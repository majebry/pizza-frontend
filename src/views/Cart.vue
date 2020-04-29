<template>
  <b-container>
    <b-card title="Cart">
      <b-card-body>
        <b-table responsive v-if="pizzas.length" :items="pizzas" :fields="fields">
          <template v-slot:cell(image)="data">
            <img :src="data.item.image_link" :alt="data.item.name" height="100">
          </template>

          <template v-slot:cell(price)="data">
              {{ data.item.price }}{{ currencySign }}
          </template>

          <template v-slot:cell(quantity)="data">
              <b-form-input
                id="quantity" type="number" min="1"
                v-b-tooltip.hover title="Quantity"
                :value="cartItems.find(item => item.pizzaId === data.item.id).quantity"
                @input="updateInCart($event, data.item.id)"
              ></b-form-input>
          </template>

          <template v-slot:cell(total_price)="data">
             {{ (cartItems.find(item => item.pizzaId === data.item.id).quantity * data.item.price).toFixed(2) }}{{ currencySign }}
          </template>

          <template v-slot:cell(actions)="data">
            <b-button variant="danger" size="sm" @click="removeFromCart(data.item.id)">Remove from Cart</b-button>
          </template>
        </b-table>

        <template v-else>
          <b-alert variant="success" :show="thankYouMessage">Your order has been submitted. Thank you!</b-alert>
          <b-alert variant="warning" show>Your cart is empty!</b-alert>
        </template>
      </b-card-body>
      
      <template v-slot:footer>
        <div class="float-left">
          <b-button pill variant="primary" size="lg" :disabled="pizzas.length < 1" v-b-modal.checkout>Checkout</b-button>
        </div>

        <div class="float-right" v-show="pizzas.length > 0">
          <strong>Total Price = {{ getCartTotalPrice }}{{ currencySign }} <span class="text-info"><br>({{ deliveryCost }}{{ currencySign }} included as Delivery Cost)</span></strong>
        </div>
      </template>
    </b-card>

    <CheckoutModal></CheckoutModal>
  </b-container>
</template>

<script>
import CheckoutModal from '../components/CheckoutModal'

export default {
  name: 'Cart',

  components: {
    CheckoutModal
  },

  data() {
    return {
      fields: ['image', 'name', 'price', 'quantity', 'total_price', 'actions']
    }
  },

  mounted() {
    this.loadCart()
  },

  methods: {
    async loadCart() {
      let pizzaIds = []

      this.cartItems.forEach(item => {
        pizzaIds.push(item.pizzaId)
      })
      
      await this.$store.dispatch('onLoadPizzas', { 'ids' : pizzaIds })

      this.$store.dispatch('onChangeCurrency', this.currency)

      await this.$store.dispatch('onLoadCart')
    },

    updateInCart(value, pizzaId) {
      this.$store.dispatch('onUpdateInCart', { pizzaId, quantity: value });
    },

    removeFromCart(pizzaId) {
      this.$store.dispatch('onRemoveFromCart', pizzaId)
    },
  },

  computed: {
    cartItems() {
      return this.$store.getters.cartItems
    },

    pizzas() {
      return this.$store.getters.pizzas.data.filter(pizza => {
        return this.cartItems.find(item => item.pizzaId === pizza.id)
      })
    },

    currency() {
      return this.$store.getters.currency
    },

    currencySign() {
      return this.$store.getters.currencySign
    },

    getCartTotalPrice() {
      return this.$store.getters.getCartTotalPrice
    },

    thankYouMessage() {
      return this.$store.getters.thankYouMessage
    },

    deliveryCost() {
      return this.$store.getters.deliveryCost
    }
  }
}
</script>

<style>

</style>