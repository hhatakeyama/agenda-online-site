'use client'

import { Group, Stack, Title } from '@mantine/core'

import ClientMenu from '@/components/navigation/ClientMenu'
import guardAccount from '@/guards/AccountGuard'

function MyAccount() {
  return (
    <Group align="flex-start" wrap="nowrap">
      <ClientMenu />

      <Stack w="100%">
        <Title c="orange" order={1} fw={700}>Minha conta</Title>
      </Stack>
    </Group>
  )
}

export default guardAccount(MyAccount)
