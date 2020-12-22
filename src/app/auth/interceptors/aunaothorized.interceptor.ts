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

import { AuthFacade } from '@auth/facades'

@Injectable()
export class UnathorizedInterceptor implements HttpInterceptor {
  constructor (private readonly authFacade: AuthFacade) {}

  intercept (
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && this.authFacade.user) {
          this.authFacade.dispatchLogoutRequest()
        }
        return throwError(error)
      })
    )
  }
}
