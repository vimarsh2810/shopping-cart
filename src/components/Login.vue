<template>
  <div>
    <form method="POST">
      <input type="text" name="email" id="email" v-model="email">
      <input type="text" name="password" id="password" v-model="password">
      <button @click.prevent="login" type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Signup',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async login() {
      const formData = {
        email: this.email,
        password: this.password
      };
      try {
        const response = await axios.post('http://localhost:3000/auth/login', formData);
        console.log(response.data.payload)
        this.$store.dispatch('login', response.data);
      } catch (error) {
        console.log(error.response);
      }
    }
  }
}
</script>