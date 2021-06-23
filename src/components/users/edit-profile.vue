<template>
  <div class="main-div">
    <Navbar />
    <div class="container">
      <div class="card card-1">
        <h5 class="card-title">Edit Profile</h5>
        <!-- Form starts -->
        <form @submit.prevent="editProfile" method="POST">
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
            <input type="text" name="name" id="name" class="form-control" v-model="name">
          </div>

          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" name="username" id="username" class="form-control" v-model="username">
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="text" name="email" id="email" class="form-control" v-model="email">
          </div>

          <button class="btn btn-primary material-button" type="submit">Edit Profile</button>
        </form>
        <!-- Form ends -->
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Navbar from '../shared/navbar.vue';

export default {
  name: 'UserEditProfile',
  components: { Navbar },
  data() {
    return {
      name: this.$store.getters.userData.name,
      email: this.$store.getters.userData.email,
      username: this.$store.getters.userData.username,
      successMsg: null,
      errors: []
    }
  },

  methods: {
    async editProfile() {
      if(!this.name || !this.username || !this.email) {
        this.errors = ['Please fill all details'];
        return;
      }
      
      const userData = {
        name: this.name,
        username: this.username,
        email: this.email
      };

      try {
        const response = await axios.put(`${this.$store.getters.base_url}/user/profile`, userData, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.refreshToken}`
          }, params: {
            accessToken: this.$store.getters.token
          }
        });

        if(response.data.success) {
          this.errors = [];
          this.successMsg = response.data.message;
          this.$store.dispatch('getUserData');
        } else {
          this.$store.dispatch('refreshAccessToken', response.data.accessToken);
          await this.editProfile();
        }
      } catch (error) {
        this.successMsg = null;
        this.errors = [error.response.data.message];
      }
    }
  }
}
</script>

<<style scoped src="../../assets/css/form.css"></style>

<style scoped>
  .wrapper {
    max-width: 1450px;
    height: 100%;
    margin-top: 150px;
    margin-left: auto;
    margin-right: auto;
  }

  .container {
    min-width: 100% !important;
  }

  .card-1 {
    margin-top: 100px !important;
  }
</style>