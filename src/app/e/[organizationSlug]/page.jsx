'use client'

import { Grid, Group, Modal, Select, Skeleton, Stack, Text } from '@mantine/core'
import { IconPhone } from '@tabler/icons-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

import Details from './Details'

export default function Organization() {
  // Hooks
  const { organizationSlug } = useParams()
  const organizationSlugString = organizationSlug.split('_')
  const organizationid = organizationSlugString[organizationSlugString.length - 1]
  console.log(organizationid)

  // States
  const [company, setCompany] = useState(null);

  // Fetch
  // const { data } = useFetch([organizationid ? `/api/site/organizations/${organizationId}` : null])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data = {
    registeredName: 'Barbearia Ltda',
    tradingName: 'Barbearia',
    cnpj: '12.345.678/0001-90',
    status: '1',
    companies: [
      { id: 1, name: 'Company 1' },
      { id: 2, name: 'Company 2' },
      { id: 3, name: 'Company 3' }
    ]
  }
  const companiesOptions = data?.companies?.map(item => {
    return { value: item.id.toString(), label: item.name.toString() }
  })

  // Effect
  useEffect(() => {
    if (!company && data && companiesOptions.length === 1) setCompany(data.companies[0])
  }, [companiesOptions.length, company, data])

  return (
    <>
      {!company && company !== '' && companiesOptions?.length > 1 ? (
        <>
          <Grid>
            <Grid.Col span={{ base: 12, md: 7, lg: 8 }}>
              <Stack>
                <Skeleton h={200} />
                <Skeleton height={18} radius="xl" />

                <Skeleton height={12} radius="xl" />
                <Skeleton height={24} radius="xs" />

                <Skeleton h={400} />
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 5, lg: 4 }}>
              <Stack>
                <Skeleton height={18} radius="xl" />
                <Group>
                  {[1, 2, 3].map(collaborator => (
                    <Stack key={collaborator}>
                      <Skeleton height={50} circle />

                      <Skeleton height={8} radius="xl" />
                    </Stack>
                  ))}
                </Group>

                <Skeleton height={18} radius="xl" />
                <Stack>
                  {[1, 2, 3].map(contact => (
                    <Group key={contact}>
                      <IconPhone />
                      <Skeleton height={8} w={140} />
                    </Group>
                  ))}
                </Stack>

                <Skeleton height={12} radius="xl" />
                <Stack>
                  {[1, 2, 3].map(time => (
                    <Group justify="space-between" key={time}>
                      <Skeleton height={8} mb="xl" w={50} />

                      <Stack gap={0}>
                        <Text>00:00 - 12:00</Text>
                      </Stack>
                    </Group>
                  ))}
                </Stack>
              </Stack>
            </Grid.Col>
          </Grid>
          <Modal opened={true} withCloseButton={false} onClose={() => { }} title="Selecione uma unidade" centered>
            <Select placeholder="Selecione uma unidade" data={companiesOptions} onChange={option => setCompany(option || null)} />
          </Modal>
        </>
      ) : (
        <Details company={company} />
      )}
    </>
  )
}
