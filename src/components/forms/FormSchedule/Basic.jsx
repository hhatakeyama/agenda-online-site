import { Alert, Avatar, Box, Button, Center, Grid, Group, LoadingOverlay, Paper, Stack, Text, UnstyledButton, useMantineTheme } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { useMediaQuery } from '@mantine/hooks'
import { IconAlertCircle } from '@tabler/icons-react'
import React, { useState } from 'react'

import { useAuth } from '@/providers/AuthProvider'
import { api } from '@/utils'
import { generateHourList } from '@/utils/dateFormatter'

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
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [service] = useState(startService)
  const [selectedDate, setSelectedDate] = useState(today)
  const [selectedStartTime, setSelectedStartTime] = useState(null)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [items, setItems] = useState([
    {
      service_id: scheduleData?.service_id || startService.id,
      employee_id: scheduleData?.employee_id || null,
      start_time: scheduleData?.start_time || '',
      end_time: scheduleData?.end_time || '',
      price: scheduleData?.price || startService?.price,
      duration: scheduleData?.duration || startService?.duration,
    }
  ])
  const [dayOfWeek, setDayOfWeek] = useState(todayDayOfWeek)
  // const [unavailableDates, setUnavailableDates] = useState([]) // TODO: List of unavailable dateList
  const [unavailableHours, setUnavailableHours] = useState([480, 540]) // TODO: List of unavailable hourList in minutes. Get when date change

  const hourList = generateHourList(selectedDate, dayOfWeek, service?.duration, unavailableHours) || []

  // Actions
  const handleSubmit = async () => {
    setError(null)
    setIsSubmitting(true)
    // return api
    //   .patch(`/admin/usuarios/${scheduleData?.id}/`, {
    //     ...newValues, ...(newValues ? { password_confirmation: newValues.confirmPassword } : {})
    //   }) // Verificar usuário logado no painel
    //   .then(() => {
    //     notifications.show({
    //       title: 'Sucesso',
    //       message: 'Dados atualizados com sucesso!',
    //       color: 'green'
    //     })
    //   })
    //   .catch(error => {
    //     notifications.show({
    //       title: 'Erro',
    //       message:
    //         errorHandler(error.response.data.errors).messages ||
    //         'Erro ao atualizar os dados. Entre em contato com o administrador do site ou tente novamente mais tarde.',
    //       color: 'red'
    //     })
    //   })
    //   .finally(() => setIsSubmitting(false))
    setError(null)
    setIsSubmitting(false)
  }

  const handleSelectEmployee = employee => {
    setLoading(true)
    setSelectedEmployee(employee)
    // TODO: get employee schedules
    const data = api.get(`/site/schedulesFromEmployee/${employee.id}/`)
    console.log(data)

    setLoading(false)
  }

  const handleChangeDate = newDate => {
    setSelectedDate(newDate)
    const selectedDayOfWeek = daysOfWeeks.find(item => Number(item.day_of_week) === newDate.getDay())

    // TODO: fetch unavailable hours from database?
    setUnavailableHours([])

    setDayOfWeek(selectedDayOfWeek)
    setSelectedStartTime(null)
  }

  return (
    <Box style={{ position: 'relative' }}>
      <LoadingOverlay visible={isValidating} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

      <Stack>
        <Text>Selecione um colaborador</Text>
        <Group>
          {service?.employees?.map(employee => (
            <UnstyledButton onClick={() => handleSelectEmployee(employee)} key={employee.id}>
              <Center>
                <Stack align="center" gap="xs">
                  <Avatar src={employee.picture} size={70} style={{ border: selectedEmployee?.id === employee.id ? '3px solid #f57842' : '3px solid #333333' }} />
                  <Text fw={selectedEmployee?.id === employee.id ? 700 : 400}>{employee.name.split(' ')[0]}</Text>
                </Stack>
              </Center>
            </UnstyledButton>
          ))}
        </Group>

        {!!selectedEmployee && (
          <Stack pos="relative">
            <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <Grid>
              <Grid.Col span={{ base: 12, xs: 6, sm: 5 }}>
                <Stack>
                  <Text>Selecione uma data</Text>
                  <Paper shadow="sm">
                    <Center>
                      <DatePicker
                        value={selectedDate}
                        maxLevel="month"
                        minDate={today}
                        onChange={newDate => handleChangeDate(newDate)}
                      />
                    </Center>
                  </Paper>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, xs: 6, sm: 7 }}>
                {selectedDate && (
                  <Stack>
                    <Text>Horários disponíveis</Text>
                    {hourList.length > 0 ? (
                      <Grid gutter={10}>
                        {hourList.map(hour => (
                          <Grid.Col key={hour} span={{ base: 3, md: 2 }}>
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

            <Grid justify="center">
              {items?.map((item, index) => (
                <ScheduleItem
                  key={`item-${index}`}
                  editValues={item}
                  services={services}
                  startTime={selectedStartTime}
                  onSubmit={() => { }}
                />
              ))}
            </Grid>

            <Group mt="xl" justify="center">
              <Button
                color="green"
                type="button"
                size={isXs ? 'sm' : 'md'}
                fullWidth={!!isXs}
                disabled={false}
                loading={isSubmitting}
                onClick={handleSubmit}>
                Continuar
              </Button>
            </Group>
          </Stack>
        )}

        {!!error && <Alert color="red" title="Erro">{error}</Alert>}
      </Stack>
    </Box>
  )
}
