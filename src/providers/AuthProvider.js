'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'

import { useFetch } from '@/hooks'
// import { useFetch } from '@/hooks'
import { api, getCookie, removeCookie, removeStorage, setCookie } from '@/utils'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

function useProvideAuth() {
  // Hooks
  const { cache } = useSWRConfig()

  // Constants
  const cookieTokenString = 'skedyou-token'
  const { token: cookieToken, expiry: cookieExpiry } = getCookie(cookieTokenString) || {}

  // States
  const [loading, setLoading] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [isValidating, setIsValidating] = useState(null)

  // Fetch
  const { data: userData, isValidating: userIsValidating, mutate: userMutate } = useFetch([
    !!isAuthenticated ? '/me/' : null
  ])

  // Login with credentials
  const login = async (credentials) => {
    setLoading(true)
    const response = await api
      .post('/login-client/', {
        email: credentials.email,
        password: credentials.password
      })
      .then(response => {
        const { data } = response || {}
        if (data?.token) {
          const date = new Date()
          date.setDate(date.getDate() + 1)
          const tokenData = { expiry: date.toISOString(), token: data.token }
          setCookie(cookieTokenString, tokenData)
          setIsAuthenticated(true)
        } else {
          return { error: 'E-mail ou senha inválidos' }
        }
      })
      .catch(error => {
        return {
          error: error?.response?.data?.message === 'Unauthorized' ? 'E-mail ou senha inválidos' : error?.response?.data?.message ||
            'Ocorreu um erro inesperado. Tente novamente mais tarde'
        }
      })
      .finally(() => setLoading(false))

    return response
  }

  const register = async (newValues) => {
    setLoading(true)
    return await api
      .post('/site/clients/create/', {
        ...newValues,
        ...(newValues ? { password_confirmation: newValues.confirmPassword } : {})
      })
      .then(response => {
        const { data } = response || {}
        if (data?.token) {
          const date = new Date()
          date.setDate(date.getDate() + 1)
          const tokenData = { expiry: date.toISOString(), token: data.token }
          setCookie(cookieTokenString, tokenData)
          setIsAuthenticated(true)
        } else {
          return { error: 'E-mail ou senha inválidos' }
        }
      })
      .catch(error => {
        return { error: error?.response?.data?.message || 'Ocorreu um erro inesperado. Tente novamente mais tarde' }
      })
      .finally(() => setLoading(false))
  }

  const updateUser = async (newValues) => {
    setLoading(true)
    return await api
      .patch(`/site/clients/update/${userData?.data?.id}/`, {
        name: newValues.name,
        email: newValues.email,
        picture: newValues.picture,
        ...(newValues.password ? { password: newValues.password } : {}),
        ...(newValues.password ? { password_confirmation: newValues.confirmPassword } : {}),
      })
      .then(() => userMutate())
      .catch(error => {
        return { error: error?.response?.data?.message || 'Ocorreu um erro inesperado. Tente novamente mais tarde' }
      })
      .finally(() => setLoading(false))
  }

  // Logout user from API
  const logout = async () => {
    try {
      await api.post('/logout/')
    } finally {
      removeCookie(cookieTokenString)
      removeStorage('services')
      setIsAuthenticated(false)
    }
  }

  // Send reset password link
  const forgotPassword = async (email) => {
    const response = await api.post('/password-reset/', { email })
    return response
  }

  // Reset password
  const resetPassword = async (password, uidb64, hash) => {
    const response = await api.post('/password-reset/confirm/', {
      password,
      uidb64,
      token: hash
    })
    return response
  }

  // Verify if token is valid or expired
  const verifyToken = useCallback(() => {
    let expired = true
    if (cookieToken) {
      const expiryDate = new Date(cookieExpiry)
      const nowDate = new Date()

      expired = nowDate.getTime() > expiryDate.getTime()

      if (expired) {
        removeCookie(cookieTokenString)
      }
    }

    return !expired
  }, [cookieToken, cookieExpiry])

  // Effects
  useEffect(() => {
    const isValidToken = verifyToken()
    setIsAuthenticated(!!isValidToken)
  }, [verifyToken, cookieToken])

  useEffect(() => {
    setIsValidating(loading || userIsValidating)
  }, [loading, userIsValidating])

  // Clear all SWR cache (experimental)
  useEffect(() => {
    cache?.clear?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  return {
    login,
    logout,
    forgotPassword,
    resetPassword,
    register,
    updateUser,
    verifyToken,
    isAuthenticated,
    isValidating,
    userData: userData?.data || {}
  }
}

export default function AuthProvider({ children }) {
  const auth = useProvideAuth()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
