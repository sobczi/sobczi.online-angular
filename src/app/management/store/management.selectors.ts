import { createSelector } from '@ngrx/store'

import { AppState } from '@store/types'

const _selectUsers = (state: AppState) => state.management

export const selectUsers = createSelector(_selectUsers, state => state.users)
