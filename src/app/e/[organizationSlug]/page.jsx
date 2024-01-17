'use client'

import { Button, Collapse, Grid, Group, Input, Paper, Skeleton, Space, Stack, Table, Text, Title } from '@mantine/core'
import { IconChevronDown, IconChevronUp, IconPhone } from '@tabler/icons-react'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'

export default function Organization() {
  // Hooks
  const { organizationSlug } = useParams()

  // States
  const [open, setOpen] = useState([]);

  // Fetch
  // const { data } = useFetch([`/`])
  const data = {
    registeredName: 'Barbearia Ltda',
    tradingName: 'Barbearia',
    cnpj: '12.345.678/0001-90',
    status: '1',
  }

  // Actions
  const handleOpenService = category => {
    if(open.find(item => item === category)) {
      setOpen(open.filter(item => item !== category))
    } else {
      setOpen(prevState => [...prevState, category])
    }
  }

  const handleSchedule = service => {
    alert(service)
  }

  return (
    <Grid>
      <Grid.Col span={8}>
        <Stack>
          <Skeleton h={200} />
          <Title order={1}>{data.tradingName} - {organizationSlug}</Title>

          <Title order={2}>Serviços</Title>
          <Input name="search" placeholder="Buscar por nome" />

          {[1,2,3].map(category => (
            <Paper shadow="xs" p="sm" key={category}>
              <Stack>
                <Group justify="space-between" onClick={() => handleOpenService(category)} style={{ cursor: 'pointer' }}>
                  <Title order={3}>Cabelo</Title>
                  {!!open.find(item => item === category) ? <IconChevronUp /> : <IconChevronDown />}
                </Group>
                <Collapse in={!open.find(item => item === category)}>
                  <Table highlightOnHover>
                    <Table.Tbody>
                      {[1,2,3].map(service => (
                        <Table.Tr key={service}>
                          <Table.Td w="70%">
                            <Text>Cabelo 1 - 30 min</Text>
                          </Table.Td>
                          <Table.Td align="right">
                            <Group align="center" justify="flex-end" gap={10}>
                              <Text>R$ 100,00</Text>
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
          ))}
          <Space h="20" />

          <Title order={2}>Galeria</Title>
          <Grid>
            <Grid.Col span={4}>
              <Skeleton h={200} />
            </Grid.Col>
            <Grid.Col span={4}>
              <Skeleton h={200} />
            </Grid.Col>
            <Grid.Col span={4}>
              <Skeleton h={200} />
            </Grid.Col>
          </Grid>
        </Stack>
      </Grid.Col>
      <Grid.Col span={4}>
        <Stack>
          <Title order={2}>Profissionais</Title>
          <Group>
            {[1,2,3].map(collaborator => (
              <Stack key={collaborator}>
                <Skeleton h="80" />

                <Text>Colaborador {collaborator}</Text>
              </Stack>
            ))}
          </Group>
          
          <Title order={2}>Contatos</Title>
          {[1,2,3].map(contact => (
            <Stack key={contact}>
              <a href={`+551111111111${contact}`}>
                <Group>
                  <IconPhone />
                  <Text>(11) 11111111{contact}</Text>
                </Group>
              </a>
            </Stack>
          ))}

          <Title order={2}>Horários</Title>
          <Stack>
            {[1,2,3].map(time => (
              <Group justify="space-between" key={time}>
                <Text>{time}-feira</Text>

                <Stack gap={0}>
                  <Text>08:00 - 12:00</Text>
                  <Text>14:00 - 18:00</Text>
                </Stack>
              </Group>
            ))}
          </Stack>

          <Title order={2}>Redes-sociais</Title>
          <Group justify="space-between">
            {[1,2,3].map(socialMedia => (
              <Stack key={socialMedia}>
                <Skeleton h={60} w={60} />

                <Text>Face {socialMedia}</Text>
              </Stack>
            ))}
          </Group>
        </Stack>
      </Grid.Col>
    </Grid>
  )
}
