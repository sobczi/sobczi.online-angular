import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Actions, ofType } from '@ngrx/effects'
import { filter, map, takeUntil } from 'rxjs/operators'
import { ReplaySubject } from 'rxjs'

import { GuestFacade } from '@guest/facades'
import { DialogService } from '@shared/services'
import {
  PasswordPattern,
  PasswordsMustEqual,
  CrossFieldErrorMatcher
} from '@shared/validators'
import {
  ResetPasswordResponseFail,
  ResetPasswordResponseSuccess
} from '@guest/store'

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  passwordIsVisible: boolean
  readonly form: FormGroup
  readonly errorStateMatcher = new CrossFieldErrorMatcher()
  private resetKey: string
  private readonly unsubscribe$ = new ReplaySubject<void>()
  constructor (
    private readonly dialogService: DialogService,
    private readonly translateService: TranslateService,
    private readonly router: Router,
    private readonly facade: GuestFacade,
    private readonly actions$: Actions,
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

    this.actions$
      .pipe(ofType(ResetPasswordResponseSuccess), takeUntil(this.unsubscribe$))
      .subscribe(this.handleResetPasswordResponseSuccess.bind(this))

    this.actions$
      .pipe(ofType(ResetPasswordResponseFail), takeUntil(this.unsubscribe$))
      .subscribe(this.handleResetPasswordResponseFail.bind(this))
  }

  handlePasswordChange (): void {
    const newPassword = this.form.controls.password.value
    this.facade.dispatchResetPasswordRequest(this.resetKey, newPassword)
  }

  private handleResetPasswordResponseSuccess (): void {
    this.dialogService.openSimpleDialog(
      this.translateService.instant('resetComponent.passwordChanged.header'),
      this.translateService.instant('resetComponent.passwordChanged.content')
    )
    this.router.navigate(['/guest/login'])
  }

  private handleResetPasswordResponseFail (): void {
    this.dialogService.openSimpleDialog(
      this.translateService.instant('resetComponent.cannotChange'),
      this.translateService.instant('resetComponent.inproperURL')
    )
  }
}
