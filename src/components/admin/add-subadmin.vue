<template>
  <div class="main-div">
    <AdminNavbar/>
    <div class="container">
      <div class="card card-1">
        <h5 class="card-title">Add SubAdmin</h5>
        <!-- Form starts -->
        <form @submit.prevent="addSubAdmin" method="POST">
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
            <input type="text" name="name" id="name" class="form-control" v-model="name" placeholder="Enter Name">
          </div>

          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" name="username" id="username" class="form-control" v-model="username" placeholder="Enter Username">
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="text" name="email" id="email" class="form-control" v-model="email" placeholder="Enter Email">
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" name="password" id="password" class="form-control" v-model="password" placeholder="Enter Password">
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input type="password" name="confirmPassword" id="confirmPassword" class="form-control" v-model="confirmPassword" placeholder="Confirm Password">
          </div>

          <button class="btn btn-primary material-button" type="submit">Add SubAdmin</button>
        </form>
        <!-- Form ends -->
      </div>
    </div>   
  </div>
</template>

<script>
import axios from 'axios';
import AdminNavbar from '../shared/admin-navbar.vue';
export default {
  name: 'AddSubAdmin',
  components: { AdminNavbar },
  data() {
    return {
      name: null,
      username: null,
      email: null,
      password: null,
      confirmPassword: null,
      errors: null,
      successMsg: null
    };
  },

  methods: {

    async addSubAdmin() {
      if(!this.name || !this.username || !this.email || !this.password || !this.confirmPassword) {
        this.successMsg = null;
        this.errors = ['Please fill all the details'];
        return;
      }

      if(this.confirmPassword !== this.password) {
        this.successMsg = null;
        this.errors = ['Passwords do not match'];
        return;
      }

      const formData = {
        name: this.name,
        username: this.username,
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword
      };
      try {
        const response = await axios.post(`${this.$store.getters.base_url}/admin/subAdmin`, formData, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.refreshToken}`
          }, params: {
            accessToken: this.$store.getters.token
          }
        });

        if(response.data.success) {
          this.errors = null;
          this.successMsg = response.data.message;
        } else {
          this.$store.dispatch('refreshAccessToken', response.data.accessToken);
          await this.addSubAdmin();
        }
      } catch (error) {
        this.successMsg = null;
        this.errors = [error.response.data.message];
      }
    }

  }

}
</script>

<style scoped src="../../assets/css/form.css"></style>

<style scoped>
  .card-1 {
    margin-top: 100px !important;
  }
</style>