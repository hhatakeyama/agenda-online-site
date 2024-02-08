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

export const dateToHuman = (date, type = 'datetime') => {
  const dateObject = new Date(date)
  let format = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: 'UTC',
  }
  if (type === 'date') {
    format = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }
  }
  return new Intl.DateTimeFormat('pt-BR', format).format(dateObject)
}

const isToday = (date) => {
  const today = new Date()
  if (
    date.getYear() === today.getYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDay() === today.getDay()
  )
    return true
  return false
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

export function generateUnavailableHourInterval(startTime, endTime, interval) {
  const hourList = []
  if (startTime && endTime && interval) {
    const startTimeMinutes = parseMinutes(startTime)
    const endTimeMinutes = parseMinutes(endTime)
    for (var index = startTimeMinutes; index < endTimeMinutes; index = index + interval) {
      // const addHour = minutesToHours(index)
      hourList.push(index)
    }
  }

  return hourList
}

export function generateHourInterval(date, startTime, endTime, interval, unavailable) {
  // Check today min hour to display
  const today = new Date()
  const timeNow = hoursToMinutes({ hours: today.getHours(), minutes: today.getMinutes() }) + 60
  const minTime = isToday(date) ? timeNow : 0

  const hourList = []
  if (startTime && endTime && interval) {
    const startTimeMinutes = parseMinutes(startTime)
    const endTimeMinutes = parseMinutes(endTime)
    for (var index = startTimeMinutes; index < endTimeMinutes; index = index + interval) {
      const addHour = minutesToHours(index)
      // TODO: check if hour is not equal start_time and smaller than start_time + duration 
      if (!unavailable.find(item => Number(item) === Number(index)) && index > minTime)
        hourList.push(addHour)
    }
  }

  return hourList
}

export function generateHourList(date, dayOfWeek, interval, unavailable = []) {
  /* TODO: remove unavailable hour interval */
  const hourList = []
  if (dayOfWeek && interval) {
    const intervalTime = parseMinutes(interval)
    const startTime = dayOfWeek.start_time
    const endTime = dayOfWeek.end_time
    if (startTime && endTime && intervalTime) {
      hourList.push(...generateHourInterval(date, startTime, endTime, intervalTime, unavailable))
    }
    [2, 3, 4].map(index => {
      const startTimeIndex = dayOfWeek[`start_time_${index}`]
      const endTimeIndex = dayOfWeek[`end_time_${index}`]
      if (startTimeIndex && endTimeIndex && intervalTime) {
        hourList.push(...generateHourInterval(date, startTimeIndex, endTimeIndex, intervalTime, unavailable))
      }
    })
  }

  return hourList
}

export function verifyAvailableHour(hourList, dayOfWeek, totalDuration, hour) {
  const hourInMinutes = hour ? parseMinutes(hour) : 0
  if (hourList.length > 0) {
    const endTime = dayOfWeek?.end_time ? parseMinutes(dayOfWeek.end_time) - totalDuration : 0
    const startTime2 = dayOfWeek?.start_time_2 ? parseMinutes(dayOfWeek.start_time_2) : 0
    const endTime2 = dayOfWeek?.end_time_2 ? parseMinutes(dayOfWeek.end_time_2) - totalDuration : 0
    const startTime3 = dayOfWeek?.start_time_3 ? parseMinutes(dayOfWeek.start_time_3) : 0
    const endTime3 = dayOfWeek?.end_time_3 ? parseMinutes(dayOfWeek.end_time_3) - totalDuration : 0
    const startTime4 = dayOfWeek?.start_time_4 ? parseMinutes(dayOfWeek.start_time_4) : 0
    const endTime4 = dayOfWeek?.end_time_4 ? parseMinutes(dayOfWeek.end_time_4) - totalDuration : 0

    if (endTime4) {
      return (hourInMinutes < endTime) ||
        (
          !endTime2 || (
            endTime2 > 0 &&
            hourInMinutes >= startTime2 &&
            hourInMinutes < endTime2
          )
        ) ||
        (
          !endTime3 || (
            endTime3 > 0 &&
            hourInMinutes >= startTime3 &&
            hourInMinutes < endTime3
          )
        ) ||
        (
          !endTime4 || (
            endTime4 > 0 &&
            hourInMinutes >= startTime4 &&
            hourInMinutes < endTime4
          )
        )
    }
    if (endTime3) {
      return (hourInMinutes < endTime) ||
        (
          !endTime2 || (
            endTime2 > 0 &&
            hourInMinutes >= startTime2 &&
            hourInMinutes < endTime2
          )
        ) ||
        (
          !endTime3 || (
            endTime3 > 0 &&
            hourInMinutes >= startTime3 &&
            hourInMinutes < endTime3
          )
        )
    }
    if (endTime2) {
      return (hourInMinutes <= endTime) ||
        (
          !endTime2 || (
            endTime2 > 0 &&
            hourInMinutes >= startTime2 &&
            hourInMinutes <= endTime2
          )
        )
    }
    return hourInMinutes <= endTime
  }
  return false
}