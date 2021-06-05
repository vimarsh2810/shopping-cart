<template>
  <div class="main-div">
    <Navbar />
    <div class="wrapper" style="margin-top: 100px">
      <!-- Container starts -->
      <div class="container" v-if="!isLoading">

        <div class="row">
          <div class="col-12">
            <div class="alert alert-danger" role="alert" v-if="!isUserActive">
              Verify Email Id to add products in WishList
            </div>
            <!-- Table responsive div starts -->
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th class="text-center vertical-center">Product Image</th>
                    <th class="text-center vertical-center">Product Name</th>
                    <th class="text-center vertical-center">Product Description</th>
                    <th class="text-center vertical-center">Price</th>
                    <th class="text-center vertical-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="wishListProducts.length <= 0">
                    <td colspan="6" class="text-center no-products-tr">No Products in your WishList</td>
                  </tr>
                  <tr v-else v-for="product in visibleProducts" :key="product.id">
                    <td>
                      <div class="cart-img text-center">
                        <img :src="product.imagePath" alt="">
                      </div>
                    </td>
                    <td class="vertical-center text-center">{{ product.title }}</td>
                    <td class="vertical-center text-center">{{ product.description }}</td>
                    <td class="vertical-center text-center">{{ product.price }}</td>
                    <td class="vertical-center text-center">
                      <button 
                        class="btn btn-primary" 
                        style="color: #fff" 
                        @click="addToCart(product.id)"
                      >ADD TO CART</button>
                      <button 
                        class="btn btn-warning ml-2" 
                        style="color: #fff" 
                        @click="removeFromWishList(product.id)"
                      >DELETE</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-12">
              <Pagination 
                :currentPage="currentPage" 
                :totalPages="totalPages" 
                :showPrevious="showPrevious()" 
                :showNext="showNext()"
                @pageClicked="filterItems($event)"
              ></Pagination>
            </div>
            <!-- Table responsive div ends -->
          </div>
        </div>
      </div>
      <!-- Container ends -->
    </div>

  </div>
</template>

<script>

import axios from 'axios';
import Navbar from "../shared/navbar.vue";
import Pagination from '../shared/pagination';

export default {
  name: "WishList",
  components: { Navbar, Pagination },
  data() {
    return {
      wishListProducts: [],
      visibleProducts: [],
      isLoading: true,
      currentPage: null,
      totalPages: null,
      limit: 5,
      isAuthenticated: this.$store.getters.authStatus,
      isUserActive: this.$store.getters.userData.isActive
    };
  },
  methods: {
    async getWishList() {
      if(!this.isUserActive) {
        this.isLoading = false;
        return;
      }
      try {
        const response = await axios.get(`${this.$store.getters.base_url}/user/wishList`, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.token}`
          }
        });
        
        if(response.data.success) {
          this.wishListProducts = response.data.payload.products;
          this.totalPages = Math.ceil(this.wishListProducts.length / this.limit);
          this.isLoading = false;
          this.filterItems(1);
        }
      } catch (error) {
        console.log(error.response);
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
        console.log(error.response.data.message);
      }
    },

    async removeFromWishList(productId) {
      if(confirm('Are you sure you want to remove this product from wishList?')) {
        try {
          const response = await axios.delete(`${this.$store.getters.base_url}/user/wishList/${productId}`, {
            headers: {
              'Authorization': `Bearer ${this.$store.getters.token}`
            }
          });
          this.getWishList();
        } catch (error) {
          console.log(error.response);
        }
      }
    },

    filterItems(requiredPage) {
      const startIndex = (parseInt(requiredPage) - 1) * this.limit;
      const endIndex = startIndex + this.limit - 1;
      this.visibleProducts = this.wishListProducts.filter((product, index) => index >= startIndex && index <= endIndex);
      this.currentPage = requiredPage;
    },

    showPrevious() {
      return this.currentPage == 1 ? false : true;
    },

    showNext() {
      return this.currentPage == this.totalPages ? false : true;
    }
  },

  created() {
    this.getWishList();
  }
};
</script>
<style scoped>
  .wrapper {
    max-width: 1450px;
    height: 100%;
    margin-left: auto;
    margin-right: auto;
  }

  .mbpx-30px {
    margin-bottom: 30px;
  }

  .container {
    min-width: 100% !important;
  }
  .cart-img {
    width: 200px;
    height: 140px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    display:flex;
    align-items:center;
    justify-content:center;
  }

  .cart-img img {
    max-height: 70%;
    max-width: 70%;
    width: auto;
  }

  .vertical-center {
    vertical-align: middle;
  }
  .card {
    width: 100%;
    padding: 10px;
  }

  td button:focus {
    box-shadow:none !important;
  }

  tr:last-child {
    border-bottom: 1px solid #dee2e6;
  }

  .no-products-tr {
    padding-top: 30px;
    padding-bottom: 30px;
  }

  @media (max-width: 992px) {
    button {
      font-size: 12px;
    }
    td, th {
      font-size: 12px;
    }

    .cart-img {
      width: 150px;
      height: 100px;
    }

    .card {
      width: fit-content;
    }
  }

</style>