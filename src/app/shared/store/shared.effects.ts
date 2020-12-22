import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { EMPTY } from 'rxjs'
import { catchError, map, mergeMap } from 'rxjs/operators'

import { SharedService } from '@shared/services'

import { DeleteUserRequest, DeleteUserResponse } from './shared.actions'

@Injectable()
export class SharedEffects {
  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeleteUserRequest),
      mergeMap(({ userId }) =>
        this.service.deleteUser(userId).pipe(
          map(response => DeleteUserResponse({ response, userId })),
          catchError(() => EMPTY)
        )
      )
    )
  )

  constructor (
    private readonly actions$: Actions,
    private readonly service: SharedService
  ) {}
}
