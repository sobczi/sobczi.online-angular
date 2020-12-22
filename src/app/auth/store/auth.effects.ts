import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { map, mergeMap } from 'rxjs/operators'

import { AuthService } from '@auth/services'
import {
  LogoutRequest,
  RefreshTokenRequest,
  RefreshTokenResponseSuccess
} from './auth.actions'

@Injectable()
export class AuthEffects {
  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RefreshTokenRequest),
      mergeMap(({ userId }) =>
        this.service
          .refreshToken(userId)
          .pipe(
            map(response =>
              typeof response === 'string'
                ? RefreshTokenResponseSuccess({ token: response })
                : LogoutRequest()
            )
          )
      )
    )
  )

  constructor (
    private readonly actions$: Actions,
    private readonly service: AuthService
  ) {}
}
