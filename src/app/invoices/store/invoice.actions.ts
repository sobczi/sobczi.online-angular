import { createAction, props } from '@ngrx/store'

import { InvoiceBE } from '@invoices/models'

export const setInvoices = createAction(
  '[Invoice Component] Set',
  props<{ invoices: InvoiceBE[] }>()
)

export const deleteInvoice = createAction(
  '[Invoice Component] Delete',
  props<{ invoiceId: string }>()
)

export const createInvoice = createAction(
  '[Invoice Component] Add',
  props<{ invoice: InvoiceBE }>()
)

export const updateInvoice = createAction(
  '[Invoice Component] Update',
  props<{ invoice: InvoiceBE }>()
)

export const currentInvoiceId = createAction(
  '[Invoice Component] Edit',
  props<{ invoiceId: string }>()
)
