import { Injectable, OnDestroy } from '@angular/core'
import { Store } from '@ngrx/store'
import { Subject } from 'rxjs'

import { AppState } from '@store/types'

@Injectable()
export class PomodoroFacade implements OnDestroy {
  private readonly unsubscribe$ = new Subject<void>()
  constructor (private readonly store: Store<AppState>) {}

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
