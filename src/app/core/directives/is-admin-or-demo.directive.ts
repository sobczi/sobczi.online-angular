import {
  Directive,
  OnDestroy,
  TemplateRef,
  ViewContainerRef
} from '@angular/core'
import { Store } from '@ngrx/store'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import { AppState } from '@store/types'
import { AccountRoles } from '@shared/models'
import { AuthFacade } from '@shared/facades'

@Directive({
  selector: '[appIsAdminOrDemo]'
})
export class IsAdminOrDemoDirective implements OnDestroy {
  private lastLogged: boolean
  private readonly unsubscribe$ = new Subject<void>()
  private readonly adminOrDemo: AccountRoles[] = [
    AccountRoles.Admin,
    AccountRoles.DemoUser
  ]
  constructor (
    templateRef: TemplateRef<any>,
    viewContainer: ViewContainerRef,
    authFacade: AuthFacade
  ) {
    authFacade.user$.pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      if (user && this.adminOrDemo.includes(user.role) && !this.lastLogged) {
        viewContainer.createEmbeddedView(templateRef)
      } else if (!user) {
        viewContainer.clear()
      }
      this.lastLogged = !!user
    })
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
