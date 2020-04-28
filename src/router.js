import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Home from './views/Home.vue';
import Cart from './views/Cart.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/cart', component: Cart }
];

const router = new VueRouter({
  routes
});

export default router;
