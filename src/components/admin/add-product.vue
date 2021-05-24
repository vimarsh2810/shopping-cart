<template>
  <div>
    <AdminNavbar/>
    <div class="container">
      <div class="card card-1">
        <h5 class="card-title">Add Product</h5>
        <form @submit.prevent="addProduct" method="POST" enctype="multipart/form-data">
          <div class="form-group">
            <label for="title">Product Title</label>
            <input type="text" name="title" id="title" class="form-control" v-model="title" />
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" class="form-control" name="description" v-model="description"></textarea>
          </div>
          <div class="form-group">
            <label for="price">Price</label>
            <input type="number" class="form-control" name="price" id="price" v-model="price">
          </div>
          <div class="form-group">
            <label for="image">Image</label>
            <input type="file" class="form-control" name="image" id="image" ref="file" @change="onFileChange">
          </div>
          <button class="btn btn-primary material-button" type="submit">Add Product</button>
        </form>
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
      categoryId: null
    };
  },
  methods: {
    onFileChange(event) {
      this.image = this.$refs.file.files[0];
    },
    async addProduct() {
      try {
        console.log('hello')
        const formData = new FormData();
        formData.append('file', this.image);
        formData.append('description', this.description);
        formData.append('title', this.title);
        formData.append('price', this.price);
        formData.append('userId', this.userId);
        formData.append('categoryId', 6);
        const response = await axios.post('http://localhost:3000/admin/product/add', formData, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.token}`
          }
        });
        console.log(response.data);
      } catch (error) {
        console.log(error.response)
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
  margin-top: 200px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
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