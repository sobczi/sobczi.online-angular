import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, mergeMap } from 'rxjs/operators'
import { EMPTY } from 'rxjs'

import { InvoicesService } from '@invoices/services'
import {
  CreateInvoiceRequest,
  CreateInvoiceResponse,
  GetInvoices,
  SetInvoices,
  UpdateInvoiceRequest,
  UpdateInvoiceResponse
} from './invoice.actions'

@Injectable()
export class InvoicesEffects {
  getInvoices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GetInvoices),
      mergeMap(() =>
        this.service.read().pipe(
          map(invoices => SetInvoices({ invoices })),
          catchError(() => EMPTY)
        )
      )
    )
  )

  createInvoice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateInvoiceRequest),
      mergeMap(({ invoice: inv }) =>
        this.service.create(inv).pipe(
          map(invoice => CreateInvoiceResponse({ invoice })),
          catchError(() => EMPTY)
        )
      )
    )
  )

  updateInvoice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UpdateInvoiceRequest),
      mergeMap(({ invoice: inv, invoiceId }) =>
        this.service.update(inv, invoiceId).pipe(
          map(invoice => UpdateInvoiceResponse({ invoice })),
          catchError(() => EMPTY)
        )
      )
    )
  )

  constructor (
    private readonly actions$: Actions,
    private readonly service: InvoicesService
  ) {}
}
