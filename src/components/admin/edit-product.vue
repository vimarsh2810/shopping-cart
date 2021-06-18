<template>
  <div>
    <!-- eslint-disable vue/no-use-v-if-with-v-for,vue/no-confusing-v-for-v-if -->
    <AdminNavbar/>
    <div class="container">
      <div class="card card-1 mb-4" v-if="!isLoading">
        <h5 class="card-title">Edit Product</h5>
        <!-- Form starts -->
        <form @submit.prevent="editProduct" method="POST">
          <div class="alert alert-danger" role="alert" v-if="error">
            {{ error }}
          </div>
          <div class="alert alert-success" role="alert" v-if="successMsg">
            {{ successMsg }}
          </div>
          <div class="form-group">
            <label for="title">Product Title</label>
            <input type="text" name="title" id="title" class="form-control" v-model="product.title" placeholder="Enter product title">
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" class="form-control" name="description" v-model="product.description" placeholder="Enter product description"></textarea>
          </div>

          <div class="form-group">
            <label for="brand">Brand</label>
            <select name="brand" id="brand" class="form-control">
              <option :value="brand.id" v-for="brand in brands" :key="brand.id" v-if="product.brandId === brand.id" selected>{{ brand.name }}</option>
              <option :value="brand.id" v-for="brand in brands" :key="brand.id" v-if="product.brandId !== brand.id">{{ brand.name }}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="price">Price</label>
            <input type="number" class="form-control" name="price" id="price" v-model="product.price" placeholder="Enter brand price">
          </div>

          <div class="form-group">
            <label for="parentCategory">Parent Category</label>
            <select name="parentCategory" class="form-control" id="parentCategory" @change="onSelectParent">
              <option 
                :value="category.id" 
                v-for="category in parentCategories" 
                :key="category.id" 
                v-if="parseInt(product.category.parentId) === parseInt(category.id)" 
                selected
              >
                {{ category.title }}
              </option>
              <option 
                :value="category.id" 
                v-for="category in parentCategories" 
                :key="category.id"
                v-if="parseInt(product.category.parentId) !== parseInt(category.id)"
              >
                {{ category.title }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="childCategory">Child Category</label>
            <select name="childCategory" class="form-control" id="childCategory">
              <option 
                :value="category.id" 
                v-for="category in childCategories" 
                :key="category.id"
                v-if="category.id === product.categoryId"
                selected
              >
                {{ category.title }}
              </option>

              <option 
                :value="category.id" 
                v-for="category in childCategories" 
                :key="category.id"
                v-if="category.id !== product.categoryId"
              >
                {{ category.title }}
              </option>
            </select>
          </div>

          <button class="btn btn-primary material-button" type="submit">Edit Product</button>
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
  name: 'EditProduct',
  components: {
    AdminNavbar
  },
  data() {
    return {
      isLoading: true,
      product: null,
      brands: this.$store.getters.brands,
      selectedParentCategory: null,
      parentCategories: this.$store.getters.categories,
      childCategories: null,
      error: null,
      successMsg: null
    };
  },
  methods: {

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
    
    async editProduct() {
      this.product.categoryId = document.querySelector('#childCategory').value;
      this.product.brandId = document.querySelector('#brand').value;
      if(!this.product.title || !this.product.brandId || !this.product.price || !this.product.description || !this.product.categoryId) {
        this.error = 'Please fill all details';
        return;
      }

      try {  
        const response = await axios.put(`${this.$store.getters.base_url}/admin/product/${this.$route.params.id}`, this.product, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.token}`
          }
        });

        if(response.data.success) {
          this.error = null;
          this.successMsg = response.data.message;
        }
      } catch (error) {
        this.successMsg = null;
        this.error = error.response.data.message
      }
    },

    async getProduct() {
      try {
        const response = await axios.get(`${this.$store.getters.base_url}/admin/product/${this.$route.params.id}`, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.token}`
          }
        });

        if(response.data.success) {
          this.product = response.data.payload;
          this.selectedParentCategory = this.product.category.parentId;
          this.childCategories = this.parentCategories.find(category => category.id === this.selectedParentCategory).children;
          this.isLoading = false;
        }
      } catch (error) {
        this.successMsg = null;
        this.error = error.response.data.message;
      }
    }
  },

  created() {
    this.getProduct();
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