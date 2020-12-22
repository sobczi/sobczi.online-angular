import { Injectable, OnDestroy } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { select, Store } from '@ngrx/store'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { filter, take, takeUntil } from 'rxjs/operators'
import { interval, Observable, Subject } from 'rxjs'
import { Actions, ofType } from '@ngrx/effects'

import { AppState } from '@store/types'
import { User } from '@shared/models'
import {
  selectToken,
  selectUser,
  LogoutRequest,
  LoadSessionRequest,
  RefreshTokenRequest,
  RefreshTokenResponseSuccess
} from '@auth/store'
import { DialogService } from '@shared/services'
import { LoginResponseSuccess } from '@guest/store'
import { LoginResponseArgs } from '@guest/models'
import { LoadSessionArgs } from '@auth/models'

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
    private readonly store: Store<AppState>,
    private readonly dialogService: DialogService,
    private readonly dialogRef: MatDialog,
    private readonly translateService: TranslateService,
    private readonly router: Router,
    private readonly actions$: Actions
  ) {
    this.loadSession()

    this.user$ = this.store.pipe(
      select(selectUser),
      takeUntil(this.unsubscribe$)
    )

    this.token$ = this.store.pipe(
      select(selectToken),
      takeUntil(this.unsubscribe$)
    )

    this.user$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => (this._user = user))

    this.token$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(token => (this._token = token))

    this.actions$
      .pipe(ofType(LoginResponseSuccess), takeUntil(this.unsubscribe$))
      .subscribe(this.handleLoginResponseSuccess.bind(this))

    this.actions$
      .pipe(ofType(LogoutRequest), takeUntil(this.unsubscribe$))
      .subscribe(this.handleLogoutRequest.bind(this))

    this.actions$
      .pipe(ofType(LoadSessionRequest), takeUntil(this.unsubscribe$))
      .subscribe(this.handleLoadSessionRequest.bind(this))

    this.actions$
      .pipe(ofType(RefreshTokenResponseSuccess), takeUntil(this.unsubscribe$))
      .subscribe(this.handleRefreshTokenResponseSuccess.bind(this))
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  dispatchLogoutRequest (): void {
    this.store.dispatch(LogoutRequest())
  }

  private dispatchLoadSessionRequest (
    user: User,
    token: string,
    expiration: number
  ): void {
    this.store.dispatch(LoadSessionRequest({ user, token, expiration }))
  }

  private dispatchRefreshTokenRequest (): void {
    this.store.dispatch(RefreshTokenRequest({ userId: this.user.id }))
  }

  private handleLoginResponseSuccess (response: LoginResponseArgs): void {
    const { user, token } = response
    sessionStorage.setItem(USER, JSON.stringify(user))
    sessionStorage.setItem(TOKEN, token)
    this.updateExpirationTime()
    this.handleSession()
  }

  private handleLoadSessionRequest (response: LoadSessionArgs): void {
    const { user, token, expiration } = response
    sessionStorage.setItem(USER, JSON.stringify(user))
    sessionStorage.setItem(TOKEN, token)
    this.expiration = expiration
    this.handleSession()
  }

  private handleLogoutRequest (): void {
    const userString = sessionStorage.getItem(USER)
    if (!userString) {
      return
    }
    const { fullName } = JSON.parse(userString)
    this.dialogRef.closeAll()
    this.dialogService.showLogoutDialog(fullName)
    sessionStorage.clear()
    this.router.navigate(['/guest/login'])
  }

  private handleRefreshTokenResponseSuccess (token: string): void {
    sessionStorage.setItem(TOKEN, token)
    this.updateExpirationTime()
    this.handleSession()
  }

  private loadSession (): void {
    const userString = sessionStorage.getItem(USER)
    const token = sessionStorage.getItem(TOKEN)
    const expiration = Number(sessionStorage.getItem(EXPIRATION_DATESTAMP))
    if (userString && token) {
      this.dispatchLoadSessionRequest(JSON.parse(userString), token, expiration)
    } else {
      sessionStorage.clear()
    }
  }

  private handleSession (): void {
    const reactionTime = 15 * 1000
    const showModalIn = this.expiration - new Date().getTime() - reactionTime
    if (showModalIn < 0) {
      return this.dispatchLogoutRequest()
    }

    interval(showModalIn)
      .pipe(
        take(1),
        filter(() => !!this.user)
      )
      .subscribe(() => {
        const forceLogout = interval(reactionTime)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(() => this.dispatchLogoutRequest())

        this.dialogService
          .openConfirmDialog(
            this.translateService.instant('sessionComponent.sessionEnds'),
            this.translateService.instant('sessionComponent.wantToRefresh')
          )
          .afterClosed()
          .pipe(take(1))
          .subscribe((response: { accepted: boolean }) => {
            forceLogout.unsubscribe()
            if (!response || !response?.accepted) {
              return !!this.user ? this.dispatchLogoutRequest() : undefined
            }

            this.dispatchRefreshTokenRequest()
          })
      })
  }

  private updateExpirationTime (): void {
    const expireAt = new Date().getTime() + SESSION_VALIDITY_TIME
    sessionStorage.setItem(EXPIRATION_DATESTAMP, `${expireAt}`)
    this.expiration = expireAt
  }
}
