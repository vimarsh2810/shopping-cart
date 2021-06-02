import Vue from 'vue';
import VueRouter from 'vue-router';
import Signup from '../components/Signup.vue';
import Login from '../components/Login.vue';
import UserHome from '../components/users/user-home.vue';
import AddProduct from '../components/admin/add-product.vue';
import AddSubAdmin from '../components/admin/add-subadmin.vue';
import Cart from '../components/users/cart.vue';
import Categories from '../components/users/categories.vue';
import ShopByCategory from '../components/users/shop-by-category.vue';
import AddCategory from '../components/admin/add-category.vue';
import ManageProducts from '../components/admin/manage-products.vue';
import EditProduct from '../components/admin/edit-product.vue';
import VerifyEmail from '../components/verify-email.vue';
import Payment from '../components/users/payment.vue';
import RetryPayment from '../components/users/retry-payment.vue';
import Orders from '../components/users/orders.vue';
import OrderDetails from '../components/users/order-details.vue';
import AdminEditProfile from '../components/admin/edit-profile.vue';
import AllOrders from '../components/admin/all-orders.vue';
import AdminOrderDetails from '../components/admin/order-details.vue';
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
    path: '/admin/add-subadmin',
    name: 'AddSubAdmin',
    component: AddSubAdmin,
    meta: {
      requiresAuth: true, adminAuth: false, superAdminAuth: true, userAuth: false
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
    path: '/admin/edit-profile',
    name: 'AdminEditProfile',
    component: AdminEditProfile,
    meta: {
      requiresAuth: true, adminAuth: true, userAuth: false
    }
  },
  {
    path: '/admin/orders',
    name: 'AllOrders',
    component: AllOrders,
    meta: {
      requiresAuth: true, adminAuth: true, userAuth: false
    }
  },
  {
    path: '/admin/orders/:id',
    name: 'AdminOrderDetails',
    component: AdminOrderDetails  ,
    meta: {
      requiresAuth: true, adminAuth: true, userAuth: false
    }
  },
  {
    path: '/admin/manage-products',
    name: 'ManageProducts',
    component: ManageProducts  ,
    meta: {
      requiresAuth: true, adminAuth: true, userAuth: false
    }
  },
  {
    path: '/admin/edit-product/:id',
    name: 'EditProduct',
    component: EditProduct  ,
    meta: {
      requiresAuth: true, adminAuth: true, userAuth: false
    }
  },
  {
    path: '/user/verify-email',
    name: 'VerifyEmail',
    component: VerifyEmail,
    meta: {
      requiresAuth: true, adminAuth: false, userAuth: true, userNotActive: true
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
    path: '/user/orders/retry-payment/:id',
    name: 'RetryPayment',
    component: RetryPayment,
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
    path: '/user/orders/:id',
    name: 'OrderDetails',
    component: OrderDetails,
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
      } else if(to.meta.superAdminAuth) {
        if(store.getters.userData.roleId === development.roles.SuperAdmin) {
          next();
        } else {
          next('/page-not-found');
        }
      } else if(to.meta.userAuth) {
        if(store.getters.userData.roleId === development.roles.User) {
          if(to.meta.userNotActive) {
            if(!store.getters.userData.isActive) {
              next();
            } else {
              next('/page-not-found');
            }
          }
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