import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

import { ColorSchemeScript } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { Cairo } from 'next/font/google'

import Providers from './Providers'

const cairo = Cairo({ subsets: ['latin']})

export const metadata = {
  title: 'Skedyou',
  description: 'Agende sua visita',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={cairo.className}>
        <Providers>
          <Notifications position="top-right" autoClose={10000} zIndex={10000} top={95} />
          {children}
        </Providers>
      </body>
    </html>
  )
}