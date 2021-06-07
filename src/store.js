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
    notifications: [],
    walletBalance: 0
  },
  mutations: {
    setAuthData(state, loginData) {
      state.token = loginData.token;
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
    }
  },
  actions: {

    async getCategories(context) {
      try {
        const response = await axios.get(`${context.getters.base_url}/admin/categories`, {
          headers: {
            'Authorization': `Bearer ${context.getters.token}`
          }
        });
        context.commit('setCategories', response.data.payload);
      } catch (error) {
        console.log(error.response);
      }
    },

    async getWalletBalance(context) {
      try {
        const response = await axios.get(`${context.getters.base_url}/user/walletBalance`, {
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
        router.push('/admin/dashboard');
      }
    },

    logout(context) {
      context.commit('clearAuthData');
      router.push('/login');
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

      return await axios.post(`${context.getters.base_url}/cart/addToCart`, data, {
        headers: {
            'Authorization': `Bearer ${context.getters.token}`
        }
      });
    },

    async addToWishList(context, productId) {
      return await axios.post(`${context.getters.base_url}/user/wishList/${productId}`, null, {
        headers: {
          'Authorization': `Bearer ${context.getters.token}`
        }
      });
    }

  },

  getters: {
    token: (state) => state.token,
    userData: (state) => state.user,
    isActive: (state) => state.user.isActive,
    categories: (state) => state.categories,
    base_url: (state) => state.base_url,
    authStatus: (state) => state.isAuthenticated,
    notifications: (state) => state.notifications,
    walletBalance: (state) => state.walletBalance
  }
});