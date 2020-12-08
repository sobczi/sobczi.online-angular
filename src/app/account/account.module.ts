import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { AccountRoutingModule } from '@account/account-routing.module'
import { SettingsComponent } from '@account/views'
import { AccountService } from '@account/services'
import { AccountFacade } from '@account/facades'
import { SharedModule } from '@shared/shared.module'

@NgModule({
  declarations: [SettingsComponent],
  imports: [CommonModule, AccountRoutingModule, SharedModule],
  providers: [AccountService, AccountFacade]
})
export class AccountModule {}
