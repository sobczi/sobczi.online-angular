import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { ManagementRoutingModule } from '@management/management-routing.module'
import { ManagementFacade } from '@management/facades'
import { ManagementService } from '@management/services'
import { ManageComponent } from '@management/views'
import { SharedModule } from '@shared/shared.module'

@NgModule({
  declarations: [ManageComponent],
  imports: [CommonModule, ManagementRoutingModule, SharedModule],
  providers: [ManagementFacade, ManagementService]
})
export class ManagementModule {}
