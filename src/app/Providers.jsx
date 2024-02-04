'use client'

import 'dayjs/locale/pt-br'
import '@mantine/dates/styles.css';

import { MantineProvider } from '@mantine/core'
import { DatesProvider } from '@mantine/dates'
import { SWRConfig } from 'swr'

import AuthProvider from '@/providers/AuthProvider'
import ScheduleProvider from '@/providers/ScheduleProvider';
import { fetcher } from '@/utils'

export default function Providers({ children }) {
  return (
    <SWRConfig value={{ fetcher, revalidateOnFocus: false }}>
      <MantineProvider
        theme={{ fontFamily: 'Cairo, Verdana, sans-serif' }}>
        <DatesProvider settings={{ locale: 'pt-br', firstDayOfWeek: 0, weekendDays: [0], timezone: 'America/Sao_Paulo' }}>
          <AuthProvider>
            <ScheduleProvider>
              {children}
            </ScheduleProvider>
          </AuthProvider>
        </DatesProvider>
      </MantineProvider>
    </SWRConfig >
  )
}