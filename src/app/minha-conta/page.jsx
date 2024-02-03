'use client'

import { Stack, Text } from '@mantine/core'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/providers/AuthProvider'

export default function Schedules() {
  // Hooks
  const router = useRouter()
  const { isAuthenticated, isValidating, userData } = useAuth()

  if (!isValidating && !isAuthenticated && !userData) return router.push('/minha-conta/login')

  return (
    <Stack>
      <Text c="orange" size="lg" fw={700}>Minha conta</Text>
      
    </Stack>
  )
}
