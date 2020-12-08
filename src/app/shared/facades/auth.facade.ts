import { Injectable, OnDestroy } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { select, Store } from '@ngrx/store'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { filter, take, takeUntil, tap } from 'rxjs/operators'
import { interval, Observable, Subject } from 'rxjs'

import { AppState } from '@store/types'
import { User, UserAuth, UpdateUserArgs } from '@shared/models'
import {
  selectToken,
  selectUser,
  userLogin,
  userLogout,
  userUpdate
} from '@shared/store'
import { AuthService, DialogService } from '@shared/services'

const USER = 'User'
const TOKEN = 'Token'
const EXPIRATION_DATESTAMP = 'Expiration_datestamp'
const SESSION_VALIDITY_TIME = 600 * 1000

@Injectable()
export class AuthFacade implements OnDestroy {
  readonly user$: Observable<User>
  readonly token$: Observable<string>

  private _user: User
  private _token: string
  private expiration: number
  private readonly unsubscribe$ = new Subject<void>()

  get user (): User {
    return this._user
  }

  get token (): string {
    return this._token
  }

  constructor (
    private readonly service: AuthService,
    private readonly store: Store<AppState>,
    private readonly dialogService: DialogService,
    private readonly dialogRef: MatDialog,
    private readonly translateService: TranslateService,
    private readonly router: Router
  ) {
    this.extractDataFromSessionStorage()

    this.user$ = this.store.pipe(
      select(selectUser),
      takeUntil(this.unsubscribe$)
    )
    this.token$ = this.store.pipe(
      select(selectToken),
      takeUntil(this.unsubscribe$)
    )

    this.user$.subscribe(user => (this._user = user))
    this.user$
      .pipe(filter(response => !response))
      .subscribe(this.logout.bind(this))

    this.token$.subscribe(token => (this._token = token))
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  dispatchUserLogout (): void {
    this.store.dispatch(userLogout())
  }

  dispatchUserLogin (auth: UserAuth, keepExpiration?: boolean): void {
    sessionStorage.setItem(USER, JSON.stringify(auth.user))
    sessionStorage.setItem(TOKEN, auth.token)
    if (!keepExpiration) {
      this.updateExpirationTime()
    }
    this.store.dispatch(userLogin({ auth }))
    this.handleUserSession()
  }

  dispatchUserUpdate (args: UpdateUserArgs): void {
    this.store.dispatch(userUpdate({ args }))
  }

  private logout (): void {
    const userString = sessionStorage.getItem(USER)
    if (!userString) {
      return
    }
    const user = JSON.parse(userString)
    this.dialogRef.closeAll()
    this.dialogService.showLogoutDialog(user.fullName)
    sessionStorage.clear()
    this.router.navigate(['/login'])
  }

  private refreshToken (): Observable<string | void> {
    return this.service.refreshToken(this.user.id).pipe(
      takeUntil(this.unsubscribe$),
      tap(response =>
        typeof response !== 'string' ? this.dispatchUserLogout() : undefined
      ),
      filter(response => typeof response === 'string'),
      tap((response: string) => {
        sessionStorage.setItem(TOKEN, response)
        this.updateExpirationTime()
        this.handleUserSession()
      })
    )
  }

  private extractDataFromSessionStorage (): void {
    const userString = sessionStorage.getItem(USER)
    const token = sessionStorage.getItem(TOKEN)
    this.expiration = Number(sessionStorage.getItem(EXPIRATION_DATESTAMP))
    if (userString && token) {
      this.dispatchUserLogin({ user: JSON.parse(userString), token }, true)
    } else {
      sessionStorage.clear()
    }
  }

  private handleUserSession (): void {
    const translate = this.translateService.instant.bind(this.translateService)
    const reactionTime = 15 * 1000
    const showModalIn = this.expiration - new Date().getTime() - reactionTime
    if (showModalIn < 0) {
      return this.dispatchUserLogout()
    }

    interval(showModalIn)
      .pipe(
        take(1),
        filter(() => !!this.user)
      )
      .subscribe(() => {
        const forceLogout = interval(reactionTime)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(() => this.dispatchUserLogout())

        this.dialogService
          .openConfirmDialog(
            translate('sessionComponent.sessionEnds'),
            translate('sessionComponent.wantToRefresh')
          )
          .afterClosed()
          .pipe(take(1), takeUntil(this.unsubscribe$))
          .subscribe((response: { accepted: boolean }) => {
            forceLogout.unsubscribe()
            if (!response || !response?.accepted) {
              return !!this.user ? this.dispatchUserLogout() : undefined
            }

            this.refreshToken()
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe()
          })
      })
  }

  private updateExpirationTime (): void {
    const expireAt = new Date().getTime() + SESSION_VALIDITY_TIME
    sessionStorage.setItem(EXPIRATION_DATESTAMP, `${expireAt}`)
    this.expiration = expireAt
  }
}
