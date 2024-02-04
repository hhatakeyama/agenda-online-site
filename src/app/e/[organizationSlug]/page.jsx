'use client'

import { Grid, Group, Modal, Select, Skeleton, Stack, Text } from '@mantine/core'
import { IconPhone } from '@tabler/icons-react';
import React, { useEffect } from 'react'

import guardOrganization from '@/guards/OrganizationGuard';
import { useOrganization } from '@/providers/OrganizationProvider';

import Details from './Details'

function Organization() {
  // Hooks
  const { companies, organization, selectedCompanyId, setSelectedCompany, setSelectedCompanyId } = useOrganization()

  // Fetch
  const companiesOptions = companies.map(item => {
    return { value: item.id.toString(), label: item.name.toString() }
  }) || []

  // Effect
  useEffect(() => {
    if (organization && !selectedCompanyId && companiesOptions?.length === 1 && companies[0]) {
      setSelectedCompany(companies[0])
      setSelectedCompanyId(companies[0].id)
    }
  }, [companies, companiesOptions?.length, organization, selectedCompanyId, setSelectedCompany, setSelectedCompanyId])

  return (
    <>
      {organization && selectedCompanyId ? (
        <Details />
      ) : (
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
          {!selectedCompanyId && companiesOptions.length > 1 && (
            <Modal opened={true} withCloseButton={false} onClose={() => { }} title="Selecione uma unidade" centered>
              <Select placeholder="Selecione uma unidade" data={companiesOptions} onChange={option => setSelectedCompanyId(option || null)} />
            </Modal>
          )}
        </>
      )}
    </>
  )
}

export default guardOrganization(Organization)
