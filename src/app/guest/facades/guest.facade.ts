import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'

import { AppState } from '@store/types'
import {
  LoginRequest,
  RegisterUserRequest,
  ResetPasswordRequest,
  SendResetPaswordRequest
} from '@guest/store'

@Injectable()
export class GuestFacade {
  constructor (private readonly store: Store<AppState>) {}

  dispatchSendResetPasswordRequest (email: string): void {
    this.store.dispatch(SendResetPaswordRequest({ email }))
  }

  dispatchLoginRequest (email: string, password: string): void {
    this.store.dispatch(LoginRequest({ email, password }))
  }

  dispatchRegisterUserRequest (email: string, fullName: string): void {
    this.store.dispatch(RegisterUserRequest({ email, fullName }))
  }

  dispatchResetPasswordRequest (resetKey: string, newPassword: string): void {
    this.store.dispatch(ResetPasswordRequest({ resetKey, newPassword }))
  }
}
