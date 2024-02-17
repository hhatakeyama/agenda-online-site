import { Alert, Button, Grid, LoadingOverlay, Stack, Text } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { useParams } from 'next/navigation'
import React from 'react'

import { useFetch } from '@/hooks'
import { useOrganization } from '@/providers/OrganizationProvider'
import { useSchedule } from '@/providers/ScheduleProvider'
import { generateHourList, generateUnavailableHourList, parseMinutes, verifyAvailableHour } from '@/utils'

export default function HourList({ dayOfWeek }) {
  // Hooks
  const { organizationSlug } = useParams()
  const { company } = useOrganization()
  const { schedule, selectedServices, smallestDuration, handleChangeSchedule } = useSchedule()

  // Constants
  const today = new Date().toISOString()
  let totalDuration = 0
  selectedServices.map(item => totalDuration += Number(parseMinutes(item.duration)))

  // Fetch
  const { data, isValidating } = useFetch([
    organizationSlug && company?.id && selectedServices && schedule.date ? `/site/schedules/unavailables/` : null,
    {
      company: company?.id,
      date: schedule.date ? new Date(schedule.date).toISOString() : today,
      services: selectedServices.flatMap(item => item.id),
      employees: selectedServices.flatMap(selectedService => selectedService.employees.flatMap(employee => employee.id))
    }
  ])
  const unavailables = data?.data || []
  const unavailableHours = generateUnavailableHourList(selectedServices, smallestDuration, unavailables) || [] // Mount unavailable hour list for each selected service
  const hourList = generateHourList(schedule.date, dayOfWeek, smallestDuration, unavailableHours) || [] // Mount available hour list
  const availableHourList = hourList.filter(hour => verifyAvailableHour(hourList, dayOfWeek, totalDuration, hour))

  return (
    <>
      <LoadingOverlay visible={isValidating} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
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
    </>
  )
}
