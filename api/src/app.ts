import express from 'express'
import pg from 'pg'
import { config } from 'dotenv'
import amqp from 'amqp-connection-manager'

import { RegisterRoutes } from '../build/routes'
import ServiceFactory from './utils/serviceFactory'
import expressErrorHandler from './config/expressErrorHandler'
import cors from './config/cors'
import bodyparser from './config/bodyparser'
import docs from './config/docs'
import ScraperClient from './utils/scraperClient'

config()

const app = express()

if (
  !process.env.JWT_SECRET ||
  !process.env.PG_USER ||
  !process.env.PG_PASSWORD ||
  !process.env.PG_HOST ||
  !process.env.PG_PORT ||
  !process.env.PG_DATABASE ||
  !process.env.RABBITMQ_HOST
) {
  console.error('missing env variables, exiting process...')
  process.exit(1)
}

export const pool = new pg.Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT),
  database: process.env.PG_DATABASE
})

export const serviceFactory = new ServiceFactory(pool)

const amqpConn = amqp.connect('amqp://' + process.env.RABBITMQ_HOST)

amqpConn.on('connectFailed', (e) => console.log('failed to connect: ' + e))

amqpConn.on('connect', () => console.log('connected to the rabbitmq broker'))

export const scraperClient = new ScraperClient(amqpConn)

bodyparser(app)

cors(app)

if (process.env.NODE_ENV !== 'production') {
  docs(app)
}

RegisterRoutes(app)

expressErrorHandler(app)

export default app
