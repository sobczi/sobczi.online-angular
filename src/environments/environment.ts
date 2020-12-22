// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  login: '/api/account/login',
  generateAccessToken: (userId: string) => `/api/account/token/${userId}`,
  refreshToken: (userId: string) => `/api/account/refresh-token/${userId}`,
  createInvoice: (userId: string) => `/api/invoice/user/${userId}`,
  editInvoice: (userId: string, invoiceId: string) =>
    `/api/invoice/user/${userId}/invoice/${invoiceId}`,
  getInvoices: (userId: string) => `/api/invoice/user/${userId}`,
  getInvoicePdf: (
    language: string,
    userId: string,
    accessToken: string,
    invoiceId: string
  ) =>
    `/api/invoice/${language}/user/${userId}/accessToken/${accessToken}/invoice/${invoiceId}`,
  getInvoicesPdfs: (
    language: string,
    userId: string,
    accessToken: string,
    query: string
  ) =>
    `/api/invoice/${language}/user/${userId}/accessToken/${accessToken}/invoices?ids=${query}`,
  deleteInvoice: (invoiceId: string) => `/api/invoice/invoice/${invoiceId}`,
  changeRole: (userId: string) => `/api/account/change-role/${userId}`,
  changeActive: (userId: string) => `/api/account/change-active/${userId}`,
  deleteUser: (userId: string) => `/api/account/delete-account/${userId}`,
  updateUser: (userId: string) => `/api/account/update/${userId}`,
  resetPassword: (resetKey: string) =>
    `/api/account/reset-password/${resetKey}`,
  checkUsernameAndEmail: `/api/account/check-username-and-email`,
  sendResetPassword: `/api/account/send-reset-password`,
  changePassword: (userId: string) => `/api/account/change-password/${userId}`,
  registerUser: '/api/account/create-user',
  getUsers: '/api/account/users'
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
