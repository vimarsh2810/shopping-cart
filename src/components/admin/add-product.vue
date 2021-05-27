<template>
  <div>
    <AdminNavbar/>
    <div class="container">
      <div class="card card-1">
        <h5 class="card-title">Add Product</h5>
        <!-- Form starts -->
        <form method="POST">
          <div class="alert alert-danger" role="alert" v-if="errors">
            {{ errors }}
          </div>
          <div class="alert alert-danger" role="alert" v-if="successMsg">
            {{ successMsg }}
          </div>
          <div class="form-group">
            <label for="title">Product Title</label>
            <input type="text" name="title" id="title" class="form-control" v-model="title" >
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" class="form-control" name="description" v-model="description" ></textarea>
          </div>

          <div class="form-group">
            <label for="price">Price</label>
            <input type="number" class="form-control" name="price" id="price" v-model="price" >
          </div>

          <div class="form-group">
            <label for="parentCategory">Parent Category</label>
            <select name="parentCategory" class="form-control" id="parentCategory" required @change="onSelectParent">
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

          <button class="btn btn-primary material-button" type="button" @click.prevent="addProduct">Add Product</button>
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
    
    async addProduct() {
      const formData = new FormData();
      this.categoryId = document.querySelector('#childCategory').value;
      formData.append('file', this.image);
      formData.append('description', this.description);
      formData.append('title', this.title);
      formData.append('price', this.price);
      formData.append('userId', this.userId);
      formData.append('categoryId', this.categoryId);
      try {  
        const response = await axios.post(`${this.$store.getters.base_url}/admin/product`, formData, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.token}`
          }
        });
        console.log(response.data);
        if(response.data.success) {
          this.errors = null;
          this.successMsgs = response.data.message;
        }
      } catch (error) {
        this.successMsg = null;
        this.errors = error.response.data.message
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