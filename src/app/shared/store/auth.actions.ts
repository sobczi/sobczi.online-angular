import { createAction, props } from '@ngrx/store'

import { UpdateUserArgs, UserAuth } from '@shared/models'

export const userLogin = createAction(
  '[Auth Component] User login',
  props<{ auth: UserAuth }>()
)

export const userLogout = createAction('[Auth Component] User logout')

export const userUpdate = createAction(
  '[Auth Component] User update',
  props<{ args: UpdateUserArgs }>()
)
