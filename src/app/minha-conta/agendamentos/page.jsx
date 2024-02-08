'use client'

import { Center, Group, Pagination, Paper, Stack, Text, Title } from '@mantine/core'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

import StatusChip from '@/components/display/StatusChip'
import ClientMenu from '@/components/navigation/ClientMenu'
import guardAccount from '@/guards/AccountGuard'
import { useFetch } from '@/hooks'
import { useAuth } from '@/providers/AuthProvider'
import { dateToHuman } from '@/utils'
import { currencyValue } from '@/utils/converter'

import classes from './Schedules.module.css'

function Schedules() {
  // Hooks
  const { userData } = useAuth()
  const params = useSearchParams()

  // States
  const [page, setPage] = useState(params.get('page') || 1)
  const [pageSize] = useState(params.get('page_size') || 20)

  // Fetch
  const { data } = useFetch([userData?.id ? `/site/schedules/client/${userData.id}` : null, { page, page_size: pageSize }])
  const { data: pagination } = data || { data: {} }

  return (
    <Group align="flex-start" wrap="nowrap">
      <ClientMenu />

      <Stack w="100%">
        <Title c="orange" order={1} fw={700}>Agendamentos</Title>
        {pagination?.data?.map(schedule => {
          let total = 0
          return (
            <Paper withBorder key={schedule.id} p={10}>
              <Stack gap={5}>
                <Text size="lg" fw={700}>{dateToHuman(`${schedule.date}T03:00:00Z`, 'date')} - {schedule.company.name}</Text>
                <Text><strong>Local</strong>: {schedule.company.address}</Text>

                {schedule.schedule_items?.map(scheduleItem => {
                  total += Number(scheduleItem.price)
                  return (
                    <Group className={classes.scheduleItem} justify="space-between" key={scheduleItem.id}>
                      <Text>
                        <strong>{scheduleItem.service.name}</strong>: {scheduleItem.start_time} - {scheduleItem.end_time}
                      </Text>
                      <Text c="green" fw={700}>{currencyValue(scheduleItem.price)}</Text>
                    </Group>
                  )
                })}
                <Group justify="space-between" gap={5}>
                  <Group>
                    <StatusChip status={schedule.confirmed} title="confirmado" />
                    {schedule.confirmed && <StatusChip status={schedule.done} title="concluído" />}
                  </Group>
                  <Text c="orange" fw={700}>Total: {currencyValue(total)}</Text>
                </Group>
              </Stack>
            </Paper>
          )
        })}

        {pagination?.last_page > 1 && (
          <Center>
            <Pagination total={pagination?.last_page} defaultValue={page} onChange={setPage} />
          </Center>
        )}
      </Stack>
    </Group>
  )
}

export default guardAccount(Schedules)
