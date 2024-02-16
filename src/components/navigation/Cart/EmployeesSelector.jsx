import { Avatar, Box, Group, LoadingOverlay, Stack, Text, UnstyledButton } from '@mantine/core'
import React from 'react'

import { useAuth } from '@/providers/AuthProvider'
import { useSchedule } from '@/providers/ScheduleProvider'

import classes from './Cart.module.css'

export default function Employees({ scheduleItem, onChange }) {
  // Hooks
  const { isValidating } = useAuth()
  const { selectedServices } = useSchedule()

  // Constants
  const service = scheduleItem ? selectedServices.find(item => item.id === scheduleItem.item?.service_id) : {}
  const selectedEmployee = scheduleItem && service ? service.employees?.find?.(item => item.id === scheduleItem.item?.employee_id) : {}
  const canChooseEmployee = service?.can_choose_employee === 1

  // Actions
  const handleChangeEmployee = employee => {
    onChange(scheduleItem.index, employee)
  }

  return (
    <Box style={{ position: 'relative' }}>
      <LoadingOverlay visible={isValidating} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

      <Stack gap="xs">
        <UnstyledButton onClick={() => handleChangeEmployee(null)} p="xs" className={classes.employeeSelector}>
          <Group gap="xs">
            <Avatar src={''} size={50} style={{ border: !selectedEmployee ? '3px solid #f57842' : '3px solid #333333' }} />
            <Text fw={!selectedEmployee ? 700 : 400}>Qualquer colaborador</Text>
          </Group>
        </UnstyledButton>
        {canChooseEmployee && service?.employees?.map?.(employee => {
          const available = true
          return (
            <UnstyledButton onClick={() => available ? handleChangeEmployee(employee) : null} key={employee.id} p="xs" className={available ? classes.employeeSelector : classes.unavailableEmployeeSelector}>
              <Group gap="xs">
                <Avatar src={employee.picture} size={50} style={{ border: selectedEmployee?.id === employee.id ? '3px solid #f57842' : '3px solid #333333' }} />
                <Box>
                  <Text fw={selectedEmployee?.id === employee.id ? 700 : 400}>{employee.name}</Text>
                  <Text size="sm" c={available ? 'green' : 'red'}>{available ? 'Disponível' : 'Indisponível'}</Text>
                </Box>
              </Group>
            </UnstyledButton>
          )
        })}
      </Stack>
    </Box>
  )
}
