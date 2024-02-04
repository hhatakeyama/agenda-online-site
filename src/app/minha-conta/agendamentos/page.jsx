'use client'

import { Stack, Text } from '@mantine/core'

import guardAccount from '@/guards/AccountGuard'

function Schedules() {
  return (
    <Stack>
      <Text c="orange" size="lg" fw={700}>Agendamentos</Text>
      
    </Stack>
  )
}

export default guardAccount(Schedules)
