import React from 'react';

import OrganizationProvider from '@/providers/OrganizationProvider';

export default function Providers({ children }) {
  return (
    <OrganizationProvider>
      {children}
    </OrganizationProvider>
  )
}