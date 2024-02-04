'use client'

import { Stack } from '@mantine/core'

import Content from '@/components/navigation/Content'
import Footer from '@/components/navigation/Footer'
import Header from '@/components/navigation/Header'

export default function Home() {
  return (
    <Stack gap={0}>
      <Header />
      <Content>
        <Stack>
          Home Skedyou
        </Stack>
      </Content>
      <Footer />
    </Stack>
  )
}
