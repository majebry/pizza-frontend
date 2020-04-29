import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Home from './views/Home.vue';
import Cart from './views/Cart.vue';
import Login from './views/Login.vue';
import OrderList from './views/OrderList.vue';
import OrderShow from './views/OrderShow.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/cart', component: Cart },
  { path: '/login', component: Login },
  { path: '/orders', component: OrderList },
  { path: '/orders/:id', component: OrderShow, props: true },
];

const router = new VueRouter({
  routes
});

export default router;
