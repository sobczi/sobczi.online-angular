import { createAction, props } from '@ngrx/store'

export const DeleteUserRequest = createAction(
  '[Shared Component] Delete User Request',
  props<{ userId: string }>()
)

export const DeleteUserResponse = createAction(
  '[Shared Component] Delete User Response',
  props<{ response: boolean; userId: string }>()
)
