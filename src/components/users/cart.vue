<template>
  <div class="main-div">
    <Navbar />
    <div class="wrapper" style="margin-top: 100px">
      <div class="container">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th class="text-center">Action</th>
                <th class="text-center">Product Image</th>
                <th class="text-center">Product Name</th>
                <th class="text-center">Price</th>
                <th class="text-center">Quantity</th>
                <th class="text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in cartProducts" :key="product.id">
                <td class="text-center">
                  <button @click.prevent="deleteCartItem(product.id)">DELETE</button>
                </td>
                <td>
                  <div class="cart-img text-center">
                    <img :src="product.imagePath" alt="">
                  </div>
                </td>
                <td class="vertical-center text-center">{{ product.title }}</td>
                <td class="vertical-center text-center">{{ product.price }}</td>
                <td class="vertical-center text-center">
                  <div class="quantity">
                    <button class="btn">+</button>
                    <input type="text" class="form-control" v-model="ddd">
                    <button class="btn">+</button>
                  </div>
                </td>
                <td class="vertical-center text-center">{{ product.total }}</td>
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
        console.log(response.data);
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
      } catch (error) {
        console.log(error.response);
      }
    },
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
    max-width: 200px;
    max-height: 140px;
    object-fit: cover;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
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
</style>