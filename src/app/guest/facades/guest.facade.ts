import { Injectable, OnDestroy } from '@angular/core'
import { catchError, tap, takeUntil } from 'rxjs/operators'
import { Observable, of, Subject } from 'rxjs'

import { GuestService } from '@guest/services'
import { User } from '@shared/models'
import { AuthFacade } from '@shared/facades'

@Injectable()
export class GuestFacade implements OnDestroy {
  private readonly unsubscribe$ = new Subject<void>()
  constructor (
    private readonly service: GuestService,
    private readonly authFacade: AuthFacade
  ) {}

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  resetPassword (resetKey: string, newPassword: string): Observable<boolean> {
    return this.service
      .resetPassword(resetKey, newPassword)
      .pipe(takeUntil(this.unsubscribe$))
  }

  sendResetPassword (email: string): Observable<void> {
    return this.service
      .sendResetPassword(email)
      .pipe(takeUntil(this.unsubscribe$))
  }

  login (
    email: string,
    password: string
  ): Observable<{ token: string; user: User } | void> {
    return this.service.login(email, password).pipe(
      takeUntil(this.unsubscribe$),
      tap(response =>
        typeof response === 'object'
          ? this.authFacade.dispatchUserLogin(response)
          : undefined
      ),
      catchError(() => of(void 0))
    )
  }

  createUser (email: string, fullName: string): Observable<boolean> {
    return this.service
      .createUser(email, fullName)
      .pipe(takeUntil(this.unsubscribe$))
  }
}
