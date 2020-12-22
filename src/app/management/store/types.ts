import { User } from '@shared/models'

export type ManagementStore = {
  users: User[]
}

export const ManagementStoreKey = 'ManagementStoreKey'
