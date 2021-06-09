import Vue from 'vue';
import VueRouter from 'vue-router';
import Signup from '../components/Signup.vue';
import Login from '../components/Login.vue';
import UserHome from '../components/users/user-home.vue';
import ProductDetailsUser from '../components/users/product-details.vue';
import AddProduct from '../components/admin/add-product.vue';
import AddSubAdmin from '../components/admin/add-subadmin.vue';
import ManageSubAdmins from '../components/admin/manage-subadmins.vue';
import EditSubAdmin from '../components/admin/edit-subadmin.vue';
import Cart from '../components/users/cart.vue';
import MyWallet from '../components/users/my-wallet.vue';
import WishList from '../components/users/wishlist.vue';
import Categories from '../components/users/categories.vue';
import UserEditProfile from '../components/users/edit-profile.vue';
import ShopByCategory from '../components/users/shop-by-category.vue';
import AdminDashboard from '../components/admin/dashboard.vue';
import MarkDelivery from '../components/admin/mark-delivery.vue';
import AddCategory from '../components/admin/add-category.vue';
import ManageProducts from '../components/admin/manage-products.vue';
import ManageCategories from '../components/admin/manage-categories.vue';
import EditCategory from '../components/admin/edit-category.vue';
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
      name: 'UserHome'
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

  /* User Routes */

  {
    path: '/user/home',
    name: 'UserHome',
    component: UserHome
  },
  {
    path: '/user/product-details/:id',
    name: 'ProductDetailsUser',
    component: ProductDetailsUser
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
    path: '/user/wishlist',
    name: 'WishList',
    component: WishList,
    meta: {
      requiresAuth: true, adminAuth: false, userAuth: true
    }
  },
  {
    path: '/user/category',
    name: 'Categories',
    component: Categories
  },
  {
    path: '/user/category/:id',
    name: 'ShopByCategory',
    component: ShopByCategory,
    props: true
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
    path: '/user/edit-profile',
    name: 'UserEditProfile',
    component: UserEditProfile,
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
    path: '/user/wallet',
    name: 'MyWallet',
    component: MyWallet,
    meta: {
      requiresAuth: true, adminAuth: false, userAuth: true
    }
  },

  /* Admin Routes */
  
  {
    path: '/admin/add-product',
    name: 'AddProduct',
    component: AddProduct,
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
    path: '/admin/add-subadmin',
    name: 'AddSubAdmin',
    component: AddSubAdmin,
    meta: {
      requiresAuth: true, adminAuth: false, superAdminAuth: true, userAuth: false
    }
  },
  {
    path: '/admin/manage-subadmins',
    name: 'ManageSubAdmins',
    component: ManageSubAdmins,
    meta: {
      requiresAuth: true, adminAuth: false, superAdminAuth: true, userAuth: false
    }
  },
  {
    path: '/admin/edit-subadmin/:id',
    name: 'EditSubAdmin',
    component: EditSubAdmin,
    meta: {
      requiresAuth: true, adminAuth: false, superAdminAuth: true, userAuth: false
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
    path: '/admin/manage-categories',
    name: 'ManageCategories',
    component: ManageCategories  ,
    meta: {
      requiresAuth: true, adminAuth: true, userAuth: false
    }
  },
  {
    path: '/admin/edit-category/:id',
    name: 'EditCategory',
    component: EditCategory  ,
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
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard  ,
    meta: {
      requiresAuth: true, adminAuth: true, userAuth: false
    }
  },
  {
    path: '/admin/mark-delivery/:id',
    name: 'MarkDelivery',
    component: MarkDelivery,
    meta: {
      requiresAuth: true, adminAuth: true, userAuth: false
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