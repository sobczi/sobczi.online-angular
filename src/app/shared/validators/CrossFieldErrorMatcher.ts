import { FormControl, FormGroupDirective, NgForm } from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core'

export class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState (
    control: FormControl,
    form: FormGroupDirective | NgForm
  ): boolean {
    return (
      (control.dirty || control.touched) &&
      form.invalid &&
      !!(form.errors || control.errors)
    )
  }
}
