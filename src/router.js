import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Home from './views/Home.vue';
import Cart from './views/Cart.vue';
import Login from './views/Login.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/cart', component: Cart },
  { path: '/login', component: Login }
];

const router = new VueRouter({
  routes
});

export default router;
