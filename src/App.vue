<template>
  <div id="app" class="mb-4">
    <b-navbar toggleable="lg" type="dark" variant="info" class="mb-4">
      <b-navbar-brand to="/">PizzaWorld</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <router-link class="nav-link" to="/">Home</router-link>
          <router-link class="nav-link" to="/cart">Cart <b-badge variant="warning">{{ cartCount }}</b-badge></router-link>
          
          <b-button v-b-tooltip.hover title="Change Currency To" v-if="currency === 'euro'" variant="link" class="nav-link" @click="changeCurrency('usd')">USD <b-badge>$</b-badge></b-button>
          <b-button v-b-tooltip.hover title="Change Currency To" v-if="currency === 'usd'" variant="link" class="nav-link" @click="changeCurrency('euro')">Euro <b-badge>€</b-badge></b-button>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <router-link v-show="isLogged" class="nav-link" to="/orders">Orders</router-link>

          <b-nav-item-dropdown right v-if="isLogged">
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <em>Admin</em>
            </template>
            <b-dropdown-item href="#" @click.prevent="logout">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
          
          <router-link v-else to="login" class="nav-link">Login</router-link>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    
    <router-view></router-view>
  </div>
</template>

<script>
import Cookies from 'js-cookie';

export default {
  name: "App",

  data() {
    return {
      get isLogged() {
        return Cookies.get("token");
      }
    };
  },

  methods: {
    changeCurrency(newCurrency) {
      this.$store.dispatch('onChangeCurrency', newCurrency)
    },

    logout() {
      this.$store.dispatch("logout");
      this.$router.push({ path: "login" });
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