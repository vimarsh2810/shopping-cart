import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import router from './router';
import createPersistedState from 'vuex-persistedstate';
import { development } from '../server/config/config.js';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    token: null,
    refreshToken: null,
    user: {
      name: null,
      username: null,
      email: null,
      roleId: null,
      isActive: false
    },
    isAuthenticated: false,
    base_url: 'http://localhost:3000',
    categories: null,
    brands: null,
    notifications: [],
    walletBalance: 0
  },
  mutations: {
    setAuthData(state, loginData) {
      state.token = loginData.token;
      state.refreshToken = loginData.refreshToken;
      state.isAuthenticated = !!(loginData.token);
      state.user = loginData.user;
    },

    setNotifications(state, notifications) {
      state.notifications = notifications;
    },

    setVerificationData(state, data) {
      state.user = data;
    },

    clearAuthData(state) {
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.user = {
        name: null,
        username: null,
        email: null,
        roleId: null,
        isActive: false
      };
      state.notifications = [];
      state.categories = null;
      state.walletBalance = 0;
    },

    setCategories(state, categories) {
      state.categories = categories
    },

    setBalance(state, balance) {
      state.walletBalance = balance;
    },

    setBrands(state, brands) {
      state.brands = brands;
    },

    setAccessToken(state, accessToken) {
      state.token = accessToken;
    }
  },
  actions: {

    async getCategories(context) {
      try {
        const response = await axios.get(`${context.getters.base_url}/admin/categories`, {
          headers: {
            'Authorization': `Bearer ${context.getters.refreshToken}`
          }, params: {
            accessToken: context.getters.token
          }
        });

        if(response.data.success) {
          context.commit('setCategories', response.data.payload);
        } else {
          context.dispatch('refreshAccessToken', response.data.accessToken);
          await context.dispatch('getCategories');
        }
        
      } catch (error) {
        console.log(error.response);
      }
    },

    async getBrands(context) {
      try {
        const response = await axios.get(`${context.getters.base_url}/shop/brands`);
        context.commit('setBrands', response.data.payload);
      } catch (error) {
        console.log(error.response);
      }
    },

    async getWalletBalance(context) {
      try {
        const response = await axios.get(`${context.getters.base_url}/user/wallet/balance`, {
          headers: {
            'Authorization': `Bearer ${context.getters.token}`
          }
        });
        context.commit('setBalance', response.data.payload.balance);
      } catch (error) {
        console.log(error.response);
      }
    },

    async login({commit, dispatch}, authData) {
      commit('setAuthData', {
        token: authData.accessToken,
        refreshToken: authData.refreshToken,
        user: authData.payload
      });
      
      if(authData.payload.roleId === development.roles.User) {
        await dispatch('getNotifications');
        if(authData.payload.isActive) {
          await dispatch('getWalletBalance');
        };
        router.push('/user/home');
      } else {
        await dispatch('getCategories');
        await dispatch('getBrands');
        router.push('/admin/dashboard');
      }
    },

    async logout(context) {
      try {
        const response = await axios.get(`${context.getters.base_url}/auth/logout`, {
          headers: {
            'Authorization': `Bearer ${context.getters.refreshToken}`
          }, params: {
            accessToken: context.getters.token
          }
        });

        if(!response.data.success) {
          context.dispatch('refreshAccessToken', response.data.accessToken);
          await context.dispatch('logout');
        } else {
          context.commit('clearAuthData');
          router.push('/login');
        }
      } catch (error) {
        if(error.response.status === 401) {
          router.push('/login');
        } else  {
          console.log(error.response);
        }
      }
    },

    async getUserData(context) {
      try {
        const responseTwo = await axios.get(`${context.getters.base_url}/user/data`, {
          headers: {
            'Authorization': `Bearer ${context.getters.token}`
          }
        });
  
        if(responseTwo.data.payload.roleId === development.roles.User) {
          context.commit('setVerificationData', responseTwo.data.payload);
          context.commit('setNotifications', []);
          router.push('/user/home');
        } else {
          context.commit('setVerificationData', responseTwo.data.payload);
          location.reload();
        }
      } catch (error) {
        console.log(error.response);
      }
    },

    async getNotifications(context) {
      try {
        const response = await axios.get(`${context.getters.base_url}/user/notifications`, {
          headers: {
            'Authorization': `Bearer ${context.getters.token}`
          }
        });

        context.commit('setNotifications', response.data.payload);
      } catch (error) {
        console.log(error.response.data.message);
      }
    },

    async addToCart(context, productId) {
      const data = {
        productId: productId,
        quantity: 1
      };

      return await axios.post(`${context.getters.base_url}/cart/cartFunctionalities`, data, {
        headers: {
            'Authorization': `Bearer ${context.getters.refreshToken}`
        }, params: {
          accessToken: context.getters.token
        }
      });
    },

    async getCart(context) {
      return await axios.get(`${context.getters.base_url}/cart/products`, {
        headers: {
          'Authorization': `Bearer ${context.getters.refreshToken}`
        }, params: {
          accessToken: context.getters.token
        }
      });
    },

    async addToWishList(context, productId) {
      return await axios.post(`${context.getters.base_url}/user/wishList/${productId}`, null, {
        headers: {
          'Authorization': `Bearer ${context.getters.refreshToken}`
        }, params: {
          accessToken: context.getters.token
        }
      });
    },

    async renewAccessToken(context) {
      try {
        const response = await axios.get(`${context.getters.base_url}/auth/renewAccessToken`, {
          headers: {
            'Authorization': `Bearer ${context.getters.refreshToken}`
          }
        });

        if(response.data.success) {
          context.commit('setAccessToken', response.data.accessToken);
        }
      } catch (error) {
        console.log(error.response);
      }
    },

    refreshAccessToken(context, accessToken) {
      context.commit('setAccessToken', accessToken);
    }

  },

  getters: {
    token: (state) => state.token,
    refreshToken: (state) => state.refreshToken,
    userData: (state) => state.user,
    isActive: (state) => state.user.isActive,
    categories: (state) => state.categories,
    brands: (state) => state.brands,
    base_url: (state) => state.base_url,
    authStatus: (state) => state.isAuthenticated,
    notifications: (state) => state.notifications,
    walletBalance: (state) => state.walletBalance
  }
});