import Vue from 'vue';
import VueRouter from 'vue-router';
import Signup from '../components/Signup.vue';
import Login from '../components/Login.vue';
import UserHome from '../components/users/user-home.vue';
import AddProduct from '../components/admin/add-product.vue';
import Cart from '../components/users/cart.vue';
import Categories from '../components/users/categories.vue';
import ShopByCategory from '../components/users/shop-by-category.vue';
import AddCategory from '../components/admin/add-category.vue';
import VerifyEmail from '../components/verify-email.vue';
import Payment from '../components/users/payment.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
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
    path: '/user/home',
    name: 'UserHome',
    component: UserHome
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
    path: '/user/category',
    name: 'Categories',
    component: Categories
  },
  {
    path: '/user/category/:id',
    name: 'ShopByCategory',
    component: ShopByCategory
  },
  {
    path: '/admin/add-category',
    name: 'AddCategory',
    component: AddCategory
  },
  {
    path: '/user/verify-email',
    name: 'VerifyEmail',
    component: VerifyEmail
  },
  {
    path: '/user/cart/payment',
    name: 'Payment',
    component: Payment
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router