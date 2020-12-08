import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms'

export const PasswordsMustEqual: ValidatorFn = (
  controls: FormGroup
): ValidationErrors | null => {
  const newPassword = controls.get('password')
  const confirmPassword = controls.get('repeatPassword')
  const areFilled =
    !newPassword.hasError('required') && !confirmPassword.hasError('required')

  if (!areFilled || newPassword.value === confirmPassword.value) {
    return null
  }
  return { passwordsNotEqual: true }
}
