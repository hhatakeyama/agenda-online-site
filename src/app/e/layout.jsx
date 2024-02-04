import { Stack } from '@mantine/core'

import Content from '@/components/navigation/Content'
import Footer from '@/components/navigation/Footer'
import Header from '@/components/navigation/Header'

import Providers from './Providers'

export const metadata = {
  title: 'Skedyou',
  description: 'Agende sua visita',
}

export default function OrganizationLayout({ children }) {
  return (
    <Providers>
      <Stack gap={0}>
        <Header />
        <Content>
          {children}
        </Content>
        <Footer />
      </Stack>
    </Providers>
  )
}