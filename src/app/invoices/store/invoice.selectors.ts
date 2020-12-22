import { createFeatureSelector, createSelector } from '@ngrx/store'

import { InvoicesStoreKey, InvoiceStore } from './types'

const _selectInvoices = createFeatureSelector<InvoiceStore>(InvoicesStoreKey)

export const selectInvoices = createSelector(
  _selectInvoices,
  state => state.invoices
)

export const selectCurrentInvoice = createSelector(_selectInvoices, state =>
  state.invoices?.find(({ id }) => id === state.currentInvoiceId)
)
