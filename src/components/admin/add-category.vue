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
            <input 
              type="text" 
              name="title" 
              id="title" 
              class="form-control" 
              v-model="title" 
              placeholder="Enter category title"
              @blur="checkCategoryExists"
            >
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

    async checkCategoryExists() {
      try {
        const response = await axios.post(`${this.$store.getters.base_url}/admin/checkCategoryExists`, { title: this.title }, {
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

<style scoped src="../../assets/css/form.css"></style>

<style scoped>
  .card-1 {
    margin-top: 100px !important;
  }
</style>