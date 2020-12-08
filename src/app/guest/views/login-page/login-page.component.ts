import { Component, OnDestroy } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Router } from '@angular/router'
import { takeUntil } from 'rxjs/operators'
import { ReplaySubject } from 'rxjs'

import { DialogService } from '@shared/services'
import { EmailPattern } from '@shared/validators'
import { GuestFacade } from '@guest/facades'

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnDestroy {
  form: FormGroup
  passwordIsVisible: boolean
  private readonly unsubscribe$ = new ReplaySubject<void>()
  private readonly translate: (
    value: string
  ) => string = this.translateService.instant.bind(this.translateService)
  constructor (
    private readonly router: Router,
    private readonly dialogService: DialogService,
    private readonly translateService: TranslateService,
    private readonly facade: GuestFacade,
    formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(EmailPattern)]],
      password: ['', Validators.required]
    })
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  login (): void {
    const { email, password } = this.form.value
    this.facade
      .login(email, password)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(result => {
        if (typeof result === 'object') {
          const { fullName } = result.user
          const headerOk = this.translate('loginComponent.loggedIn')
          const contentOk = this.translate('loginComponent.welcome')
          this.dialogService
            .openSimpleDialog(headerOk, `${contentOk}, ${fullName}.`)
            .afterClosed()
            .subscribe()
          return this.router.navigate(['/home'])
        } else {
          const headerErr = this.translate('loginComponent.errorLogin.header')
          const contentErr = this.translate('loginComponent.errorLogin.content')
          this.dialogService
            .openSimpleDialog(headerErr, contentErr)
            .afterClosed()
            .subscribe()
          this.form.patchValue({ email: '', password: '' })
          this.form.markAllAsTouched()
        }
      })
  }
}
