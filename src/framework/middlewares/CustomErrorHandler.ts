import { AxiosError } from 'axios'
import { NextFunction, Request, Response } from 'express'
import {
  Middleware,
  ExpressErrorMiddlewareInterface,
  HttpError
} from 'routing-controllers'
import { URL } from 'url'

import Logger from '../logger'

@Middleware({ type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
  error(
    err: HttpError | AxiosError,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) {
    Logger.error(`${err}\n${err.stack}`)

    let errorResponse
    let httpCode = 500

    if (err instanceof HttpError) {
      const typedError = err as HttpError
      errorResponse = typedError
      httpCode = typedError.httpCode
    } else if ((<AxiosError>err).isAxiosError !== undefined) {
      const typedError = err as AxiosError
      const {
        config: { url },
        stack
      } = typedError

      let parsedUrl = ''
      if (url) parsedUrl = new URL(url).pathname
      errorResponse = { message: 'Invalid request', path: parsedUrl, stack }
    } else errorResponse = err

    if (err.name === 'UnauthorizedError') res.status(401).send('Unauthorized')
    else res.status(httpCode).json({ error: errorResponse })
  }
}
