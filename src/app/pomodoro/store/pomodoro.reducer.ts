import { Action, createReducer } from '@ngrx/store'

import { PomodoroStore } from './types'

const initialState: PomodoroStore = {}

const pomodoroReducer = createReducer(initialState)

export function PomodoroReducer (
  state: PomodoroStore,
  action: Action
): PomodoroStore {
  return pomodoroReducer(state, action)
}
