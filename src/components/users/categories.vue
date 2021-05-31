<template>
  <div class="main-div">
    <Navbar />
    <div class="wrapper" style="margin-top: 100px">
      <!-- Container starts -->
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
      <!-- Container ends -->
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
        const response = await axios.get(`${this.$store.getters.base_url}/shop/categories`, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.token}`
          }
        });
        this.parentCategories = response.data.payload;
      } catch (error) {
        console.log(error.response);
      }
    },
    
    redirectToCategoryPage(categoryId, categoryTitle) {
      this.$router.push({name: 'ShopByCategory', params: { id: categoryId } });
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
    color: #ffffff;
    background-color: #8abbee;
    border-radius: 50%;
    display:flex;
    align-items:center;
    text-align: center;
    justify-content:center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.24);
    transition: all 0.2s ease-in-out;
  }

  .category-circle:hover {
    color: #000000;
    cursor: pointer;
    background-color: #ffffff;
    box-shadow: 0 3px 9px rgba(0, 0, 0, 0.36);
    transform: translateY(-2px);
  }

  @media (max-width: 650px) {
    .category-circle {
      width: 135px;
      height: 135px;
    }
  }

</style>