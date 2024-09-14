export const environment = {
  production: true,
  apiBaseUrl: 'https://api-prod.benraz.com/authorization-server/v1',
  authorization: {
    endpoint: 'https://api-prod.benraz.com/authorization-server/v1/auth/login'
  },
  defaultApplication: null,
  googleAnalyticsID: 'G-888888',
  qa: {
    apiBaseUrl: 'https://qa.benraz.com/authorization-server/v1',
    authorization: {
      endpoint: 'https://qa.benraz.com/authorization-server/v1/auth/login'
    },
    googleAnalyticsID: null
  },
  sb: {
    apiBaseUrl: 'https://api-sb.benraz.com/authorization-server/v1',
    authorization: {
      endpoint: 'https://api-sb.benraz.com/authorization-server/v1/auth/login'
    },
    googleAnalyticsID: 'G-6GYLSZSYRH'
  }
};

//default is the prod, if url environment is empty or null use default