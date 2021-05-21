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
    login({commit, dispatch}, authData) {
      commit('setAuthData', {
        token: authData.accessToken,
        user: authData.payload
      });
      dispatch('setLogoutTimer', authData.payload.tokenExpirationTime);
      router.push('/dashboard')
    },
    logout({commit}) {
      commit('clearAuthData');
      router.push('/login');
    }
  },
  getters: {
    token: (state) => state.token,
    userData: (state) => state.user,
    isLoggedIn: (state) => state.isLoggedIn
  }
});