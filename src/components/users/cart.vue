<template>
  <div class="main-div">
    <Navbar />
    <div class="wrapper" style="margin-top: 100px">
      <div class="container">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th class="text-center">Product Image</th>
                <th class="text-center">Product Name</th>
                <th class="text-center">Price</th>
                <th class="text-center">Quantity</th>
                <th class="text-center">Total</th>
                <th class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="cartProducts.length <= 0">
                <td colspan="6" class="text-center no-products-tr">No Products in your cart</td>
              </tr>
              <tr v-else v-for="product in cartProducts" :key="product.id">
                <td>
                  <div class="cart-img text-center">
                    <img :src="product.imagePath" alt="">
                  </div>
                </td>
                <td class="vertical-center text-center">{{ product.title }}</td>
                <td class="vertical-center text-center">{{ product.price }}</td>
                <td class="vertical-center text-center">
                  <div class="quantity">
                    <button class="btn btn-success" @click="product.cartItem.quantity--">&#8722;</button>
                    <span>{{ product.cartItem.quantity }}</span>
                    <button class="btn btn-success" @click="product.cartItem.quantity++">&#43;</button><br>
                    <button class="btn btn-sm btn-primary update-qty-btn" @click="updateQuantity(product.id, product.cartItem.quantity)">Update Quantity</button>
                  </div>
                </td>
                <td class="vertical-center text-center">{{ product.total }}</td>
                <td class="vertical-center text-center">
                  <button class="btn btn-warning" style="color: #fff" @click="deleteCartItem(product.id)">DELETE</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="card" style="display: inline-block">
            <div class="coupon-form float-left">
              <form action="">
                <div class="form-group d-inline-block mr-2">
                  <input type="text" class="form-control" placeholder="Enter Coupon Code">
                </div>
                <div class="form-group d-inline-block">
                  <button class="btn btn-primary" type="submit">Apply Coupon</button>
                </div>
              </form>
            </div>
            <div class="update-cart-div float-right">
              <div class="form-group d-inline-block">
                <button class="btn btn-primary" type="submit">Update Cart</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import Navbar from "../shared/navbar.vue";
export default {
  name: "Cart",
  components: { Navbar },
  data() {
    return {
      ddd: '',
      cartProducts: []
    };
  },
  methods: {
    async getCart() {
      try {
        const response = await axios.get('http://localhost:3000/cart/getCart', {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.token}`
          }
        });
        this.cartProducts = response.data.payload.products;
      } catch (error) {
        console.log(error.response);
      }
    },
    async deleteCartItem(productId) {
      try {
        const response = await axios.delete(`http://localhost:3000/cart/deleteCartItem/${productId}`, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.token}`
          }
        });
        console.log(response.data);
        location.reload();
      } catch (error) {
        console.log(error.response);
      }
    },
    async updateQuantity(productId, quantity) {
      try {
        const response = await axios.put(`http://localhost:3000/cart/updateQuantity/${productId}`, { quantity }, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.token}`
          }
        });
        location.reload();
      } catch (error) {
        console.log(error.response);
      }
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
    padding: 20px;
  }

  .quantity span {
    margin-left: 10px; 
    margin-right: 10px
  }

  td button:focus {
    box-shadow:none !important;
  }

  .no-products-tr {
    padding-top: 30px;
    padding-bottom: 30px;
  }

  .update-qty-btn {
    margin-top: 10px;
  }

</style>