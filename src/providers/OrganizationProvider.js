'use client'

import { useParams } from 'next/navigation'
import { createContext, useContext, useState } from 'react'

import { useFetch } from '@/hooks'

const OrganizationContext = createContext(null)

export const useOrganization = () => useContext(OrganizationContext)

function useProvideOrganization() {
  // Hooks
  const { organizationSlug } = useParams()

  // States
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [selectedCompanyId, setSelectedCompanyId] = useState(null)
  
  // Fetch
  const { data } = useFetch([organizationSlug ? `/site/organizations/${organizationSlug}` : null])
  const organization = data?.data || {}

  const { data: dataCompany } = useFetch([selectedCompanyId ? `/site/companies/${selectedCompanyId}` : null])
  const company = dataCompany?.data || {}

  return {
    company,
    companies: organization.companies || [],
    organization,
    selectedCompany,
    selectedCompanyId,
    setSelectedCompany,
    setSelectedCompanyId,
  }
}

export default function OrganizationProvider({ children }) {
  const auth = useProvideOrganization()
  return <OrganizationContext.Provider value={auth}>{children}</OrganizationContext.Provider>
}
