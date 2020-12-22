import { User } from '@shared/models'

export type AuthStore = {
  user: User
  token: string
}

export const AuthStoreKey = 'AuthStoreKey'
