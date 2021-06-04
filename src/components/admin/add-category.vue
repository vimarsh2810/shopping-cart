<template>
  <div class="main-div">
    <AdminNavbar/>
    <div class="container">
      <div class="card card-1">
        <h5 class="card-title">Add Category</h5>
        <!-- Form starts -->
        <form @submit.prevent="addCategory" method="POST">
          <div class="error-msgs" v-if="errors">
            <div class="alert alert-danger" role="alert" v-for="(error, index) in errors" :key="index">
              {{ error }}
            </div>
          </div>
          <div class="alert alert-success" role="alert" v-if="successMsg">
            {{ successMsg }}
          </div>
          <div class="form-group">
            <label for="title">Category Title</label>
            <input type="text" name="title" id="title" class="form-control" v-model="title" placeholder="Enter category title">
          </div>

          <div class="form-group">
            <label for="parentCategory">Parent Category</label>
            <select name="parentCategory" class="form-control" id="parentCategory">
              <option value="" selected hidden>Select Parent Category If any</option>
              <option :value="category.id" v-for="category in parentCategories" :key="category.id">{{ category.title }}</option>
            </select>
          </div>

          <button class="btn btn-primary material-button" type="submit">Add Category</button>
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
  name: 'AddCategory',
  components: { AdminNavbar },
  data() {
    return {
      title: null,
      parentCategories: this.$store.getters.categories,
      parentId: null,
      errors: null,
      successMsg: null
    };
  },

  methods: {

    async addCategory() {
      this.parentId = document.querySelector('#parentCategory').value;
      const formData = {
        title: this.title,
        parentId: this.parentId
      };
      try {
        const response = await axios.post(`${this.$store.getters.base_url}/admin/category`, formData, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.token}`
          }
        });
        if(response.data.success) {
          this.errors = null;
          this.successMsg = response.data.message;
          this.getCategories();
        }
      } catch (error) {
        this.successMsg = null;
        this.errors = error.response.data.payload;
      }
    },

    async getCategories() {
      await this.$store.dispatch('getCategories');
      this.parentCategories = this.$store.getters.categories;
    }
  },
  created() {
    this.parentCategories = this.$store.getters.categories;
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