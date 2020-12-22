import { NgModule } from '@angular/core'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'

import { AccountRoutingModule } from '@account/account-routing.module'
import { SettingsComponent } from '@account/views'
import { AccountService } from '@account/services'
import { AccountFacade } from '@account/facades'
import { AccountEffects, AccountReducer, AccountStoreKey } from '@account/store'
import { SharedModule } from '@shared/shared.module'

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    AccountRoutingModule,
    SharedModule,
    EffectsModule.forFeature([AccountEffects]),
    StoreModule.forFeature(AccountStoreKey, AccountReducer)
  ],
  providers: [AccountService, AccountFacade]
})
export class AccountModule {}
