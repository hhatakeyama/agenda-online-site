'use client'

import { Center, Container, Paper, Stack, Text, Title } from '@mantine/core'
import { useSearchParams } from 'next/navigation'

import { FormUser } from '@/components/forms'
import guardAccount from '@/guards/AccountGuard'
import { useAuth } from '@/providers/AuthProvider'

function Login() {
  // Hooks
  const { login } = useAuth()
  const params = useSearchParams()
  const redirectCallback = params.get('redirectCallback')
  
  // Constants
  const loginUrl = `/minha-conta/login${redirectCallback ? `?redirectCallback=${redirectCallback}` : ''}`

  return (
    <Container size="xl" my={40} style={{ maxWidth: '400px', width: '100%' }}>
      <Title ta="center">
        Bem-vindo(a)!
      </Title>
      <Text c="dimmed" fz="sm" ta="center">
        Faça seu cadastro abaixo.
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md" pos="relative">
        <Stack>
          <FormUser.Basic onSubmit={login} />
          <Center>
            <Text size="sm" c="orange" component="a" href={loginUrl}>já tenho login</Text>
          </Center>

          {/* <Divider label="ou cadastre-se com" labelPosition="center" />

          <FormUser.SocialLogin /> */}
        </Stack>
      </Paper>
    </Container>
  )
}

export default guardAccount(Login)
