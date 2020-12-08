import { Injectable } from '@angular/core'
import { NativeDateAdapter } from '@angular/material/core'

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' }
  },
  display: {
    dateInput: 'input',
    monthYearLabel: 'monthHeader',
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
}

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  parse (value: any): Date | null {
    const [day, month, year] = value.split('/')
    if (month > 12) {
      return null
    }
    const date = new Date(Number(year), Number(month) - 1, Number(day))

    const maxDay = new Date(Number(year), Number(month), Number(0)).getDate()
    if (day > maxDay) {
      return null
    }

    return date
  }

  // tslint:disable-next-line: ban-types
  format (date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return date.toLocaleDateString('pl-PL')
    } else if (displayFormat === 'monthHeader') {
      const year = date.getFullYear()
      const month = date.toLocaleString('pl-PL', { month: 'short' })
      return `${month} ${year}`
    }
    return date.toDateString()
  }

  getFirstDayOfWeek (): number {
    return 1
  }
}
