import { GTUCodes, Item, Units, VATRates } from '@invoices/models'

export const MOCKED_ITEMS: Item[] = [
  {
    name: 'Mouse',
    unit: Units.piece,
    quantity: 1,
    netto: 10,
    vatPercentage: VATRates.TwentyThree,
    vat: 2.3,
    brutto: 12.3,
    gtuCode: GTUCodes.GTU_12
  },
  {
    name: 'Keyboard',
    unit: Units.piece,
    quantity: 2,
    netto: 30,
    vatPercentage: VATRates.TwentyThree,
    vat: 13.8,
    brutto: 73.8,
    gtuCode: GTUCodes.GTU_12
  },
  {
    name: 'Notebook',
    unit: Units.piece,
    quantity: 5,
    netto: 80,
    vatPercentage: VATRates.TwentyThree,
    vat: 92,
    brutto: 492,
    gtuCode: GTUCodes.GTU_12
  },
  {
    name: 'Office rental',
    unit: Units.month,
    quantity: 13,
    netto: 210,
    vatPercentage: VATRates.Exempt,
    vat: 627.9,
    brutto: 3357.9,
    gtuCode: GTUCodes.GTU_12
  }
]
