import { createFeatureSelector } from '@ngrx/store'
import { SharedStore, SharedStoreKey } from './types'

export const selectSharedFeature = createFeatureSelector<SharedStore>(
  SharedStoreKey
)
