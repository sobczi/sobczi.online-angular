import { Component, OnDestroy } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { filter, take, takeUntil } from 'rxjs/operators'
import { ReplaySubject, Subscription } from 'rxjs'
import { Actions, ofType } from '@ngrx/effects'

import { DialogService } from '@shared/services'
import {
  EmailPattern,
  PasswordsMustEqual,
  CrossFieldErrorMatcher,
  PasswordPattern
} from '@shared/validators'
import { SharedFacade } from '@shared/facades'
import { AuthFacade } from '@auth/facades'
import { User } from '@shared/models'
import { AccountFacade } from '@account/facades'
import { PasswordUpdateResponse, UserUpdateResponse } from '@account/store'
import { DeleteUserResponse } from '@shared/store'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnDestroy {
  basicForm: FormGroup
  passwordForm: FormGroup
  passwordIsVisible: boolean
  readonly errorStateMatcher = new CrossFieldErrorMatcher()

  private readonly translate: (
    value: string
  ) => string = this.translateService.instant.bind(this.translateService)
  private readonly unsubscribe$ = new ReplaySubject<void>()

  private get user (): User {
    return this.authFacade.user
  }

  constructor (
    private readonly actions$: Actions,
    private readonly dialogService: DialogService,
    private readonly translateService: TranslateService,
    private readonly sharedFacade: SharedFacade,
    private readonly authFacade: AuthFacade,
    private readonly accountFacade: AccountFacade,
    formBuilder: FormBuilder
  ) {
    this.basicForm = formBuilder.group({
      fullName: [this.user.fullName, Validators.required],
      email: [
        this.user.email,
        [Validators.required, Validators.pattern(EmailPattern)]
      ],
      role: [{ value: '', disabled: true }]
    })

    this.passwordForm = formBuilder.group(
      {
        password: [
          '',
          [Validators.required, Validators.pattern(PasswordPattern)]
        ],
        repeatPassword: ['', Validators.required]
      },
      { validators: PasswordsMustEqual }
    )

    // Workarounds due to:
    // https://github.com/ngx-translate/core/issues/758
    this.translateSubscription()
    this.translateService.onLangChange
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.translateSubscription())

    this.actions$
      .pipe(
        ofType(DeleteUserResponse),
        takeUntil(this.unsubscribe$),
        filter(({ userId }) => userId === this.user.id)
      )
      .subscribe(() => this.authFacade.dispatchLogoutRequest())

    this.actions$
      .pipe(ofType(PasswordUpdateResponse), takeUntil(this.unsubscribe$))
      .subscribe(({ response }) => this.handlePasswordUpdateResponse(response))

    this.actions$
      .pipe(ofType(UserUpdateResponse), takeUntil(this.unsubscribe$))
      .subscribe(({ response }) => this.handleUserUpdateResponse(response))
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  handleBasicChange (): void {
    if (this.basicForm.invalid || !this.basicForm.touched) {
      return
    }
  }

  handlePasswordChange (): void {
    if (this.passwordForm.invalid) {
      return
    }
    const { password } = this.passwordForm.value
    this.accountFacade.dispatchUpdatePasswordRequest(password)
  }

  handleAccountDeletion (): void {
    this.dialogService
      .openConfirmDialog(
        this.translate('settingsComponent.accountDeletion.header'),
        this.translate('settingsComponent.accountDeletion.content')
      )
      .afterClosed()
      .pipe(
        take(1),
        filter(response => !!response?.accepted)
      )
      .subscribe(() =>
        this.sharedFacade.dispatchDeleteUserRequest(this.user.id)
      )
  }

  private translateSubscription (): Subscription {
    return this.translateService
      .get(`shared.${this.user.role}`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(role => this.basicForm.patchValue({ role }))
  }

  // Modals
  private handlePasswordUpdateResponse (response: boolean): void {
    const header = response
      ? 'settingsComponent.passwordUpdateSuccessfuly.header'
      : 'settingsComponent.passwordNotUpdated.header'
    const content = response
      ? 'settingsComponent.passwordUpdateSuccessfuly.content'
      : 'shared.somethingWentWrong'
    this.dialogService
      .openSimpleDialog(this.translate(header), this.translate(content))
      .afterClosed()
    this.passwordForm.reset()
  }

  private handleUserUpdateResponse (response: boolean): void {
    const header = response
      ? 'settingsComponent.dataUpdateSuccessfuly.header'
      : 'settingsComponent.dataUpdateFailed.header'
    const content = response
      ? 'settingsComponent.dataUpdateSuccessfuly.content'
      : 'shared.somethingWentWrong'
    this.dialogService
      .openSimpleDialog(this.translate(header), this.translate(content))
      .afterClosed()
    if (!response) {
      this.basicForm.patchValue({
        fullName: this.user.fullName,
        email: this.user.email
      })
    }
    this.basicForm.markAsUntouched()
  }
}
