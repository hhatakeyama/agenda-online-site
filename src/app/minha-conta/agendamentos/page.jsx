'use client'

import { Group, Paper, Stack, Text, Title } from '@mantine/core'

import StatusChip from '@/components/display/StatusChip'
import ClientMenu from '@/components/navigation/ClientMenu'
import guardAccount from '@/guards/AccountGuard'
import { useAuth } from '@/providers/AuthProvider'
import { dateToHuman } from '@/utils'
import { currencyValue } from '@/utils/converter'

function Schedules() {
  // Hooks
  const { userData } = useAuth()

  // Fetch
  // const { data } = useFetch([userData?.id ? `/schedules/client/${userData.id}` : null])
  // console.log(data)
  const data = [
    {
      id: 1,
      date: '2024-02-05',
      confirmed: true,
      done: true,
      company: { name: 'Cabelereira Leila' },
      scheduleItems: [{
        id: 1,
        service: { name: 'Cabelo' },
        start_time: '09:00',
        end_time: '09:30',
        price: '50.50',
        duration: '00:30',
      }],
    },
    {
      id: 2,
      date: '2024-02-06',
      confirmed: true,
      done: false,
      company: { name: 'Barbearia da bárbara' },
      scheduleItems: [
        {
          id: 2,
          service: { name: 'Cabelo' },
          start_time: '09:00',
          end_time: '09:30',
          price: '14.50',
          duration: '00:30',
        },
        {
          id: 3,
          service: { name: 'Barba' },
          start_time: '09:30',
          end_time: '10:30',
          price: '29.99',
          duration: '01:00',
        },
      ],
    }
  ]

  return (
    <Group align="flex-start" wrap="nowrap">
      <ClientMenu />

      <Stack>
        <Title c="orange" order={1} fw={700}>Agendamentos</Title>
        {JSON.stringify(data)}

        {data?.map(schedule => (
          <Paper withBorder key={schedule.id} p={10}>
            <Group justify="space-between">
              <Stack gap={5}>
                <Text size="lg" fw={700}>{dateToHuman(schedule.date, 'date')} - {schedule.company.name}</Text>

                {schedule.scheduleItems?.map(scheduleItem => (
                  <Group key={scheduleItem.id}>
                    <Text>
                      {scheduleItem.service.name} {currencyValue(scheduleItem.price)}: {scheduleItem.start_time} - {scheduleItem.end_time}
                    </Text>
                  </Group>
                ))}
              </Stack>
              <Group gap={5}>
                <StatusChip status={schedule.confirmed} title="confirmado" />
                <StatusChip status={schedule.done} title="concluído" />
              </Group>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Group>
  )
}

export default guardAccount(Schedules)
