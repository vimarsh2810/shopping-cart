<template>
  <div class="main-div">
    <AdminNavbar/>
    <div class="container">
      <div class="card card-1">
        <h5 class="card-title">Add Brand</h5>
        <!-- Form starts -->
        <form @submit.prevent="addBrand" method="POST">
          <div class="error-msgs" v-if="error">
            <div class="alert alert-danger" role="alert" v-if="error">
              {{ error }}
            </div>
          </div>
          <div class="alert alert-success" role="alert" v-if="successMsg">
            {{ successMsg }}
          </div>
          <div class="form-group">
            <label for="title">Brand Name</label>
            <input 
              type="text" 
              name="name" 
              id="name" 
              class="form-control" 
              v-model="name" 
              placeholder="Enter brand name"
            >
          </div>

          <button class="btn btn-primary material-button" type="submit">Add Brand</button>
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
  name: 'AddBrand',
  components: { AdminNavbar },
  data() {
    return {
      name: null,
      error: null,
      successMsg: null
    };
  },

  methods: {

    async addBrand() {
      const formData = { name: this.name };
      try {
        const response = await axios.post(`${this.$store.getters.base_url}/admin/brand`, formData, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.refreshToken}`
          }, params: {
            accessToken: this.$store.getters.token
          }
        });

        if(response.data.success) {
          this.error = null;
          this.successMsg = response.data.message;
          await this.$store.dispatch('getBrands');
        } else {
          this.$store.dispatch('refreshAccessToken', response.data.accessToken);
          await this.addBrand();
        }
      } catch (error) {
        this.successMsg = null;
        this.error = error.response.data.message;
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