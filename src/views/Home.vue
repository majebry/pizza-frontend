<template>
  <b-container>
    <b-card title="Home">
      <b-card-body>
        <b-row id="pizzas">
          <b-col lg="4" md="6" v-for="pizza in pizzas.data" :key="pizza.id" class="mb-2 mt-2">
            <b-card 
              img-top
              :img-src="pizza.image_link"
              :title="pizza.name"
              :sub-title="pizza.price + currencySign"
              sub-title-text-variant="success"
            >
              <template v-slot:footer>
                  <template v-if="getQuantityForCartItem(pizza.id) > 0">
                    <b-input-group>
                      <b-form-input
                        id="quantity" type="number" min="0"
                        v-b-tooltip.hover title="Quantity"
                        :value="getQuantityForCartItem(pizza.id)"
                        @input="updateInCart($event, pizza.id)"
                      ></b-form-input>

                      <template v-slot:append>
                         <b-input-group-text>items in cart</b-input-group-text>
                      </template>
                    </b-input-group>
                  </template>
                  
                  <template v-else>
                    <b-button
                      variant="primary"
                      @click="addToCart(pizza.id)"
                    >Add to Cart</b-button>
                  </template>
              </template>
            </b-card>
          </b-col>
        </b-row>
      </b-card-body>
      
      <template v-slot:footer>
        <b-pagination
          pills size="lg" align="center"
          @change="changePage"
          v-model="currentPage"
          :total-rows="rows" :per-page="perPage"
          aria-controls="pizzas"
        >
        </b-pagination>
      </template>
    </b-card>
  </b-container>
</template>

<script>
export default {
  name: 'Home',

  data() {
    return {
      currentPage: 1,
      rows: 0,
      perPage: 9
    }
  },

  created() {
    this.loadPizzas({ per_page: this.perPage })
  },
  
  methods: {
    async loadPizzas(params) {
      await this.$store.dispatch('onLoadPizzas', params)

      this.$store.dispatch('onChangeCurrency', this.currency)

      this.currentPage = this.pizzas.current_page
      this.rows = this.pizzas.total
      this.perPage = this.pizzas.per_page
    },

    changePage(page) {
      this.loadPizzas({ page, per_page: this.perPage })
    },

    addToCart(pizzaId) {
      this.$store.dispatch('onUpdateInCart', { pizzaId, quantity: 1 });
    },

    updateInCart(value, pizzaId) {
      this.$store.dispatch('onUpdateInCart', { pizzaId, quantity: value });
    },

    findCartItem(pizzaId) {
      return this.cart.find(cartItem => cartItem.pizzaId === pizzaId)
    },

    getQuantityForCartItem(pizzaId) {
      const cartItem = this.findCartItem(pizzaId);
      return cartItem !== undefined ? cartItem.quantity : 0
    }
  },

  computed: {
    pizzas() {
      return this.$store.getters.pizzas
    },

    cart() {
      return this.$store.getters.cart
    },

    currency() {
      return this.$store.getters.currency
    },

    currencySign() {
      return this.$store.getters.currencySign
    }
  }
}
</script>

<style>

</style>