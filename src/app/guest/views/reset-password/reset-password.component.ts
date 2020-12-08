import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { filter, map, takeUntil } from 'rxjs/operators'
import { ReplaySubject } from 'rxjs'

import { GuestFacade } from '@guest/facades'
import { DialogService } from '@shared/services'
import {
  PasswordPattern,
  PasswordsMustEqual,
  CrossFieldErrorMatcher
} from '@shared/validators'

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  form: FormGroup
  passwordIsVisible: boolean
  readonly errorStateMatcher = new CrossFieldErrorMatcher()
  private resetKey: string
  private readonly unsubscribe$ = new ReplaySubject<void>()
  private readonly translate: (
    value: string
  ) => string = this.translateService.instant.bind(this.translateService)
  constructor (
    private readonly dialogService: DialogService,
    private readonly translateService: TranslateService,
    private readonly router: Router,
    private readonly facade: GuestFacade,
    activatedRoute: ActivatedRoute,
    formBuilder: FormBuilder
  ) {
    activatedRoute.params
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(params => !!params.resetKey),
        map(params => params.resetKey)
      )
      .subscribe(resetKey => (this.resetKey = resetKey))

    this.form = formBuilder.group(
      {
        password: [
          '',
          [Validators.required, Validators.pattern(PasswordPattern)]
        ],
        repeatPassword: ['', Validators.required]
      },
      { validators: PasswordsMustEqual }
    )
  }

  handlePasswordChange (): void {
    const newPassword = this.form.controls.password.value
    this.facade
      .resetPassword(this.resetKey, newPassword)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(result =>
        result
          ? this.router.navigate(['/guest/login'])
          : this.dialogService.openSimpleDialog(
              this.translate('resetComponent.cannotChange'),
              this.translate('resetComponent.inproperURL')
            )
      )
  }
}
