import { ThemeIcon } from '@mantine/core'
import { IconCheck, IconX } from '@tabler/icons-react'
import React from 'react'

export default function Status({ status }) {
  return status ? (
    <ThemeIcon color="green" radius="xl">
      <IconCheck style={{ width: '16px', height: '16px' }} />
    </ThemeIcon>
  ) : (
    <ThemeIcon color="red" radius="xl">
      <IconX style={{ width: '16px', height: '16px' }} />
    </ThemeIcon>
  )
}
