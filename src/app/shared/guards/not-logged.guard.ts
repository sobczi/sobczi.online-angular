import { Injectable } from '@angular/core'
import { CanActivate } from '@angular/router'

import { AuthFacade } from '@auth/facades'

@Injectable({
  providedIn: 'root'
})
export class NotLoggedGuard implements CanActivate {
  constructor (private readonly authFacade: AuthFacade) {}

  canActivate (): boolean {
    return !this.authFacade.user
  }
}
