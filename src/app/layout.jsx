import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

import { ColorSchemeScript } from '@mantine/core'
import { Notifications } from '@mantine/notifications'

import Providers from './Providers'

export const metadata = {
  title: 'Skedyou',
  description: 'Agende sua visita',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          <Notifications position="top-right" autoClose={10000} zIndex={10000} top={95} />
          {children}
        </Providers>
      </body>
    </html>
  )
}