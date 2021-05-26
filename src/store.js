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
    user: null,
    isLoggedIn: false,
    categories: null
  },
  mutations: {
    setAuthData(state, loginData) {
      state.token = loginData.token;
      state.isLoggedIn = !!(loginData.token);
      state.user = loginData.user;
    },

    clearAuthData(state) {
      state.token = null;
      state.isLoggedIn = false;
      state.user = null;
    },

    setCategories(state, categories) {
      state.categories = categories
    }
  },
  actions: {
    setLogoutTimer({commit}, expirationTime) {
      setTimeout(() => {
        commit('clearAuthData');
      }, expirationTime*1000);
    },

    signup({commit}, authData) {
      console.log(authData)
      axios.post(`${development.base_url}/auth/signup`, authData)
        .then(res => {
          if(res.data.success) {
            router.push('/login');
          }
        })
        .catch(err => {
          console.log(err.response);
        })
    },

    async getCategories(context) {
      try {
        const response = await axios.get('http://localhost:3000/admin/categories', {
          headers: {
            'Authorization': `Bearer ${context.getters.token}`
          }
        });
        context.commit('setCategories', response.data.payload);
      } catch (error) {
        console.log(error.response);
      }
    },

    login({commit, dispatch}, authData) {
      commit('setAuthData', {
        token: authData.accessToken,
        user: authData.payload
      });
      dispatch('setLogoutTimer', authData.payload.tokenExpirationTime);
      dispatch('getCategories');
      if(authData.payload.roleId === 3) {
        router.push('/user/dashboard');
      } else {
        router.push('/admin/add-product');
      }
    },

    logout({commit}) {
      commit('clearAuthData');
      router.push('/login');
    }
  },

  getters: {
    token: (state) => state.token,
    userData: (state) => state.user,
    isLoggedIn: (state) => state.isLoggedIn,
    categories: (state) => state.categories
  }
});