<template>
  <div class="main-div">
    <Navbar/>
    <div class="container">
      <div class="card card-1">
        <h5 class="card-title">Verify Email</h5>
        <form method="POST">
          <div class="form-group">
            <label for="otp">OTP</label>
            <input type="text" name="otp" id="otp" class="form-control" v-model="otp" placeholder="Enter OTP">
          </div>
          <button class="btn btn-primary material-button" @click.prevent="verifyOtp">Verify</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Navbar from './shared/navbar.vue';
export default {
  name: "VerifyEmail",
  components: { Navbar },
  data() {
    return {
      otp: null,
      email: "",
      password: ""
    };
  },
  methods: {
    async verifyOtp() {
      const formData = {
        otp: this.otp
      };
      try {
        const response = await axios.post(`${this.$store.getters.base_url}/auth/verifyEmail`, formData, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.refreshToken}`
          }, params: {
            accessToken: this.$store.getters.token
          }
        });

        if(response.data.success) {
          await this.$store.dispatch('getUserData');
          await this.$store.dispatch('getWalletBalance')
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

<style scoped src="../assets/css/form.css"></style>