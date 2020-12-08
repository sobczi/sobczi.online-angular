import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms'
import { ReplaySubject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import {
  Item,
  TranslatedElements,
  Units,
  GTUCodes,
  VATRates
} from '@invoices/models'
import { validateNumberWithSpaces } from '@shared/validators'

type ItemForm = {
  name: string
  unit: Units
  quantity: string
  netto: string
  vatPercentage: VATRates
  gtuCode: GTUCodes
}

@Component({
  selector: 'app-invoice-item-form',
  templateUrl: './invoice-item-form.component.html',
  styleUrls: ['./invoice-item-form.component.scss']
})
export class InvoiceItemFormComponent implements OnInit, OnDestroy {
  @Input() item: Item
  itemForm: FormGroup

  readonly units: TranslatedElements[] = [
    {
      value: Units.piece,
      translation: 'invoiceComponent.piecesUnit'
    },
    {
      value: Units.month,
      translation: 'invoiceComponent.monthsUnit'
    }
  ]
  readonly VatRates: TranslatedElements[] = [
    {
      value: VATRates.TwentyThree,
      translation: '23%'
    },
    {
      value: VATRates.Exempt,
      translation: 'invoiceComponent.vatExempt'
    }
  ]
  readonly gtuCodes: TranslatedElements[] = [
    {
      value: GTUCodes.GTU_12,
      translation: 'GTU_12'
    }
  ]
  private readonly unsubscribe$ = new ReplaySubject<void>()

  get c (): { [key: string]: AbstractControl } {
    return this.itemForm.controls
  }

  get itemValue (): Item {
    const c = this.itemForm.controls
    const { netto, quantity, ...rest }: ItemForm = this.itemForm.value
    return {
      ...rest,
      vat: this.convertStringToNumber(c.vat.value),
      brutto: this.convertStringToNumber(c.brutto.value),
      netto: this.convertStringToNumber(netto),
      quantity: this.convertStringToNumber(quantity)
    }
  }

  constructor (formBuilder: FormBuilder) {
    this.itemForm = formBuilder.group({
      name: [undefined, Validators.required],
      gtuCode: [undefined, Validators.required],
      unit: [undefined, Validators.required],
      quantity: [undefined, [Validators.required, validateNumberWithSpaces]],
      netto: [undefined, [Validators.required, validateNumberWithSpaces]],
      vatPercentage: [undefined, Validators.required],
      vat: [{ value: '', disabled: true }, Validators.required],
      brutto: [{ value: '', disabled: true }, Validators.required]
    })

    this.c.netto.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(this.updateVatAndBrutto.bind(this))
    this.c.quantity.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(this.updateVatAndBrutto.bind(this))
    this.c.vatPercentage.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.updateVatAndBrutto()
        this.updateGtuCodeProperty()
      })
  }

  ngOnInit (): void {
    this.itemForm.patchValue({
      ...this.item,
      netto: this.addSpacesToNumber(`${this.item?.netto || ''}`)
    })
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  updateFormatOfNumbers (): void {
    this.itemForm.patchValue({
      netto: this.addSpacesToNumber(this.itemForm.controls.netto.value)
    })

    this.itemForm.patchValue({
      quantity: this.addSpacesToNumber(
        `${this.convertStringToNumber(this.itemForm.controls.quantity.value)}`
      )
    })
    this.updateVatAndBrutto()
  }

  handleFormatNetto (e: KeyboardEvent): void {
    if (e.key === '.') {
      e.preventDefault()
    }
    this.itemForm.patchValue({
      netto: this.addSpacesToNumber(this.itemForm.controls.netto.value)
    })
  }

  handleFormatQuantity (): void {
    this.itemForm.patchValue({
      quantity: this.addSpacesToNumber(
        `${this.convertStringToNumber(this.itemForm.controls.quantity.value)}`
      )
    })
  }

  private updateGtuCodeProperty (): void {
    const property = this.c.gtuCode
    const vatExists = this.c.vatPercentage.value !== VATRates.Exempt
    const gtuCode = vatExists ? GTUCodes.GTU_12 : undefined
    this.itemForm.patchValue({ gtuCode })
    return vatExists ? property.enable() : property.disable()
  }

  private updateVatAndBrutto (): void {
    const c = this.itemForm.controls
    const netto = this.convertStringToNumber(c.netto.value) || 0
    const vatPercentage = this.convertStringToNumber(c.vatPercentage.value)
    const quantity = this.convertStringToNumber(c.quantity.value)

    const vat = this.roundNumber(netto * vatPercentage) || 0
    const brutto = this.roundNumber(netto + vat) * quantity || 0
    this.itemForm.patchValue({
      vat: this.addSpacesToNumber((vat * quantity).toFixed(2)),
      brutto: this.addSpacesToNumber(brutto.toFixed(2))
    })
  }

  private addSpacesToNumber (value: string): string {
    return `${value.replace(/\s/g, '')}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  private roundNumber (value: number): number {
    return Math.round(value * 100) / 100
  }

  private convertStringToNumber (value: string): number {
    return !value ? 0 : parseFloat(`${value}`.replace(' ', ''))
  }
}
