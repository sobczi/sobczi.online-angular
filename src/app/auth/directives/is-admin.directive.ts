import {
  Directive,
  OnDestroy,
  TemplateRef,
  ViewContainerRef
} from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import { AccountRoles } from '@shared/models'
import { AuthFacade } from '@auth/facades'

@Directive({
  selector: '[appIsAdmin]'
})
export class IsAdminDirective implements OnDestroy {
  private lastLogged: boolean
  private readonly unsubscribe$ = new Subject<void>()
  constructor (
    templateRef: TemplateRef<any>,
    viewContainer: ViewContainerRef,
    authFacade: AuthFacade
  ) {
    authFacade.user$.pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      console.log(user.role)
      if (user && AccountRoles.Admin === user.role && !this.lastLogged) {
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
