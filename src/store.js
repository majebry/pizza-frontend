import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(Vuex);
Vue.use(VueAxios, axios)

Vue.axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;

const store = new Vuex.Store({
  state: {
    pizzas: []
  },

  mutations: {
    SET_PIZZAS(state, pizzas) {
      state.pizzas = pizzas
    }
  },

  actions: {
    async onLoadPizzas({commit}, params) {
      await Vue.axios.get('pizzas', { params })
        .then(response => {
          commit('SET_PIZZAS', response.data)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
});

export default store;
