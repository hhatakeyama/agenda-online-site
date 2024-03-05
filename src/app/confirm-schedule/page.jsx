'use client'

import { Center, Group, Loader, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { IconCheck, IconX } from '@tabler/icons-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import Content from '@/components/navigation/Content'
import Footer from '@/components/navigation/Footer'
import Header from '@/components/navigation/Header'
import { api } from '@/utils'

export default function ConfirmSchedule() {
  // Hooks
  const params = useSearchParams()

  // States
  const [confirmed, setConfirmed] = useState(null)

  // Actions
  useEffect(() => {
    api
      .post(`/api/site/schedules/confirmSchedule`, { hash: params.get('hash') })
      .then(() => setConfirmed(true))
      .catch(error => {
        console.log(error)
        setConfirmed(false)
      })
  }, [])

  return (
    <Stack gap={0}>
      <Header />
      <Content>
        <Stack align="center" justify="center" mt="xl">
          <Title c="orange">Confirmar agendamento</Title>

          {confirmed === null && <Center><Loader /></Center>}
          {confirmed && (
            <Stack>
              <Group>
                <ThemeIcon radius="xl">
                  <IconCheck />
                </ThemeIcon>
                <Text ta="center" size="lg">
                  Agendamento confirmado com sucesso!
                </Text>
              </Group>
              <Text ta="center">A equipe da Skedyou agradece.</Text>
            </Stack>
          )}
          {confirmed === false && (
            <Stack>
              <Group>
                <ThemeIcon radius="xl" color="red">
                  <IconX />
                </ThemeIcon>
                <Text ta="center" size="lg">Erro ao confirmar agendamento.</Text>
              </Group>
              <Text ta="center">Tente novamente mais tarde.</Text>
            </Stack>
          )}
        </Stack>
      </Content>
      <Footer />
    </Stack>
  )
}
