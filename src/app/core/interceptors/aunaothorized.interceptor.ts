import { Injectable } from '@angular/core'
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

import { DialogService } from '@shared/services'
import { AuthFacade } from '@shared/facades'

@Injectable()
export class UnathorizedInterceptor implements HttpInterceptor {
  constructor (
    private readonly authFacade: AuthFacade,
    private readonly dialogService: DialogService
  ) {}

  intercept (
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && this.authFacade.user) {
          this.dialogService.showLogoutDialog(this.authFacade.user.fullName)
          this.authFacade.dispatchUserLogout()
        }
        return throwError(error)
      })
    )
  }
}
