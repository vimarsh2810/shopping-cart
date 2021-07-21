<template>
  <div class="main-div">
    <Navbar
      @searchProduct="searchProduct($event)"
    ></Navbar>
    <div class="wrapper" style="margin-top: 100px" v-if="!isLoading">
      <!-- Container starts -->
      <div class="container">
        <h4 class="mbpx-30px">{{ categoryTitle }}</h4>
        <div class="alert alert-danger" role="alert" v-if="error">
          {{ error }}
        </div>

        <div class="row mb-5">

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

        <!-- Row starts -->
        <div class="row" v-if="products.length > 0">

          <div class="col-md-4 col-sm-6 col-12 mbpx-30px" v-for="product in products" :key="product.id">
            <div class="card">
              <div class="card-product-img" @click.prevent="$router.push({ name: 'ProductDetailsUser', params: { id: product.id } })">
                <img :src="product.productImages[0].path" alt="">
              </div>
              <div class="card-product-details">
                <h4
                  @click.prevent="$router.push({ name: 'ProductDetailsUser', params: { id: product.id } })"
                >{{ product.title }}</h4>
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
              @pageClicked="getProductsByCategory($event)"
            ></Pagination>
          </div>
          
        </div>
        <!-- Row ends -->
        <div class="no-product-found" v-else>
          <div class="no-product-found-inner">
            <img src="/img/products/no-products-found-2021-05-26.jpg" alt="">
            <h5>Sorry, No products found for this category!</h5>
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
import Pagination from '../shared/pagination';

export default {
  name: 'ShopByCategory',
  components: { Navbar, Pagination },
  props: ['title'],
  data() {
    return {
      isLoading: true,
      products: [],
      brands: null,
      selectedBrand: null,
      minPrice: null,
      maxPrice: null,
      categoryTitle: null,
      error: null,
      searchText: null,
      isFiltered: false,
      isUserActive: this.$store.getters.userData.isActive,
      isAuthenticated: this.$store.getters.authStatus,
      currentPage: null,
      totalPages: null,
      cartProducts: [],
      limit: 6
    };
  },

  methods: {

    showPrevious() {
      return this.currentPage == 1 ? false : true;
    },

    showNext() {
      return this.currentPage == this.totalPages ? false : true;
    },

    onSelectBrand() {
      this.selectedBrand = document.querySelector('#brand').value;
    },

    filterProducts() {
      this.isFiltered = true;
      this.getProductsByCategory(1);
    },

    async getProductsByCategory(requestedPage) {
      try {
        let response;
        if(this.isFiltered) {
          if(!this.minPrice) {
            this.minPrice = 0;
          }

          if(!this.maxPrice) {
            this.maxPrice = 10000000;
          }

          response = await axios.get(`${this.$store.getters.base_url}/shop/filteredProductsCategory`, {
            params: {
              brandId: this.selectedBrand,
              minPrice: this.minPrice,
              maxPrice: this.maxPrice,
              page: requestedPage,
              limit: this.limit,
              categoryId: this.$route.params.id
            }
          });
        } else {
          response = await axios.get(`${this.$store.getters.base_url}/shop/productsByCategory/${this.$route.params.id}`, {
            params: {
              page: requestedPage,
              limit: this.limit
            }
          });
        }

        if(response.data.success) {
          this.products = response.data.payload.products;
          this.currentPage = response.data.payload.currentPage;
          this.totalPages = response.data.payload.totalPages
          this.categoryTitle = response.data.payload.categoryTitle;
          await this.$store.dispatch('getBrands');
          this.brands = this.$store.getters.brands;
          this.isLoading = false;
        }
      } catch (error) {
        console.log(error.response);
      }
    },

    async getCart() {
      if(!this.isUserActive) {
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

    async searchProduct(searchText) {
      if(!searchText) {
        return;
      }

      try {
        const response = await axios.get(`${this.$store.getters.base_url}/shop/searchedProducts`, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.token}`
          }, params: {
            page: 1,
            limit: this.limit,
            searchText: searchText,
            categoryId: this.$route.params.id
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

    checkProductInCart(productId) {
      return this.cartProducts.some(product => product.id === productId);
    },

    async addToCart(productId) {
      if(!this.isAuthenticated) {
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
        console.log(error.response);
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
    this.getProductsByCategory(1);
    this.getCart();
    if(!this.isAuthenticated) {
      this.error = 'Login to purchase products';
    } else if(!this.isUserActive) {
      this.error = 'Verify Email Id to add products in cart';
    }
  }
}
</script>

<style scoped src="../../assets/css/product-listing.css"></style>