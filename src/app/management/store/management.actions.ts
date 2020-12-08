import { createAction, props } from '@ngrx/store'

import { AccountRoles, User } from '@shared/models'

export const setUsers = createAction(
  '[Management Component] Set user',
  props<{ users: User[] }>()
)

export const updateUser = createAction(
  '[Management Component] Update user role',
  props<{ user: User }>()
)

export const deleteUser = createAction(
  '[Management Component] Delete user',
  props<{ userId: string }>()
)
