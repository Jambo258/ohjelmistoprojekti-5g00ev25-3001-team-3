import {
  Response as ExResponse,
  Request as ExRequest,
  NextFunction,
  Application as ExApplication
} from 'express'
import { ValidateError } from 'tsoa'

import { ApiError } from '../utils/apiError'

export default (app: ExApplication) =>
  app.use(
    (
      err: unknown,
      req: ExRequest,
      res: ExResponse,
      next: NextFunction
    ): ExResponse | void => {
      if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
          name: err.name,
          message: err.message
        })
      }
      if (err instanceof ValidateError) {
        console.warn(`Caught Validation Error for ${req.path}:`, err.fields)
        return res.status(422).json({
          message: 'Validation Failed',
          details: err?.fields
        })
      }
      if (err instanceof Error) {
        return res.status(500).json({
          message: 'Internal Server Error'
        })
      }
      next()
    }
  )
