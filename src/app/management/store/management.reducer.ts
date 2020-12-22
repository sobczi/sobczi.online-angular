import { Action, createReducer, on } from '@ngrx/store'

import { ManagementStore } from '@management/store'
import * as AccountActions from '@account/store/account.actions'
import * as SharedActions from '@shared/store'
import * as ManagementActions from './management.actions'

const initialState: ManagementStore = {
  users: undefined
}

const _managementReducer = createReducer(
  initialState,
  on(ManagementActions.SetUsers, (state, { users }) => ({
    ...state,
    users
  })),
  on(SharedActions.DeleteUserResponse, (state, { userId }) => ({
    ...state,
    users: state.users.filter(u => u.id !== userId)
  })),
  on(AccountActions.UserUpdateResponse, (state, { args }) => {
    const idx = state.users?.findIndex(u => u.id === args.userId)
    if (!state.users || idx === -1) {
      return state
    }

    const updatedUser = { ...state.users[idx], ...args }
    const users = state.users.filter(u => u.id !== args.userId)
    users.splice(idx, 0, updatedUser)

    return {
      ...state,
      users
    }
  })
)

export function ManagementReducer (
  state: ManagementStore,
  action: Action
): ManagementStore {
  return _managementReducer(state, action)
}
