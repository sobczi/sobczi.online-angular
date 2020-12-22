import { Component, OnDestroy } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { filter, takeUntil, tap } from 'rxjs/operators'
import { Observable, ReplaySubject } from 'rxjs'

import { ManagementFacade } from '@management/facades'
import { DialogService } from '@shared/services'
import { AccountRoles, User } from '@shared/models'
import { SharedFacade } from '@shared/facades'
import { AuthFacade } from '@auth/facades'

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnDestroy {
  readonly users$: Observable<User[]>
  readonly privilages = Object.values(AccountRoles)

  private readonly unsubscribe$ = new ReplaySubject<void>()

  get userId (): string {
    return this.authFacade.user.id
  }

  constructor (
    private readonly dialogService: DialogService,
    private readonly translateService: TranslateService,
    private readonly facade: ManagementFacade,
    private readonly authFacade: AuthFacade,
    private readonly sharedFacade: SharedFacade
  ) {
    this.users$ = this.facade.users$.pipe(
      takeUntil(this.unsubscribe$),
      tap(r => (!r ? this.facade.dispatchGetUsers() : undefined)),
      filter(r => !!r)
    )
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  handleRoleChange (user: User, $event: AccountRoles): void {
    this.facade.dispatchUpdateUserRole(user.id, $event)
  }

  handleActiveChange (user: User): void {
    this.facade.dispatchUpdateUserActive(user.id, !user.active)
  }

  handleDelete (user: User): void {
    if (user.id === this.userId) {
      return
    }

    this.dialogService
      .openConfirmDialog(
        this.translateService.instant('manageComponent.deleteUser.header'),
        this.translateService.instant('manageComponent.deleteUser.content')
      )
      .afterClosed()
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(response => !!response?.accepted)
      )
      .subscribe(() => this.sharedFacade.dispatchDeleteUserRequest(user.id))
  }
}
