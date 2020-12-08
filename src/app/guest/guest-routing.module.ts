import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { NotLoggedGuard } from '@shared/guards'
import {
  ForgotPasswordComponent,
  LoginPageComponent,
  RegisterPageComponent,
  ResetPasswordComponent
} from '@guest/views'

const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [NotLoggedGuard]
  },
  {
    path: 'register',
    component: RegisterPageComponent,
    canActivate: [NotLoggedGuard]
  },
  {
    path: 'reset-password/:resetKey',
    component: ResetPasswordComponent,
    canActivate: [NotLoggedGuard]
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [NotLoggedGuard]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuestRoutingModule {}
