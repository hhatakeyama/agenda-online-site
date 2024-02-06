import { Alert, Button, Center, Group, LoadingOverlay, Stack, Text, useMantineTheme } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { useMediaQuery } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { useSearchParams } from 'next/navigation'
import React, { useState } from 'react'

import { useAuth } from '@/providers/AuthProvider'
import { Yup } from '@/utils'

import * as Fields from './Fields'

export default function Basic({ showRegisterButton, onForgotPassword }) {
  // Hooks
  const { isValidating, login } = useAuth()
  const params = useSearchParams()
  const theme = useMantineTheme()
  const isXs = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`)
  
  // Constants
  const redirectCallback = params.get('redirectCallback')
  const registerUrl = `/minha-conta/cadastro${redirectCallback ? `?redirectCallback=${redirectCallback}` : ''}`

  // States
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Constants
  const initialValues = {
    email: '',
    password: '',
  }

  const schema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
  })

  // Mantine form
  const form = useForm({
    initialValues,
    validate: yupResolver(schema),
    validateInputOnBlur: true,
    validateInputOnChange: true
  })

  // Actions
  const handleSubmit = async (newValues) => {
    setError(null)
    if (form.isValid() && form.isDirty()) {
      setIsSubmitting(true)
      await login(newValues)
        .then(response => {
          if (response.error) {
            notifications.show({
              title: 'Erro',
              message: response?.error || 'E-mail ou senha errados.',
              color: 'red'
            })
          } else {
            notifications.show({
              title: 'Sucesso',
              message: 'Login realizado com sucesso!',
              color: 'green'
            })
          }
        })
        .catch(() => setError('Houve um erro no login. Tente novamente mais tarde'))
        .finally(() => setIsSubmitting(false))
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} style={{ position: 'relative' }}>
      <LoadingOverlay visible={isValidating} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      <Stack gap={5}>
        <Fields.EmailField inputProps={{ ...form.getInputProps('email'), required: true, disabled: isSubmitting }} />
        <Fields.PasswordField inputProps={{ ...form.getInputProps('password'), required: true, disabled: isSubmitting }} />
        {/* <Group justify="space-between" mt="lg" style={{ display: 'none' }}>
          <Anchor component="button" size="sm" onClick={onForgotPassword}>
            Esqueceu a senha?
          </Anchor>
        </Group> */}

        {!!error && <Alert color="red" title="Erro">{error}</Alert>}

        <Group mt="sm" justify="center">
          <Button
            type="submit"
            color="green"
            fullWidth={!!isXs}
            disabled={!form.isValid() || !form.isDirty()}
            loading={isSubmitting}>
            Login
          </Button>
        </Group>

        {showRegisterButton && (
          <Center>
            <Text size="sm" c="orange" component="a" href={registerUrl}>ou cadastre-se</Text>
          </Center>
        )}
      </Stack>
    </form>
  )
}
