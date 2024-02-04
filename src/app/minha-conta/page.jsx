'use client'

import { Stack, Text } from '@mantine/core'

import guardAccount from '@/guards/AccountGuard'

function MyAccount() {
  return (
    <Stack>
      <Text c="orange" size="lg" fw={700}>Minha conta</Text>
      
    </Stack>
  )
}

export default guardAccount(MyAccount)
