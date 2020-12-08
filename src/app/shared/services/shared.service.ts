import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import { environment } from '@env/environment'

@Injectable()
export class SharedService {
  constructor (private readonly http: HttpClient) {}

  checkEmailOccupation (email: string, userId?: string): Observable<boolean> {
    return this.http
      .post<{ occupation: boolean }>(environment.checkUsernameAndEmail, {
        email,
        userId
      })
      .pipe(
        map(response => response.occupation),
        catchError(() => of(true))
      )
  }

  deleteUser (userId: string): Observable<boolean> {
    return this.http
      .delete<{ result: boolean }>(environment.deleteUser(userId))
      .pipe(
        map(response => response.result),
        catchError(() => of(false))
      )
  }
}
