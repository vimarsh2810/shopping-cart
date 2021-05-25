import Vue from 'vue';
import VueRouter from 'vue-router';
import Signup from '../components/Signup.vue';
import Login from '../components/Login.vue';
import Dashboard from '../components/users/dashboard.vue';
import AddProduct from '../components/admin/add-product.vue';
import Cart from '../components/users/cart.vue';
import Categories from '../components/users/categories.vue';
import ShopByCategory from '../components/users/shop-by-category.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/user/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },,
  {
    path: '/admin/add-product',
    name: 'AddProduct',
    component: AddProduct
  },
  {
    path: '/user/cart',
    name: 'Cart',
    component: Cart
  },
  {
    path: '/user/categories',
    name: 'Categories',
    component: Categories
  },
  {
    path: '/user/shop-by-category/:id',
    name: 'ShopByCategory',
    component: ShopByCategory
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router