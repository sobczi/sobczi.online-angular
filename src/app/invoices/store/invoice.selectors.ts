import { createSelector } from '@ngrx/store'

import { AppState } from '@store/types'

const _selectInvoices = (state: AppState) => state.invoices

export const selectInvoices = createSelector(
  _selectInvoices,
  state => state.invoices
)

export const selectCurrentInvoiceId = createSelector(
  _selectInvoices,
  state => state.currentInvoiceId
)

export const selectCurrentInvoice = createSelector(_selectInvoices, state =>
  state.invoices?.find(({ id }) => id === state.currentInvoiceId)
)
