import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css';

import { ColorSchemeScript, Stack } from '@mantine/core'
import { Notifications } from '@mantine/notifications';

import Content from '@/components/navigation/Content'
import Footer from '@/components/navigation/Footer'
import Header from '@/components/navigation/Header'

import Providers from './Providers'

export const metadata = {
  title: 'Agendamento Online',
  description: 'Agende sua visita',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <Providers>
          <Notifications position="top-right" autoClose={10000} zIndex={10000} top={95} />
          <Stack gap={0}>
            <Header />
            <Content>
              {children}
            </Content>
            <Footer />
          </Stack>
        </Providers>
      </body>
    </html >
  )
}