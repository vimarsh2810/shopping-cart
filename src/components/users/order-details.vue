<template>
  <div class="main-div">
    <Navbar />
    <div class="wrapper" style="margin-top: 100px">
      <div class="container" v-if="!isLoading">
        <div class="alert alert-danger" role="alert" v-if="!isUserActive">
          Verify Email Id to access this functionality
        </div>
        <div class="row">
          <div class="col-12">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th class="text-center">Product Title</th>
                    <th class="text-center">Product Category</th>
                    <th class="text-center">Product Price</th>
                    <th class="text-center">Product Quantity</th>
                    <th class="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="visibleProducts.length <= 0">
                    <td colspan="5" class="text-center">No Products</td>
                  </tr>
                  <tr v-else v-for="product in visibleProducts" :key="product.id">
                    <td class="text-center">{{ product.title }}</td>
                    <td class="text-center">{{ product.category.title }}</td>
                    <td class="text-center">{{ product.price }}</td>
                    <td class="text-center">{{ product.orderItem.quantity }}</td>
                    <td class="text-center">
                      <button
                        v-if="orderStatus === 'in Process'"
                        class="btn btn-primary mr-2"
                        @click="removeProduct(product.id)"
                      >Remove</button>
                      <button
                        class="btn btn-primary"
                        @click="redirectToProductDetails(product.id)"
                      >Product Details</button>
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
                @pageClicked="filterProducts($event)"
              ></Pagination>
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
import Pagination from '../shared/pagination.vue';

export default {
  name: 'OrderDetails',
  components: { Navbar, Pagination },
  data() {
    return {
      orderStatus: null,
      allOrderProducts: [],
      visibleProducts: [],
      isLoading: true,
      currentPage: null,
      totalPages: null,
      limit: 5,
      isUserActive: this.$store.getters.userData.isActive
    };
  },

  methods: {
    async getOrderProducts() {
      if(!this.isUserActive) {
        this.isLoading = false;
        return;
      }
      try {
        const response = await axios.get(`${this.$store.getters.base_url}/user/order/${this.$route.params.id}`, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.token}`
          }
        });

        if(response.data.success) {
          this.orderStatus = response.data.payload.status;
          this.allOrderProducts = response.data.payload.products;
          this.totalPages = Math.ceil(this.allOrderProducts.length / this.limit);
          this.filterProducts(1);
          this.isLoading = false;
        }
      } catch (error) {
        console.log(error.response.data);
      }
    },

    filterProducts(requiredPage) {
      const startIndex = (requiredPage - 1) * this.limit;
      const endIndex = startIndex + this.limit - 1;
      this.visibleProducts = this.allOrderProducts.filter((product, index) => index >= startIndex && index <= endIndex);
      this.currentPage = requiredPage;
    },

    showPrevious() {
      return this.currentPage == 1 ? false : true;
    },

    showNext() {
      return this.currentPage == this.totalPages ? false : true;
    },

    async removeProduct(productId) {
      
    },

    redirectToProductDetails(productId) {
      this.$router.push({ name: 'ProductDetails', params: { id: productId } });
    }
  },

  created() {
    this.getOrderProducts();
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

  tbody tr:last-child {
    border-bottom: 1px solid #dee2e6;
  }
</style>