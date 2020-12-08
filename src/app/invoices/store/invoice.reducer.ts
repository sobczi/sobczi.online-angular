import { Action, createReducer, on, State } from '@ngrx/store'

import { InvoiceStore } from './types'
import * as InvoiceActions from './invoice.actions'

const initialState: InvoiceStore = {
  invoices: undefined,
  currentInvoiceId: undefined
}

const _invoiceReducer = createReducer(
  initialState,
  on(InvoiceActions.setInvoices, (state, { invoices }) => ({
    ...state,
    invoices
  })),
  on(InvoiceActions.deleteInvoice, (state, { invoiceId }) => ({
    ...state,
    invoices: state.invoices?.filter(({ id }) => id !== invoiceId)
  })),
  on(InvoiceActions.currentInvoiceId, (state, { invoiceId }) => ({
    ...state,
    currentInvoiceId: invoiceId
  })),
  on(InvoiceActions.updateInvoice, (state, { invoice }) => ({
    ...state,
    invoices: [
      ...state.invoices?.filter(({ id }) => id !== invoice.id),
      invoice
    ]
  })),
  on(InvoiceActions.createInvoice, (state, { invoice }) => ({
    ...state,
    invoices: state.invoices ? [...state.invoices, invoice] : [invoice]
  }))
)

export function invoiceReducer (
  state: State<InvoiceStore>,
  action: Action
): {} {
  return _invoiceReducer(state as any, action)
}
