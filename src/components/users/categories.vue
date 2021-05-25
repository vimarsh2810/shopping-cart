<template>
  <div class="main-div">
    <Navbar />
    <div class="wrapper" style="margin-top: 100px">
      <div class="container">
        <div class="row" v-for="parentCategory in parentCategories" :key="parentCategory.id">
          <div class="col-12" style="margin-bottom: 30px" v-if="parentCategory.children.length > 0">
            <h4>{{ parentCategory.title }}</h4>
          </div>
          <div class="col-md-3 col-sm-4 col-6" v-for="childCategory in parentCategory.children" :key="childCategory.id">
            <div class="category-circle" @click="redirectToCategoryPage(childCategory.id, childCategory.title)">
              {{ childCategory.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>


import axios from 'axios';
import Navbar from '../shared/navbar.vue';
export default {
  name: 'ShopByCategory',
  components: { Navbar },
  data() {
    return {
      parentCategories: []
    };
  },
  methods: {
    async getCategories() {
      try {
        const response = await axios.get('http://localhost:3000/shop/categories', {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.token}`
          }
        });
        console.log(response.data);
        this.parentCategories = response.data.payload;
      } catch (error) {
        console.log(error.response);
      }
    },
    
    redirectToCategoryPage(categoryId) {
      this.$router.push({name: 'ShopByCategory', params: { id: categoryId }});
    }
  },
  created() {
    this.getCategories();
  }
}
</script>

<style scoped>

  .wrapper {
    max-width: 1450px;
    height: 100%;
    margin-left: auto;
    margin-right: auto;
  }

  .container {
    min-width: 100% !important;
  }

  .col-md-3, .col-sm-4, .col-6 {
    margin-bottom: 30px;
  }

  .category-circle {
    width: 180px;
    height: 180px;
    background-color: #f1f1f1;
    border-radius: 50%;
    display:flex;
    align-items:center;
    text-align: center;
    justify-content:center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .category-circle:hover {
    cursor: pointer;
    background-color: #ffffff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.24);
    transform: translateY(-3px);
  }

  @media (max-width: 650px) {
    .category-circle {
      width: 135px;
      height: 135px;
    }
  }

</style>