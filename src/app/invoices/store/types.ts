import { InvoiceBE } from '@invoices/models'

export type InvoiceStore = {
  invoices: InvoiceBE[]
  currentInvoiceId: string
}
