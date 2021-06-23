<template>
  <div class="main-div">
    <Navbar/>
    <div class="wrapper" style="margin-top: 100px">
      <div class="alert alert-danger ml-5 mr-5" role="alert" v-if="!isUserActive">
        Verify Email Id to access this functionality
      </div>
      <div class="container" v-else>
        <!-- Checkout & Coupon starts -->
        <h4 class="text-center" style="margin-bottom: 30px">Make Payment</h4>
        <div class="card ml-auto mr-auto" id="payment-info-card">
          <div class="alert alert-danger" role="alert" v-if="error">
            {{ error }}
          </div>
          <div class="alert alert-success" role="alert" v-if="successMsg">
            {{ successMsg }}
          </div>
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
                <button class="btn btn-primary" type="button" id="btn-confirm" data-toggle="modal" data-target="#exampleModal">Make Payment</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Checkout & Coupon ends -->
        <!-- Modal Starts -->
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Confirm Payment</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                Final Amount: {{ finalAmount }} 
              </div>
              <div class="modal-footer d-flex justify-content-center align-content-center">
                <button 
                  type="button" 
                  class="btn btn-success" 
                  data-dismiss="modal" 
                  style="margin-right: 10px" 
                  @click.prevent="makePayment(true)"
                >
                  Success
                </button>
                <button 
                  type="button" 
                  class="btn btn-danger" 
                  data-dismiss="modal" 
                  @click.prevent="makePayment(false)"
                >
                  Fail
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- Modal Ends -->
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Navbar from '../shared/navbar.vue';
export default {
  name: 'Payment',
  components: { Navbar },
  data() {
    return {
      orderId: null,
      totalAmount: 0,
      finalAmount: 0,
      discount: 0,
      couponCode: null,
      isCouponApplied: false,
      isUserActive: this.$store.getters.userData.isActive,
      error: null,
      successMsg: null
    };
  },
  methods: {
    async makePayment(isSuccess) {
      try {
        const response = await axios.post(
          `${this.$store.getters.base_url}/cart/payment`, 
          { 
            paymentSuccess: isSuccess,
            couponCode: this.couponCode,
            isCouponApplied: this.isCouponApplied
          }, 
          {
            headers: {
              'Authorization': `Bearer ${this.$store.getters.refreshToken}`
          }, params: {
            accessToken: this.$store.getters.token
          }
        });
        if(response.data.success) {
          this.error = null;
          this.successMsg = response.data.message;
          this.orderId = response.data.payload.id;
          this.$store.dispatch('getWalletBalance');
          await this.generateInvoice();
        } else if(response.data.message === 'Refreshed AccessToken') {
          this.$store.dispatch('refreshAccessToken', response.data.accessToken);
          await this.makePayment(isSuccess);
        } else {
          this.successMsg = null;
          this.error = response.data.message;
        }
      } catch (error) {
        this.successMsg = null;
        this.error = error.response.data.message;
      }
    },

    async getPaymentAmount() {
      try {
        const response = await axios.post(`${this.$store.getters.base_url}/cart/paymentAmount`, { isCouponApplied: this.isCouponApplied }, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.refreshToken}`
          }, params: {
            accessToken: this.$store.getters.token
          }
        });
        if(response.data.success) {
          this.totalAmount = response.data.payload.totalAmount;
          this.finalAmount = response.data.payload.finalAmount;
          this.discount = response.data.payload.discount;
        } else if(response.data.message === 'Refreshed AccessToken') {
          this.$store.dispatch('refreshAccessToken', response.data.accessToken);
          await this.getPaymentAmount();
        } else {
          this.$router.push({ name: 'Cart' });
        }
      } catch (error) {
        this.successMsg = null;
        this.error = error.response.data.message;
      }
    },

    async verifyCoupon() {
      try {
        const response = await axios.post(`${this.$store.getters.base_url}/cart/verifyCoupon`, { couponCode: this.couponCode }, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.refreshToken}`
          }, params: {
            accessToken: this.$store.getters.token
          }
        });
        
        if(response.data.success) {
          this.isCouponApplied = true;
          this.error = null;
          this.successMsg = response.data.message;
          this.getPaymentAmount();
        } else {
          this.$store.dispatch('refreshAccessToken', response.data.accessToken);
          await this.verifyCoupon();
        }
      } catch (error) {
        this.isCouponApplied = false;
        this.getPaymentAmount();
        this.successMsg = null;
        this.error = error.response.data.message;
      }
    },

    async generateInvoice() {
      try {
        const response = await axios.post(`${this.$store.getters.base_url}/user/order/${this.orderId}/invoice`, null, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.token}`
          }
        });
        if(response.data.success) {
          console.log(response.data.message)
          this.successMsg = response.data.message;
        } else {
          this.$store.dispatch('refreshAccessToken', response.data.accessToken);
          await this.getPaymentAmount();
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    }
  },

  created() {
    this.getPaymentAmount();
  }
}
</script>

<style scoped>

  .alert {
    font-size: 14px !important;
    padding: 6px 10px !important;
    margin-bottom: 10px !important;
  }

  #payment-info-card {
    width: 50%;
    padding: 20px;
  }
</style>