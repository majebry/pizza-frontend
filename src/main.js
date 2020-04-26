import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import store from './store.js'
import { BootstrapVue } from 'bootstrap-vue'

Vue.config.productionTip = false

Vue.use(BootstrapVue)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
