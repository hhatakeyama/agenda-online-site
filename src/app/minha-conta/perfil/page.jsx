'use client'

import { Group, Stack, Title } from '@mantine/core'

import { FormUser } from '@/components/forms'
import ClientMenu from '@/components/navigation/ClientMenu'
import guardAccount from '@/guards/AccountGuard'

function Profile() {
  return (
    <Group align="flex-start" wrap="nowrap">
      <ClientMenu />

      <Stack w="100%">
        <Title c="orange" order={1} fw={700}>Perfil</Title>
        
        <FormUser.Profile />
      </Stack>
    </Group>
  )
}

export default guardAccount(Profile)
