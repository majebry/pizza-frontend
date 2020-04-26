<template>
  <b-container>
    <b-card title="Home">
      <b-card-body>
        <b-row id="pizzas">
          <b-col lg="3" md="6" v-for="pizza in pizzas.data" :key="pizza.id" class="mb-2 mt-2">
            <b-card 
              img-top
              :img-src="pizza.image_link"
              :title="pizza.name"
            >
              <b-button href="#" variant="primary">Add to Cart</b-button>
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
      perPage: 0
    }
  },

  created() {
    this.loadPizzas()
  },
  
  methods: {
    async loadPizzas(params) {
      await this.$store.dispatch('onLoadPizzas', params)

      this.currentPage = this.pizzas.current_page
      this.rows = this.pizzas.total
      this.perPage = this.pizzas.per_page
    },

    changePage(page) {
      this.loadPizzas({ page })
    }
  },

  computed: {
    pizzas() {
      return this.$store.state.pizzas
    }
  }
}
</script>

<style>

</style>