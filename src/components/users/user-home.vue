<template>
  <div class="main-div">
    <Navbar />
    <div class="wrapper" style="margin-top: 100px">
      <div class="container" v-if="!isLoading">
        <h3 class="mbpx-30px">Products</h3>
        <div class="alert alert-danger" role="alert" v-if="error">
          {{ error }}
        </div>
        <div class="row" v-if="products.length > 0">

          <div class="col-md-4 col-sm-6 col-12 mbpx-30px" v-for="product in products" :key="product.id">
            <div class="card">
              <div class="card-product-img">
                <img 
                  :src="product.imagePath" 
                  alt="Product Image" 
                  @click.prevent="$router.push({ name: 'ProductDetailsUser', params: { id: product.id }})"
                >
              </div>
              <div class="card-product-details">
                <h4 
                  @click.prevent="$router.push({ name: 'ProductDetailsUser', params: { id: product.id }})"
                >
                  {{ product.title }}
                </h4>
                <p>
                  <span 
                    class="d-inline-flex align-items-center badge badge-success"
                    v-if="product.avgRating"
                  >
                    {{ product.avgRating }}&nbsp;&#11088;
                  </span>
                  &nbsp;&nbsp;&nbsp;&#8377;{{ product.price }}
                </p>
              </div>
              <div class="card-product-btn">
                <button 
                  class="btn btn-primary material-button"
                  id="cart-btn"
                  type="button" 
                  @click.prevent="addToCart(product.id)"
                >ADD TO CART</button>
                <button 
                  class="btn btn-primary material-button"
                  id="wishlist-btn"
                  type="button" 
                  @click.prevent="addToWishList(product.id)"
                >ADD TO WISHLIST</button>
              </div>
            </div>
          </div>

          <div class="col-12">
            <Pagination 
              :currentPage="currentPage" 
              :totalPages="totalPages" 
              :showPrevious="showPrevious()" 
              :showNext="showNext()"
              @pageClicked="getProducts($event)"
            ></Pagination>
          </div>
          
        </div>

        <div class="no-products-found" v-else>
          <div class="no-product-found-inner">
            <img src="/img/products/no-products-found-2021-05-26.jpg" alt="No Product Found">
            <h5>Sorry, No products found</h5>
          </div>
        </div>

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
        isLoading: true,
        isActive: this.$store.getters.isActive,
        isAuthenticated: this.$store.getters.authStatus,
        products: [],
        error: null,
        totalPages: null,
        totalProductsCount: null,
        currentPage: null,
        limit: 6
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
          const response = await axios.get(`${this.$store.getters.base_url}/shop/limitedProducts`, {
            headers: {
              'Authorization': `Bearer ${this.$store.getters.token}`
            }, params: {
              page: requestedPage,
              limit: this.limit,
              includeCategory: Boolean(false)
            }
          });

          if(response.data.success) {
            this.products = response.data.payload.products;
            this.totalPages = response.data.payload.totalPages;
            this.totalProductsCount = response.data.payload.productCount;
            this.currentPage = response.data.payload.currentPage;
            this.isLoading = false;
          }
        } catch (error) {
          console.log(error.response.data.message);
        }
      },

      async addToCart(productId) {
        if(!this.isAuthenticated) {
          return;
        }
        try {
          const response = await this.$store.dispatch('addToCart', productId);
          if(response.data.success) {
            this.$router.push('/user/cart');
          }
        } catch (error) {
          alert(error.response.data.message);
        }
      },

      async addToWishList(productId) {
        if(!this.isAuthenticated) {
          return;
        }
        try {
          const response = await this.$store.dispatch('addToWishList', productId);
          if(response.data.success) {
            this.$router.push('/user/wishlist');
          } else {
            alert(response.data.message);
          }
        } catch (error) {
          console.log(error.response);
        }
      }
    }, 
    created() {
      this.getProducts(1);
      if(!this.isAuthenticated) {
        this.error = 'Login to purchase products';
      } else if(!this.isActive) {
        this.error = 'Verify Email Id to add products in cart';
      }
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
    font-size: 14px;
  }

  #wishlist-btn {
    margin-left: 5px;
  }

  .form-control:focus,
  .btn:focus {
    box-shadow:none !important;
  }

  .no-product-found {
    margin-top: 60px;
  }

  .no-product-found-inner {
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }

  @media (min-width: 577px) and (max-width: 992px) {
    #cart-btn, #wishlist-btn {
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
    
    #wishlist-btn {
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }

</style>