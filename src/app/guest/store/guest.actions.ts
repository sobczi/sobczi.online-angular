import { createAction, props } from '@ngrx/store'

import { LoginResponseArgs } from '@guest/models'

export const SendResetPaswordRequest = createAction(
  '[Guest Component] Send Reset Password Request',
  props<{ email: string }>()
)

export const SendResetPasswordResponse = createAction(
  '[Guest Component] Reset Password Response'
)

export const LoginRequest = createAction(
  '[Guest Component] Login Request',
  props<{ email: string; password: string }>()
)

export const LoginResponseSuccess = createAction(
  '[Guest Component] Login Response Success',
  props<LoginResponseArgs>()
)

export const LoginResponseFail = createAction(
  '[Guest Component] Login Response Fail'
)

export const RegisterUserRequest = createAction(
  '[Guest Component] Register User Request',
  props<{ email: string; fullName: string }>()
)

export const RegisterUserResponse = createAction(
  '[Guest Component] Register User Response'
)

export const ResetPasswordRequest = createAction(
  '[Guest Component] Reset Password Request',
  props<{ resetKey: string; newPassword: string }>()
)

export const ResetPasswordResponseSuccess = createAction(
  '[Guest Component] Reset Password Response Success'
)

export const ResetPasswordResponseFail = createAction(
  '[Guest Component] Reset Password Response Fail'
)
