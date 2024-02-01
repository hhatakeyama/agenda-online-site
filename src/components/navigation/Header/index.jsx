'use client'

import {
  Avatar,
  Box,
  Burger,
  Container,
  Group,
  Menu,
  rem,
  Text,
  UnstyledButton,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconChevronDown } from '@tabler/icons-react'
import cx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { useAuth } from '@/providers/AuthProvider'

import classes from './Header.module.css'

export default function Header() {
  // Hooks
  const { userData } = useAuth()
  const pathname = usePathname()

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
  const [userMenuOpened, setUserMenuOpened] = useState(false)

  return (
    <header className={classes.header}>
      <Container className={classes.mainSection} size="lg">
        <Group justify="space-between">
          <Link href="/" className={classes.logo}>Skedyou</Link>
          <Box className={classes.links} visibleFrom="sm">
            <Group justify="flex-end">
              {userData ? (
                <Menu
                  width={260}
                  position="bottom-end"
                  transitionProps={{ transition: 'pop-top-right' }}
                  onClose={() => setUserMenuOpened(false)}
                  onOpen={() => setUserMenuOpened(true)}
                  withinPortal
                  styles={{ dropdown: { zIndex: 1001 } }}
                >
                  <Menu.Target>
                    <UnstyledButton
                      className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
                    >
                      <Group gap={7}>
                        <Avatar src={userData?.image} alt={userData?.name} radius="xl" size={20} />
                        <Text fw={500} size="sm" lh={1} mr={3}>
                          {userData?.name}
                        </Text>
                        <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                      </Group>
                    </UnstyledButton>
                  </Menu.Target>
                </Menu>
              ) : (
                <Link href="/account/login" className={classes.secondaryLink}>Login</Link>
              )}
            </Group>
            <Group gap={0} justify="flex-end" className={classes.mainLinks}>
              {menuItens}
            </Group>
          </Box>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />

        </Group>
      </Container>
    </header>
  )
}