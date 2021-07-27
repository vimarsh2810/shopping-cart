<template>
  <div class="main-div">
    <Navbar
      @searchProduct="searchProduct($event)"
    ></Navbar>
    <div class="wrapper" style="margin-top: 100px">
      <div class="container" v-if="!isLoading">
        <div class="row">
          <div class="col-12" v-if="products.length > 0">
            <h3>New Arrivals</h3>
            <!-- Carousel start -->
            <div id="carouselDiv" class="carousel slide" data-interval="false" data-ride="carousel">
              <div class="carousel-inner">
                <!-- eslint-disable -->
                <div
                  class="carousel-item product-details-img active"
                  v-for="(product, index) in newProducts"
                  v-if="index == 0"
                  :key="product.id"
                >
                  <img
                    :src="product.productImages[0].path"
                    class="d-block ml-auto mr-auto"
                    @click.prevent="$router.push({ name: 'ProductDetailsUser', params: { id: product.id }})"
                    alt="Product Image"
                  >
                  <h3
                    class="text-center mt-2"
                    @click.prevent="$router.push({ name: 'ProductDetailsUser', params: { id: product.id }})"
                  >{{ product.title }}</h3>
                </div>

                <div
                  class="carousel-item product-details-img"
                  v-for="(product, index) in newProducts"
                  v-if="index != 0"
                  :key="product.id"
                >
                  <img
                    :src="product.productImages[0].path"
                    class="d-block ml-auto mr-auto"
                    @click.prevent="$router.push({ name: 'ProductDetailsUser', params: { id: product.id }})"
                    alt="Product Image"
                  >
                  <h3
                    class="text-center mt-2"
                    @click.prevent="$router.push({ name: 'ProductDetailsUser', params: { id: product.id }})"
                  >{{ product.title }}</h3>
                </div>
                <!-- eslint-enable -->
              </div>
              <!-- Carousel Arrows start -->
              <a class="carousel-control-prev" href="#carouselDiv" role="button" data-slide="prev">
                <i class="fas fa-angle-left fa-2x mr-5"></i>
                <span class="sr-only">Previous</span>
              </a>
              <a class="carousel-control-next" href="#carouselDiv" role="button" data-slide="next">
                <i class="fas fa-angle-right fa-2x ml-5"></i>
              </a>
              <!-- Carousel Arrows end -->
            </div>
            <!-- Carousel start -->
          </div>
          <div class="col-12">
            <h3 class="mbpx-30px">Products</h3>
          </div>
          <div class="col-12">
            <div class="alert alert-danger" role="alert" v-if="error">
              {{ error }}
            </div>
          </div>
        </div>
        <div class="row">
          <!-- Product filter starts -->
          <div class="col-12 mb-5">
            <div class="row">

              <div class="col-3">
                <select name="brand" id="brand" class="form-control" @change="onSelectBrand">
                  <option value="" selected hidden>Select Brand</option>
                  <option 
                    :value="brand.id" 
                    v-for="brand in brands" 
                    :key="brand.id"
                  >{{ brand.name }}
                  </option>
                </select>
              </div>

              <div class="col-3">
                <input 
                  type="text" 
                  class="form-control" 
                  name="minPrice" 
                  id="minPrice"
                  v-model="minPrice"
                  placeholder="Minimum Price"
                >
              </div>

              <div class="col-3">
                <input 
                  type="text" 
                  class="form-control" 
                  name="maxPrice" 
                  id="maxPrice" 
                  v-model="maxPrice"
                  placeholder="Maximum Price"
                >
              </div>

              <div class="col-3">
                <button 
                  type="button" 
                  class="btn btn-primary w-100"
                  @click.prevent="filterProducts()"
                >Filter
                </button>
              </div>

            </div>
          </div>
          <!-- Product filter ends -->
        </div>
        <div class="row" v-if="products.length > 0">
          <!-- Product grid starts -->
          <div class="col-md-4 col-sm-6 col-12 mbpx-30px" v-for="product in products" :key="product.id">
            <div class="card">
              <div class="card-product-img">
                <img 
                  :src="product.productImages[0].path" 
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
          <!-- Product filter ends -->
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
            <img src="/img/products/no-products-found.png" alt="No Product Found">
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
        isFiltered: false,
        isActive: this.$store.getters.isActive,
        isAuthenticated: this.$store.getters.authStatus,
        products: [],
        newProducts: [],
        brands: null,
        selectedBrand: null,
        minPrice: null,
        maxPrice: null,
        error: null,
        totalPages: null,
        totalProductsCount: null,
        currentPage: null,
        cartProducts: [],
        limit: 5
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
          let response;
          if(this.isFiltered) {
            if(!this.minPrice) {
              this.minPrice = 0;
            }
            if(!this.maxPrice) {
              this.maxPrice = 10000000;
            }

            response = await axios.get(`${this.$store.getters.base_url}/shop/filteredProducts`, {
              params: {
                brandId: this.selectedBrand,
                minPrice: this.minPrice,
                maxPrice: this.maxPrice,
                page: requestedPage,
                limit: this.limit
              }
            });
          } else {
            response = await axios.get(`${this.$store.getters.base_url}/shop/limitedProducts`, {
              params: {
                page: requestedPage,
                limit: this.limit,
                includeCategory: Boolean(false)
              }
            });
          }

          if(response.data.success) {
            this.products = response.data.payload.products;
            this.totalPages = response.data.payload.totalPages;
            this.totalProductsCount = response.data.payload.productCount;
            this.currentPage = response.data.payload.currentPage;
            await this.$store.dispatch('getBrands');
            this.brands = this.$store.getters.brands;
            this.isLoading = false;
          }
        } catch (error) {
          console.log(error.response.data.message);
        }
      },

      async getNewArrivals() {
        try {
          const response = await axios.get(`${this.$store.getters.base_url}/shop/newArrivals`);
          if(response.data.success) {
            this.newProducts = response.data.payload;
          }
        } catch (error) {
          console.log(error.response);
        }
      },
      
      filterProducts() {
        this.isFiltered = true;
        this.getProducts(1);
      },

      async searchProduct(searchText) {
        if(!searchText) {
          return;
        }
        try {
          const response = await axios.get(`${this.$store.getters.base_url}/shop/searchedProducts`, {
            params: {
              page: 1,
              limit: this.limit,
              searchText: searchText,
              categoryId: null
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

      onSelectBrand() {
        this.selectedBrand = document.querySelector('#brand').value;
      },

      async getCart() {
        if(!this.isActive) {
          return;
        }
        try {
          const response = await this.$store.dispatch(`getCart`);
          
          if(response.data.success) {
            this.cartProducts = response.data.payload.products;
          } else {
            this.$store.dispatch('refreshAccessToken', response.data.accessToken);
            await this.getCart();
          }
        } catch (error) {
          console.log(error.response.data.message);
        }
      },

      checkProductInCart(productId) {
        return this.cartProducts.some(product => product.id === productId);
      },

      async addToCart(productId) {
        if(!this.isAuthenticated || !this.isActive) {
          return;
        }

        if(this.checkProductInCart(productId)) {
          alert('Product already in cart.');
          return;
        }
        
        try {
          const response = await this.$store.dispatch('addToCart', productId);
          if(response.data.success) {
            this.$router.push('/user/cart');
          } else {
            this.$store.dispatch('refreshAccessToken', response.data.accessToken);
            await this.addToCart(productId);
          }
        } catch (error) {
          console.log(error.response.data.message);
        }
      },

      async addToWishList(productId) {
        if(!this.isAuthenticated || !this.isActive) {
          return;
        }
        try {
          const response = await this.$store.dispatch('addToWishList', productId);
          if(response.data.success) {
            this.$router.push('/user/wishlist');
          } else if(response.data.message !== 'Refreshed AccessToken') {
            alert(response.data.message);
          } else {
            this.$store.dispatch('refreshAccessToken', response.data.accessToken);
            await this.addToWishList(productId);
          }
        } catch (error) {
          console.log(error.response);
        }
      }
    },

    created() {
      this.getProducts(1);
      this.getNewArrivals();
      this.getCart();
      if(!this.isAuthenticated) {
        this.error = 'Login to purchase products';
      } else if(!this.isActive) {
        this.error = 'Verify Email Id to add products in cart';
      }
    }
  }
</script>

<style scoped src="../../assets/css/product-listing.css"></style>