import { createFeatureSelector } from '@ngrx/store'
import { PomodoroStore, PomodoroStoreKey } from './types'

export const selectPomodoroFeature = createFeatureSelector<PomodoroStore>(
  PomodoroStoreKey
)
