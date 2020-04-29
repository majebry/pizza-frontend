<template>
  <b-container>
    <b-card :title="'Order #' + this.id">
      <div class="row">
        <table class="table">
          <tr>
            <th>Item Name</th>
            <th>Sold Price</th>
            <th>Sold Quantity</th>
          </tr>
          <tr v-for="item in order.items" :key="item.id">
            <td>{{ item.sold_price }}</td>
            <td>{{ item.quantity }}</td>
          </tr>
        </table>
      </div>

      <template v-slot:footer>
        <div class="row">
          <div class="col">
            <table class="table">
              <tr>
                <th>Client Name</th>
                <td>{{ order.client.name }}</td>
              </tr>
              <tr>
                <th>Client Address</th>
                <td>{{ order.client.address }}</td>
              </tr>
              <tr>
                <th>Client Phone</th>
                <td>{{ order.client.phone }}</td>
              </tr>
            </table>
          </div>

          <div class="col">
            <table class="table">
              <tr>
                <th>Order Date</th>
                <td>{{ order.created_at_string }}</td>
              </tr>
              <tr>
                <th>Order Cost</th>
                <td>{{ order.total_price }} {{ order.currency }}</td>
              </tr>
            </table>
          </div>
        </div>
      </template>
    </b-card>
  </b-container>
</template>

<script>
export default {
  name: 'OrderShow',
  
  props: ['id'],

  created() {
    this.loadOrder()
  },

  methods: {
    async loadOrder() {
      await this.$store.dispatch('onLoadOrder', this.id)
    }
  },

  computed: {
    order() {
      return this.$store.getters.order
    }
  }
}
</script>

<style>

</style>