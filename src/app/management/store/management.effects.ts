import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, mergeMap } from 'rxjs/operators'
import { EMPTY } from 'rxjs'

import { ManagementService } from '@management/services'
import {
  GetUsers,
  SetUsers,
  UserActiveUpdateRequest,
  UserActiveUpdateResponse,
  UserRoleUpdateRequest,
  UserRoleUpdateResponse
} from './management.actions'

@Injectable()
export class ManagementEffects {
  getUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GetUsers),
      mergeMap(() =>
        this.service.fetchUsers().pipe(
          map(users => SetUsers({ users })),
          catchError(() => EMPTY)
        )
      )
    )
  )

  updateUserActive$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActiveUpdateRequest),
      mergeMap(({ userId, active }) =>
        this.service.updateUserActive(userId, active).pipe(
          map(response => UserActiveUpdateResponse({ response })),
          catchError(() => EMPTY)
        )
      )
    )
  )

  updateUserRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserRoleUpdateRequest),
      mergeMap(({ userId, role }) =>
        this.service.updateUserRole(userId, role).pipe(
          map(response => UserRoleUpdateResponse({ response })),
          catchError(() => EMPTY)
        )
      )
    )
  )

  constructor (
    private readonly actions$: Actions,
    private readonly service: ManagementService
  ) {}
}
