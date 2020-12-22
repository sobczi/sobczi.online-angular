import { createAction, props } from '@ngrx/store'

import { UpdateUserArgs } from '@shared/models'

// Update user
export const UserUpdateRequest = createAction(
  '[Account Component] User Update Request',
  props<{ args: UpdateUserArgs }>()
)

export const UserUpdateResponse = createAction(
  '[Account Component] User Not Updated',
  props<{ response: boolean; args: UpdateUserArgs }>()
)

// Update password
export const PasswordUpdateRequest = createAction(
  '[Account Component] Password Update Request',
  props<{ password: string }>()
)

export const PasswordUpdateResponse = createAction(
  '[Account Component] Password Updated',
  props<{ response: boolean }>()
)
