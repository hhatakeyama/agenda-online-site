'use client'

import { Paper, Text, Title } from '@mantine/core'
import { usePathname } from 'next/navigation'

import { useAuth } from '@/providers/AuthProvider'

import classes from './ClientMenu.module.css'

export default function ClientMenu() {
  // Hooks
  const { logout } = useAuth()
  const pathname = usePathname()

  // Constants
  const links = [
    { label: 'Perfil', link: '/minha-conta/perfil' },
    { label: 'Agendamentos', link: '/minha-conta/agendamentos' },
  ]

  return (
    <Paper withBorder className={classes.menu}>
      <Title className={classes.header} order={3}>Menu</Title>
      {links.map(link => (
        <Text
          key={link.link}
          className={classes.link}
          component="a"
          href={link.link}
          data-active={pathname === link.link}>
          {link.label}
        </Text>
      ))}
      <Text className={classes.link} component="a" onClick={logout} style={{ cursor: 'pointer' }}>Logout</Text>
    </Paper>
  )
}
