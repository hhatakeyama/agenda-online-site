export const normalize = (str) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

export function cleanNumber(number) {
  return number.replace(/[^\d]/g, '')
}

export function capitalize(value) {
  const [firstLetter = '', ...rest] = `${value}`.trim()
  return typeof value === 'string'
    ? firstLetter.toUpperCase() + rest.join('').toLowerCase()
    : undefined
}

export function bytesToSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export const stringCompare = (sentence, searchTerm) =>
  typeof sentence === 'string' &&
  typeof searchTerm === 'string' &&
  normalize(sentence).includes(normalize(searchTerm))