import { AccountRoles, User } from '@shared/models'

export const MOCKED_USERS: User[] = [
  {
    id: 'fake_id_1',
    email: 'sylvester@stalone.com',
    active: true,
    inserted: -741312000000,
    fullName: 'Sylvester Stallone',
    role: AccountRoles.Admin,
    lastLogged: -741312000000
  },
  {
    id: 'fake_id_2',
    email: 'steven@segal.com',
    active: false,
    inserted: -559440000000,
    fullName: 'Steven Segal',
    role: AccountRoles.DemoUser,
    lastLogged: -559440000000
  }
]
