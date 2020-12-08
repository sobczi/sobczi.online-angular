import { createSelector } from '@ngrx/store'

import { AppState } from '@store/types'

const _selectAuth = (state: AppState) => state.auth

export const selectUser = createSelector(_selectAuth, state => state.user)
export const selectToken = createSelector(_selectAuth, state => state.token)
