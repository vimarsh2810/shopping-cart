<template>
  <div class="main-div">
    <AdminNavbar/>
    <div class="container">
      <div class="card card-1">
        <h5 class="card-title">Add Brand</h5>
        <!-- Form starts -->
        <form @submit.prevent="addBrand" method="POST">
          <div class="error-msgs" v-if="errors">
            <div class="alert alert-danger" role="alert" v-for="(error, index) in errors" :key="index">
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
              @blur="checkBrandExists"
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
      errors: null,
      successMsg: null
    };
  },

  methods: {

    async checkBrandExists() {
      try {
        const response = await axios.post(`${this.$store.getters.base_url}/admin/checkBrandExists`, { name: this.name }, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.token}`
          }
        });

        if(response.data.success) {
          this.errors = [];
          this.successMsg = response.data.payload;
        } else {
          this.successMsg = null;
          this.errors = [response.data.payload];
        }
      } catch (error) {
        console.log(error.response);
      }
    },

    async addBrand() {
      const formData = { name: this.name };
      try {
        const response = await axios.post(`${this.$store.getters.base_url}/admin/brand`, formData, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.token}`
          }
        });
        if(response.data.success) {
          this.errors = null;
          this.successMsg = response.data.message;
          await this.$store.dispatch('getBrands');
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
  .card-1 {
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 100px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .alert {
    font-size: 14px !important;
    padding: 6px 10px !important;
    margin-bottom: 10px !important;
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
</style>