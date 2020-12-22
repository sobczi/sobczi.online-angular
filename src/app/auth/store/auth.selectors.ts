import { createFeatureSelector, createSelector } from '@ngrx/store'

import { AuthStore, AuthStoreKey } from './types'

export const selectAuthFeature = createFeatureSelector<AuthStore>(AuthStoreKey)

export const selectUser = createSelector(selectAuthFeature, state => state.user)
export const selectToken = createSelector(
  selectAuthFeature,
  state => state.token
)
