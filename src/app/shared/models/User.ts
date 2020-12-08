import { AccountRoles } from '@shared/models'

export type User = {
  id: string
  email: string
  active: boolean
  inserted: number
  lastLogged: number
  fullName: string
  role: AccountRoles
}
