import { Alert, Avatar, Box, Button, Center, Grid, Group, LoadingOverlay, Modal, Paper, Stack, Text, UnstyledButton, useMantineTheme } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { useMediaQuery } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconAlertCircle } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'

import { useAuth } from '@/providers/AuthProvider'
import { api } from '@/utils'
import { generateHourList, minutesToHours, parseMinutes } from '@/utils/dateFormatter'

import { FormLogin } from '..'
import { ScheduleItem } from '.'

export default function Basic({ company, daysOfWeeks, scheduleData, services, startService }) {
  // Hooks
  const { isAuthenticated, isValidating, login, userData } = useAuth()
  const theme = useMantineTheme()
  const isXs = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`)

  // Constants
  const today = new Date()
  const todayDayOfWeek = daysOfWeeks.find(item => Number(item.day_of_week) === today.getDay())

  // States
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [signIn, setSignIn] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedService] = useState(startService)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [selectedDate, setSelectedDate] = useState(today)
  const [selectedStartTime, setSelectedStartTime] = useState(null)
  const [items, setItems] = useState([
    {
      service_id: scheduleData?.service_id || startService.id,
      employee_id: scheduleData?.employee_id || null,
      start_time: scheduleData?.start_time || '',
      end_time: scheduleData?.end_time || '',
      price: scheduleData?.price || startService?.price,
      duration: scheduleData?.duration || startService?.duration,
      service: scheduleData?.service || startService,
      employee: scheduleData?.employee || null,
    }
  ])
  const [dayOfWeek, setDayOfWeek] = useState(todayDayOfWeek)
  // const [unavailableDates, setUnavailableDates] = useState([]) // TODO: List of unavailable dateList
  const [unavailableHours, setUnavailableHours] = useState([]) // TODO: List of unavailable hourList in minutes. Get when date change

  const hourList = generateHourList(selectedDate, dayOfWeek, selectedService?.duration, unavailableHours) || []
  const canChooseRandom = selectedService?.can_choose_random === 1 || selectedService?.can_choose_random === '1'
  const canChooseEmployee = selectedService?.can_choose_employee === 1 || selectedService?.can_choose_employee === '1'
  const showDates = (
    !canChooseEmployee ||
    (
      canChooseEmployee &&
      (canChooseRandom || (!canChooseRandom && !!selectedEmployee))
    )
  )
  const canSubmit =
    company &&
    !!selectedDate &&
    (!canChooseEmployee ||
      (canChooseEmployee &&
        (canChooseRandom || (!canChooseRandom && !!selectedEmployee))
      )
    ) &&
    !!selectedService &&
    !!selectedStartTime

  // Actions
  const handleSubmit = async () => {
    if (!isValidating && isAuthenticated) {
      setError(null)
      setIsSubmitting(true)
      const newItems = items.map(item => {
        const { employee, service, ...restItem } = item
        return restItem
      })
      return await api
        .post(`/site/schedules/create/`, {
          company_id: company.id,
          client_id: userData.id,
          date: selectedDate.toISOString(),
          items: newItems
        })
        .then(() => {
          notifications.show({
            title: 'Sucesso',
            message: 'Agendamento realizado com sucesso!',
            color: 'green'
          })
        })
        .catch(error => {
          notifications.show({
            title: 'Erro',
            message: error?.response?.data?.message ||
              'Erro ao finalizar agendamento. Entre em contato com o administrador do site ou tente novamente mais tarde.',
            color: 'red'
          })
        })
        .finally(() => {
          setError(null)
          setIsSubmitting(false)
        })
    } else {
      setSignIn(true)
    }
  }

  const handleChangeScheduleItemValue = (newValue) => {
    const changingScheduleItem = 0 // First item, implement when multiple schedule items
    const newItem = {...items[changingScheduleItem]}
    setItems([{ ...newItem, ...newValue }])
  }

  const handleSelectEmployee = async employee => {
    setLoading(true)
    setSelectedEmployee(employee)
    handleChangeScheduleItemValue({ employee: employee || null, employee_id: employee?.id || null })
    // TODO: get employee schedules
    if (employee) {
      await api.get(`/site/schedules-from-employee/${employee.id}/`)
        .then(response => {
          console.log(response?.data?.data)
          setUnavailableHours(response?.data?.data)
        })
        .catch(error => {
          console.log(error?.response?.data)
        })
    } else {
      setUnavailableHours([])
    }
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

  const handleSelectStartTime = startTime => {
    setSelectedStartTime(startTime)
    // TODO: change start time of scheduleItem
    if (startTime) {
      const startTimeMinutes = parseMinutes(startTime)
      const intervalMinutes = parseMinutes(items[0].duration)
      const endTime = minutesToHours(startTimeMinutes + intervalMinutes)
      handleChangeScheduleItemValue({ start_time: startTime || '', end_time: endTime })
    } else {
      handleChangeScheduleItemValue({ end_time: '' })
    }
  }

  // Effects
  useEffect(() => {
    if (isAuthenticated && userData && signIn) setSignIn(false)
  }, [isAuthenticated, userData, signIn])

  return (
    <Box style={{ position: 'relative' }}>
      <LoadingOverlay visible={isValidating} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

      <Stack>
        {canChooseEmployee && (
          <>
            <Text fw={700}>Selecione um colaborador</Text>
            <Group justify="center">
              {canChooseRandom && (
                <UnstyledButton onClick={() => handleSelectEmployee(null)}>
                  <Center>
                    <Stack align="center" gap="xs">
                      <Avatar src={''} size={70} style={{ border: !selectedEmployee ? '3px solid #f57842' : '3px solid #333333' }} />
                      <Text fw={!selectedEmployee ? 700 : 400}>Disponível</Text>
                    </Stack>
                  </Center>
                </UnstyledButton>
              )}
              {selectedService?.employees?.map(employee => (
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
          </>
        )}

        {showDates && (
          <Stack pos="relative">
            <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <Grid>
              <Grid.Col span={{ base: 12, xs: 6, sm: 5 }}>
                <Stack>
                  <Text fw={700}>Selecione uma data</Text>
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
                    <Text fw={700}>Horários disponíveis</Text>
                    {hourList.length > 0 ? (
                      <Grid gutter={10}>
                        {hourList.map(hour => (
                          <Grid.Col key={hour} span={{ base: 3, md: 2 }}>
                            <Button
                              variant={selectedStartTime === hour ? "filled" : "outline"}
                              fullWidth
                              p={0}
                              onClick={() => handleSelectStartTime(hour)}>
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
                  employee={selectedEmployee}
                  startTime={selectedStartTime}
                />
              ))}
            </Grid>

            <Group mt="xl" justify="center">
              <Button
                color="green"
                type="button"
                size={isXs ? 'sm' : 'md'}
                fullWidth={!!isXs}
                disabled={!canSubmit}
                loading={isSubmitting}
                onClick={handleSubmit}>
                Continuar
              </Button>
            </Group>
          </Stack>
        )}

        {!!error && <Alert color="red" title="Erro">{error}</Alert>}
      </Stack>

      <Modal opened={signIn} onClose={() => setSignIn(null)} title="Login" centered size="xl">
        {signIn && <FormLogin.Basic onSubmit={login} />}
      </Modal>
    </Box>
  )
}
