import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { InvoicesRoutingModule } from '@invoices/invoices-routing.module'
import { InvoiceComponent, HistoryComponent } from '@invoices/views'
import {
  SubjectFormComponent,
  InvoiceItemFormComponent
} from '@invoices/components'
import { InvoicesFacade } from '@invoices/facades'
import { InvoicesService } from '@invoices/services'

import { SharedModule } from '@shared/shared.module'

@NgModule({
  declarations: [
    InvoiceComponent,
    HistoryComponent,
    SubjectFormComponent,
    InvoiceItemFormComponent
  ],
  imports: [CommonModule, InvoicesRoutingModule, SharedModule],
  providers: [InvoicesFacade, InvoicesService]
})
export class InvoicesModule {}
