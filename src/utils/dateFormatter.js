import dayjs from 'dayjs'

const defaultOptions = {
  format: undefined,
  display: {
    date: 'DD/MM/YYYY',
    time: 'HH:mm',
    datetime: 'DD/MM/YYYY HH:mm'
  }
}

export function displayer(inputDayjs, options) {
  if (!dayjs.isDayjs(inputDayjs)) { return { date: undefined, time: undefined, datetime: undefined } }

  if (!options) options = defaultOptions

  return {
    date: inputDayjs.format(options.display.date),
    time: inputDayjs.format(options.display.time),
    datetime: inputDayjs.format(options.display.datetime)
  }
}

function response(input, raw, options) {
  const { format } = options
  return { input, output: raw.format(format), raw, display: displayer(raw, options) }
}

function isDate(value) {
  try {
    // If you call a Date method, like .valueOf(),
    // with a "this" value that's anything
    // other than a Date, a TypeError is thrown.
    Date.prototype.valueOf.call(value)
    return true
  } catch (error) {
    if (error instanceof TypeError) return false
    throw error
  }
}

export function datter(input, options = defaultOptions) {
  const inputIsDayjs = dayjs.isDayjs(input)
  const inputIsDate = isDate(input)
  const inputIsString = typeof input === 'string'

  if (!options) throw Error('Options is mandatory for datter')

  const mergedOptions = { ...defaultOptions, ...options }
  const { format } = mergedOptions

  if (input === undefined) {
    const raw = dayjs()
    return response(raw.format(), raw, mergedOptions)
  }

  if (inputIsDayjs) {
    const raw = input
    return response(input, raw, mergedOptions)
  }

  if (inputIsDate) {
    const raw = dayjs(input)
    return response(input, raw, mergedOptions)
  }

  if (inputIsString) {
    const raw = dayjs(input, format)
    return response(input, raw, mergedOptions)
  }

  return { input, output: null, raw: null, display: displayer(input, mergedOptions) }
}

export const daysOfWeekString = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]

export const dateToHuman = (date) => {
  const dateObject = new Date(date)
  return new Intl.DateTimeFormat('pt-BR', {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: 'UTC',
  }).format(dateObject)
}

function hoursToMinutes(hoursMinutes) {
  return hoursMinutes.hours * 60 + hoursMinutes.minutes
}

export function minutesToHours(minutes) {
  const hours = Math.floor(minutes / 60)
  const restMinutes = minutes % 60
  return `${hours >= 10 ? hours : `0${hours}`}:${restMinutes >= 10 ? restMinutes : `0${restMinutes}`}`
}

export function parseMinutes(time) {
  const timeArray = time.split(":")
  const timeHour = Number(timeArray[0])
  const timeMinute = Number(timeArray[1])

  return hoursToMinutes({ hours: timeHour, minutes: timeMinute })
}

export function generateHourInterval(startTime, endTime, interval, unavailable) {
  const hourList = []
  if (startTime && endTime && interval) {
    const startTimeMinutes = parseMinutes(startTime)
    const endTimeMinutes = parseMinutes(endTime)
    for (var index = startTimeMinutes; index < endTimeMinutes; index = index + interval) {
      const addHour = minutesToHours(index)
      if (!unavailable.find(item => Number(item) === Number(index)))
        hourList.push(addHour)
    }
  }

  return hourList
}

export function generateHourList(dayOfWeek, interval, unavailable = []) {
  /* TODO: remove unavailable hour interval */
  /* TODO: unavailable list of minutes e.g.: [540, 610, 640, ...] */
  const hourList = []
  if (dayOfWeek && interval) {
    const intervalTime = parseMinutes(interval)
    const startTime = dayOfWeek.start_time
    const endTime = dayOfWeek.end_time
    if (startTime && endTime && intervalTime) {
      hourList.push(...generateHourInterval(startTime, endTime, intervalTime, unavailable))
    }
    [2, 3, 4].map(index => {
      const startTimeIndex = dayOfWeek[`start_time_${index}`]
      const endTimeIndex = dayOfWeek[`end_time_${index}`]
      if (startTimeIndex && endTimeIndex && intervalTime) {
        hourList.push(...generateHourInterval(startTimeIndex, endTimeIndex, intervalTime, unavailable))
      }
    })
  }

  return hourList
}