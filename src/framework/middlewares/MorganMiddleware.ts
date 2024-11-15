import morgan from 'morgan'
import expressRequestId from 'express-request-id'

import Logger from '../logger'
import { Request, Express } from 'express'

interface CustomRequest extends Request {
  id?: string
}

const stream = {
  write: (message) => Logger.http(message)
}

morgan.token('id', (req: CustomRequest) => req.id?.split('-')[0] ?? '')

const morganBefore = morgan('[#:id] Started :method :url for :remote-addr', {
  immediate: true,
  stream
})

const morganAfter = morgan(
  '[#:id] Completed :status Length :res[content-length] in :response-time ms',
  { stream }
)

const initHttpLogger = (app: Express) => {
  app.use(expressRequestId())
  app.use(morganBefore)
  app.use(morganAfter)
}

export { initHttpLogger }
