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
            'Authorization': `Bearer ${this.$store.getters.token}`
          }
        });
        if(response.data.success) {
          const responseTwo = await axios.get(`${this.$store.getters.base_url}/user/data`, {
            headers: {
              'Authorization': `Bearer ${this.$store.getters.token}`
            }
          });

          this.$store.dispatch('getUserData');
        }
      } catch (error) {
        console.log(error.response);
      }
    },
  },
};
</script>

<style scoped>
  .card-1 {
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 200px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  form {
    padding: 20px;
  }

  .card {
    border: none !important;
  }

  .card-title {
    margin-bottom: 0;
    color: white;
    padding: 20px;
    background-color: #007bff;
    border-top-left-radius: .25rem;
    border-top-right-radius: .25rem;
  }

  .material-button {
    box-shadow: 0 2px 4px rgba(0,0,0,0.16), 0 2px 4px rgba(0,0,0,0.23);
  }

  .form-control:focus,
  .btn:focus {
    box-shadow:none !important;
  }
</style>