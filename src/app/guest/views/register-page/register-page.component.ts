import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Router } from '@angular/router'
import { ReplaySubject } from 'rxjs'
import { filter, takeUntil } from 'rxjs/operators'

import { DialogService } from '@shared/services'
import { EmailPattern } from '@shared/validators'
import { GuestFacade } from '@guest/facades'
import { SharedFacade } from '@shared/facades'

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
    formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(EmailPattern)]]
    })
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
        return this.facade
          .createUser(email, fullName)
          .pipe(
            takeUntil(this.unsubscribe$),
            filter(response => !!response)
          )
          .subscribe(() => {
            this.dialogService.openSimpleDialog(
              this.translate('registerComponent.registrationSuccess'),
              this.translate('registerComponent.registrationInfo')
            )
            this.router.navigate(['/home'])
          })
      })
  }

  handleLogin (): void {
    this.router.navigate(['/guest/login'])
  }
}
