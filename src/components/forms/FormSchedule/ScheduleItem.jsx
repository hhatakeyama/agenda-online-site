import { Avatar, Button, Divider, Grid, Paper, Stack, Text, Title } from '@mantine/core'
import React from 'react'

import { currencyValue } from '@/utils/converter'

export default function ScheduleItem({ editValues, services, startTime, handleChangeStaff }) {
  // Constants
  const service = services.find(itemService => itemService.id === editValues.service_id)

  return (
    <>
      <Grid.Col span={{ base: 12 }}>
        <Paper p="lg" radius="md" withBorder>
          <Grid>
            <Grid.Col span={{ base: 12, xs: 5 }}>
              <Stack align="center" gap="xs">
                <Avatar src={''} size="lg" />
                <Text>Funcionário 1</Text>
                <Button
                  type="submit"
                  size="sm"
                  onClick={() => handleChangeStaff()}>
                  Alterar
                </Button>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, xs: 7 }}>
              <Stack align="center" gap={2}>
                <Title order={4} fw={700} align="center">Progressiva + barba + cabelo</Title>
                <Divider  />
                <Text>{currencyValue(service.price)}</Text>
                <Text size="sm">Início: {startTime}</Text>
                <Text size="sm">Duração: {service.duration}</Text>
              </Stack>
            </Grid.Col>
          </Grid>
        </Paper>
      </Grid.Col>
    </>
  )
}
