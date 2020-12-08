import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { PomodoroRoutingModule } from '@pomodoro/pomodoro-routing.module'
import { PomodoroComponent } from '@pomodoro/views'
import { SharedModule } from '@shared/shared.module'

@NgModule({
  declarations: [PomodoroComponent],
  imports: [CommonModule, PomodoroRoutingModule, SharedModule]
})
export class PomodoroModule {}
