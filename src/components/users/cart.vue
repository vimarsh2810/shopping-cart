<template>
  <div class="main-div">
    <Navbar />
    <div class="wrapper" style="margin-top: 100px">
      <div class="container">

        <div class="row">
          <div class="col-md-9 col-12">
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
                  <tr v-else v-for="product in cartProducts" :key="product.id">
                    <td>
                      <div class="cart-img text-center">
                        <img :src="product.imagePath" alt="">
                      </div>
                    </td>
                    <td class="vertical-center text-center">{{ product.title }}</td>
                    <td class="vertical-center text-center">{{ product.price }}</td>
                    <td class="vertical-center text-center" style="width: 200px">
                      <div class="quantity">
                        <button class="btn btn-success btn-qty" @click="product.cartItem.quantity--" style="display: inline-block">&#8722;</button>
                        <span style="display: inline-block">{{ product.cartItem.quantity }}</span>
                        <button class="btn btn-success btn-qty" @click="product.cartItem.quantity++" style="display: inline-block">&#43;</button><br>
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
            </div>
            <!-- Table responsive div ends -->

          </div>
          <div class="col-md-3 col-12">
            <!-- Checkout & Coupon starts -->

            <div class="card ml-auto mr-auto">
              <div class="coupon-form">
                <form method="POST">
                  <div class="form-group">
                    <input type="text" class="form-control" placeholder="Enter Coupon Code" name="couponCode" v-model="couponCode">
                  </div>
                  <div class="form-group">
                    <button class="btn btn-primary" type="submit" @click.prevent="verifyCoupon">Apply Coupon</button>
                  </div>
                </form>
              </div>
              <div class="update-cart-div">
                <div class="checkout-section">
                  <div class="checkout-div">
                    <p style="text-align: right;">
                      <span style="float: left;">
                        Total Amount
                      </span>
                      {{ totalAmount }}
                    </p>
                    <p style="text-align: right;">
                      <span style="float: left;">
                        Discount
                      </span>
                      <span v-if="isCouponApplied">50%</span>
                      <span v-else>0%</span>
                    </p>
                    <p style="text-align: right;">
                      <span style="float: left;">
                        Final Amount
                      </span>
                      {{ finalAmount }}
                    </p>
                    <button class="btn btn-primary" type="submit">Checkout</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Checkout & Coupon ends -->
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
      cartProducts: [],
      couponCode: '',
      isCouponApplied: false,
      totalAmount: 0,
      finalAmount: 0
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
        this.calculateAmount();
      } catch (error) {
        console.log(error.response);
      }
    },

    calculateAmount() {
      let totalDummyAmount = 0;
      let finalDummyAmount = 0;
      let cartProductsDummy = this.cartProducts;

      for(let product of cartProductsDummy) {
        totalDummyAmount += product.cartItem.quantity * product.price;
        if(this.isCouponApplied) {
          finalDummyAmount = totalDummyAmount / 2;
        } else {
          finalDummyAmount = totalDummyAmount;
        }
      }

      this.totalAmount = totalDummyAmount;
      this.finalAmount = finalDummyAmount;
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
    },

    async verifyCoupon() {
      try {
        const response = await axios.post('http://localhost:3000/cart/verifyCoupon', { couponCode: this.couponCode }, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.token}`
          }
        });
        console.log(response.data);
        if(response.data.success) {
          this.isCouponApplied = true;
          this.calculateAmount();
        }
      } catch (error) {
        
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

  ::placeholder {
    font-size: 10px;
  }

  .coupon-form input[type=text] {
    font-size: 10px;
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