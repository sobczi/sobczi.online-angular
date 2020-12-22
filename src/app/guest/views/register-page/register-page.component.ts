import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Actions, ofType } from '@ngrx/effects'
import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { takeUntil } from 'rxjs/operators'
import { ReplaySubject } from 'rxjs'

import { DialogService } from '@shared/services'
import { EmailPattern } from '@shared/validators'
import { GuestFacade } from '@guest/facades'
import { SharedFacade } from '@shared/facades'
import { RegisterUserResponse } from '@guest/store'

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent {
  form: FormGroup
  private readonly unsubscribe$ = new ReplaySubject<void>()
  private readonly translate: (
    value: string
  ) => string = this.translateService.instant.bind(this.translateService)
  constructor (
    private readonly router: Router,
    private readonly translateService: TranslateService,
    private readonly dialogService: DialogService,
    private readonly facade: GuestFacade,
    private readonly sharedFacade: SharedFacade,
    private readonly actions$: Actions,
    formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(EmailPattern)]]
    })

    this.actions$
      .pipe(ofType(RegisterUserResponse), takeUntil(this.unsubscribe$))
      .subscribe(this.handleRegisterUserResponse.bind(this))
  }

  handleRegister (): void {
    const { email: e, fullName: f } = this.form.controls
    const email = e.value
    const fullName = f.value

    this.sharedFacade
      .checkEmailOccupation(email)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(occupation => {
        if (occupation) {
          this.dialogService.openSimpleDialog(
            this.translate('registerComponent.registrationFailed'),
            this.translate('shared.emailOccupied')
          )
          return this.form.patchValue({ email: '' })
        }
        this.facade.dispatchRegisterUserRequest(email, fullName)
      })
  }

  handleLogin (): void {
    this.router.navigate(['/guest/login'])
  }

  private handleRegisterUserResponse (): void {
    this.dialogService.openSimpleDialog(
      this.translate('registerComponent.registrationSuccess'),
      this.translate('registerComponent.registrationInfo')
    )
    this.router.navigate(['/home'])
  }
}
