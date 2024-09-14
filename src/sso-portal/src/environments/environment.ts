export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:60341/v1',
  authorization: {
    endpoint: 'http://localhost:60341/v1/auth/login'
  },
  defaultApplication: 'd5069819-1256-4aef-9341-2628237c8ee6',
  googleAnalyticsID: 'G-*******',
  qa: {
    apiBaseUrl: null,
    authorization: {
      endpoint: null
    },
    googleAnalyticsID: null
  },
  sb: {
    apiBaseUrl: null,
    authorization: {
      endpoint: null
    },
    googleAnalyticsID: null
  }
};
