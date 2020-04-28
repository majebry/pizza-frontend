<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="info" class="mb-4">
      <b-navbar-brand href="/">BuzzyPizza</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <router-link class="nav-link" to="/">Home</router-link>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-button v-if="currency === 'euro'" variant="link" class="nav-link" @click="changeCurrency('usd')">USD <b-badge>$</b-badge></b-button>
          <b-button v-if="currency === 'usd'" variant="link" class="nav-link" @click="changeCurrency('euro')">Euro <b-badge>€</b-badge></b-button>
          
          <router-link class="nav-link" to="/cart">Cart <b-badge variant="warning">{{ cartCount }}</b-badge></router-link>

          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <em>User</em>
            </template>
            <b-dropdown-item href="#">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",

  methods: {
    changeCurrency(newCurrency) {
      this.$store.dispatch('onChangeCurrency', newCurrency)
    }
  },

  computed: {
    cartCount() {
      return this.$store.getters.cartCount
    },

    currency() {
      return this.$store.getters.currency
    }
  }
};
</script>

<style lang="scss">
@import "node_modules/bootstrap/scss/bootstrap";
@import "node_modules/bootstrap-vue/src/index.scss";
</style>