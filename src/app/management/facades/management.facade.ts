import { Injectable, OnDestroy } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable, Subject } from 'rxjs'
import { takeUntil, tap } from 'rxjs/operators'

import { AppState } from '@store/types'
import { ManagementService } from '@management/services'
import {
  deleteUser,
  selectUsers,
  setUsers,
  updateUser
} from '@management/store'
import { AccountRoles, User } from '@shared/models'

@Injectable()
export class ManagementFacade implements OnDestroy {
  private readonly unsubscribe$ = new Subject<void>()
  constructor (
    private readonly store: Store<AppState>,
    private readonly service: ManagementService
  ) {}

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  users (): Observable<User[]> {
    return this.store.select(selectUsers).pipe(takeUntil(this.unsubscribe$))
  }

  fetchUsers (): Observable<User[]> {
    return this.service.fetchUsers().pipe(
      takeUntil(this.unsubscribe$),
      tap(users => this.dispatchUsers(users))
    )
  }

  updateUserRole (user: User, role: AccountRoles): Observable<boolean> {
    return this.service.updateUserRole(user.id, role).pipe(
      takeUntil(this.unsubscribe$),
      tap(() => this.dispatchUpdateUser({ ...user, role }))
    )
  }

  updateUserActive (user: User, active: boolean): Observable<boolean> {
    return this.service.updateUserActive(user.id, active).pipe(
      takeUntil(this.unsubscribe$),
      tap(() => this.dispatchUpdateUser({ ...user, active }))
    )
  }

  dispatchDeleteUser (userId: string): void {
    this.store.dispatch(deleteUser({ userId }))
  }

  private dispatchUsers (users: User[]): void {
    this.store.dispatch(setUsers({ users }))
  }

  private dispatchUpdateUser (user: User): void {
    this.store.dispatch(updateUser({ user }))
  }
}
