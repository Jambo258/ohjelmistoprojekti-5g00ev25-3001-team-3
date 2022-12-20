import cors from 'cors'
import express from 'express'

export default (app: express.Application) => {
  app.use(cors())
}
