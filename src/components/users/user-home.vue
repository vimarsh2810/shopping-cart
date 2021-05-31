<template>
  <div class="main-div">
    <Navbar />
    <div class="wrapper" style="margin-top: 100px">
      <div class="container">
        <div class="alert alert-danger" role="alert" v-if="!user.isActive">
          Verify Email Id to add products in cart
        </div>
        <div class="row">

          <div class="col-lg-3 col-md-4 col-sm-6 col-12 mbpx-30px" v-for="product in products" :key="product.id">
            <div class="card">
              <div class="card-product-img">
                <img :src="product.imagePath" alt="">
              </div>
              <div class="card-product-details">
                <h4>{{ product.title }}</h4>
                <p><span class=" d-inline-flex align-items-center badge badge-success">4.5&nbsp;&#11088;</span>&nbsp;&nbsp;&nbsp;&#8377;{{ product.price }}</p>
              </div>
              <div class="card-product-btn">
                <button class="btn btn-primary material-button" type="button" @click.prevent="addToCart(product.id)">ADD TO CART</button>
              </div>
            </div>
          </div>
          
        </div>

        <!-- <div v-if="totalPages > 0" class="pagination-wrapper d-flex justify-content-center">
          <div class="pagination-arrow" @click="getProducts(currentPage - 1)" v-if="showPrevious()">
            <img src="/img/left-arrow.png" alt="">
          </div>
          <div class="pagination-page-no" v-for="i in totalPages" :key="i">
            <span class="pagination-btn" v-bind:class="{ active: i == currentPage }" @click="getProducts(i)">{{i}}</span>
          </div>
          <div class="pagination-arrow" @click="getProducts(currentPage + 1)" v-if="showNext()">
            <img src="/img/right-arrow.png" alt="">
          </div>
        </div> -->

        <Pagination 
          :currentPage="currentPage" 
          :totalPages="totalPages" 
          :showPrevious="showPrevious()" 
          :showNext="showNext()"
          @pageClicked="getProducts($event)"
        ></Pagination>

      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
  import Navbar from '../shared/navbar.vue';
  import Pagination from '../shared/pagination.vue';
  export default {
    name: 'UserHome',
    components: {
      Navbar,
      Pagination
    },
    data() {
      return {
        user: {},
        products: [],
        error: null,
        totalPages: null,
        totalProductsCount: null,
        currentPage: null,
        limit: 3
      }
    },
    methods: {
      logout() {
        this.$store.dispatch('logout');
      },

      showPrevious() {
        return this.currentPage == 1 ? false : true;
      },

      showNext() {
        return this.currentPage == this.totalPages ? false : true;
      },

      async getProducts(requestedPage) {
        try {
          const response = await axios.get(`${this.$store.getters.base_url}/shop/limitedProducts?page=${requestedPage}&limit=${this.limit}`, {
            headers: {
              'Authorization': `Bearer ${this.$store.getters.token}`
            }
          });

          if(response.data.success) {
            this.products = response.data.payload.products;
            this.totalPages = response.data.payload.totalPages;
            this.totalProductsCount = response.data.payload.productCount;
            this.currentPage = response.data.payload.currentPage;
          }
        } catch (error) {
          console.log(error.response.data.message)
        }
      },

      async addToCart(productId) {
        try {
          const response = await this.$store.dispatch('addToCart', productId);
          if(response.data.success) {
            this.$router.push('/user/cart');
          }
        } catch (error) {
          alert(error.response.data.message);
        }
      }
    }, 
    created() {
      this.user = this.$store.getters.userData;
      this.isLoggedIn = this.$store.getters.isLoggedIn;
      this.getProducts(1);
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

  .pagination-wrapper {
    margin-bottom: 30px;
  }

  .pagination-arrow {
    height: 35px;
    width: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .pagination-page-no {
    margin: 0 10px;
  }

  span.active {
    background-color: #007bff;
    color: #ffffff;
    overflow: hidden;
  }

  span.pagination-btn {
    display: inline-flex;
    border: 1px solid none;
    border-radius: 50%;
    justify-content: center;
    align-items: center;
    width: 35px;
    height: 35px;
    font-size: 18px;
    line-height: 18px;
  }

  .pagination-page-no span.pagination-btn:hover {
    cursor: pointer;
    background-color: #007bff;
    color: #ffffff;
  }

  .mbpx-30px {
    margin-bottom: 30px;
  }

  .container {
    min-width: 100% !important;
  }

  .card {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .card-product-img {
    height: 280px;
    max-width: 330.5px;
    padding: 20px;
    display:flex;
    align-items:center;
    justify-content:center;
    margin-left: auto;
    margin-right: auto;
  }

  .card-product-img img {
    max-height: 100%;
    max-width: 100%;
    transition: all 0.15s ease-in-out;
    object-fit: cover;
  }

  .card-product-img img:hover {
    cursor: pointer;
    transform: scale(1.03);
  }

  .card-product-details h4 {
    text-align: center;
    padding-left: 20px;
    padding-right: 20px;
    text-overflow: ellipsis;
    white-space: nowrap; 
    overflow: hidden;
  }

  .card-product-details h4:hover {
    cursor: pointer;
    text-decoration: underline;
  }

  .card-product-details p {
    font-weight: 600;
    text-align: center;
  }
  span {
    display: inline-block;
    height: 24px;
  }

  .card-product-btn {
    margin-left: auto;
    margin-right: auto;
  }

  .material-button {
    box-shadow: 0 2px 4px rgba(0,0,0,0.16), 0 2px 4px rgba(0,0,0,0.23);
    margin-bottom: 15px;
    width: 200px;
  }

  .form-control:focus,
  .btn:focus {
    box-shadow:none !important;
  }

</style>