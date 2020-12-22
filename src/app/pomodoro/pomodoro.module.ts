import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'

import { PomodoroRoutingModule } from '@pomodoro/pomodoro-routing.module'
import { PomodoroComponent } from '@pomodoro/views'
import { SharedModule } from '@shared/shared.module'

import {
  PomodoroEffects,
  PomodoroReducer,
  PomodoroStoreKey
} from '@pomodoro/store'
import { PomodoroService } from '@pomodoro/services'
import { PomodoroFacade } from '@pomodoro/facades'

@NgModule({
  declarations: [PomodoroComponent],
  imports: [
    CommonModule,
    PomodoroRoutingModule,
    SharedModule,
    EffectsModule.forFeature([PomodoroEffects]),
    StoreModule.forFeature(PomodoroStoreKey, PomodoroReducer)
  ],
  providers: [PomodoroService, PomodoroFacade]
})
export class PomodoroModule {}
