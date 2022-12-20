import swaggerUi from 'swagger-ui-express'
import express, { Response as ExResponse, Request as ExRequest } from 'express'

export default (app: express.Application) => {
  app.use(
    '/docs',
    swaggerUi.serve,
    async (_req: ExRequest, res: ExResponse) => {
      return res.send(
        swaggerUi.generateHTML(await import('../../build/swagger.json'))
      )
    }
  )
}
