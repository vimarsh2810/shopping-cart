<template>
  <div class="container">
    <div class="card card-1">
      <h5 class="card-title">Signup</h5>
      <form method="POST">
        <div class="error-msgs" v-if="errors">
          <div class="alert alert-danger" role="alert" v-for="(error, index) in errors" :key="index">
            {{ error }}
          </div>
        </div>
        <div class="alert alert-success" role="alert" v-if="successMsg">
          {{ successMsg }}
        </div>
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" name="name" id="name" class="form-control" v-model="name" placeholder="Enter your Name">
        </div>
        <div class="form-group">
          <label for="username">Username</label>
          <input 
            type="text" 
            name="username" 
            id="username" 
            class="form-control" 
            v-model="username" 
            placeholder="Enter your Username"
            @blur="checkUsernameAvailable"
          >
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="text" 
            name="email" 
            id="email" 
            class="form-control" 
            v-model="email" 
            placeholder="Enter your Email Id"
            @blur="checkEmailAvailable"
          >
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" name="password" id="password" class="form-control" v-model="password" placeholder="Enter your Password">
        </div>
        <div class="form-group">
          <label for="password">Confirm Password</label>
          <input type="password" name="confirmPassword" id="confirmPassword" class="form-control" v-model="confirmPassword" placeholder="Confirm Password">
        </div>
        <button class="btn btn-primary material-button" @click.prevent="signup">Signup</button>
      </form>
      <p class="text-center">Already have an account? <span class="login-link"><router-link to="/login">Login.</router-link></span></p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Signup',
  data() {
    return {
      name: null,
      email: null,
      username: null,
      password: null,
      confirmPassword: null,
      errors: null,
      successMsg: null
    };
  },
  methods: {

    async checkUsernameAvailable() {
      if(!this.username) {
        this.errors = ['Username can not be empty'];
        return;
      }
      try {
        const response = await axios.post(`${this.$store.getters.base_url}/auth/checkUsernameAvailable`, { username: this.username });

        if(response.data.success) {
          this.errors = null;
          this.successMsg = response.data.message;
        } else {
          this.successMsg = null;
          this.errors = [response.data.message];
        }
      } catch (error) {
        console.log(error.response);
      }
    },

    async checkEmailAvailable() {
      if(!this.email) {
        this.errors = ['Email can not be empty'];
        return;
      }
      try {
        const response = await axios.post(`${this.$store.getters.base_url}/auth/checkEmailAvailable`, { email: this.email });

        if(response.data.success) {
          this.errors = null;
          this.successMsg = response.data.message;
        } else {
          this.successMsg = null;
          this.errors = [response.data.message];
        }
      } catch (error) {
        console.log(error.response);
      }
    },

    async signup() {
      if(!this.name || !this.email || !this.username || !this.password || !this.confirmPassword) {
        this.errors = ['Please fill up all details'];
        return;
      }
      if(this.password !== this.confirmPassword) {
        this.errors = ['Passwords do not match'];
        return;
      }
      const formData = {
        name: this.name,
        email: this.email,
        username: this.username,
        password: this.password,
        confirmPassword: this.confirmPassword
      };
      try {
        const response = await axios.post(`${this.$store.getters.base_url}/auth/signup`, formData);
        if(response.data.success) {
          this.errors = null;
          this.successMsg = response.data.message;
        }
      } catch (error) {
        this.successMsg = null;
        this.errors = error.response.data.payload;
      }
    }
  }
}
</script>

<style scoped src="../assets/css/form.css"></style>