import { Component, OnDestroy } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Router } from '@angular/router'
import { takeUntil } from 'rxjs/operators'
import { Actions, ofType } from '@ngrx/effects'
import { ReplaySubject } from 'rxjs'

import { DialogService } from '@shared/services'
import { EmailPattern } from '@shared/validators'
import { GuestFacade } from '@guest/facades'
import { LoginResponseFail, LoginResponseSuccess } from '@guest/store'

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnDestroy {
  form: FormGroup
  passwordIsVisible: boolean
  private readonly unsubscribe$ = new ReplaySubject<void>()
  constructor (
    private readonly router: Router,
    private readonly dialogService: DialogService,
    private readonly translateService: TranslateService,
    private readonly facade: GuestFacade,
    private readonly actions$: Actions,
    formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(EmailPattern)]],
      password: ['', Validators.required]
    })

    this.actions$
      .pipe(ofType(LoginResponseSuccess), takeUntil(this.unsubscribe$))
      .subscribe(({ user: { fullName } }) =>
        this.handleLoginResponseSuccess(fullName)
      )

    this.actions$
      .pipe(ofType(LoginResponseFail), takeUntil(this.unsubscribe$))
      .subscribe(() => this.handleLoginResponseFail())
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  handleLoginSubmit (): void {
    const { email, password } = this.form.value
    this.facade.dispatchLoginRequest(email, password)
  }

  private handleLoginResponseSuccess (fullName: string): void {
    const headerOk = this.translateService.instant('loginComponent.loggedIn')
    const contentOk = this.translateService.instant('loginComponent.welcome')
    this.dialogService.openSimpleDialog(headerOk, `${contentOk}, ${fullName}.`)
    this.router.navigate(['/home'])
  }

  private handleLoginResponseFail (): void {
    const headerErr = this.translateService.instant(
      'loginComponent.errorLogin.header'
    )
    const contentErr = this.translateService.instant(
      'loginComponent.errorLogin.content'
    )
    this.dialogService.openSimpleDialog(headerErr, contentErr)
    this.form.patchValue({ email: '', password: '' })
    this.form.markAllAsTouched()
  }
}
