import { DatePipe } from '@angular/common'
import { Component, OnDestroy } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from '@angular/material/core'
import { Router } from '@angular/router'
import { Actions, ofType } from '@ngrx/effects'
import { filter, takeUntil, tap } from 'rxjs/operators'
import { Subject } from 'rxjs'

import { CustomDateAdapter, MY_DATE_FORMATS } from '@shared/adapters'
import { DialogService } from '@shared/services'
import { InvoiceBE, Item } from '@invoices/models'
import { DeleteInvoiceResponse } from '@invoices/store'
import { InvoicesFacade } from '@invoices/facades'

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'pl-PL' }
  ]
})
export class HistoryComponent implements OnDestroy {
  searchText: string
  dateFrom: Date
  dateTo: Date
  visibleInvoices: InvoiceBE[] = []

  private invoices: InvoiceBE[] = []
  private invoicesIdsToDownload: string[] = []
  private readonly unsubscribe$ = new Subject<void>()

  constructor (
    private readonly dialogSerivce: DialogService,
    private readonly router: Router,
    private readonly translateService: TranslateService,
    private readonly facade: InvoicesFacade,
    private readonly actions$: Actions,
    private readonly dp: DatePipe
  ) {
    this.facade.dispatchGetInvoices()
    this.facade.invoices$
      .pipe(
        takeUntil(this.unsubscribe$),
        tap(r => (!r ? this.facade.dispatchGetInvoices() : undefined)),
        filter(invoices => !!invoices)
      )
      .subscribe(invoices => {
        this.invoices = invoices
        this.visibleInvoices = invoices
        this.handleFiltersChange()
      })

    this.actions$
      .pipe(ofType(DeleteInvoiceResponse), takeUntil(this.unsubscribe$))
      .subscribe(this.handleFiltersChange.bind(this))
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  handleMultipleChange (id: string): void {
    if (!this.invoicesIdsToDownload.find(i => i === id)) {
      this.invoicesIdsToDownload.push(id)
    } else {
      this.invoicesIdsToDownload = this.invoicesIdsToDownload.filter(
        i => i !== id
      )
    }
  }

  handleFiltersChange (): void {
    this.visibleInvoices = this.invoices
      .filter(
        i =>
          this.getValueString(i).includes(
            this.searchText?.toLocaleLowerCase() || ''
          ) && this.invoiceIsInCurrentDateBounds(i)
      )
      .sort((a, b) => b.lastModified - a.lastModified)
  }

  handleClearFilters (): void {
    delete this.searchText
    delete this.dateFrom
    delete this.dateTo
    this.handleFiltersChange()
  }

  handleEdit (id: string): void {
    this.facade.dispatchSetCurrentInvoiceId(id)
    this.router.navigate(['/invoices/edit'])
  }

  handlePreview (id: string): void {
    this.facade.dispatchPreviewInvoice(id)
  }

  handleDownload (id: string): void {
    const {
      base: { type, number: n }
    } = this.invoices.find(i => i.id === id)
    this.facade.dispatchDownloadInvoice(id, `${type} ${n}.pdf`)
  }

  handleDownloadMultiple (): void {
    if (!this.invoicesIdsToDownload.length) {
      return
    }

    this.facade.dispatchDownloadInvoicesRequest(
      this.invoicesIdsToDownload.join('|'),
      `pdfs ${this.dp.transform(new Date(), 'dd-MM-yyyy HH_mm')}.zip`
    )
  }

  handleDelete (id: string): void {
    const header = this.translateService.instant(
      'historyComponent.deleteModal.header'
    )
    const content = this.translateService.instant(
      'historyComponent.deleteModal.content'
    )

    this.dialogSerivce
      .openConfirmDialog(header, content)
      .afterClosed()
      .pipe(filter(response => !!response?.accepted))
      .subscribe(() => {
        this.invoicesIdsToDownload = this.invoicesIdsToDownload.filter(
          i => i !== id
        )
        this.facade.dispatchDeleteInvoiceRequest(id)
      })
  }

  summarizeBrutto (items: Item[]): string {
    const brutto = items
      .map(i => i.brutto)
      .reduce((curr, sum) => (sum += curr), 0)
      .toFixed(2)
      .replace('.', ',')
    return `${brutto.replace(/\s/g, '')}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  private getValueString (invoice: InvoiceBE): string {
    let values: any[] = [
      ...Object.values(invoice.base),
      ...Object.values(invoice.buyer),
      ...Object.values(invoice.payment),
      ...Object.values(invoice.seller)
    ]
    invoice.items
      .map(Object.values)
      .forEach(itemValues => (values = [...values, ...itemValues]))

    return values
      .filter(v => typeof v === 'string' || typeof v === 'number')
      .join(' ')
      .toLocaleLowerCase()
  }

  private invoiceIsInCurrentDateBounds (invoice: InvoiceBE): boolean {
    if (!this.dateFrom && !this.dateTo) {
      return true
    }

    const datestamps = [
      invoice.base.date,
      invoice.inserted,
      invoice.lastModified
    ]

    return !!datestamps.map(this.getDateStampResolver()).filter(v => v).length
  }

  private getDateStampResolver (): (datestamp: number) => boolean {
    const dayInSeconds = 86400000
    const from = this.dateFrom?.getTime() || 0
    const to = this.dateTo ? this.dateTo.getTime() + dayInSeconds - 1 : 0

    let resolver = (datestamp: number) => true
    if (from && !to) {
      resolver = (datestamp: number) => datestamp >= from
    } else if (!from && to) {
      resolver = (datestamp: number) => datestamp <= to
    } else if (from && to) {
      resolver = (datestamp: number) => from <= datestamp && datestamp <= to
    }
    return resolver
  }
}
