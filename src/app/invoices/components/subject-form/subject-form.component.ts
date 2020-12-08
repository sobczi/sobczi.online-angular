import { Component, Input, OnChanges } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'

import { Subject } from '@invoices/models'

@Component({
  selector: 'app-subject-form',
  templateUrl: './subject-form.component.html',
  styleUrls: ['./subject-form.component.scss']
})
export class SubjectFormComponent implements OnChanges {
  @Input() isSeller: boolean
  @Input() subject: Subject

  form: FormGroup

  get header (): string {
    return this.isSeller
      ? this.translateService.instant('invoiceComponent.seller')
      : this.translateService.instant('invoiceComponent.buyer')
  }

  constructor (
    formBuilder: FormBuilder,
    private readonly translateService: TranslateService
  ) {
    this.form = formBuilder.group({
      name: ['', Validators.required],
      NIP: [
        '',
        [Validators.required, Validators.pattern(/^\d{3} \d{3} \d{3} \d{1}$/)]
      ],
      street: [''],
      city: ['', Validators.required],
      postalCode: [
        '',
        [Validators.required, Validators.pattern(/^\d{2}-?\d{3}$/)]
      ]
    })
  }

  ngOnChanges (): void {
    this.form.patchValue({ ...this.subject })
  }

  formatNIPNumber (): void {
    const value = this.form.controls.NIP.value.replace(/\s/g, '')
    this.form.patchValue({ NIP: value.match(/.{1,3}/g)?.join(' ') || '' })
  }
}
