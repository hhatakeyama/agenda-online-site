import { Alert, Anchor, Avatar, Box, Button, Center, Grid, Group, LoadingOverlay, Stack, Text, useMantineTheme } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { useMediaQuery } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import React, { useState } from 'react'

import { useAuth } from '@/providers/AuthProvider'
import { Yup } from '@/utils'

import * as Fields from './Fields'

export default function Profile({ usuarioData }) {
  // Hooks
  const { isValidating, register } = useAuth()
  const theme = useMantineTheme()
  const isXs = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`)

  // States
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Constants
  const initialValues = {
    name: usuarioData?.name || '',
    email: usuarioData?.email || '',
    password: '',
    confirmPassword: '',
  }

  const schema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string().required(),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Senhas diferentes').required(),
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
    setIsSubmitting(true)
    if (form.isDirty()) {
      await register(newValues)
        .then(() => {
          form.reset()
          notifications.show({
            title: 'Sucesso',
            message: 'Dados atualizados com sucesso!',
            color: 'green'
          })
        })
        .catch(error => {
          notifications.show({
            title: 'Erro',
            message: error?.response?.data?.error ||
              'Erro ao atualizar os dados. Entre em contato com o administrador do site ou tente novamente mais tarde.',
            color: 'red'
          })
        })
        .finally(() => setIsSubmitting(false))
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} style={{ position: 'relative' }}>
      <LoadingOverlay visible={isValidating} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      <Stack gap={5}>
        <Group align="flex-start" wrap="nowrap">
          <Stack gap={5} align="center">
            <Avatar size="xl" />
            <Text onClick={() => {}} style={{ cursor: 'pointer' }}>Alterar foto</Text>
          </Stack>

          <Grid>
            <Grid.Col span={{ base: 12, xs: 6 }}>
              <Fields.NameField inputProps={{ ...form.getInputProps('name'), required: true, disabled: isSubmitting }} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, xs: 6 }}>
              <Fields.EmailField inputProps={{ ...form.getInputProps('email'), required: true, disabled: isSubmitting }} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, xs: 6 }}>
              <Fields.PasswordField inputProps={{ ...form.getInputProps('password'), required: true, disabled: isSubmitting }} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, xs: 6 }}>
              <Fields.ConfirmPasswordField inputProps={{ ...form.getInputProps('confirmPassword'), required: true, disabled: isSubmitting }} />
            </Grid.Col>
          </Grid>
        </Group>

        {!!error && <Alert color="red" title="Erro">{error}</Alert>}

        <Group mt="sm" justify="center">
          <Button
            color="green"
            type="submit"
            size={isXs ? 'sm' : 'md'}
            fullWidth={!!isXs}
            disabled={!form.isValid() || !form.isDirty()}
            loading={isSubmitting}>
            Cadastrar
          </Button>
        </Group>
      </Stack>
    </form>
  )
}
