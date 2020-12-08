import { Injectable, OnDestroy } from '@angular/core'
import { takeUntil, tap } from 'rxjs/operators'
import { Observable, Subject } from 'rxjs'

import { AccountService } from '@account/services'
import { AuthFacade } from '@shared/facades'
import { UpdateUserArgs } from '@shared/models'

@Injectable()
export class AccountFacade implements OnDestroy {
  private readonly unsubscribe$ = new Subject<void>()
  constructor (
    private readonly service: AccountService,
    private readonly authFacade: AuthFacade
  ) {}

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  updateUser (args: UpdateUserArgs): Observable<boolean> {
    return this.service.updateUser(args).pipe(
      takeUntil(this.unsubscribe$),
      tap(response =>
        response ? this.authFacade.dispatchUserUpdate(args) : undefined
      )
    )
  }

  changePassword (userId: string, password: string): Observable<boolean> {
    return this.service
      .changePassword(userId, password)
      .pipe(takeUntil(this.unsubscribe$))
  }
}
