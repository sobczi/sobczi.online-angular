import { LoginResponseArgs } from '@guest/models'

export type LoadSessionArgs = LoginResponseArgs & { expiration: number }
