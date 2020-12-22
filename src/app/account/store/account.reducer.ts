import { Action, createReducer } from '@ngrx/store'

import { AccountStore } from './types'

const initialState: AccountStore = {}

const _accountReducer = createReducer(initialState)

export function AccountReducer (
  state: AccountStore,
  action: Action
): AccountStore {
  return _accountReducer(state, action)
}
