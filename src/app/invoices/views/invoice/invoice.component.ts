import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core'
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from '@angular/material/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { TranslatePipe, TranslateService } from '@ngx-translate/core'
import { DatePipe } from '@angular/common'
import { Router } from '@angular/router'
import { Actions, ofType } from '@ngrx/effects'
import { ReplaySubject } from 'rxjs'
import { filter, takeUntil } from 'rxjs/operators'

import {
  InvoiceItemFormComponent,
  SubjectFormComponent
} from '@invoices/components'
import { convertPrice } from '@invoices/utils'
import {
  PaymentType,
  GTUCodes,
  VATRates,
  Units,
  InvoiceType,
  TranslatedElements
} from '@invoices/models'
import {
  Base,
  Invoice,
  InvoiceBE,
  Item,
  Payment,
  Subject
} from '@invoices/models'
import { InvoicesFacade } from '@invoices/facades'
import { CustomDateAdapter, MY_DATE_FORMATS } from '@shared/adapters'
import { DialogService } from '@shared/services'
import { CrossFieldErrorMatcher } from '@shared/validators'
import { CreateInvoiceResponse, UpdateInvoiceResponse } from '@invoices/store'

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'pl-PL' },
    TranslatePipe
  ]
})
export class InvoiceComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('itemComponent') itemsForms: QueryList<InvoiceItemFormComponent>
  @ViewChildren('subject') subjectForms: QueryList<SubjectFormComponent>
  @ViewChild('submitButton') submitButton: ElementRef

  base: FormGroup
  payment: FormGroup

  seller: Subject
  buyer: Subject

  items: Item[] = []
  editView: boolean
  elementsNotFoundError: boolean

  readonly paymentTypes: TranslatedElements[] = [
    {
      value: PaymentType.transfer,
      translation: 'invoiceComponent.transfer'
    }
  ]
  readonly invoiceTypes: TranslatedElements[] = [
    {
      value: InvoiceType.VAT,
      translation: 'invoiceComponent.vatInvoice'
    },
    {
      value: InvoiceType.sales,
      translation: 'invoiceComponent.salesInvoice'
    }
  ]
  readonly errorStateMatcher = new CrossFieldErrorMatcher()

  private currentInvoiceId: string

  private readonly forms: FormGroup[] = []
  private readonly initialItem: Item
  private readonly unsubscribe$ = new ReplaySubject<void>()

  get submitText (): string {
    return this.editView
      ? this.translateService.instant('invoiceComponent.saveChanges')
      : this.translateService.instant('invoiceComponent.issue')
  }

  private get allFormsValid (): boolean {
    const invalidItemForms = !!this.itemsForms
      .toArray()
      .map(component => component.itemForm.valid)
      .filter(valid => !valid).length

    const invalidSubjectForms = !!this.subjectForms
      .toArray()
      .map(component => component.form.valid)
      .filter(valid => !valid).length

    return (
      !this.forms.find(f => f.invalid) &&
      !invalidItemForms &&
      !!this.itemsForms.length &&
      !invalidSubjectForms
    )
  }

  constructor (
    private readonly dialogService: DialogService,
    private readonly router: Router,
    private readonly dp: DatePipe,
    private readonly cdref: ChangeDetectorRef,
    private readonly translateService: TranslateService,
    private readonly facade: InvoicesFacade,
    private readonly actions$: Actions,
    formBuilder: FormBuilder
  ) {
    this.editView = this.router.url.includes('edit')
    const now = this.convertDatestampToInput(new Date().getTime())
    this.base = formBuilder.group({
      type: [InvoiceType.VAT, Validators.required],
      number: ['', Validators.required],
      date: [now, Validators.required]
    })

    this.payment = formBuilder.group(
      {
        type: [PaymentType.transfer, Validators.required],
        accountNumber: [
          '',
          [
            Validators.required,
            Validators.pattern(/^\d{2} \d{4} \d{4} \d{4} \d{4} \d{4} \d{4}$/)
          ]
        ],
        sign: [false],
        signValue: [{ value: '', disabled: true }]
      },
      { validators: this.requireSignValueIfSignIsChecked }
    )

    this.forms = [this.base, this.payment]
    this.initialItem = {
      name: '',
      unit: Units.piece,
      quantity: undefined,
      netto: undefined,
      vatPercentage: VATRates.TwentyThree,
      vat: undefined,
      brutto: undefined,
      gtuCode: GTUCodes.GTU_12
    }
    this.items.push(JSON.parse(JSON.stringify(this.initialItem)))
    this.payment.controls.sign.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(this.handleSignChanges.bind(this))

    this.actions$
      .pipe(ofType(CreateInvoiceResponse), takeUntil(this.unsubscribe$))
      .subscribe(this.handleCreateInvoiceResponse.bind(this))

    this.actions$
      .pipe(ofType(UpdateInvoiceResponse), takeUntil(this.unsubscribe$))
      .subscribe(this.handleUpdateInvoiceResponse.bind(this))
  }

  ngAfterViewInit (): void {
    this.facade.currentInvoice$
      .pipe(
        filter(() => this.editView),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(this.patchFormWithInvoice.bind(this))
    this.cdref.detectChanges()
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  totalValue (control: string): string {
    if (!this.itemsForms) {
      return convertPrice(0)
    }
    const forms = this.itemsForms.toArray().map(c => c.itemForm)
    return convertPrice(
      forms
        .map(f =>
          control !== 'netto'
            ? Number(`${f.controls[control].value}`.replace(' ', '')) || 0
            : Number(`${f.controls[control].value}`.replace(' ', '')) ||
              0 * Number(`${f.controls.quantity.value}`.replace(' ', '')) ||
              0
        )
        .reduce((sum, current) => sum + current, 0)
    )
  }

  handleSignChanges (): void {
    const sign = this.payment.controls.sign.value
    const signValue = this.payment.controls.signValue
    return sign ? signValue.enable() : signValue.disable()
  }

  handleItemFormAdd (): void {
    this.items = [...this.items, JSON.parse(JSON.stringify(this.initialItem))]
    this.elementsNotFoundError = false
  }

  handleItemFormDelete (item: Item): void {
    this.items = this.items.filter(itemTmp => itemTmp !== item)
    this.cdref.detectChanges()
  }

  handleAccountNumberChanges (): void {
    const value: string = this.payment.controls.accountNumber.value.replace(
      /\s/g,
      ''
    )
    this.payment.patchValue({
      accountNumber: `${value.substring(0, 2)} ${value
        .substr(2)
        .match(/.{1,4}/g)
        ?.join(' ') || ''}`
    })
  }

  handleSaveAsNew (): void {
    if (!this.allFormsValid) {
      return
    }
    this.facade.dispatchCreateInvoiceRequest(this.mapInvoiceFromForms())
  }

  handleSubmit (): void {
    if (!this.allFormsValid) {
      this.itemsForms.toArray().forEach(c => c.itemForm.markAllAsTouched())
      this.subjectForms.toArray().forEach(c => c.form.markAllAsTouched())
      this.forms.forEach(f => f.markAllAsTouched())
      if (!this.itemsForms.length) {
        this.elementsNotFoundError = true
      }
      return
    }

    const mappedInvoice = this.mapInvoiceFromForms()
    if (!this.editView) {
      this.facade.dispatchCreateInvoiceRequest(mappedInvoice)
    } else {
      this.facade.dispatchUpdateInvoiceRequest(
        mappedInvoice,
        this.currentInvoiceId
      )
    }
  }

  private handleCreateInvoiceResponse (): void {
    this.dialogService.openSimpleDialog(
      this.translateService.instant('invoiceComponent.invoiceCreated'),
      ''
    )
    this.router.navigate(['/invoices/history'])
  }

  private handleUpdateInvoiceResponse (): void {
    this.dialogService.openSimpleDialog(
      this.translateService.instant('invoiceComponent.invoiceUpdated'),
      ''
    )
    this.router.navigate(['/invoices/history'])
  }

  private mapInvoiceFromForms (): Invoice {
    const { date, ...rest } = this.base.value
    const base: Base = { ...rest, date: new Date(date).getTime() }
    const seller: Subject = this.subjectForms.toArray().find(c => c.isSeller)
      .form.value
    const buyer: Subject = this.subjectForms.toArray().find(c => !c.isSeller)
      .form.value
    const items: Item[] = this.itemsForms
      .toArray()
      .map(component => component.itemValue)

    const payment: Payment = this.payment.value
    return { base, seller, buyer, items, payment }
  }

  private requireSignValueIfSignIsChecked (group: FormGroup): object {
    const sign = group.get('sign').value
    return sign && !group.get('signValue').value
      ? { signValueRequired: true }
      : null
  }

  private patchFormWithInvoice (invoice: InvoiceBE | undefined): void {
    if (!invoice) {
      return
    }
    this.currentInvoiceId = invoice.id
    const { base, seller, buyer, items, payment } = invoice
    this.base.patchValue({
      ...base,
      date: this.convertDatestampToInput(base.date)
    })
    this.seller = seller
    this.buyer = buyer

    this.items = items
    this.payment.patchValue({
      ...payment,
      sign: payment.signValue ? true : false
    })
    this.cdref.detectChanges()
  }

  private convertDatestampToInput (datestamp: number): string {
    return this.dp.transform(datestamp, 'yyyy-MM-dd')
  }
}
