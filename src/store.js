import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios'
import VueAxios from 'vue-axios'
import Cookies from 'js-cookie';

Vue.use(Vuex);
Vue.use(VueAxios, axios)

Vue.axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;

const store = new Vuex.Store({
  state: {
    pizzas: {
      data: []
    },
    cart: [],
    currency: 'euro',
    orderConfirmed: false,
    thankYouMessage: false,
    deliveryCost: 0
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
    },

    SET_ORDER_CONFIRMED(state, value) {
      state.orderConfirmed = value
    },

    EMPTY_CART(state) {
      state.cart = []
    },

    SHOW_THANK_YOU_MESSAGE(state) {
      state.thankYouMessage = true
    },

    SET_DELIVERY_COST(state, value) {
      state.deliveryCost = value
    },

    LOGIN() {
      Cookies.set('auth', '1')
    },

    LOGOUT() {
      Cookies.remove('auth')
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
        .catch(() => {
          //
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
    },

    async onSubmitCheckout({commit, getters}, form) {
      form['cart_items'] = getters.cartItems
      form['currency'] = getters.currency

      const response = await Vue.axios.post('orders', form)

      if (response.status === 201) {
        commit('SET_ORDER_CONFIRMED', true)
      }
    },

    onCartClear({commit}) {
      commit('EMPTY_CART')
      commit('SYNC_STORAGE_FROM_CART')
      commit('SET_ORDER_CONFIRMED', false)
      commit('SHOW_THANK_YOU_MESSAGE', true)
    },

    async onLoadCart({commit}) {
      await Vue.axios.get('settings')
        .then(response => {
          commit('SET_DELIVERY_COST', response.data.delivery_cost)
        })
        .catch(() => {
          commit('SET_DELIVERY_COST', 10)
        })
    },

    login({commit}, form) {
      return new Promise((resolve, reject) => {
        form.post('login')
          .then(() => {
            commit('LOGIN')
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    logout({commit}) {
      commit('LOGOUT')
    },
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
    },

    orderConfirmed: state => {
      return state.orderConfirmed
    },

    thankYouMessage: state => {
      return state.thankYouMessage
    },

    deliveryCost: state => {
      return state.deliveryCost
    },

    getCartTotalPrice: (state, getters) => {
      let totalPrice = 0

      getters.cartItems.forEach(cartItem => {
        totalPrice += (cartItem.quantity * state.pizzas.data.find(item => item.id === cartItem.pizzaId).price)
      })

      totalPrice += state.deliveryCost

      return totalPrice.toFixed(2)
    }
  }
});

export default store;
