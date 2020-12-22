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
  selector: '[appIsLogged]'
})
export class IsLoggedDirective implements OnDestroy {
  private lastLogged: boolean
  private readonly unsubscribe$ = new Subject<void>()
  constructor (
    templateRef: TemplateRef<any>,
    viewContainer: ViewContainerRef,
    authFacade: AuthFacade
  ) {
    authFacade.user$.pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      if (user && !this.lastLogged) {
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
