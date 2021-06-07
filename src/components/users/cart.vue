<template>
  <div class="main-div">
    <Navbar />
    <div class="wrapper" style="margin-top: 100px">
      <!-- Container starts -->
      <div class="container" v-if="!isLoading">
        <div class="row">
          <div class="col-6">
            <h4 class="mb-3">My Cart</h4>
          </div>

          <div class="col-6">
            <h4 class="mb-3 text-right">Wallet Balance: &#8377;&nbsp;{{ walletBalance }}</h4>
          </div>
          <div class="col-12">
            <div class="alert alert-danger" role="alert" v-if="!isUserActive">
              Verify Email Id to add products in cart
            </div>
            <!-- Table responsive div starts -->
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th class="text-center vertical-center">Product Image</th>
                    <th class="text-center vertical-center">Product Name</th>
                    <th class="text-center vertical-center">Price</th>
                    <th class="text-center vertical-center">Quantity</th>
                    <th class="text-center vertical-center">Total</th>
                    <th class="text-center vertical-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="cartProducts.length <= 0">
                    <td colspan="6" class="text-center no-products-tr">No Products in your cart</td>
                  </tr>
                  <tr v-else v-for="product in visibleCartProducts" :key="product.id">
                    <td>
                      <div class="cart-img text-center">
                        <img :src="product.imagePath" alt="">
                      </div>
                    </td>
                    <td class="vertical-center text-center">{{ product.title }}</td>
                    <td class="vertical-center text-center">&#8377;&nbsp;{{ product.price }}</td>
                    <td class="vertical-center text-center" style="width: 200px">
                      <div class="quantity">
                        <button 
                          class="btn btn-success btn-qty" 
                          @click="product.cartItem.quantity--" 
                          style="display: inline-block"
                        >&#8722;</button>
                        <span style="display: inline-block">{{ product.cartItem.quantity }}</span>

                        <button 
                          class="btn btn-success btn-qty" 
                          @click="product.cartItem.quantity++" 
                          style="display: inline-block"
                        >&#43;</button><br>

                        <button 
                          class="btn btn-sm btn-primary update-qty-btn" 
                          @click="updateQuantity(product.id, product.cartItem.quantity)"
                        >Update Quantity</button>
                      </div>
                    </td>
                    <td class="vertical-center text-center">{{ product.cartItem.quantity * product.price }}</td>
                    <td class="vertical-center text-center">
                      <button 
                        class="btn btn-warning" 
                        style="color: #fff" 
                        @click="deleteCartItem(product.id)"
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
            <button 
              class="btn btn-primary" 
              type="button" 
              id="btn-checkout" 
              data-toggle="modal" 
              data-target="#checkoutModal"
            >Checkout</button>
          </div>
        </div>
      </div>
      <!-- Container ends -->
    </div>

    <!-- Checkout Modal starts -->

    <div class="modal fade" id="checkoutModal" tabindex="-1" aria-labelledby="checkoutModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="checkoutModalLabel">Confirm Checkout</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            Are you sure you want to checkout? 
          </div>
          <div class="modal-footer d-flex justify-content-center align-content-center">
            <button
              type="button" 
              class="btn btn-success"
              data-dismiss="modal" 
              style="margin-right: 10px" 
              @click.prevent="checkout"
            >Yes</button>
            <button type="button" class="btn btn-danger">No</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Checkout Modal ends -->

  </div>
</template>
<script>

import axios from 'axios';
import Navbar from "../shared/navbar.vue";
import Pagination from '../shared/pagination';

export default {
  name: "Cart",
  components: { Navbar, Pagination },
  data() {
    return {
      walletBalance: this.$store.getters.walletBalance,
      cartProducts: [],
      visibleCartProducts: [],
      isLoading: true,
      currentPage: null,
      totalPages: null,
      limit: 5,
      isUserActive: this.$store.getters.userData.isActive
    };
  },
  methods: {
    async getCart() {
      if(!this.isUserActive) {
        this.isLoading = false;
        return;
      }
      try {
        const response = await axios.get(`${this.$store.getters.base_url}/cart/products`, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.token}`
          }
        });
        
        if(response.data.success) {
          this.cartProducts = response.data.payload.products;
          this.totalPages = Math.ceil(this.cartProducts.length / this.limit);
          this.isLoading = false;
          this.filterItems(1);
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    },

    async deleteCartItem(productId) {
      if(confirm('Are you sure you want to delete this product from cart?')) {
        try {
          const response = await axios.delete(`${this.$store.getters.base_url}/cart/products/${productId}`, {
            headers: {
              'Authorization': `Bearer ${this.$store.getters.token}`
            }
          });
          this.getCart();
        } catch (error) {
          console.log(error.response);
        }
      }
    },

    async updateQuantity(productId, quantity) {
      if(confirm('Are you sure you want to update quantity?')) {
        if(quantity == 0) {
          await this.deleteCartItem(productId);
          return;
        }
        try {
          const response = await axios.put(`${this.$store.getters.base_url}/cart/${productId}/quantity`, { quantity }, {
            headers: {
              'Authorization': `Bearer ${this.$store.getters.token}`
            }
          });
          this.getCart();
        } catch (error) {
          console.log(error.response);
        }
      }
    },

    filterItems(requiredPage) {
      const startIndex = (parseInt(requiredPage) - 1) * this.limit;
      const endIndex = startIndex + this.limit - 1;
      this.visibleCartProducts = this.cartProducts.filter((product, index) => index >= startIndex && index <= endIndex);
      this.currentPage = requiredPage;
    },

    showPrevious() {
      return this.currentPage == 1 ? false : true;
    },

    showNext() {
      return this.currentPage == this.totalPages ? false : true;
    },

    checkout() {
      if(!this.isUserActive) {
        return;
      }
      this.$router.push('/user/cart/payment')
    }
  },

  created() {
    this.getCart();
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

  .quantity span {
    margin-left: 10px; 
    margin-right: 10px
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

  .update-qty-btn {
    margin-top: 10px;
  }

  #btn-checkout {
    display: block;
    width: 200px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 30px;
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

    .btn-qty {
      padding: 4px 6px;
    }

    .card {
      width: fit-content;
    }

    .checkout-div p {
      font-size: 10px;
    }
  }

</style>