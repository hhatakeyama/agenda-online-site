'use client'

import { Button, Collapse, Group, Input, Modal, Paper, Stack, Table, Text, Title } from '@mantine/core'
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react'
import React, { useState } from 'react'

import { FormSchedule } from '@/components/forms'
import { currencyValue } from '@/utils/converter'

export default function Categories({ company, categories }) {
  // Constants
  const services = company.company_services.map(companyService => companyService.service)

  // States
  const [open, setOpen] = useState([]);
  const [search, setSearch] = useState('');
  const [newService, setNewService] = useState(null);

  // Actions
  const handleOpenService = category => {
    if (open.find(item => item === category)) {
      setOpen(open.filter(item => item !== category))
    } else {
      setOpen(prevState => [...prevState, category])
    }
  }

  const handleSchedule = service => {
    setNewService(service)
  }

  return (
    <>
      <Title order={2}>Serviços</Title>
      <Input name="search" placeholder="Buscar por nome" value={search} onChange={e => setSearch(e.target.value)} />

      {categories.map(category => {
        const hasServices = category.services?.filter(itemService => itemService.name.indexOf(search) !== -1).length
        return hasServices ? (
          <Paper shadow="xs" p="sm" key={category.id}>
            <Stack>
              <Group justify="space-between" onClick={() => handleOpenService(category.id)} style={{ cursor: 'pointer' }}>
                <Title order={3}>{category.name}</Title>
                {!!open.find(item => item === category.id) ? <IconChevronUp /> : <IconChevronDown />}
              </Group>
              <Collapse in={!open.find(item => item === category.id)}>
                <Table highlightOnHover>
                  <Table.Tbody>
                    {category.services?.filter(itemService => itemService.name.indexOf(search) !== -1).map(service => (
                      <Table.Tr key={service.id}>
                        <Table.Td w="60%">
                          <Text>{service.name} - {service.duration}</Text>
                        </Table.Td>
                        <Table.Td align="right">
                          <Group align="center" justify="flex-end" gap={10}>
                            <Text>{currencyValue(service.price)}</Text>
                            <Button onClick={() => handleSchedule(service)}>Agendar</Button>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Collapse>
            </Stack>
          </Paper>
        ) : null
      })}
      
      <Modal opened={newService} onClose={() => setNewService(null)} title="Agendamento" centered size="xl">
        {company && newService && (
          <FormSchedule.Basic
            daysOfWeeks={company.days_of_weeks}
            services={services}
            startService={newService}
          />
        )}
      </Modal>
    </>
  )
}
