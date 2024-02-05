"use client"

import { redirect, usePathname, useSearchParams } from "next/navigation"
import { useLayoutEffect, useMemo } from "react"

import { useAuth } from "@/providers/AuthProvider"

export default function guardAccount(Component) {
  return function IsAuth(props) {
    // Hooks
    const { isAuthenticated, isValidating, userData } = useAuth()
    const pathname = usePathname()
    const search = useSearchParams()
    
    // Constants
    const redirectCallback = search.get('redirectCallback')
    const publicRoutes = useMemo(() => ['/minha-conta/login', '/minha-conta/cadastro'], [])

    useLayoutEffect(() => {
      if (publicRoutes.indexOf(pathname) === -1 && isValidating === false && (isAuthenticated === false || !userData)) redirect(`/minha-conta/login?redirectCallback=${pathname}`)
    }, [isAuthenticated, isValidating, pathname, publicRoutes, userData])

    useLayoutEffect(() => {
      if (publicRoutes.indexOf(pathname) !== -1 && isAuthenticated === true) {
        if (redirectCallback) redirect(redirectCallback)
        redirect('/')
      }
    }, [isAuthenticated, pathname, publicRoutes, redirectCallback, search])
  
    return <Component {...props} />
  };
}