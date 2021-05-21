<template>
  <div>
    <div v-if="isLoggedIn">
      <p>{{ user.id }}</p>
      <p>{{ user.name }}</p>
      <p>{{ user.username }}</p>
      <p>{{ user.email }}</p>
      <p>{{ user.isActive }}</p>
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>
<script>
  import axios from 'axios';
  import { development } from '../../server/config/config.js';
  export default {
    name: 'Dashboard',
    data() {
      return {
        user: {},
        isLoggedIn: false
      }
    },
    methods: {
      logout() {
        this.$store.dispatch('logout');
      }
    }, 
    created() {
      this.user = this.$store.getters.userData;
      this.isLoggedIn = this.$store.getters.isLoggedIn;
    }
  }
</script>