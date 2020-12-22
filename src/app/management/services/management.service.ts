import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import { AccountRoles, User } from '@shared/models'
import { environment } from '@env/environment'

@Injectable()
export class ManagementService {
  constructor (private readonly http: HttpClient) {}

  fetchUsers (): Observable<User[]> {
    return this.http.get<{ users: User[] }>(environment.getUsers).pipe(
      map(response => response.users),
      catchError(() => of([]))
    )
  }

  updateUserRole (userId: string, role: AccountRoles): Observable<boolean> {
    return this.http
      .patch<{ result: boolean }>(environment.changeRole(userId), {
        role
      })
      .pipe(
        map(response => response.result),
        catchError(() => of(false))
      )
  }

  updateUserActive (userId: string, active: boolean): Observable<boolean> {
    return this.http
      .patch<{ result: boolean }>(environment.changeActive(userId), { active })
      .pipe(
        map(response => response.result),
        catchError(() => of(false))
      )
  }
}
