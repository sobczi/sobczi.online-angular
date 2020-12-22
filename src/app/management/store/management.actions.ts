import { createAction, props } from '@ngrx/store'

import { AccountRoles, User } from '@shared/models'

// Get users
export const GetUsers = createAction('[Management Component] Get Users')

export const SetUsers = createAction(
  '[Management Component] Set user',
  props<{ users: User[] }>()
)

// Update user active
export const UserActiveUpdateRequest = createAction(
  '[Management Component] Update User Active',
  props<{ userId: string; active: boolean }>()
)

export const UserActiveUpdateResponse = createAction(
  '[Management Component] User Active Updated',
  props<{ response: boolean }>()
)

// Update user role
export const UserRoleUpdateRequest = createAction(
  '[Managemenet Component] Update User Role',
  props<{ userId: string; role: AccountRoles }>()
)

export const UserRoleUpdateResponse = createAction(
  '[Managemenet Component] User Role Updated',
  props<{ response: boolean }>()
)
