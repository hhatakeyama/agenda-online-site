'use client'

import { Anchor, Container, Group } from '@mantine/core'

import classes from './Footer.module.css'

export default function Footer() {
  // Constants
  const links = [
    { link: '/contact', label: 'Contato' },
    { link: '/privacy-policy', label: 'Política de Privacidade' },
  ]
  const items = links.map((link) => (
    <Anchor
      key={link.label}
      href={link.link}
      onClick={(event) => event.preventDefault()}
      size="sm"
    >
      {link.label}
    </Anchor>
  ))

  return (
    <div className={classes.footer}>
      <Container className={classes.inner} size="lg">
        <Group className={classes.links}>{items}</Group>
      </Container>
    </div>
  )
}