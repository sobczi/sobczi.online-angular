import { Action, createReducer } from '@ngrx/store'

import { GuestStore } from './types'

const initialState: GuestStore = {}

const guestReducer = createReducer(initialState)

export function GuestReducer (state: GuestStore, action: Action): GuestStore {
  return guestReducer(state, action)
}
