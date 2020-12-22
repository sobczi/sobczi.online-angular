import { InvoiceStore } from '@invoices/store'
import { ManagementStore } from '@management/store'
import { AuthStore } from '@auth/store'

export type AppState = {
  invoices: InvoiceStore
  management: ManagementStore
  auth: AuthStore
}
