import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, mergeMap, tap } from 'rxjs/operators'
import { EMPTY } from 'rxjs'

import { InvoicesService } from '@invoices/services'
import {
  CreateInvoiceRequest,
  CreateInvoiceResponse,
  DownloadInvoiceRequest,
  DownloadInvoiceResponse,
  DownloadInvoicesRequest,
  DownloadInvoicesResponse,
  GetInvoices,
  PreviewInvoiceRequest,
  PreviewInvoiceResponse,
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

  downloadInvoice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DownloadInvoiceRequest),
      mergeMap(({ invoiceId, name }) =>
        this.service.accessToken().pipe(
          mergeMap(token =>
            this.service.fetchInvoicePdf(token, invoiceId).pipe(
              tap(blob =>
                this.downloadAndDestroyFileURL(this.createObjectURL(blob), name)
              ),
              map(() => DownloadInvoiceResponse()),
              catchError(() => EMPTY)
            )
          )
        )
      )
    )
  )

  previewInvoice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PreviewInvoiceRequest),
      mergeMap(({ invoiceId }) =>
        this.service.accessToken().pipe(
          mergeMap(token =>
            this.service.fetchInvoicePdf(token, invoiceId).pipe(
              tap(buffer =>
                this.openAndDestroyFileURL(this.createObjectURL(buffer))
              ),
              map(() => PreviewInvoiceResponse()),
              catchError(() => EMPTY)
            )
          )
        )
      )
    )
  )

  downloadInvoicesRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DownloadInvoicesRequest),
      mergeMap(({ query, name }) =>
        this.service.accessToken().pipe(
          mergeMap(token =>
            this.service.fetchZipOfInvoicesPdf(token, query).pipe(
              tap(buffer =>
                this.downloadAndDestroyFileURL(
                  this.createObjectURL(buffer, 'application/zip'),
                  name
                )
              ),
              map(() => DownloadInvoicesResponse()),
              catchError(() => EMPTY)
            )
          )
        )
      )
    )
  )

  constructor (
    private readonly actions$: Actions,
    private readonly service: InvoicesService
  ) {}

  private createObjectURL (buffer: Buffer, type = 'application/pdf'): string {
    return URL.createObjectURL(new Blob([buffer], { type }))
  }

  private downloadAndDestroyFileURL (url: string, name: string): void {
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.target = '_blank'
    a.download = name
    document.body.appendChild(a)

    a.click()
    a.remove()

    URL.revokeObjectURL(url)
  }

  private openAndDestroyFileURL (url: string): void {
    window.open(url)

    URL.revokeObjectURL(url)
  }
}
