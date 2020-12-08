import { Units, GTUCodes, VATRates } from '@invoices/models'

export type Item = {
  name: string
  unit: Units
  quantity: number
  netto: number
  vatPercentage: VATRates
  vat: number
  brutto: number
  gtuCode?: GTUCodes
}
