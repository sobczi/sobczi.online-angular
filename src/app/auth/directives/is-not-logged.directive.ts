import {
  Directive,
  OnDestroy,
  TemplateRef,
  ViewContainerRef
} from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import { AuthFacade } from '@auth/facades'

@Directive({
  selector: '[appIsNotLogged]'
})
export class IsNotLoggedDirective implements OnDestroy {
  private lastLogged = true
  private readonly unsubscribe$ = new Subject<void>()
  constructor (
    authFacade: AuthFacade,
    templateRef: TemplateRef<any>,
    viewContainer: ViewContainerRef
  ) {
    authFacade.user$.pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      if (!user && this.lastLogged) {
        viewContainer.createEmbeddedView(templateRef)
      } else if (user) {
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
