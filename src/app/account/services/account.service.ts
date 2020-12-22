import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import { environment } from '@env/environment'
import { UpdateUserArgs } from '@shared/models'
import { AuthFacade } from '@auth/facades'

@Injectable()
export class AccountService {
  private get userId (): string {
    return this.authFacade.user.id
  }

  constructor (
    private readonly http: HttpClient,
    private readonly authFacade: AuthFacade
  ) {}

  updateUser (args: UpdateUserArgs): Observable<boolean> {
    const { email, fullName } = args
    return this.http
      .patch<{ result: boolean }>(environment.updateUser(this.userId), {
        email,
        fullName
      })
      .pipe(
        map(response => response.result),
        catchError(() => of(false))
      )
  }

  changePassword (password: string): Observable<boolean> {
    return this.http
      .patch<{ result: boolean }>(environment.changePassword(this.userId), {
        password
      })
      .pipe(
        map(response => response.result),
        catchError(() => of(false))
      )
  }
}
