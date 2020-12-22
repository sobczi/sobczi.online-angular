import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { mergeMap, map, catchError } from 'rxjs/operators'
import { EMPTY } from 'rxjs'

import { AccountService } from '@account/services'
import {
  UserUpdateRequest,
  UserUpdateResponse,
  PasswordUpdateRequest,
  PasswordUpdateResponse
} from '@account/store/account.actions'

@Injectable()
export class AccountEffects {
  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserUpdateRequest),
      mergeMap(({ args }) =>
        this.service.updateUser(args).pipe(
          map(response => UserUpdateResponse({ response, args })),
          catchError(() => EMPTY)
        )
      )
    )
  )

  updatePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PasswordUpdateRequest),
      mergeMap(({ password }) =>
        this.service.changePassword(password).pipe(
          map(response => PasswordUpdateResponse({ response })),
          catchError(() => EMPTY)
        )
      )
    )
  )

  constructor (
    private readonly service: AccountService,
    private readonly actions$: Actions
  ) {}
}
