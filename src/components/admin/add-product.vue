<template>
  <div>
    <AdminNavbar/>
    <div class="container">
      <div class="card card-1 mb-4">
        <h5 class="card-title">Add Product</h5>
        <!-- Form starts -->
        <form method="POST">
          <div class="alert alert-danger" role="alert" v-if="errors">
            {{ errors }}
          </div>
          <div class="alert alert-success" role="alert" v-if="successMsg">
            {{ successMsg }}
          </div>
          <div class="form-group">
            <label for="title">Product Title</label>
            <input 
              type="text" 
              name="title" 
              id="title" 
              class="form-control" 
              v-model="title" 
              placeholder="Enter product title"
              @blur="checkProductExists"
            >
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" class="form-control" name="description" v-model="description" placeholder="Enter product description"></textarea>
          </div>

          <!-- <div class="form-group">
            <label for="title">Brand Name</label>
            <input type="text" name="brandName" id="brandName" class="form-control" v-model="brandName" placeholder="Enter brand name">
          </div> -->
          
          <div class="form-group">
            <label for="brand">Brand</label>
            <select name="brand" class="form-control" id="brand">
              <option value="" selected hidden>Select Brand</option>
              <option :value="brand.id" v-for="brand in brands" :key="brand.id">{{ brand.name }}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="price">Price</label>
            <input type="number" class="form-control" name="price" id="price" v-model="price" placeholder="Enter brand price">
          </div>

          <div class="form-group">
            <label for="parentCategory">Parent Category</label>
            <select name="parentCategory" class="form-control" id="parentCategory" @change="onSelectParent">
              <option value="" selected hidden>Select Parent Category</option>
              <option :value="category.id" v-for="category in parentCategories" :key="category.id">{{ category.title }}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="childCategory">Child Category</label>
            <select name="childCategory" class="form-control" id="childCategory">
              <option value="" selected hidden>Select Child Category</option>
              <option :value="category.id" v-for="category in childCategories" :key="category.id">{{ category.title }}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="image">Image</label>
            <input type="file" class="form-control" name="image" id="image" ref="file" @change="onFileChange" >
          </div>

          <button 
            type="button" 
            class="btn btn-primary material-button" 
            @click.prevent="addProduct"
          >
            Add Product
          </button>

          <button 
            type="button" 
            class="btn btn-primary material-button ml-3" 
            @click.prevent="addProductInLastSelectedCategory"
          >
            Add Product(Last selected category)
          </button>
        </form>
        <!-- Form ends -->
      </div>
    </div>   
  </div>
</template>

<script>

import AdminNavbar from '../shared/admin-navbar.vue';
import axios from 'axios';
export default {
  name: 'AddProduct',
  components: {
    AdminNavbar
  },
  data() {
    return {
      title: '',
      description: '',
      price: null,
      brands: this.$store.getters.brands,
      selectedBrand: null,
      image: null,
      userId: this.$store.getters.userData.id,
      parentCategories: this.$store.getters.categories,
      childCategories: null,
      categoryId: null,
      errors: null,
      successMsg: null
    };
  },
  methods: {
    onFileChange(event) {
      this.image = this.$refs.file.files[0];
    },

    async checkProductExists() {
      try {
        const response = await axios.post(`${this.$store.getters.base_url}/admin/checkProductExists`, { title: this.title }, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.refreshToken}`
          }, params: {
            accessToken: this.$store.getters.token
          }
        });

        if(response.data.success) {
          this.errors = null;
          this.successMsg = response.data.payload;
        } else if (response.data.message === 'Refreshed AccessToken') {
          this.$store.dispatch('refreshAccessToken', response.data.accessToken);
          await this.checkProductExists();
        } else {
          this.successMsg = null;
          this.errors = response.data.payload;
        }
      } catch (error) {
        console.log(error.response);
      }
    },

    onSelectParent() {
      let selectedParent = undefined;
      for(let category of this.parentCategories) {
        if(category.id == document.querySelector('#parentCategory').value) {
          selectedParent = category;
          break;
        }
      }
      this.childCategories = selectedParent.children;
    },

    async addProductInLastSelectedCategory() {
      try {
        const response = await axios.get(`${this.$store.getters.base_url}/admin/lastSelectedCategory`, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.refreshToken}`
          }, params: {
            accessToken: this.$store.getters.token
          }
        });

        if(response.data.success) {
          const lastSelectedCategory = response.data.payload;
          this.categoryId = lastSelectedCategory.id;
          await this.addProduct();
          this.categoryId = null;
        } else {
          this.$store.dispatch('refreshAccessToken', response.data.accessToken);
          await this.addProductInLastSelectedCategory();
        }
      } catch (error) {
        console.log(error.response);
      }
    },
    
    async addProduct() {
      const formData = new FormData();
      if(!this.categoryId) {
        this.categoryId = document.querySelector('#childCategory').value;
      }
      this.selectedBrand = document.querySelector('#brand').value;
      formData.append('file', this.image);
      formData.append('description', this.description);
      formData.append('title', this.title);
      formData.append('brandId', this.selectedBrand);
      formData.append('price', this.price);
      formData.append('userId', this.userId);
      formData.append('categoryId', this.categoryId);
      try {  
        const response = await axios.post(`${this.$store.getters.base_url}/admin/product`, formData, {
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
          await this.addProduct();
        }
      } catch (error) {
        this.successMsg = null;
        this.errors = error.response.data.message
      }
    }

  }
}
</script>

<<style scoped src="../../assets/css/form.css"></style>

<style scoped>
  .card-1 {
    margin-top: 100px !important;
  }
</style>