export const environment = {
  production: true,
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
  checkUsernameAndEmail: `/api/account/check-username-and-email`,
  changeRole: (userId: string) => `/api/account/change-role/${userId}`,
  changeActive: (userId: string) => `/api/account/change-active/${userId}`,
  deleteUser: (userId: string) => `/api/account/delete-account/${userId}`,
  updateUser: (userId: string) => `/api/account/update/${userId}`,
  resetPassword: (resetKey: string) =>
    `/api/account/reset-password/${resetKey}`,
  changePassword: (userId: string) => `/api/account/change-password/${userId}`,
  sendResetPassword: `/api/account/send-reset-password`,
  createUser: '/api/account/create-user',
  getUsers: '/api/account/users'
}
