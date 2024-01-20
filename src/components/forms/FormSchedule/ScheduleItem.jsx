import { Alert, Box, Button, Group, Stack, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import React, { useState } from 'react'

export default function ScheduleItem({ editValues, onSubmit }) {
  // Hooks
  const theme = useMantineTheme()
  const isXs = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`)

  // States
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [scheduleItem, setScheduleItem] = useState(editValues || null)

  // Actions
  const handleSubmit = async () => {
    setError(null)
    setIsSubmitting(true)
    onSubmit(scheduleItem)
  }

  return (
    <Stack>
      <Box>
        {JSON.stringify(scheduleItem)}
      </Box>

      {!!error && <Alert color="red" title="Erro">{error}</Alert>}

      <Group mt="xl">
        <Button
          color="green"
          type="submit"
          size={isXs ? 'sm' : 'md'}
          fullWidth={!!isXs}
          loading={isSubmitting}>
          Selecionar
        </Button>
      </Group>
    </Stack>
  )
}
