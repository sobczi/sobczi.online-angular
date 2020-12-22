import { Injectable, OnDestroy } from '@angular/core'
import { Store } from '@ngrx/store'
import { takeUntil, tap } from 'rxjs/operators'
import { Observable, Subject } from 'rxjs'

import { AppState } from '@store/types'

import { InvoicesService } from '@invoices/services'
import { Invoice, InvoiceBE } from '@invoices/models'
import {
  CreateInvoiceRequest,
  DeleteInvoiceRequest,
  GetInvoices,
  selectCurrentInvoice,
  SetCurrentInvoiceId,
  selectInvoices,
  UpdateInvoiceRequest
} from '@invoices/store'

@Injectable()
export class InvoicesFacade implements OnDestroy {
  readonly accessToken$: Observable<string>
  readonly currentInvoice$: Observable<InvoiceBE>
  readonly invoices$: Observable<InvoiceBE[]>
  private readonly unsubscribe$ = new Subject<void>()
  constructor (
    private readonly store: Store<AppState>,
    private readonly service: InvoicesService
  ) {
    this.invoices$ = this.store
      .select(selectInvoices)
      .pipe(takeUntil(this.unsubscribe$))

    this.currentInvoice$ = this.store
      .select(selectCurrentInvoice)
      .pipe(takeUntil(this.unsubscribe$))

    this.accessToken$ = this.service
      .accessToken()
      .pipe(takeUntil(this.unsubscribe$))
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  dispatchCreateInvoiceRequest (invoice: Invoice): void {
    this.store.dispatch(CreateInvoiceRequest({ invoice }))
  }

  dispatchUpdateInvoiceRequest (invoice: Invoice, invoiceId: string): void {
    this.store.dispatch(UpdateInvoiceRequest({ invoice, invoiceId }))
  }

  dispatchDeleteInvoiceRequest (invoiceId: string): void {
    this.store.dispatch(DeleteInvoiceRequest({ invoiceId }))
  }

  dispatchSetCurrentInvoiceId (invoiceId: string): void {
    this.store.dispatch(SetCurrentInvoiceId({ invoiceId }))
  }

  dispatchGetInvoices (): void {
    this.store.dispatch(GetInvoices())
  }
}
