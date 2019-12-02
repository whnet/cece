import getList from '../api/api'

const install = function (Vue) {
  if (install.installed) return
  install.installed = true

  Object.defineProperties(Vue.prototype, {
    $api: {
      get () {
        return getList
      }
    }
  })
}

export default {
  install
}
