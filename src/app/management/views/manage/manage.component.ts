import { Component, OnDestroy } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { filter, take, takeUntil, tap } from 'rxjs/operators'
import { ReplaySubject } from 'rxjs'

import { ManagementFacade } from '@management/facades'
import { MOCKED_USERS } from '@management/mock/MOCKED_USERS'
import { DialogService } from '@shared/services'
import { AccountRoles, User } from '@shared/models'
import { AuthFacade, SharedFacade } from '@shared/facades'

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnDestroy {
  users: User[] = []

  readonly privilages: AccountRoles[] = Object.values(AccountRoles)

  private readonly unsubscribe$ = new ReplaySubject<void>()
  private readonly translate: (
    value: string
  ) => string = this.translateService.instant.bind(this.translateService)
  private readonly haveAccess =
    this.authFacade.user?.role === AccountRoles.Admin
  private readonly mockedUsers: User[] = MOCKED_USERS

  constructor (
    private readonly dialogService: DialogService,
    private readonly translateService: TranslateService,
    private readonly facade: ManagementFacade,
    private readonly authFacade: AuthFacade,
    private readonly sharedFacade: SharedFacade
  ) {
    if (!this.haveAccess) {
      this.users = this.mockedUsers
      return
    }
    this.facade
      .users()
      .pipe(
        takeUntil(this.unsubscribe$),
        tap(users =>
          !users ? this.facade.fetchUsers().subscribe() : undefined
        ),
        filter(users => !!users)
      )
      .subscribe(users => (this.users = users))
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  handleRoleChange (user: User, $event: AccountRoles): void {
    if (!this.haveAccess) {
      return
    }

    this.facade
      .updateUserRole(user, $event)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe()
  }

  handleActiveChange (user: User): void {
    if (!this.haveAccess) {
      return
    }

    this.facade
      .updateUserActive(user, !user.active)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe()
  }

  handleDelete (user: User): void {
    this.dialogService
      .openConfirmDialog(
        this.translate('manageComponent.deleteUser.header'),
        this.translate('manageComponent.deleteUser.content')
      )
      .afterClosed()
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(response => !!response?.accepted)
      )
      .subscribe(() =>
        this.sharedFacade
          .deleteUser(user.id)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(() => this.facade.dispatchDeleteUser(user.id))
      )
  }
}
