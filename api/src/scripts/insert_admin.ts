import pg from 'pg'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' })
const hashedPassword = bcrypt.hashSync('admin', 12)

const admin = {
  username: 'admin',
  password: hashedPassword,
  role: 'admin'
}

const pool = new pg.Pool({
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT as string)
})
pool
  .query(
    'INSERT INTO users (username, password, role) VALUES ($1, $2, $3 ) ON CONFLICT (username) DO NOTHING',
    [admin.username, admin.password, admin.role]
  )
  .catch((err) => console.log(err))
