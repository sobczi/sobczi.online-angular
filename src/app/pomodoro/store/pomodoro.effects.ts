import { Injectable } from '@angular/core'
import { Actions } from '@ngrx/effects'

import { PomodoroService } from '@pomodoro/services'

@Injectable()
export class PomodoroEffects {
  constructor (
    private readonly actions$: Actions,
    private readonly service: PomodoroService
  ) {}
}
