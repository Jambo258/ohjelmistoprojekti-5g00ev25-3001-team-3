export interface User {
  id: number
  username: string
  last_login: Date | null
  created_at: Date
  role: 'normal' | 'admin'
}
