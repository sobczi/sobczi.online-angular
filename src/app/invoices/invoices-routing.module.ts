import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { HistoryComponent, InvoiceComponent } from '@invoices/views'

const routes: Routes = [
  {
    path: 'history',
    component: HistoryComponent
  },
  {
    path: 'new',
    component: InvoiceComponent
  },
  {
    path: 'edit',
    component: InvoiceComponent
  },
  {
    path: '**',
    component: HistoryComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoicesRoutingModule {}
