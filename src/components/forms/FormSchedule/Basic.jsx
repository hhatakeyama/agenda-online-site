import { Alert, Button, Center, Grid, Group, LoadingOverlay, Paper, Stack, Text, useMantineTheme } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { useForm, yupResolver } from '@mantine/form'
import { useMediaQuery } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconAlertCircle } from '@tabler/icons-react'
import React, { useState } from 'react'

import { useAuth } from '@/providers/AuthProvider'
import { api, Yup } from '@/utils'
import { generateHourList } from '@/utils/dateFormatter'
import errorHandler from '@/utils/errorHandler'

import { ScheduleItem } from '.'

export default function Basic({ daysOfWeeks, scheduleData, services, startService }) {
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

  // Form
  const initialValues = {
    date: scheduleData?.date || today,
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

  const hourList = generateHourList(form.values.date, dayOfWeek, service?.duration, unavailableHours) || []

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
        <Grid>
          <Grid.Col span={{ base: 12, xs: 6, sm: 5 }}>
            <Stack>
              <Text>Selecione uma data</Text>
              <Paper shadow="sm">
                <Center>
                  <DatePicker
                    value={form.values.date}
                    maxLevel="month"
                    minDate={today}
                    onChange={newDate => handleChangeDate(newDate)}
                  />
                </Center>
              </Paper>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, xs: 6, sm: 7 }}>
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
                  <Alert variant="light" color="orange" title="Data indisponível" icon={<IconAlertCircle />}>
                    Nenhum horário disponível para esta data, selecione outra data.
                  </Alert>
                )}
              </Stack>
            )}
          </Grid.Col>
        </Grid>

        <Center><Text>Serviço{form.values.items.length > 1 && 's'} selecionado{form.values.items.length > 1 && 's'}</Text></Center>
        <Grid justify="center">
          {form.values.date && form.values.items?.map((item, index) => (
            <ScheduleItem
              key={`item-${index}`}
              editValues={item}
              services={services}
              startTime={selectedStartTime}
              onSubmit={() => { }}
            />
          ))}
        </Grid>

        {!!error && <Alert color="red" title="Erro">{error}</Alert>}
      </Stack>

      <Group mt="xl" justify="center">
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
    </form >
  )
}
