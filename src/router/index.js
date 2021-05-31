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
import Orders from '../components/users/orders.vue';
import PageNotFound from '../components/page-not-found.vue';
import store from '../store';
import { development } from '../../server/config/config';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: {
      name: 'Login'
    }
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
  },
  {
    path: '/admin/add-product',
    name: 'AddProduct',
    component: AddProduct,
    meta: {
      requiresAuth: true, adminAuth: true, userAuth: false
    }
  },
  {
    path: '/user/cart',
    name: 'Cart',
    component: Cart,
    meta: {
      requiresAuth: true, adminAuth: false, userAuth: true
    }
  },
  {
    path: '/user/category',
    name: 'Categories',
    component: Categories,
    meta: {
      requiresAuth: true, adminAuth: false, userAuth: true
    }
  },
  {
    path: '/user/category/:id',
    name: 'ShopByCategory',
    component: ShopByCategory,
    props: true,
    meta: {
      requiresAuth: true, adminAuth: false, userAuth: true
    }
  },
  {
    path: '/admin/add-category',
    name: 'AddCategory',
    component: AddCategory,
    meta: {
      requiresAuth: true, adminAuth: true, userAuth: false
    }
  },
  {
    path: '/user/verify-email',
    name: 'VerifyEmail',
    component: VerifyEmail,
    meta: {
      requiresAuth: true, adminAuth: false, userAuth: true
    }
  },
  {
    path: '/user/cart/payment',
    name: 'Payment',
    component: Payment,
    meta: {
      requiresAuth: true, adminAuth: false, userAuth: true
    }
  },
  {
    path: '/user/orders',
    name: 'Orders',
    component: Orders,
    meta: {
      requiresAuth: true, adminAuth: false, userAuth: true
    }
  },
  {
    path: '/page-not-found',
    name: 'PageNotFound',
    component: PageNotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if(to.meta.requiresAuth) {
    if(!store.getters.authStatus) {
      next('/login');
    } else {
      if(to.meta.adminAuth) {
        if(store.getters.userData.roleId === development.roles.SuperAdmin || store.getters.userData.roleId === development.roles.SubAdmin) {
          next();
        } else {
          next('/page-not-found');
        }
      } else if(to.meta.userAuth) {
        if(store.getters.userData.roleId === development.roles.User) {
          next();
        } else {
          next('/page-not-found');
        }
      }
    }
  } else {
    next();
  }
});

export default router