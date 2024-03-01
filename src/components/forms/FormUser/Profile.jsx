import { Alert, Avatar, Button, FileButton, Grid, Group, LoadingOverlay, Stack, Text, useMantineTheme } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { useMediaQuery } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import React, { useState } from 'react'

import { useAuth } from '@/providers/AuthProvider'
import { api, Yup } from '@/utils'

import * as Fields from './Fields'

export default function Profile({ userData }) {
  // Hooks
  const { isValidating, updateUser } = useAuth()
  const theme = useMantineTheme()
  const isXs = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`)

  // States
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [file, setFile] = useState(null)

  // Constants
  const srcPicture = userData?.picture?.indexOf('http') !== -1 ? userData?.picture : `${process.env.NEXT_PUBLIC_API_DOMAIN}/storage/clients/original-${userData?.picture}`
  const srcPictureFile = file ? URL.createObjectURL(file) : (srcPicture || '')
  const initialValues = {
    name: userData?.name || '',
    email: userData?.email || '',
    password: '',
    confirmPassword: '',
  }

  const schema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string(),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Senhas diferentes'),
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
      await updateUser(newValues)
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

  const handleFileChange = async file => {
    setFile(file)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileName', file.name)
    await api
      .post(`/api/site/clients/${userData?.id}/picture`, formData, {
        headers: { "Content-Type": 'multipart/form-data' }
      })
      .then(() => {
        notifications.show({
          title: 'Sucesso',
          message: 'Foto atualizada com sucesso!',
          color: 'green'
        })
      })
      .catch(error => {
        notifications.show({
          title: 'Erro',
          message: error?.response?.data?.error ||
            'Erro ao atualizar foto. Entre em contato com o administrador do site ou tente novamente mais tarde.',
          color: 'red'
        })
      })
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} style={{ position: 'relative' }}>
      <LoadingOverlay visible={isValidating} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      <Stack gap={5}>
        <Group align="flex-start" wrap="nowrap">
          <Stack gap={5} align="center">
            <FileButton onChange={handleFileChange} accept="image/png,image/jpeg">
              {(props) =>
                <>
                  <Avatar size="xl" {...props} src={srcPictureFile} />
                  <Text {...props} style={{ textWrap: 'nowrap' }}>{userData?.picture ? 'Alterar foto' : 'Selecionar foto'}</Text>
                </>
              }
            </FileButton>
          </Stack>

          <Grid>
            <Grid.Col span={{ base: 12, xs: 6 }}>
              <Fields.NameField inputProps={{ ...form.getInputProps('name'), required: true, disabled: isSubmitting }} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, xs: 6 }}>
              <Fields.EmailField inputProps={{ ...form.getInputProps('email'), required: true, disabled: isSubmitting }} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, xs: 6 }}>
              <Fields.PasswordField inputProps={{ ...form.getInputProps('password'), required: !userData, disabled: isSubmitting }} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, xs: 6 }}>
              <Fields.ConfirmPasswordField inputProps={{ ...form.getInputProps('confirmPassword'), required: !userData, disabled: isSubmitting }} />
            </Grid.Col>
          </Grid>
        </Group>

        {!!error && <Alert color="red" title="Erro">{error}</Alert>}

        <Group mt="sm" justify="right">
          <Button
            color="green"
            type="submit"
            size={isXs ? 'sm' : 'md'}
            fullWidth={!!isXs}
            disabled={!form.isValid() || !form.isDirty()}
            loading={isSubmitting}>
            {userData ? 'Salvar' : 'Cadastrar'}
          </Button>
        </Group>
      </Stack>
    </form>
  )
}
