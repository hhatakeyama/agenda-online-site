import { Avatar, Divider, Grid, Paper, Stack, Text, Title } from '@mantine/core'
import React from 'react'

import { currencyValue } from '@/utils/converter'

export default function ScheduleItem({ editValues, employee, services, startTime }) {
  // Constants
  const service = services.find(itemService => itemService.id === editValues.service_id)
  const canChooseEmployee = editValues?.service?.can_choose_employee === 1 || editValues?.service?.can_choose_employee === "1"

  return (
    <>
      <Grid.Col span={{ base: 12 }}>
        <Paper p="lg" radius="md" withBorder>
          <Grid>
            <Grid.Col span={{ base: 12, xs: 5 }}>
              <Stack align="center" gap="xs">
                <Avatar src={canChooseEmployee ? employee?.picture : ''} size="lg" />
                <Text>{canChooseEmployee && employee ? employee?.name : 'Disponível'}</Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, xs: 7 }}>
              <Stack align="center" gap={2}>
                <Title order={4} fw={700} align="center">{service?.name}</Title>
                <Divider />
                <Text fw={700} color="orange">{currencyValue(service.price)}</Text>
                <Text size="sm">Início: <strong>{startTime || '--'}</strong></Text>
                <Text size="sm">Duração: <strong>{service.duration}</strong></Text>
              </Stack>
            </Grid.Col>
          </Grid>
        </Paper>
      </Grid.Col>
    </>
  )
}
