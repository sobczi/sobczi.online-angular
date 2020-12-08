import { Base, Subject, Payment, Item } from './'

export type Invoice = {
  base: Base
  seller: Subject
  buyer: Subject
  items: Item[]
  payment: Payment
}

export type InvoiceBE = Invoice & {
  id: string
  userId: string
  inserted: number
  lastModified: number
}
