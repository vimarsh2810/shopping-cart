<template>
  <div class="main-div">
    <AdminNavbar/>
    <div class="container" v-if="!isLoading">
      <div class="card card-1">
        <h5 class="card-title">Edit Category</h5>
        <!-- Form starts -->
        <form @submit.prevent="editCategory" method="POST">
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
            <input type="text" name="title" id="title" class="form-control" v-model="category.title" placeholder="Enter category title">
          </div>

          <div class="form-group">
            <label for="parentCategory">Parent Category</label>
            <select name="parentCategory" class="form-control" id="parentCategory" v-model="selectedValue">
              <option :value="selectedValue" selected hidden v-if="!selectedValue">Select Parent Category If any</option>
              <option :value="parentCategory.id" v-for="parentCategory in parentCategories" v-show="parentCategory.id !== category.id" :key="parentCategory.id">{{ parentCategory.title }}</option>
            </select>
          </div>

          <button class="btn btn-primary material-button" type="submit">Edit Category</button>
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
      isLoading: true,
      category: null,
      parentCategories: this.$store.getters.categories,
      selectedValue: null,
      errors: null,
      successMsg: null
    };
  },

  methods: {

    async getCategory() {
      try {
        const response = await axios.get(`${this.$store.getters.base_url}/admin/category/${this.$route.params.id}`, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.refreshToken}`
          }, params: {
            accessToken: this.$store.getters.token
          }
        });

        if(response.data.success) {
          this.category = response.data.payload;
          this.isLoading = false;
          this.selectedValue = this.category.parentId;
        } else {
          this.$store.dispatch('refreshAccessToken', response.data.accessToken);
          await this.getCategory();
        }
      } catch (error) {
        this.successMsg = null;
        this.errors = [error.response.data.message];  
      }
    },

    async editCategory() {
      try {
        const data = {
          title: this.category.title,
          parentId: this.selectedValue
        }
        const response = await axios.put(`${this.$store.getters.base_url}/admin/category/${this.$route.params.id}`, data, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.refreshToken}`
          }, params: {
            accessToken: this.$store.getters.token
          }
        });
        if(response.data.success) {
          this.errors = null;
          this.successMsg = response.data.message;
          this.getCategories();
        } else {
          this.$store.dispatch('refreshAccessToken', response.data.accessToken);
          await this.editCategory();
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
    this.getCategory();
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