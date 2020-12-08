import { Action, createReducer, on, State } from '@ngrx/store'

import { AuthStore } from '@shared/store/types'
import * as AuthActions from '@shared/store/auth.actions'

const initialState: AuthStore = {
  user: undefined,
  token: undefined
}

const _authReducer = createReducer(
  initialState,
  on(AuthActions.userLogin, (state, { auth: { user, token } }) => ({
    ...state,
    user,
    token
  })),
  on(AuthActions.userLogout, () => ({
    user: undefined,
    token: undefined
  })),
  on(AuthActions.userUpdate, (state, { args: { email, fullName } }) => ({
    ...state,
    user: { ...state.user, email, fullName }
  }))
)

export function authRedcuer (state: State<AuthStore>, action: Action): {} {
  return _authReducer(state as any, action)
}
