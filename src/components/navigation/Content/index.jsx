'use client'

import { Box, Container } from '@mantine/core'
import React from 'react'

export default function Content({ children }) {
  return (
    <Box style={{ minHeight: 'calc(100vh - 168px)', width: '100%' }}>
      <Container size="lg" mb={100}>
        {children}
      </Container>
    </Box>
  )
}
