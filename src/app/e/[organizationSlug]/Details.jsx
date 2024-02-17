'use client'

import { ActionIcon, Avatar, Box, Center, Grid, Group, Image, Space, Stack, Text, Title } from '@mantine/core'
import { IconBrandFacebook, IconBrandInstagram, IconBrandWhatsapp, IconBrandX, IconMail, IconPhone } from '@tabler/icons-react'
import Link from 'next/link'
import React from 'react'

import { useOrganization } from '@/providers/OrganizationProvider'
import { contactTypeUrl, daysOfWeekString } from '@/utils'

import classes from './Organization.module.css'
import Services from './Services'

export default function Details() {
  // Hooks
  const { company, organization } = useOrganization()

  // Fetch
  const socialMedias = company.socialMedia ? JSON.parse(company.socialMedia) : {}

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 7, lg: 8 }}>
        <Stack>
          {company.thumb && (
            <Image
              src={company.thumb}
              alt="Capa"
              radius="md"
              fit="contain"
              fallbackSrc="https://placehold.co/600x300?text=Sem imagem"
            />
          )}
          <Title order={1}>{organization.tradingName || ''}</Title>

          {company && <Services />}
          <Space h="20" />

          {/* <Title order={2}>Galeria</Title>
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
          </Grid> */}
        </Stack>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 5, lg: 4 }}>
        <Stack>
          {company.map && <Box className={classes.map} dangerouslySetInnerHTML={{ __html: company.map }}></Box>}
          {company.company_employees?.length > 0 && (
            <>
              <Title order={2}>Profissionais</Title>
              <Group>
                {company.company_employees?.map(companyEmployee => (
                  <Box key={companyEmployee.id}>
                    <Avatar src={companyEmployee.employee.picture} size="lg" />
                    <Center><Text>{companyEmployee.employee.name.split(' ')[0]}</Text></Center>
                  </Box>
                ))}
              </Group>
            </>
          )}

          {(company.email || company.phone || company.mobilePhone) && (
            <>
              <Title order={2}>Contatos</Title>
              <Stack>
                {company.email && (
                  <Link className={classes.contact} href={contactTypeUrl('email', company.email)}>
                    <Group>
                      <IconMail />
                      <Text>{company.email}</Text>
                    </Group>
                  </Link>
                )}
                {company.phone && (
                  <Link className={classes.contact} href={contactTypeUrl('phone', company.phone)}>
                    <Group>
                      <IconPhone />
                      <Text>{company.phone}</Text>
                    </Group>
                  </Link>
                )}
                {company.mobilePhone && (
                  <Link className={classes.contact} href={contactTypeUrl('whatsapp', company.mobilePhone)}>
                    <Group>
                      <IconBrandWhatsapp />
                      <Text>{company.mobilePhone}</Text>
                    </Group>
                  </Link>
                )}
              </Stack>
            </>
          )}

          {company.days_of_weeks?.length > 0 && (
            <>
              <Title order={2}>Horários</Title>
              <Stack>
                {company.days_of_weeks?.map(dayOfWeek => (
                  <Group justify="space-between" key={`dayOfWeek-${dayOfWeek.id}`}>
                    <Text>{daysOfWeekString[dayOfWeek.day_of_week]}</Text>

                    <Stack gap={0}>
                      {dayOfWeek.start_time && <Text>{dayOfWeek.start_time} - {dayOfWeek.end_time}</Text>}
                      {[2, 3, 4].map(day => {
                        if (dayOfWeek[`start_time_${day}`])
                          return (
                            <Text key={`dayOfWeekStartTime-${dayOfWeek[`start_time_${day}`]}`}>
                              {dayOfWeek[`start_time_${day}`]} - {dayOfWeek[`end_time_${day}`]}
                            </Text>
                          )
                      })}
                    </Stack>
                  </Group>
                ))}
              </Stack>
            </>
          )}

          {(socialMedias.facebook || socialMedias.twitter || socialMedias.instagram) && (
            <>
              <Title order={2}>Redes sociais</Title>
              <Group justify="center" gap="md">
                {socialMedias.facebook && (
                  <ActionIcon size="xl" color="blue" variant="filled" radius="xl" aria-label="Facebook" component="a" href={socialMedias.facebook} target="_blank">
                    <IconBrandFacebook stroke={2} />
                  </ActionIcon>
                )}
                {socialMedias.twitter && (
                  <ActionIcon size="xl" color="black" variant="filled" radius="xl" aria-label="Twitter" component="a" href={socialMedias.twitter} target="_blank">
                    <IconBrandX stroke={2} />
                  </ActionIcon>
                )}
                {socialMedias.instagram && (
                  <ActionIcon size="xl" color="pink" variant="filled" radius="xl" aria-label="Instagram" component="a" href={socialMedias.instagram} target="_blank">
                    <IconBrandInstagram stroke={2} />
                  </ActionIcon>
                )}
              </Group>
            </>
          )}
        </Stack>
      </Grid.Col>
    </Grid>
  )
}
