'use client'

import { Container, LoadingOverlay, Paper, Text, Title } from '@mantine/core'
import { useState } from 'react'

import { FormLogin } from '@/components/forms'
import guardAccount from '@/guards/AccountGuard'
import { useAuth } from '@/providers/AuthProvider'

function Login() {
  // Hooks
  const { isValidating } = useAuth()

  // States
  const [forgotPassword, setForgotPassword] = useState(false)

  return (
    <Container size="xl" my={40} style={{ maxWidth: '400px', width: '100%' }}>
      {forgotPassword ? (
        <FormLogin.ForgotPassword onBack={() => setForgotPassword(false)} />
      ) : (
        <>
          <Title ta="center">
            Bem-vindo(a)!
          </Title>
          <Text c="dimmed" fz="sm" ta="center">
            Faça seu login abaixo.
          </Text>

          <Paper withBorder shadow="md" p={30} mt={30} radius="md" pos="relative">
            <LoadingOverlay visible={isValidating} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <FormLogin.Basic onForgotPassword={() => setForgotPassword(true)} showRegisterButton />
          </Paper>
        </>
      )}
    </Container>
  )
}

export default guardAccount(Login)
