import { Alert, Box, Button, Center, Grid, Group, LoadingOverlay, Stack, Text, useMantineTheme } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { useForm, yupResolver } from '@mantine/form'
import { useMediaQuery } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import React, { useState } from 'react'

import { useAuth } from '@/providers/AuthProvider'
import { api, Yup } from '@/utils'
import { generateHourList } from '@/utils/dateFormatter'
import errorHandler from '@/utils/errorHandler'

import { ScheduleItem } from '.'

export default function Basic({ daysOfWeeks, scheduleData, startService, mutate }) {
  // Hooks
  const { isValidating } = useAuth()
  const theme = useMantineTheme()
  const isXs = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`)

  // Constants
  const today = new Date()
  const todayDayOfWeek = daysOfWeeks.find(item => Number(item.day_of_week) === today.getDay())

  // States
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [service, setService] = useState(startService)
  const [dayOfWeek, setDayOfWeek] = useState(todayDayOfWeek)
  // const [unavailableDates, setUnavailableDates] = useState([]) // TODO: List of unavailable dateList
  const [unavailableHours, setUnavailableHours] = useState([480, 540]) // TODO: List of unavailable hourList in minutes. Get when date change
  const [selectedStartTime, setSelectedStartTime] = useState(null)
  const hourList = generateHourList(dayOfWeek, service?.duration, unavailableHours) || []

  // Form
  const initialValues = {
    date: scheduleData?.date || '',
    items: scheduleData?.items || [{
      service_id: startService.id,
      employee_id: null,
      start_time: '',
      end_time: '',
      price: 0,
      duration: '',
    }],
  }

  const schema = Yup.object().shape({
    date: Yup.date().required(),
    start_time: Yup.string().nullable().required(),
    end_time: Yup.string().nullable().required(),
    items: Yup.array().of(Yup.object({
      service_id: Yup.number().nullable().required(),
      employee_id: Yup.number().nullable().required(),
      start_time: Yup.string().nullable().required(),
      end_time: Yup.string().nullable().required(),
      price: Yup.number().nullable().required(),
      duration: Yup.string().nullable().required(),
    })).nullable().required(),
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
      return api
        .patch(`/admin/usuarios/${scheduleData?.id}/`, {
          ...newValues, ...(newValues ? { password_confirmation: newValues.confirmPassword } : {})
        }) // Verificar usuário logado no painel
        .then(() => {
          form.reset()
          setTimeout(() => mutate(), 2000)
          notifications.show({
            title: 'Sucesso',
            message: 'Dados atualizados com sucesso!',
            color: 'green'
          })
        })
        .catch(error => {
          notifications.show({
            title: 'Erro',
            message:
              errorHandler(error.response.data.errors).messages ||
              'Erro ao atualizar os dados. Entre em contato com o administrador do site ou tente novamente mais tarde.',
            color: 'red'
          })
        })
        .finally(() => setIsSubmitting(false))
    }
  }

  const handleChangeDate = newDate => {
    form.setFieldValue('date', newDate)
    const selectedDayOfWeek = daysOfWeeks.find(item => Number(item.day_of_week) === newDate.getDay())

    // TODO: fetch unavailable hours from database?
    setUnavailableHours([])

    setDayOfWeek(selectedDayOfWeek)
    setSelectedStartTime(null)
  }
  
  return (
    <form onSubmit={form.onSubmit(handleSubmit)} style={{ position: 'relative' }}>
      <LoadingOverlay visible={isValidating} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

      <Stack>
        <Text>Selecione uma data</Text>
        <Center><DatePicker value={form.values.date} onChange={newDate => handleChangeDate(newDate)} /></Center>

        {form.values.date && (
          <Stack>
            <Text>Horários disponíveis</Text>
            {hourList.length > 0 ? (
              <Grid gutter={10}>
                {hourList.map(hour => (
                  <Grid.Col key={hour} span={2}>
                    <Button
                      variant={selectedStartTime === hour ? "filled" : "outline"}
                      fullWidth
                      p={0}
                      onClick={() => setSelectedStartTime(hour)}>
                      {hour}
                    </Button>
                  </Grid.Col>
                ))}
              </Grid>
            ) : (
              <Box>
                Nenhum horário disponível
              </Box>
            )}

            {form.values.items?.map((item, index) => (
              <Box key={`item-${index}`}>
                <ScheduleItem
                  editValues={item}
                  onSubmit={() => { }}
                />
              </Box>
            ))}
          </Stack>
        )}

        {!!error && <Alert color="red" title="Erro">{error}</Alert>}
      </Stack>

      <Group mt="xl">
        <Button
          color="green"
          type="submit"
          size={isXs ? 'sm' : 'md'}
          fullWidth={!!isXs}
          disabled={!form.isValid() || !form.isDirty()}
          loading={isSubmitting}>
          Continuar
        </Button>
      </Group>
    </form>
  )
}
