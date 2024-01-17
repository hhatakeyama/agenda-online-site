'use client'

import { Box, Container } from '@mantine/core'
import React from 'react'

export default function Content({ children }) {
  return (
    <Box style={{ width: '100%' }}>
      <Container size="lg">
        {children}
      </Container>
    </Box>
  )
}
