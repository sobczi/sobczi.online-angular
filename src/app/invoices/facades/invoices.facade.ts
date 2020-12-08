import { Injectable, OnDestroy } from '@angular/core'
import { Store } from '@ngrx/store'
import { takeUntil, tap } from 'rxjs/operators'
import { Observable, Subject } from 'rxjs'

import { AppState } from '@store/types'

import { InvoicesService } from '@invoices/services'
import { Invoice, InvoiceBE } from '@invoices/models'
import {
  createInvoice,
  deleteInvoice,
  selectCurrentInvoice,
  selectInvoices,
  setInvoices,
  updateInvoice
} from '@invoices/store'

@Injectable()
export class InvoicesFacade implements OnDestroy {
  private readonly unsubscribe$ = new Subject<void>()
  constructor (
    private readonly store: Store<AppState>,
    private readonly service: InvoicesService
  ) {}

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  fetchInvoices (): Observable<InvoiceBE[]> {
    return this.service.read().pipe(
      takeUntil(this.unsubscribe$),
      tap(invoices => this.dispatchFetchedInvoices(invoices))
    )
  }

  invoices (): Observable<InvoiceBE[]> {
    return this.store.select(selectInvoices).pipe(takeUntil(this.unsubscribe$))
  }

  currentInvoice (): Observable<InvoiceBE> {
    return this.store
      .select(selectCurrentInvoice)
      .pipe(takeUntil(this.unsubscribe$))
  }

  create (invoice: Invoice): Observable<InvoiceBE> {
    return this.service.create(invoice).pipe(
      takeUntil(this.unsubscribe$),
      tap(response => this.dispatchCreatedInvoice(response))
    )
  }

  update (invoice: Invoice, invoiceId: string): Observable<InvoiceBE> {
    return this.service.update(invoice, invoiceId).pipe(
      takeUntil(this.unsubscribe$),
      tap(response => this.dispatchUpdatedInvoice(response))
    )
  }

  delete (invoiceId: string): Observable<boolean> {
    return this.service.delete(invoiceId).pipe(
      takeUntil(this.unsubscribe$),
      tap(response =>
        response ? this.dispatchDeletedInvoice(invoiceId) : undefined
      )
    )
  }

  accessToken (): Observable<string> {
    return this.service.accessToken().pipe(takeUntil(this.unsubscribe$))
  }

  private dispatchFetchedInvoices (invoices: InvoiceBE[]): void {
    this.store.dispatch(setInvoices({ invoices }))
  }

  private dispatchCreatedInvoice (invoice: InvoiceBE): void {
    this.store.dispatch(createInvoice({ invoice }))
  }

  private dispatchDeletedInvoice (invoiceId: string): void {
    this.store.dispatch(deleteInvoice({ invoiceId }))
  }

  private dispatchUpdatedInvoice (invoice: InvoiceBE): void {
    this.store.dispatch(updateInvoice({ invoice }))
  }
}
