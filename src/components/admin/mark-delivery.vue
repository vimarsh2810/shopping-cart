<template>
  <div class="main-div">
    <AdminNavbar/>
    <div class="container">
      <div class="card card-1">
        <h5 class="card-title">Mark Delivery</h5>
        <form method="POST">
          <div class="alert alert-danger" role="alert" v-if="error">
            {{ error }}
          </div>
          <div class="alert alert-success" role="alert" v-if="successMsg">
            {{ successMsg }}
          </div>
          <div class="form-group">
            <label for="deliveryOtp">Delivery OTP</label>
            <input type="text" name="deliveryOtp" id="deliveryOtp" class="form-control" v-model="deliveryOtp" placeholder="Enter Delivery OTP">
          </div>
          <button class="btn btn-primary material-button" @click.prevent="verifyOtp">Mark Delivery</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import AdminNavbar from '../shared/admin-navbar.vue';
export default {
  name: "MarkDelivery",
  components: { AdminNavbar },
  data() {
    return {
      deliveryOtp: null,
      error: null,
      successMsg: null
    };
  },
  methods: {
    async verifyOtp() {
      const formData = {
        deliveryOtp: this.deliveryOtp
      };
      try {
        const response = await axios.post(`${this.$store.getters.base_url}/admin/order/${this.$route.params.id}/otp`, formData, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.refreshToken}`
          }, params: {
            accessToken: this.$store.getters.token
          }
        });
        
        if(response.data.success) {
          this.error = null;
          this.successMsg = response.data.message;
        } else {
          this.$store.dispatch('refreshAccessToken', response.data.accessToken);
          await this.verifyOtp();
        }
      } catch (error) {
        console.log(error.response);
      }
    },
  },
};
</script>

<style scoped src="../../assets/css/form.css"></style>

<style scoped>
  .card-1 {
    margin-top: 200px !important;
  }
</style>