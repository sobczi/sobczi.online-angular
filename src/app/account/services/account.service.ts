import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import { environment } from '@env/environment'
import { UpdateUserArgs } from '@shared/models'

@Injectable()
export class AccountService {
  constructor (private readonly http: HttpClient) {}

  updateUser (args: UpdateUserArgs): Observable<boolean> {
    const { userId, email, fullName } = args
    return this.http
      .patch<{ result: boolean }>(environment.updateUser(userId), {
        email,
        fullName
      })
      .pipe(
        map(response => response.result),
        catchError(() => of(false))
      )
  }

  changePassword (userId: string, password: string): Observable<boolean> {
    return this.http
      .patch<{ result: boolean }>(environment.changePassword(userId), {
        password
      })
      .pipe(
        map(response => response.result),
        catchError(() => of(false))
      )
  }
}
