import { Injectable } from '@angular/core'
import { CanActivate } from '@angular/router'

import { AuthFacade } from '@auth/facades'
import { AccountRoles } from '@shared/models'

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor (private readonly authFacade: AuthFacade) {}

  canActivate (): boolean {
    const user = this.authFacade.user
    return !!user && AccountRoles.Admin === user.role
  }
}
