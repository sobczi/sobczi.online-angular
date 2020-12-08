import { Component, OnDestroy } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { filter, take, takeUntil } from 'rxjs/operators'
import { ReplaySubject, Subscription } from 'rxjs'

import { DialogService } from '@shared/services'
import {
  EmailPattern,
  PasswordsMustEqual,
  CrossFieldErrorMatcher,
  PasswordPattern
} from '@shared/validators'
import { AuthFacade, SharedFacade } from '@shared/facades'
import { User } from '@shared/models'
import { AccountFacade } from '@account/facades'

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
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  handleBasicChange (): void {
    const { fullName, email } = this.basicForm.value
    const userId = this.user.id
    this.sharedFacade
      .checkEmailOccupation(email, userId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(occupation => {
        if (occupation) {
          this.dialogService.openSimpleDialog(
            this.translate('settingsComponent.updateDataFailed'),
            this.translate('shared.emailOccupied')
          )
          return
        }
        this.accountFacade
          .updateUser({ userId, fullName, email })
          .pipe(
            takeUntil(this.unsubscribe$),
            filter(response => !!response)
          )
          .subscribe(() => {
            this.dialogService
              .openSimpleDialog(
                this.translate(
                  'settingsComponent.dataUpdateSuccessfuly.header'
                ),
                this.translate(
                  'settingsComponent.dataUpdateSuccessfuly.content'
                )
              )
              .afterClosed()
            this.basicForm.markAsUntouched()
          })
      })
  }

  handlePasswordChange (): void {
    const userId = this.user.id
    const { password } = this.passwordForm.value
    this.accountFacade
      .changePassword(userId, password)
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(response => !!response)
      )
      .subscribe(() => {
        this.dialogService.openSimpleDialog(
          this.translate('settingsComponent.passwordUpdateSuccessfuly.header'),
          this.translate('settingsComponent.passwordUpdateSuccessfuly.content')
        )
        this.passwordForm.reset()
      })
  }

  handleAccountDeletion (): void {
    const userId = this.user.id
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
        this.sharedFacade
          .deleteUser(userId)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe()
      )
  }

  private translateSubscription (): Subscription {
    return this.translateService
      .get(`shared.${this.user.role}`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(role => this.basicForm.patchValue({ role }))
  }
}
