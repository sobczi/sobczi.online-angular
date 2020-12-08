import { Action, createReducer, on, State } from '@ngrx/store'

import { ManagementStore } from '@management/store'
import * as ManagementActions from './management.actions'

const initialState: ManagementStore = {
  users: undefined
}

const _managementReducer = createReducer(
  initialState,
  on(ManagementActions.setUsers, (state, { users }) => ({
    ...state,
    users
  })),
  on(ManagementActions.deleteUser, (state, { userId }) => ({
    ...state,
    users: state.users.filter(u => u.id !== userId)
  })),
  on(ManagementActions.updateUser, (state, { user }) => ({
    ...state,
    users: [...state.users.filter(u => u.id !== user.id), user]
  }))
)

export function managementReducer (
  state: State<ManagementStore>,
  action: Action
): {} {
  return _managementReducer(state as any, action)
}
