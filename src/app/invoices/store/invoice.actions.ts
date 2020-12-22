import { createAction, props } from '@ngrx/store'

import { Invoice, InvoiceBE } from '@invoices/models'

export const CreateInvoiceRequest = createAction(
  '[Invoice Component] Create Invoice Request',
  props<{ invoice: Invoice }>()
)

export const CreateInvoiceResponse = createAction(
  '[Invoice Component] Create Invoice Response',
  props<{ invoice: InvoiceBE }>()
)

export const UpdateInvoiceRequest = createAction(
  '[Invoice Component] Update Invoice Request',
  props<{ invoice: Invoice; invoiceId: string }>()
)

export const UpdateInvoiceResponse = createAction(
  '[Invoice Component] Update Invoice Response',
  props<{ invoice: InvoiceBE }>()
)

export const DeleteInvoiceRequest = createAction(
  '[Invoice Component] Delete Invoice Request',
  props<{ invoiceId: string }>()
)

export const DeleteInvoiceResponse = createAction(
  '[Invoice Component] Delete Invoice Response',
  props<{ invoiceId: string }>()
)

export const GetInvoices = createAction('[Invoice Component] Get Invoices')

export const SetInvoices = createAction(
  '[Invoice Component] Set Invoices',
  props<{ invoices: InvoiceBE[] }>()
)

export const SetCurrentInvoiceId = createAction(
  '[Invoice Component] Set Current Invoice Id',
  props<{ invoiceId: string }>()
)
