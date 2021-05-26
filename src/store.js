import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import router from './router';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    token: null,
    user: null,
    isLoggedIn: false,
    base_url: 'http://localhost:3000',
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

    login({commit, dispatch}, authData) {
      commit('setAuthData', {
        token: authData.accessToken,
        user: authData.payload
      });
      dispatch('setLogoutTimer', authData.payload.tokenExpirationTime);
      
      if(authData.payload.roleId === 3) {
        router.push('/user/home');
      } else {
        dispatch('getCategories');
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
    categories: (state) => state.categories,
    base_url: (state) => state.base_url
  }
});