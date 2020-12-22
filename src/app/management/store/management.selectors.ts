import { createFeatureSelector, createSelector } from '@ngrx/store'

import { ManagementStore, ManagementStoreKey } from './types'

export const selectManagementFeature = createFeatureSelector<ManagementStore>(
  ManagementStoreKey
)

export const SelectUsers = createSelector(
  selectManagementFeature,
  state => state.users
)
