<template>
  <div class="main-div">
    <AdminNavbar/>
    <div class="container" v-if="!isLoading">
      <div class="card card-1">
        <h5 class="card-title">Edit SubAdmin</h5>
        <!-- Form starts -->
        <form @submit.prevent="editSubAdmin" method="POST">
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
            <input type="text" name="name" id="name" class="form-control" v-model="subAdmin.name">
          </div>

          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" name="username" id="username" class="form-control" v-model="subAdmin.username">
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="text" name="email" id="email" class="form-control" v-model="subAdmin.email">
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" name="password" id="password" class="form-control" v-model="password" placeholder="Enter Password">
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input type="password" name="confirmPassword" id="confirmPassword" class="form-control" v-model="confirmPassword" placeholder="Confirm Password">
          </div>

          <button class="btn btn-primary material-button" type="submit">Edit SubAdmin</button>
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
  name: 'EditSubAdmin',
  components: { AdminNavbar },
  data() {
    return {
      isLoading: true,
      password: null,
      confirmPassword: null,
      subAdmin: null,
      errors: [],
      successMsg: null
    }
  },

  methods: {
    async getSubAdmin() {
      try {
        const response = await axios.get(`${this.$store.getters.base_url}/admin/subAdmin/${this.$route.params.id}`, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.token}`
          }
        });

        if(response.data.success) {
          this.subAdmin = response.data.payload;
          this.errors = [];
          this.isLoading = false;
        }
      } catch (error) {
        this.successMsg = null;
        this.errors = [error.response.data.message];
      }
    },

    async editSubAdmin() {
      if(!this.subAdmin.name || !this.subAdmin.email || !this.subAdmin.username || !this.password || !this.confirmPassword) {
        this.successMsg = null;
        this.errors = ['Please fill all the details'];
        return;
      }

      if(this.confirmPassword !== this.password) {
        this.successMsg = null;
        this.errors = ['Both passwords do not match'];
        return;
      }
      try {
        this.subAdmin.password = this.password;
        this.subAdmin.confirmPassword = this.confirmPassword;
        const response = await axios.put(`${this.$store.getters.base_url}/admin/subAdmin/${this.$route.params.id}`, this.subAdmin, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.token}`
          }
        });

        if(response.data.success) {
          this.errors = [];
          this.successMsg = response.data.message;
        }
      } catch (error) {
        this.successMsg = null;
        this.errors = error.response.data.payload;
      }
    }
  },

  created() {
    this.getSubAdmin();
  }
}
</script>

<style scoped src="../../assets/css/form.css"></style>

<style scoped>
  .card-1 {
    margin-top: 100px !important;
  }
</style>