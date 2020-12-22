import { NgModule } from '@angular/core'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'

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
import { GuestReducer, GuestEffects, GuestStoreKey } from '@guest/store'

@NgModule({
  declarations: [
    ForgotPasswordComponent,
    LoginPageComponent,
    RegisterPageComponent,
    ResetPasswordComponent
  ],
  imports: [
    GuestRoutingModule,
    SharedModule,
    EffectsModule.forFeature([GuestEffects]),
    StoreModule.forFeature(GuestStoreKey, GuestReducer)
  ],
  providers: [GuestFacade, GuestService]
})
export class GuestModule {}
