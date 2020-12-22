import { Injectable, OnDestroy } from '@angular/core'
import { Store } from '@ngrx/store'
import { takeUntil } from 'rxjs/operators'
import { Observable, Subject } from 'rxjs'

import { AppState } from '@store/types'
import { SharedService } from '@shared/services'
import { DeleteUserRequest } from '@shared/store'

@Injectable()
export class SharedFacade implements OnDestroy {
  private readonly unsubscribe$ = new Subject<void>()
  constructor (
    private readonly service: SharedService,
    private readonly store: Store<AppState>
  ) {}

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  checkEmailOccupation (email: string, userId?: string): Observable<boolean> {
    return this.service
      .checkEmailOccupation(email, userId)
      .pipe(takeUntil(this.unsubscribe$))
  }

  dispatchDeleteUserRequest (userId: string): void {
    this.store.dispatch(DeleteUserRequest({ userId }))
  }
}
