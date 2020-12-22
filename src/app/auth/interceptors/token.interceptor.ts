import { Injectable } from '@angular/core'
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http'
import { Observable } from 'rxjs'

import { AuthFacade } from '@auth/facades'

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor (private readonly authFacade: AuthFacade) {}

  intercept (
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authFacade.token

    request = token
      ? request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        })
      : request

    return next.handle(request)
  }
}
