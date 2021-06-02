<template>
  <div class="main-div">
    <AdminNavbar />
    <div class="wrapper" style="margin-top: 100px">
      <div class="container" v-if="!isLoading">
        <div class="row">
          <div class="col-sm-6 col-12">
            <h4 class="mb-2 mt-2">Products</h4>
          </div>
          <div class="col-sm-6 col-12">
            <button 
              class="btn btn-primary d-block mb-2 mt-2"
              id="add-product-link"
              @click="$router.push({ name: 'AddProduct' })"
            >Add New Product</button>
          </div>
          <div class="col-12">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th class="text-center">Product Image</th>
                    <th class="text-center">Product Title</th>
                    <th class="text-center">Category</th>
                    <th class="text-center">Product Price</th>
                    <th class="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="products.length <= 0">
                    <td colspan="5" class="text-center">No Products</td>
                  </tr>
                  <tr v-else v-for="product in products" :key="product.id">
                    <td>
                      <div class="product-img text-center">
                        <img :src="product.imagePath" alt="">
                      </div>
                    </td>
                    <td class="text-center vertical-center">{{ product.title }}</td>
                    <td class="text-center vertical-center">{{ product.category.title }}</td>
                    <td class="text-center vertical-center">{{ product.price }}</td>
                    <td class="text-center vertical-center">
                      <button 
                        class="btn btn-warning"
                        @click="goToEditProduct(product.id)"
                      >Edit</button>
                      <button 
                        class="btn btn-danger ml-2"
                        @click="deleteProduct(product.id)"
                      >Delete</button>
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
                @pageClicked="getProducts($event)"
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
import AdminNavbar from '../shared/admin-navbar.vue';
import Pagination from '../shared/pagination.vue';

export default {
  name: 'ManageProducts',
  components: { AdminNavbar, Pagination },
  data() {
    return {
      isLoading: true,
      products: [],
      currentPage: null,
      totalPages: null,
      limit: 5
    };
  },

  methods: {
    async getProducts(requestedPage) {
      try {
        const response = await axios.get(`${this.$store.getters.base_url}/shop/limitedProducts`, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.token}`
          }, params: {
            page: requestedPage,
            limit: this.limit,
            includeCategory: Boolean(true)
          }
        });

        if(response.data.success) {
          this.products = response.data.payload.products;
          this.currentPage = response.data.payload.currentPage;
          this.totalPages = response.data.payload.totalPages;
          this.isLoading = false;
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    },

    async deleteProduct(productId) {
      if(confirm('Do you really want to delete this product?')) {
        try {
          const response = await axios.delete(`${this.$store.getters.base_url}/admin/product/${productId}`, {
            headers: {
              'Authorization': `Bearer ${this.$store.getters.token}`
            }
          });

          if(response.data.success) {
            this.getProducts(this.currentPage);
          }
        } catch (error) {
          console.log(error.response.data.message);
        }
      }
    },

    goToEditProduct(productId) {
      this.$router.push({ name: 'EditProduct', params: { id: productId } });
    },

    showPrevious() {
      return this.currentPage == 1 ? false : true;
    },

    showNext() {
      return this.currentPage == this.totalPages ? false : true;
    }
  },

  created() {
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

  .container {
    min-width: 100% !important;
  }

  tbody tr:last-child {
    border-bottom: 1px solid #dee2e6;
  }

  .product-img {
    width: 200px;
    height: 140px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    display:flex;
    align-items:center;
    justify-content:center;
  }

  .product-img img {
    max-height: 70%;
    max-width: 70%;
    width: auto;
  }

  .vertical-center {
    vertical-align: middle;
  }

  @media (max-width: 992px) {
    .product-img {
      width: 150px;
      height: 100px;
    }
  }

  #add-product-link {
    margin-left: auto;
  }

  @media (max-width: 576px) {
    #add-product-link {
      margin-left: 0;
      margin-right: auto;
    }
  }

</style>