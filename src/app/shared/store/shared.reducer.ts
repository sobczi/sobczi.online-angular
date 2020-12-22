import { Action, createReducer } from '@ngrx/store'

import { SharedStore } from './types'

const initialState: SharedStore = {}

const _sharedReducer = createReducer(initialState)

export function SharedReducer (
  state: SharedStore,
  action: Action
): SharedStore {
  return _sharedReducer(state, action)
}
