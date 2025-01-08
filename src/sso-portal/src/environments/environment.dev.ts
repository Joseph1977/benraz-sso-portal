export const environment = {
  production: false,
  apiBaseUrl: 'https://dev.benraz.com/authorization-server/v1',
  authorization: {
    endpoint: 'https://dev.benraz.com/authorization-server/v1/auth/login'
  },
  defaultApplication: null,
  googleAnalyticsID: null,
  sendConfirmationEmail: false,
  qa: {
    apiBaseUrl: null,
    authorization: {
      endpoint: null
    },
    googleAnalyticsID: null,
    sendConfirmationEmail: false,
  },
  sb: {
    apiBaseUrl: null,
    authorization: {
      endpoint: null
    },
    googleAnalyticsID: null,
    sendConfirmationEmail: false,
  }
};
