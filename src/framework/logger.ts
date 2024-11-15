import winston from 'winston'
import 'winston-daily-rotate-file'

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
}

const level = () => {
  const env = process.env.NODE_ENV || 'development'
  const isDevelopment = env === 'development'
  return isDevelopment ? 'debug' : 'warn'
}

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
}

winston.addColors(colors)

const format = ({ colorize = false }: { colorize?: boolean } = {}) => {
  const formats = [
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ]

  if (colorize) formats.push(winston.format.colorize({ all: true }))

  return winston.format.combine(...formats)
}

const transports = [
  new winston.transports.Console({
    format: format({ colorize: true })
  }),
  new winston.transports.DailyRotateFile({
    datePattern: 'YYYY-MM-DD',
    filename: 'logs/error-%DATE%.log',
    level: 'error',
    format: format(),
    zippedArchive: true,
    maxSize: '30m',
    maxFiles: '14d'
  }),
  new winston.transports.DailyRotateFile({
    datePattern: 'YYYY-MM-DD',
    filename: 'logs/all-%DATE%.log',
    format: format(),
    zippedArchive: true,
    maxSize: '50m',
    maxFiles: '14d'
  })
]

const Logger = winston.createLogger({
  level: level(),
  levels,
  transports
})

export default Logger
