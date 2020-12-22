import { NgModule } from '@angular/core'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'

import { ManagementRoutingModule } from '@management/management-routing.module'
import { ManagementFacade } from '@management/facades'
import { ManagementService } from '@management/services'
import { ManageComponent } from '@management/views'
import { SharedModule } from '@shared/shared.module'
import {
  ManagementEffects,
  ManagementReducer,
  ManagementStoreKey
} from '@management/store'

@NgModule({
  declarations: [ManageComponent],
  imports: [
    ManagementRoutingModule,
    SharedModule,
    EffectsModule.forFeature([ManagementEffects]),
    StoreModule.forFeature(ManagementStoreKey, ManagementReducer)
  ],
  providers: [ManagementFacade, ManagementService]
})
export class ManagementModule {}
