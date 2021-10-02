import Vue from 'vue'
import App from './App'
import router from './router'

import VueAxios from 'vue-axios'
import SaturnUser from '@/plugins/saturn-user'
import Vuetify from 'vuetify/lib/framework'
import Vuelidate from 'vuelidate'
import '@/mixins/helpers'

const AxiosServices = require('./services/axios')

let securedAxiosInstance = null
let securedAxiosInstanceXLSX = null
let securedAxiosInstanceNoTimeout = null
let plainAxiosInstance = null

Vue.config.productionTip = false

fetch(process.env.BASE_URL + 'config.json')
  .then(response => response.json())
  .then(data => {
    console.log('Starting vue app.')
    Vue.prototype.$config = data
    const opts = {
      theme: {
        themes: {
          light: {
            primary: data.COL_PRIMARY,
            secondary: data.COL_SECONDARY
          }
        }
      }
    }

    Vue.use(Vuelidate)
    Vue.use(SaturnUser)
    Vue.use(Vuetify)

    securedAxiosInstance = AxiosServices.securedAxiosInstance(data.API_URL, Vue.prototype.$userSignout, data.TIMEOUT, {'Content-Type': 'application/json'}, 'json')
    securedAxiosInstanceXLSX = AxiosServices.securedAxiosInstance(data.API_URL, Vue.prototype.$userSignout, data.TIMEOUT, {'Content-Disposition': 'attachment;', 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}, 'arraybuffer')
    securedAxiosInstanceNoTimeout = AxiosServices.securedAxiosInstance(data.API_URL, Vue.prototype.$userSignout, 0)
    plainAxiosInstance = AxiosServices.plainAxiosInstance(data.API_URL)

    Vue.use(VueAxios, {
      secured: securedAxiosInstance,
      securedXLSX: securedAxiosInstanceXLSX,
      securedNoTimeout: securedAxiosInstanceNoTimeout,
      plain: plainAxiosInstance
    })

    /* eslint-disable no-new */
    new Vue({
      router,
      securedAxiosInstance,
      securedAxiosInstanceNoTimeout,
      plainAxiosInstance,
      data: { state: {} },
      vuetify: new Vuetify(opts),
      render: h => h(App)
    }).$mount('#app')
  })
  .catch(err => console.log(err))
