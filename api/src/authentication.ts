import * as express from 'express'
import * as jwt from 'jsonwebtoken'

export interface jwtObj extends jwt.JwtPayload {
  role: 'admin' | 'user'
  id: number
  username: string
}

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes: string[]
) {
  switch (securityName) {
    case 'jwt': {
      const token = request.headers.authorization?.split(' ')[1]

      return new Promise((resolve, reject) => {
        if (!token) {
          return reject(new Error('No token provided'))
        }
        jwt.verify(
          token,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          process.env.JWT_SECRET!,
          (err: unknown, decoded) => {
            if (err) {
              return reject(err)
            }
            if (
              decoded &&
              typeof decoded !== 'string' &&
              !scopes.includes(decoded.role)
            ) {
              return reject('Not enough priviledges for this request')
            }
            return resolve(decoded as jwtObj)
          }
        )
      })
    }
    default:
      return new Promise((_, reject) => reject('Wrong auth scheme'))
  }
}
