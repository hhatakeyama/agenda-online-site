"use client"

import { redirect, usePathname, useSearchParams } from "next/navigation"
import { useLayoutEffect } from "react"

import { useAuth } from "@/providers/AuthProvider"

export default function guardAccount(Component) {
  return function IsAuth(props) {
    // Hooks
    const { isAuthenticated, isValidating, userData } = useAuth()
    const pathname = usePathname()
    const search = useSearchParams()
    const redirectCallback = search.get('redirectCallback')

    useLayoutEffect(() => {
      if (pathname !== '/minha-conta/login' && isValidating === false && (isAuthenticated === false || !userData)) redirect(`/minha-conta/login?redirectCallback=${pathname}`)
    }, [isAuthenticated, isValidating, pathname, userData])

    useLayoutEffect(() => {
      if (pathname === '/minha-conta/login' && isAuthenticated === true) {
        if (redirectCallback) redirect(redirectCallback)
        redirect('/')
      }
    }, [isAuthenticated, pathname, redirectCallback, search])
  
    return <Component {...props} />
  };
}