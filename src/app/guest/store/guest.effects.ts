import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, mergeMap } from 'rxjs/operators'
import { EMPTY } from 'rxjs'

import { GuestService } from '@guest/services'
import {
  LoginRequest,
  LoginResponseFail,
  LoginResponseSuccess,
  RegisterUserRequest,
  RegisterUserResponse,
  ResetPasswordRequest,
  ResetPasswordResponseFail,
  ResetPasswordResponseSuccess,
  SendResetPasswordResponse,
  SendResetPaswordRequest
} from './guest.actions'

@Injectable()
export class GuestEffects {
  sendResetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SendResetPaswordRequest),
      mergeMap(({ email }) =>
        this.service.sendResetPassword(email).pipe(
          map(() => SendResetPasswordResponse()),
          catchError(() => EMPTY)
        )
      )
    )
  )

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoginRequest),
      mergeMap(({ email, password }) =>
        this.service.login(email, password).pipe(
          map(r =>
            typeof r === 'object'
              ? LoginResponseSuccess({ user: r.user, token: r.token })
              : LoginResponseFail()
          ),
          catchError(() => EMPTY)
        )
      )
    )
  )

  registerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegisterUserRequest),
      mergeMap(({ email, fullName }) =>
        this.service.registerUser(email, fullName).pipe(
          map(() => RegisterUserResponse()),
          catchError(() => EMPTY)
        )
      )
    )
  )

  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResetPasswordRequest),
      mergeMap(({ resetKey, newPassword }) =>
        this.service.resetPassword(resetKey, newPassword).pipe(
          map(response =>
            response
              ? ResetPasswordResponseSuccess()
              : ResetPasswordResponseFail()
          ),
          catchError(() => EMPTY)
        )
      )
    )
  )

  constructor (
    private readonly actions$: Actions,
    private readonly service: GuestService
  ) {}
}
