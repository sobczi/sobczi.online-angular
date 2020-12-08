import { Component, OnDestroy } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { takeUntil } from 'rxjs/operators'
import { ReplaySubject } from 'rxjs'

import { DialogService } from '@shared/services'
import { EmailPattern } from '@shared/validators'
import { GuestFacade } from '@guest/facades'

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnDestroy {
  form: FormGroup
  private readonly translate: (
    value: string
  ) => string = this.translateService.instant.bind(this.translateService)
  private readonly unsubscribe$ = new ReplaySubject<void>()

  constructor (
    private readonly dialogService: DialogService,
    private readonly translateService: TranslateService,
    private readonly facade: GuestFacade,
    formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(EmailPattern)]]
    })
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  handlePasswordChangeRequest (): void {
    const { email: e } = this.form.controls
    const email = e.value
    this.dialogService.openSimpleDialog(
      this.translate('forgotComponent.passwordRecover'),
      this.translate('forgotComponent.ifExistsWasSent')
    )
    this.form.patchValue({ email: '' })
    this.facade
      .sendResetPassword(email)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe()
  }
}
