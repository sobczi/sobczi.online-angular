import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { GuestRoutingModule } from '@guest/guest-routing.module'
import {
  ForgotPasswordComponent,
  LoginPageComponent,
  RegisterPageComponent,
  ResetPasswordComponent
} from '@guest/views'
import { GuestFacade } from '@guest/facades'
import { GuestService } from '@guest/services'
import { SharedModule } from '@shared/shared.module'

@NgModule({
  declarations: [
    ForgotPasswordComponent,
    LoginPageComponent,
    RegisterPageComponent,
    ResetPasswordComponent
  ],
  imports: [CommonModule, GuestRoutingModule, SharedModule],
  providers: [GuestFacade, GuestService]
})
export class GuestModule {}
