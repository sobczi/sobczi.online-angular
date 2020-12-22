import { Injectable, OnDestroy } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import { AppState } from '@store/types'
import {
  GetUsers,
  SelectUsers,
  UserActiveUpdateRequest,
  UserRoleUpdateRequest
} from '@management/store'
import { AccountRoles, User } from '@shared/models'

@Injectable()
export class ManagementFacade implements OnDestroy {
  readonly users$: Observable<User[]>
  private readonly unsubscribe$ = new Subject<void>()
  constructor (private readonly store: Store<AppState>) {
    this.users$ = this.store
      .select(SelectUsers)
      .pipe(takeUntil(this.unsubscribe$))
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  dispatchGetUsers (): void {
    this.store.dispatch(GetUsers())
  }

  dispatchUpdateUserActive (userId: string, active: boolean): void {
    this.store.dispatch(UserActiveUpdateRequest({ userId, active }))
  }

  dispatchUpdateUserRole (userId: string, role: AccountRoles): void {
    this.store.dispatch(UserRoleUpdateRequest({ userId, role }))
  }
}
