<template>
  <b-container>
    <b-alert :show="rows < 1">There are no orders yet!</b-alert>
    
    <b-card class="mb-4" sub-title="Filter">
      <b-row>
        <b-col>
          <b-form-group label="Client Name">
            <b-form-input v-model="filters.clientName" @change="filterResults"></b-form-input>
          </b-form-group>
        </b-col>

        <b-col>
          <b-form-group label="Client Phone">
            <b-form-input v-model="filters.clientPhone" @change="filterResults"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
    </b-card>
    
    <b-card title="Order History">
      <b-table responsive :items="ordersData" :fields="fields">
        <template v-slot:cell(total_price)="data">
          {{ data.item.total_price }} {{ data.item.currency }}
        </template>
  
        <template v-slot:cell(actions)="data">
          <router-link :to="'orders/' + data.item.id" class="btn btn-info">Show</router-link>
        </template>
      </b-table>

      <template v-slot:footer>
        <b-pagination
          pills align="center"
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
          @change="changePage"
        ></b-pagination>
      </template>
    </b-card>
  </b-container>
</template>

<script>
export default {
  name: 'OrderList',

  data() {
    return {
      currentPage: 1,
      rows: 0,
      perPage: 0,
      fields: [
        'id',
        'client_name', 'client_address', 'client_phone',
        'total_price', 'created_at', 'actions'
      ],
      filters: {
        clientName: '',
        clientPhone: ''
      }
    }
  },

  created() {
    this.loadOrders()
  },

  methods: {
    async loadOrders(params) {
      await this.$store.dispatch('onLoadOrders', params)

      this.currentPage = this.orders.current_page
      this.rows = this.orders.total
      this.perPage = this.orders.per_page
    },

    changePage(page) {
      this.loadOrders({ page })
    },

    filterResults() {
      const params = {
        client_name: this.filters.clientName,
        client_phone: this.filters.clientPhone,
      }
      
      this.loadOrders(params)
    }
  },
  
  computed: {
    orders() {
      return this.$store.getters.orders
    },

    ordersData() {
      return this.$store.getters.orders.data
    }
  }
}
</script>

<style>

</style>