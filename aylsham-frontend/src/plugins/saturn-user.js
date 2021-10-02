let user = null

export default {
  install (Vue, options) {
    if (localStorage.user) {
      user = JSON.parse(localStorage.user)
    }
    Vue.prototype.$userSignin = (email, password) => {
      return Vue.prototype.$http.plain.post('/api/v1/signin', { email: email, password: password })
        .then(response => {
          if (!response.data.csrf) {
            delete localStorage.csrf
            delete localStorage.user
            throw new Error('Login failed')
          }
          localStorage.csrf = response.data.csrf
          return Vue.prototype.$http.secured.get('/api/v1/current-user/')
        })
        .then(response => {
          user = response.data
          user.permissionsDict = {}
          user.permissions.forEach(p => { user.permissionsDict[p.role_ref] = true })
          localStorage.user = JSON.stringify(user)
          // console.log(Vue.prototype.$socket)
          Vue.prototype.$socket.client.io.opts.extraHeaders.Authorization = `Bearer ${localStorage.csrf}`
          Vue.prototype.$socket.client.open()
          return user
        })
        .catch(error => {
          delete localStorage.csrf
          delete localStorage.user
          throw error
        })
    }
    Vue.prototype.$userSignout = () => {
      delete localStorage.csrf
      delete localStorage.user
      location.replace('/signin')
    }
    Vue.prototype.$userCheckPermission = (roleRef) => {
      if (!user) { return false }
      if (!user.permissionsDict) { return false }
      return (user.permissionsDict[roleRef])
    }
    Vue.prototype.$user = () => {
      return user
    }
  }
}
