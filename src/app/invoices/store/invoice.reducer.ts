import { Action, createReducer, on } from '@ngrx/store'

import { InvoiceStore } from './types'
import * as InvoiceActions from './invoice.actions'

const initialState: InvoiceStore = {
  invoices: undefined,
  currentInvoiceId: undefined
}

const invoicesReducer = createReducer(
  initialState,
  on(InvoiceActions.SetInvoices, (state, { invoices }) => ({
    ...state,
    invoices
  })),
  on(InvoiceActions.DeleteInvoiceResponse, (state, { invoiceId }) => ({
    ...state,
    invoices: state.invoices?.filter(({ id }) => id !== invoiceId)
  })),
  on(InvoiceActions.SetCurrentInvoiceId, (state, { invoiceId }) => ({
    ...state,
    currentInvoiceId: invoiceId
  })),
  on(InvoiceActions.UpdateInvoiceResponse, (state, { invoice }) => ({
    ...state,
    invoices: [
      ...state.invoices?.filter(({ id }) => id !== invoice.id),
      invoice
    ]
  })),
  on(InvoiceActions.CreateInvoiceResponse, (state, { invoice }) => ({
    ...state,
    invoices: state.invoices ? [...state.invoices, invoice] : [invoice]
  }))
)

export function InvoicesReducer (
  state: InvoiceStore,
  action: Action
): InvoiceStore {
  return invoicesReducer(state, action)
}
