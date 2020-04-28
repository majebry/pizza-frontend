import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(Vuex);
Vue.use(VueAxios, axios)

Vue.axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;

const store = new Vuex.Store({
  state: {
    pizzas: {
      data: []
    },
    cart: [],
    currency: 'euro'
  },

  mutations: {
    SET_PIZZAS(state, pizzas) {
      state.pizzas = pizzas
    },

    INIT_CART(state, pizzas) {
      pizzas.forEach(pizza => {
        const cartItem = state.cart.find(cartItem => cartItem.pizzaId === pizza.id)

        if (cartItem === undefined) {
          state.cart.push({
            pizzaId: pizza.id, 
            quantity: 0
          })
        }
      })
    },
    
    SYNC_CART_FROM_STORAGE(state) {
      const storedCart = localStorage.getItem('cart')

      if (storedCart !== null) {
        JSON.parse(storedCart).forEach(storedCartItem => {
          const stateCartItem = state.cart.find(cartItem => cartItem.pizzaId === storedCartItem.pizzaId)

          if (stateCartItem !== undefined) {
            const stateCartItemIndex = state.cart.indexOf(stateCartItem)
            state.cart[stateCartItemIndex].quantity = storedCartItem.quantity
          }
        })
      }
    },

    SYNC_STORAGE_FROM_CART(state) {
      localStorage.setItem('cart', JSON.stringify(state.cart))
    },

    UPDATE_IN_CART(state, updatedCartItem) {
      const cartItem = state.cart.find(cartItem => cartItem.pizzaId === updatedCartItem.pizzaId)
      
      if (cartItem !== undefined) {
        cartItem.quantity = parseFloat(updatedCartItem.quantity)
      }
    },

    REMOVE_FROM_CART(state, pizzaId) {
      state.cart.find(cartItem => cartItem.pizzaId === pizzaId).quantity = 0
    },

    SET_CURRENCY(state, newCurrency) {
      state.currency = newCurrency
    }
  },

  actions: {
    async onLoadPizzas({commit}, params) {
      await Vue.axios.get('pizzas', { params })
        .then(response => {
          commit('SET_PIZZAS', response.data)
          commit('INIT_CART', response.data.data)
          commit('SYNC_CART_FROM_STORAGE')
        })
        .catch(error => {
          console.log(error)
        })
    },

    onUpdateInCart({commit}, updatedCartItem) {
      commit('UPDATE_IN_CART', updatedCartItem)
      commit('SYNC_STORAGE_FROM_CART')
    },

    onRemoveFromCart({commit}, pizzaId) {
      commit('REMOVE_FROM_CART', pizzaId)
      commit('SYNC_STORAGE_FROM_CART')
    },

    onChangeCurrency({commit}, newCurrency) {
      commit('SET_CURRENCY', newCurrency)

      let pizzas = this.state.pizzas

      const updatedPizzas = this.state.pizzas.data.map(pizza => {
        if (newCurrency === 'euro') {
          pizza['price'] = pizza.price_in_euro
        }
  
        if (newCurrency === 'usd') {
          pizza.price = pizza.price_in_usd
        }

        return pizza
      })

      pizzas['data'] = updatedPizzas

      commit('SET_PIZZAS', pizzas)
    }
  },

  getters: {
    pizzas: state => {
      return state.pizzas
    },
    
    cart: state => {
      return state.cart
    },
    
    cartItems: state => {
      return state.cart.filter(item => item.quantity > 0)
    },

    cartCount: state => {
      return state.cart.filter(item => item.quantity > 0).length
    },

    currency: state => {
      return state.currency
    },

    currencySign: state => {
      if (state.currency === 'euro') {
        return '€';
      }

      if (state.currency === 'usd') {
        return '$'
      }
    }
  }
});

export default store;
