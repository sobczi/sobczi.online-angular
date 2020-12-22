import { createAction, props } from '@ngrx/store'

import { LoadSessionArgs } from '@auth/models'

export const LoadSessionRequest = createAction(
  '[Auth Component] Load Session Request',
  props<LoadSessionArgs>()
)

export const LogoutRequest = createAction('[Auth Component] Logout Request')

export const RefreshTokenRequest = createAction(
  '[Auth Component] Refresh Token Request',
  props<{ userId: string }>()
)

export const RefreshTokenResponseSuccess = createAction(
  '[Auth Component] Refresh Token Response Success',
  props<{ token: string }>()
)
