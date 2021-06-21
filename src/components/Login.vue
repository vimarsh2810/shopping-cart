<template>
  <div class="container">
    <div class="card card-1">
      <h5 class="card-title">Login</h5>
      <form method="POST">
        <div class="alert alert-danger" role="alert" v-if="error">
          {{ error }}
        </div>
        <div class="form-group">
          <label for="exampleInputEmail1">Email address</label>
          <input type="text" name="email" class="form-control" v-model="email" placeholder="Enter your Email Id">
          <small id="emailHelp" class="form-text text-muted"></small>
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input type="password" name="password" class="form-control" v-model="password" placeholder="Enter your Password">
          <small id="emailHelp" class="form-text text-muted"></small>
        </div>
        <button class="btn btn-primary material-button" @click.prevent="login">Login</button>
      </form>
      <p class="text-center">Don't have an account? <span class="signup-link"><router-link to="/signup">Signup.</router-link></span></p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Signup",
  data() {
    return {
      email: null,
      password: null,
      error: null
    };
  },
  methods: {
    async login() {
      if(!this.email || !this.password) {
        this.error = 'Please enter all credentials';
        return;
      }
      const formData = {
        email: this.email,
        password: this.password,
      };
      try {
        const response = await axios.post(
          `${this.$store.getters.base_url}/auth/login`,
          formData
        );
        this.$store.dispatch("login", response.data);
      } catch (error) {
        this.error = error.response.data.message;
      }
    }
  }
};
</script>

<style scoped src="../assets/css/form.css"></style>