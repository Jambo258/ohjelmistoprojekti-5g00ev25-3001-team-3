import { createContext } from 'react'

interface Auth {
  userId: string | null
  token: string | null
  isLoggedIn: boolean
  login(token: string | null, uid: string | null, role: string): void
  logout(): void
}

export const AuthContext = createContext<Auth | null | any>(null)
