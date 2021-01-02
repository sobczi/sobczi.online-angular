import { Injectable, OnDestroy } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { TranslateService } from '@ngx-translate/core'
import { Observable, of, Subject } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'

import { Invoice, InvoiceBE } from '@invoices/models'
import { CrudService } from '@invoices/models'
import { environment } from '@env/environment'
import { AuthFacade } from '@auth/facades'

@Injectable()
export class InvoicesService implements CrudService<Invoice>, OnDestroy {
  private readonly unsubscribe$ = new Subject<void>()
  private get currentLang (): string {
    return this.translateService.currentLang
  }

  private get userId (): string {
    return this.authFacade.user?.id
  }

  constructor (
    private readonly http: HttpClient,
    private readonly authFacade: AuthFacade,
    private readonly translateService: TranslateService
  ) {}

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  create (invoice: Invoice): Observable<InvoiceBE> {
    return this.http
      .post<{ invoice: InvoiceBE }>(environment.createInvoice(this.userId), {
        invoice
      })
      .pipe(
        map(response => response.invoice),
        catchError(() => of(undefined))
      )
  }

  read (): Observable<InvoiceBE[]> {
    return this.http
      .get<{ invoices: InvoiceBE[] }>(environment.getInvoices(this.userId))
      .pipe(
        map(response => response.invoices),
        catchError(() => of([]))
      )
  }

  fetchInvoicePdf (token: string, invoiceId: string): Observable<Buffer> {
    const headers = new HttpHeaders().set('Accept', 'application/pdf')
    const responseType = 'blob' as 'json'

    return this.http.get<Buffer>(
      environment.getInvoicePdf(
        this.currentLang,
        this.userId,
        token,
        invoiceId
      ),
      { headers, responseType }
    )
  }

  fetchZipOfInvoicesPdf (token: string, query: string): Observable<Buffer> {
    const headers = new HttpHeaders().set('Accept', 'application/zip')
    const responseType = 'arraybuffer' as 'json'

    return this.http.get<Buffer>(
      environment.getInvoicesPdfs(this.currentLang, this.userId, token, query),
      { headers, responseType }
    )
  }

  update (invoice: Invoice, invoiceId: string): Observable<InvoiceBE> {
    return this.http
      .post<{ invoice: InvoiceBE }>(
        environment.editInvoice(this.userId, invoiceId),
        {
          invoice
        }
      )
      .pipe(
        map(response => response.invoice),
        catchError(() => of(undefined))
      )
  }

  delete (invoiceId: string): Observable<boolean> {
    return this.http
      .delete<{ result: boolean }>(environment.deleteInvoice(invoiceId))
      .pipe(
        map(response => response.result),
        catchError(() => of(false))
      )
  }

  accessToken (): Observable<string> {
    return this.http
      .get<{ token: string }>(environment.generateAccessToken(this.userId))
      .pipe(
        map(response => response.token),
        catchError(() => of(''))
      )
  }
}
