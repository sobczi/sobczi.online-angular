import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'

import { InvoicesRoutingModule } from '@invoices/invoices-routing.module'
import { InvoiceComponent, HistoryComponent } from '@invoices/views'
import {
  SubjectFormComponent,
  InvoiceItemFormComponent
} from '@invoices/components'
import { InvoicesFacade } from '@invoices/facades'
import { InvoicesService } from '@invoices/services'
import {
  InvoicesEffects,
  InvoicesStoreKey,
  InvoicesReducer
} from '@invoices/store'
import { SharedModule } from '@shared/shared.module'

@NgModule({
  declarations: [
    InvoiceComponent,
    HistoryComponent,
    SubjectFormComponent,
    InvoiceItemFormComponent
  ],
  imports: [
    CommonModule,
    InvoicesRoutingModule,
    SharedModule,
    EffectsModule.forFeature([InvoicesEffects]),
    StoreModule.forFeature(InvoicesStoreKey, InvoicesReducer)
  ],
  providers: [InvoicesFacade, InvoicesService]
})
export class InvoicesModule {}
