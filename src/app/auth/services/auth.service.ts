import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, map, take } from 'rxjs/operators'
import { Observable, of } from 'rxjs'

import { environment } from '@env/environment'

@Injectable()
export class AuthService {
  constructor (private http: HttpClient) {}

  refreshToken (userId: string): Observable<string | void> {
    return this.http
      .get<{ token: string }>(environment.refreshToken(userId))
      .pipe(
        take(1),
        map(({ token }) => token),
        catchError(() => of(void 0))
      )
  }
}
