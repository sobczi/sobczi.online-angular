import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'

import { AppState } from '@store/types'
import { PasswordUpdateRequest, UserUpdateRequest } from '@account/store'
import { UpdateUserArgs } from '@shared/models'

@Injectable()
export class AccountFacade {
  constructor (private readonly store: Store<AppState>) {}

  dispatchUpdateUserRequest (args: UpdateUserArgs): void {
    this.store.dispatch(UserUpdateRequest({ args }))
  }

  dispatchUpdatePasswordRequest (password: string): void {
    this.store.dispatch(PasswordUpdateRequest({ password }))
  }
}
