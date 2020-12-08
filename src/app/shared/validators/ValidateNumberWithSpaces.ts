import { FormControl, ValidationErrors } from '@angular/forms'

export function validateNumberWithSpaces (
  control: FormControl
): ValidationErrors | null {
  const value = `${control.value}`
  if (value && !Number(value.replace(/\s/g, ''))) {
    return { invalidNumber: true }
  }
}
