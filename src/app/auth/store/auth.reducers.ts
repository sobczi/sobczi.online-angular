import { Action, createReducer, on } from '@ngrx/store'

import { AuthStore } from '@auth/store/types'
import * as AuthActions from '@auth/store/auth.actions'
import * as SharedActions from '@shared/store/shared.actions'
import * as AccountActions from '@account/store/account.actions'
import * as GuestActions from '@guest/store/guest.actions'

const initialState: AuthStore = {
  user: undefined,
  token: undefined
}

const _authReducer = createReducer(
  initialState,
  on(GuestActions.LoginResponseSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token
  })),
  on(AuthActions.LoadSessionRequest, (state, { user, token }) => ({
    ...state,
    user,
    token
  })),
  on(AuthActions.LogoutRequest, () => ({
    user: undefined,
    token: undefined
  })),
  on(AuthActions.RefreshTokenResponseSuccess, (state, { token }) => ({
    ...state,
    token
  })),
  on(
    AccountActions.UserUpdateResponse,
    (state, { args: { email, fullName } }) => ({
      ...state,
      user: { ...state.user, email, fullName }
    })
  ),
  on(SharedActions.DeleteUserResponse, (state, { response, userId }) =>
    state.user.id === userId && response
      ? {
          user: undefined,
          token: undefined
        }
      : state
  )
)

export function AuthReducer (state: AuthStore, action: Action): AuthStore {
  return _authReducer(state, action)
}
