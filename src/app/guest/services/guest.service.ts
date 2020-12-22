import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import { environment } from '@env/environment'
import { User } from '@shared/models'

@Injectable()
export class GuestService {
  constructor (private readonly http: HttpClient) {}

  resetPassword (resetKey: string, newPassword: string): Observable<boolean> {
    return this.http
      .patch<{ result: boolean }>(environment.resetPassword(resetKey), {
        newPassword
      })
      .pipe(
        map(response => response.result),
        catchError(() => of(false))
      )
  }

  sendResetPassword (email: string): Observable<void> {
    return this.http.patch<{}>(environment.sendResetPassword, { email }).pipe(
      map(() => of(void 0)),
      catchError(() => of(void 0))
    )
  }

  login (
    email: string,
    password: string
  ): Observable<{ token: string; user: User } | void> {
    return this.http
      .post<{ token: string; user: User }>(environment.login, {
        email,
        password
      })
      .pipe(
        map(response => response),
        catchError(() => of(void 0))
      )
  }

  registerUser (email: string, fullName: string): Observable<boolean> {
    return this.http
      .post<{ created: boolean }>(environment.registerUser, {
        email,
        fullName
      })
      .pipe(
        map(response => response.created),
        catchError(() => of(false))
      )
  }
}
