import bodyParser from 'body-parser'
import express from 'express'

export default (app: express.Application) => {
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  )
  app.use(bodyParser.json())
}
