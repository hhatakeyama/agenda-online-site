import { Alert, Box, Button, Center, Container, Divider, Grid, Group, Modal, Paper, Stack, Stepper, Text, Title, useMantineTheme } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { useMediaQuery } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconAlertCircle, IconCheck } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { FormLogin, FormUser } from '@/components/forms'
import { useAuth } from '@/providers/AuthProvider'
import { useOrganization } from '@/providers/OrganizationProvider'
import { useSchedule } from '@/providers/ScheduleProvider'
import { api } from '@/utils'
import { currencyValue } from '@/utils/converter'
import { dateToHuman, generateHourList, parseMinutes, verifyAvailableHour } from '@/utils/dateFormatter'

import EmployeesSelector from './EmployeesSelector'
import ScheduleItem from './ScheduleItem'

export default function Cart() {
  // Hooks
  const theme = useMantineTheme()
  const router = useRouter()
  const isXs = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`)
  const { isAuthenticated, login, userData } = useAuth()
  const { company } = useOrganization()
  const { schedule, selectedServices, smallestDuration, handleChangeSchedule, handleChangeScheduleItem } = useSchedule()

  // Constants
  const today = new Date()
  const todayDayOfWeek = company.days_of_weeks?.find?.(item => Number(item.day_of_week) === schedule.date?.getDay?.())
  let total = 0
  let totalDuration = 0
  selectedServices.map(item => {
    total += Number(item.price)
    totalDuration += Number(parseMinutes(item.duration))
  })

  // States
  const [register, setRegister] = useState(false)
  const [step, setStep] = useState(0)
  const [openSelectEmployees, setOpenSelectEmployees] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dayOfWeek, setDayOfWeek] = useState(todayDayOfWeek)
  // const [unavailableDates, setUnavailableDates] = useState([]) // TODO: List of unavailable dateList
  const [unavailableHours, setUnavailableHours] = useState([]) // TODO: List of unavailable hourList in minutes. Get when date change

  const hourList = generateHourList(schedule.date, dayOfWeek, smallestDuration, unavailableHours) || [] // Mount available hour list
  const canSubmit = schedule.date && schedule.start_time && schedule.items.length > 0
  const availableHourList = hourList.filter(hour => verifyAvailableHour(hourList, dayOfWeek, totalDuration, hour))

  // Actions
  const handleSubmit = async () => {
    setIsSubmitting(true)
    const newItems = schedule.items.map(item => {
      // eslint-disable-next-line no-unused-vars
      const { employee, ...restItem } = item
      return restItem
    })
    return await api
      .post(`/site/schedules/create/`, {
        company_id: company.id,
        client_id: userData.id,
        date: schedule.date.toISOString(),
        items: newItems
      })
      .then(() => setStep(3))
      .catch(error =>
        notifications.show({
          title: 'Erro',
          message: error?.response?.data?.message ||
            'Erro ao finalizar agendamento. Entre em contato com o administrador do site ou tente novamente mais tarde.',
          color: 'red'
        })
      )
      .finally(() => setIsSubmitting(false))
  }

  const handleChangeDate = newDate => {
    handleChangeSchedule({ date: newDate, start_time: null })
    const selectedDayOfWeek = company.days_of_weeks?.find?.(item => Number(item.day_of_week) === newDate.getDay())

    // TODO: fetch unavailable hours from database?
    setUnavailableHours([])

    setDayOfWeek(selectedDayOfWeek)
  }

  const handleSelectEmployee = async (itemIndex, employee) => {
    setOpenSelectEmployees(null)
    handleChangeScheduleItem(itemIndex, { employee_id: employee?.id || null })
  }

  // Effects
  useEffect(() => {
    if (isAuthenticated && userData && step === 1) setStep(2)
  }, [isAuthenticated, step, userData])

  return (
    <>
      <Stepper color="orange" active={step} onStepClick={setStep}>
        <Stepper.Step label="Agendamento" description="Serviços">
          <Stack pos="relative">
            <Grid>
              <Grid.Col span={{ base: 12, xs: 6, sm: 5 }}>
                <Stack>
                  <Text fw={700}>Selecione uma data</Text>
                  <Paper shadow="sm">
                    <Center>
                      <DatePicker
                        value={schedule.date}
                        maxLevel="month"
                        minDate={today}
                        onChange={newDate => handleChangeDate(newDate)}
                      />
                    </Center>
                  </Paper>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, xs: 6, sm: 7 }}>
                {schedule.date && (
                  <Stack>
                    <Text fw={700}>Horários disponíveis</Text>
                    {availableHourList.length > 0 ? (
                      <Grid gutter={10}>
                        {availableHourList.map(hour => (
                          <Grid.Col key={hour} span={{ base: 3, md: 2 }}>
                            <Button
                              color="orange"
                              variant={schedule.start_time === hour ? "filled" : "outline"}
                              fullWidth
                              p={0}
                              onClick={() => handleChangeSchedule({ start_time: hour })}>
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
              {schedule.items?.map((item, index) => (
                <ScheduleItem
                  key={`scheduleItem-${item.service_id}`}
                  editValues={item}
                  onChangeEmployee={() => setOpenSelectEmployees({ index, item })}
                />
              ))}
            </Grid>

            <Group justify="space-between">
              <Box>
                <Text size="xl"><strong>Total</strong>: {currencyValue(total)}</Text>
                <Text size="xl"><strong>Duração</strong>: {totalDuration}min</Text>
              </Box>
              <Button
                color="green"
                type="button"
                size={isXs ? 'sm' : 'md'}
                fullWidth={!!isXs}
                disabled={!canSubmit}
                onClick={() => !isAuthenticated ? setStep(1) : setStep(2)}>
                Continuar
              </Button>
            </Group>
          </Stack>
        </Stepper.Step>
        <Stepper.Step label="Autenticação" description="Login/Cadastro" icon={isAuthenticated ? <IconCheck /> : null} disabled={!canSubmit || isAuthenticated}>
          <Container size="xl" style={{ maxWidth: '400px', width: '100%' }}>
            <Paper withBorder shadow="md" p={30} mb={30} radius="md" pos="relative">
              {register ? (
                <Stack>
                  <Title order={3} ta="center">
                    Cadastro
                  </Title>
                  <Text c="dimmed" fz="sm" ta="center">
                    Preencha os campos abaixo para se cadastrar.
                  </Text>
                  <FormUser.Basic />
                  <Center>
                    <Text size="sm" c="orange" component="a" onClick={() => setRegister(false)} style={{ cursor: 'pointer' }}>
                      já tenho login
                    </Text>
                  </Center>

                  {/* <Divider label="ou cadastre-se com" labelPosition="center" />

                  <FormUser.SocialLogin /> */}
                </Stack>
              ) : (
                <Stack>
                  <Title order={3} ta="center">
                    Login
                  </Title>
                  <Text c="dimmed" fz="sm" ta="center">
                    Faça seu login abaixo.
                  </Text>
                  <FormLogin.Basic onSubmit={login} />
                  <Center>
                    <Text size="sm" c="orange" component="a" onClick={() => setRegister(true)} style={{ cursor: 'pointer' }}>
                      ou cadastre-se
                    </Text>
                  </Center>
                </Stack>
              )}
            </Paper>
          </Container>
        </Stepper.Step >
        <Stepper.Step label="Resumo" description="Confirmação" disabled={!canSubmit || !isAuthenticated}>
          <Stack>
            <Box>
              <Text size="lg"><strong>Data</strong>: {dateToHuman(schedule.date, 'date')}</Text>
              <Text size="lg"><strong>Hora</strong>: {schedule.items[0].start_time} - {schedule.items[schedule.items.length - 1].end_time} ({totalDuration}min)</Text>
              <Text>
                <strong>Local</strong>: {company.name}<br />{company.address}, {company.district}, {company.city.name}/{company.state}
              </Text>
            </Box>

            <Text size="lg" fw={700}>Serviços</Text>
            <Grid justify="center">
              {schedule.items?.map((item, index) => (
                <ScheduleItem
                  key={`scheduleItem-${item.service_id}`}
                  editValues={item}
                  showChangeButton={false}
                  onChangeEmployee={() => setOpenSelectEmployees(index)}
                />
              ))}
            </Grid>

            <Group justify="center">
              <Button size="lg" onClick={() => setStep(0)}>Reagendar</Button>
              <Button
                size="lg"
                color="green"
                loading={isSubmitting}
                onClick={handleSubmit}>
                Confirmar agendamento
              </Button>
            </Group>
          </Stack>
        </Stepper.Step>
        <Stepper.Completed disabled={!isAuthenticated}>
          <Stack>
            <Center>
              <Text c="green" size="xl" fw={700}>Agendamento realizado com sucesso!</Text>
            </Center>
            <Box>
              <Text>Logo enviaremos um e-mail com a confirmação de agendamento para o e-mail cadastrado.</Text>
              <Text>Antes do dia do serviço estaremos enviando um SMS para confirmar seu agendamento.</Text>
            </Box>

            <Divider />

            {true && (
              <Stack>
                <Text size="xl" fw={700}>Instruções</Text>
                <Box>
                  <Text>Um dia antes do atendimento, fique pelo menos 10 horas em jejum para poder realizar o procedimento.</Text>
                  <Text>Caso contrário teremos que reagendar um novo serviço.</Text>
                </Box>
              </Stack>
            )}

            <Group justify="center" my="md">
              <Button onClick={() => router.push('/minha-conta/agendamentos')}>Ver meus agendamentos</Button>
            </Group>
          </Stack>
        </Stepper.Completed>
      </Stepper >

      <Modal opened={openSelectEmployees !== null} onClose={() => setOpenSelectEmployees(null)} title="Selecionar Colaborador" centered size="xl">
        <EmployeesSelector scheduleItem={openSelectEmployees} onChange={handleSelectEmployee} />
      </Modal>
    </>
  )
}
