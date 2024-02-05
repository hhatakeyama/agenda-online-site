import { TextInput } from '@mantine/core'

export const EmailField = ({ inputProps }) => (
  <TextInput {...inputProps} label="E-mail" placeholder="E-mail" type="email" />
)

export const PasswordField = ({ inputProps }) => (
  <TextInput {...inputProps} label="Senha" placeholder="Senha" type="password" />
)
