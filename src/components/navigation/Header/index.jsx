'use client'

import {
  ActionIcon,
  Avatar,
  Box,
  Burger,
  Container,
  Group,
  Indicator,
  Menu,
  Modal,
  rem,
  Text,
  Tooltip,
  UnstyledButton,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconChevronDown, IconShoppingCart } from '@tabler/icons-react'
import cx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { useAuth } from '@/providers/AuthProvider'
import { useSchedule } from '@/providers/ScheduleProvider'

import Cart from '../Cart'
import classes from './Header.module.css'

export default function Header() {
  // Hooks
  const { logout, isAuthenticated, userData } = useAuth()
  const pathname = usePathname()
  const { openCartMenu, schedule, setOpenCartMenu } = useSchedule()

  // Constants
  const menu = [
    { link: '/category/barbearias', label: 'Barbearias' },
    { link: '/category/manicures', label: 'Manicures' },
  ]
  const menuItens = menu.map((item) => (
    <a
      className={classes.mainLink}
      data-active={pathname.indexOf(item.link) !== -1 || undefined}
      href={item.link}
      key={item.label}
    >
      <span>{item.label}</span>
    </a>
  ))

  // States
  const [opened, { toggle }] = useDisclosure(false)
  const [openEmptyCartMenu, setOpenEmptyCartMenu] = useState(false)
  const [openUserMenu, setOpenUserMenu] = useState(false)

  return (
    <header className={classes.header}>
      <Container className={classes.mainSection} size="lg">
        <Group justify="space-between">
          <Link href="/" className={classes.logo}>Skedyou</Link>
          <Box className={classes.links} visibleFrom="sm">
            <Group justify="flex-end">
              {isAuthenticated && userData ? (
                <>
                  <Tooltip opened={openEmptyCartMenu} label="Nenhum serviço selecionado">
                    <ActionIcon color="white" variant="transparent" size="lg" onClick={() => schedule.items.length > 0 ? setOpenCartMenu(true) : setOpenEmptyCartMenu(!openEmptyCartMenu)}>
                      <Indicator inline label={schedule.items.length} size={16}>
                        <IconShoppingCart />
                      </Indicator>
                    </ActionIcon>
                  </Tooltip>
                  <Menu
                    width={260}
                    position="bottom-end"
                    transitionProps={{ transition: 'pop-top-right' }}
                    onClose={() => setOpenUserMenu(false)}
                    onOpen={() => setOpenUserMenu(true)}
                    withinPortal
                    styles={{ dropdown: { zIndex: 1001 } }}
                  >
                    <Menu.Target>
                      <UnstyledButton p={5} className={cx(classes.user, { [classes.userActive]: openUserMenu })}>
                        <Group gap={7}>
                          <Avatar src={userData?.image} alt={userData?.name} radius="xl" size={22} />
                          <Text fw={500} size="sm" lh={1} mr={3}>
                            {userData?.name}
                          </Text>
                          <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                        </Group>
                      </UnstyledButton>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item component="a" href="/minha-conta">
                        Minha Conta
                      </Menu.Item>
                      <Menu.Item component="a" href="/minha-conta/agendamentos">
                        Meus agendamentos
                      </Menu.Item>
                      <Menu.Item onClick={logout}>
                        Logout
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </>
              ) : (
                <UnstyledButton component="a" href="/minha-conta/login" p={8} className={classes.user}>
                  <Text fw={500} size="sm" lh={1} mr={3}>
                    Login
                  </Text>
                </UnstyledButton>
              )}
            </Group>
            <Group gap={0} justify="flex-end" className={classes.mainLinks}>
              {menuItens}
            </Group>
          </Box>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
        </Group>
      </Container>

      <Modal opened={openCartMenu} onClose={() => setOpenCartMenu(false)} title="Agendamento" centered size="xl">
        <Cart />
      </Modal>
    </header>
  )
}