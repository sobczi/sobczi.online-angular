import { createFeatureSelector } from '@ngrx/store'

import { AccountStore, AccountStoreKey } from './types'

export const selectAccountFeature = createFeatureSelector<AccountStore>(
  AccountStoreKey
)
