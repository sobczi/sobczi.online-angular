import { Injectable, OnDestroy } from '@angular/core'
import { takeUntil } from 'rxjs/operators'
import { Observable, Subject } from 'rxjs'

import { SharedService } from '@shared/services'

Injectable()
export class SharedFacade implements OnDestroy {
  private readonly unsubscribe$ = new Subject<void>()
  constructor (private readonly service: SharedService) {}

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  checkEmailOccupation (email: string, userId?: string): Observable<boolean> {
    return this.service
      .checkEmailOccupation(email, userId)
      .pipe(takeUntil(this.unsubscribe$))
  }

  deleteUser (userId: string): Observable<boolean> {
    return this.service.deleteUser(userId).pipe(takeUntil(this.unsubscribe$))
  }
}
