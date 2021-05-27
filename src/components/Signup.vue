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
          <input type="text" name="username" id="username" class="form-control" v-model="username" placeholder="Enter your Username">
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="text" name="email" id="email" class="form-control" v-model="email" placeholder="Enter your Email Id">
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

<style scoped>

.alert {
  font-size: 14px !important;
  padding: 6px 10px !important;
  margin-bottom: 10px !important;
}

.card-1 {
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 100px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

form {
  padding: 20px;
}

.card {
  border: none !important;
}

.card-title {
  margin-bottom: 0;
  color: white;
  padding: 20px;
  background-color: #007bff;
  border-top-left-radius: .25rem;
  border-top-right-radius: .25rem;
}

.material-button {
  box-shadow: 0 2px 4px rgba(0,0,0,0.16), 0 2px 4px rgba(0,0,0,0.23);
}

.form-control:focus,
.btn:focus {
  box-shadow:none !important;
}

.login-link {
  color: #007bff;
  cursor: pointer;
}
</style>