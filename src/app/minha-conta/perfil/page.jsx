'use client'

import { Group, Stack, Title } from '@mantine/core'

import { FormUser } from '@/components/forms'
import ClientMenu from '@/components/navigation/ClientMenu'
import guardAccount from '@/guards/AccountGuard'
import { useAuth } from '@/providers/AuthProvider'

function Profile() {
  const { isValidating, userData } = useAuth()

  return (
    <Group align="flex-start" wrap="nowrap">
      <ClientMenu />

      <Stack w="100%">
        <Title c="orange" order={1} fw={700}>Perfil</Title>
        
        {(isValidating === false || userData.name) && <FormUser.Profile userData={userData} />}
      </Stack>
    </Group>
  )
}

export default guardAccount(Profile)
