const axios = require('axios')
const axiosRetry = require('retry-axios')

module.exports = {
  securedAxiosInstance (url, fLogout, timeout, headers, responseType) {
    const securedInstance = axios.create({
      baseURL: url,
      withCredentials: true,
      timeout: timeout,
      headers: headers,
      responseType: responseType
    })

    securedInstance.interceptors.request.use(config => {
      const method = config.method.toUpperCase()
      if (method !== 'OPTIONS') {
        config.headers = {
          ...config.headers,
          'x-access-token': localStorage.csrf
        }
      }
      return config
    })
    securedInstance.interceptors.response.use(null, error => {
      if ((error.response && error.response.status === 401) || (error.response && error.response.status === 403)) {
        fLogout()
        return Promise.reject(error)
      } else {
        return Promise.reject(error)
      }
    })
    securedInstance.defaults.raxConfig = {
      instance: securedInstance,
      httpMethodsToRetry: ['GET'],
      statusCodesToRetry: [[100, 199], [429, 429], [500, 599]],
      onRetryAttempt: err => {
        console.log(`Retry attempt: ${err}`)
      }
    }
    axiosRetry.attach(securedInstance)
    return securedInstance
  },
  plainAxiosInstance (url) {
    return axios.create({
      baseURL: url,
      withCredentials: false,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
