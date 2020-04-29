<template>
  <b-modal
    id="checkout" ref="checkoutModal"
    title="Checkout" ok-title="Confirm Order"
    @ok.prevent="submitCheckout"
    :ok-disabled="checkoutLoading"
  >
    <b-alert variant="warning" show>
      <strong>Order Cost: {{ getCartTotalPrice }}</strong>
    </b-alert>
    
    <b-form ref="checkoutForm">
      <b-form-group label="Your Name" label-cols="4">
        <b-form-input v-model="form.name" required></b-form-input>
      </b-form-group>

      <b-form-group label="Your Address" label-cols="4">
        <b-form-input v-model="form.address" required></b-form-input>
      </b-form-group>

      <b-form-group label="Your Phone" label-cols="4">
        <b-form-input v-model="form.phone" required></b-form-input>
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<script>
export default {
  name: 'CheckoutModal',

  data() {
    return {
      form: {
        name: '',
        address: '',
        phone: '',
      }
    }
  },

  methods: {
    async submitCheckout() {
      if (this.$refs.checkoutForm.checkValidity()) {
        await this.submitCheckoutForm()
      } else {
        this.$refs.checkoutForm.reportValidity()
      }
    },

    async submitCheckoutForm() {
      await this.$store.dispatch('onSubmitCheckout', this.form)

      if (this.$store.getters.orderConfirmed === true) {
        this.form.name = ''
        this.form.address = ''
        this.form.phone = ''

        this.$store.dispatch('onCartClear')

        this.$refs.checkoutModal.hide()
      }
    }
  },

  computed: {
    getCartTotalPrice() {
      return this.$store.getters.getCartTotalPrice
    },

    cartItems() {
      return this.$store.getters.cartItems
    },

    checkoutLoading() {
      return this.$store.getters.checkoutLoading
    }
  }
}
</script>

<style>

</style>