import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'

import { AuthEffects, AuthReducer, AuthStoreKey } from '@auth/store'
import { AuthService } from '@auth/services'
import { AuthFacade } from '@auth/facades'
import {
  IsAdminDirective,
  IsLoggedDirective,
  IsNotLoggedDirective
} from '@auth/directives'
import { TokenInterceptor, UnathorizedInterceptor } from '@auth/interceptors'

@NgModule({
  declarations: [IsAdminDirective, IsLoggedDirective, IsNotLoggedDirective],
  imports: [
    EffectsModule.forFeature([AuthEffects]),
    StoreModule.forFeature(AuthStoreKey, AuthReducer)
  ],
  exports: [IsAdminDirective, IsLoggedDirective, IsNotLoggedDirective],
  providers: [
    AuthService,
    AuthFacade,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnathorizedInterceptor,
      multi: true
    }
  ]
})
export class AuthModule {}
