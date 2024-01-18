'use client'

import { ActionIcon, Button, Collapse, Grid, Group, Image, Input, Modal, Paper, Skeleton, Space, Stack, Table, Text, Title } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { IconBrandFacebook, IconBrandInstagram, IconBrandTwitter, IconBrandWhatsapp, IconChevronDown, IconChevronUp, IconMail, IconPhone } from '@tabler/icons-react'
import React, { useState } from 'react'

import { useFetch } from '@/hooks'
import { daysOfWeekString } from '@/utils/dateFormatter'

export default function Details({ organization, companyId }) {
  // States
  const [open, setOpen] = useState([]);
  const [newSchedule, setNewSchedule] = useState(null);
  const [value, setValue] = useState(null);

  // Fetch
  const { data } = useFetch([companyId ? `${process.env.NEXT_PUBLIC_ENTRYPOINT}/site/companies/${companyId}` : null])
  const company = data?.data
  const socialMedias = company?.socialMedia ? JSON.parse(company.socialMedia) : null

  // Actions
  const handleOpenService = category => {
    if (open.find(item => item === category)) {
      setOpen(open.filter(item => item !== category))
    } else {
      setOpen(prevState => [...prevState, category])
    }
  }

  const handleSchedule = service => {
    setNewSchedule(service)
  }

  return (
    <>
      <Grid>
        <Grid.Col span={{ base: 12, md: 7, lg: 8 }}>
          <Stack>
            {company?.thumb && (
              <Image
                src={company?.thumb}
                alt="Capa"
                radius="md"
                fit="contain"
                fallbackSrc="https://placehold.co/600x400?text=Sem imagem"
              />
            )}
            <Title order={1}>{organization?.tradingName}</Title>

            <Title order={2}>Serviços</Title>
            <Input name="search" placeholder="Buscar por nome" />

            {[1, 2, 3].map(category => (
              <Paper shadow="xs" p="sm" key={category}>
                <Stack>
                  <Group justify="space-between" onClick={() => handleOpenService(category)} style={{ cursor: 'pointer' }}>
                    <Title order={3}>Cabelo</Title>
                    {!!open.find(item => item === category) ? <IconChevronUp /> : <IconChevronDown />}
                  </Group>
                  <Collapse in={!open.find(item => item === category)}>
                    <Table highlightOnHover>
                      <Table.Tbody>
                        {[1, 2, 3].map(service => (
                          <Table.Tr key={service}>
                            <Table.Td w="60%">
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
        <Grid.Col span={{ base: 12, md: 5, lg: 4 }}>
          <Stack>
            {company?.company_employees?.length > 0 && (
              <>
                <Title order={2}>Profissionais</Title>
                <Group>
                  {company.company_employees.employee.map(employee => (
                    <Stack key={employee.id}>
                      <Skeleton h="80" />

                      <Text>{employee.name}</Text>
                    </Stack>
                  ))}
                </Group>
              </>
            )}

            {(company?.email || company?.phone || company?.mobilePhone) && (
              <>
                <Title order={2}>Contatos</Title>
                <Stack>
                  {company?.email && (
                    <a href={`mailto:${company?.email}`}>
                      <Group>
                        <IconMail />
                        <Text>{company?.email}</Text>
                      </Group>
                    </a>
                  )}
                  {company?.phone && (
                    <a href={`+55${company?.phone}`}>
                      <Group>
                        <IconPhone />
                        <Text>{company?.phone}</Text>
                      </Group>
                    </a>
                  )}
                  {company?.mobilePhone && (
                    <a href={`+55${company?.mobilePhone}`}>
                      <Group>
                        <IconBrandWhatsapp />
                        <Text>{company?.mobilePhone}</Text>
                      </Group>
                    </a>
                  )}
                </Stack>
              </>
            )}

            {company?.days_of_week?.length > 0 && (
              <>
                <Title order={2}>Horários</Title>
                <Stack>
                  {company.days_of_week.map(dayOfWeek => (
                    <Group justify="space-between" key={dayOfWeek.id}>
                      <Text>{daysOfWeekString[dayOfWeek.day_of_week]}</Text>

                      <Stack gap={0}>
                        {dayOfWeek.start_time && <Text>{dayOfWeek.start_time} - {dayOfWeek.end_time}</Text>}
                        {[2, 3, 4].map(day => {
                          if (dayOfWeek?.[`start_time_${day}`]) return <Text>{dayOfWeek?.[`start_time_${day}`]} - {dayOfWeek?.[`end_time_${day}`]}</Text>
                        })}
                      </Stack>
                    </Group>
                  ))}
                </Stack>
              </>
            )}

            {(socialMedias?.facebook || socialMedias?.twitter || socialMedias?.instagram) && (
              <>
                <Title order={2}>Redes sociais</Title>
                <Group justify="center" gap="md">
                  {socialMedias?.facebook && (
                    <ActionIcon size="lg" color="blue" variant="filled" radius="xl" aria-label="Facebook" onClick={() => window.open(socialMedias.facebook)}>
                      <IconBrandFacebook style={{ width: '70%', height: '70%' }} stroke={1.5} />
                    </ActionIcon>
                  )}
                  {socialMedias?.twitter && (
                    <ActionIcon size="lg" color="lightblue" variant="filled" radius="xl" aria-label="Twitter" onClick={() => window.open(socialMedias.twitter)}>
                      <IconBrandTwitter style={{ width: '70%', height: '70%' }} stroke={1.5} />
                    </ActionIcon>
                  )}
                  {socialMedias?.instagram && (
                    <ActionIcon size="lg" color="pink" variant="filled" radius="xl" aria-label="Instagram" onClick={() => window.open(socialMedias.instagram)}>
                      <IconBrandInstagram style={{ width: '70%', height: '70%' }} stroke={1.5} />
                    </ActionIcon>
                  )}
                </Group>
              </>
            )}
          </Stack>
        </Grid.Col>
      </Grid>

      <Modal opened={newSchedule} onClose={() => setNewSchedule(null)} title="Agendamento" centered>
        <DatePicker value={value} onChange={setValue} />
      </Modal>
    </>
  )
}
