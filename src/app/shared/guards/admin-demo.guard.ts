import { Injectable } from '@angular/core'
import { CanActivate } from '@angular/router'

import { AuthFacade } from '@shared/facades'
import { AccountRoles } from '@shared/models'

@Injectable({
  providedIn: 'root'
})
export class AdminDemoGuard implements CanActivate {
  private readonly adminOrDemo: AccountRoles[] = [
    AccountRoles.Admin,
    AccountRoles.DemoUser
  ]
  constructor (private readonly authFacade: AuthFacade) {}

  canActivate (): boolean {
    const user = this.authFacade.user
    return !!user && this.adminOrDemo.includes(user?.role)
  }
}
