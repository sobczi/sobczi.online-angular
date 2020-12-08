import { Component } from '@angular/core'
import { SwPush } from '@angular/service-worker'

import { Observable, Subscription, timer } from 'rxjs'

type CardTypes = 'TIMER' | 'HISTORY'

/**
 * IN PROGRESS
 */
@Component({
  selector: 'app-pomodoro',
  templateUrl: './pomodoro.component.html',
  styleUrls: ['./pomodoro.component.scss']
})
export class PomodoroComponent {
  currentActive: CardTypes = 'TIMER'
  readonly PERIOD = 1 * 10 // 25 * 60

  currentTime = this.PERIOD
  private timerSubscription: Subscription

  private readonly maxTime = this.PERIOD
  private readonly timer: Observable<number> = timer(0, 1000)

  get minutes (): string {
    return this.addZeroIfMissing(Math.floor(this.currentTime / 60))
  }

  get seconds (): string {
    return this.addZeroIfMissing(this.currentTime % 60)
  }

  get percentage (): number {
    return 100 - (this.currentTime / this.maxTime) * 100
  }

  get currentlyRunning (): boolean {
    return !!this.timerSubscription
  }

  constructor (private readonly pwa: SwPush) {}

  handleSubmit (): void {
    if (this.timerSubscription) {
      this.destroyTimer()
      return
    }

    this.timerSubscription = this.timer.subscribe(() => {
      this.currentTime -= 1
      if (this.currentTime === 0) {
        this.destroyTimer(true)
      }
    })
  }

  handleReset (): void {
    this.currentTime = this.PERIOD
  }

  private destroyTimer (resetCounter?: boolean): void {
    this.timerSubscription.unsubscribe()
    delete this.timerSubscription

    if (resetCounter) {
      this.currentTime = this.maxTime
    }
  }

  private addZeroIfMissing (value: number): string {
    return value < 10 ? `0${value}` : `${value}`
  }
}
