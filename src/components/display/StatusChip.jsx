import { Chip } from '@mantine/core'
import { IconCheck, IconX } from '@tabler/icons-react'
import React from 'react'

export default function StatusChip({ status, title }) {
  return status ? (
    <Chip color="green" defaultChecked={true} type="radio" icon={<IconCheck style={{ width: '16px', height: '16px' }} />}>
      {title}
    </Chip>
  ) : (
    <Chip color="red" defaultChecked={true} type="radio" icon={<IconX style={{ width: '16px', height: '16px' }} />}>
      {title}
    </Chip>
  )
}
