<template>
  <div class="main-div">
    <Navbar/> 
    <div class="wrapper" style="margin-top: 100px">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <h4 class="text-center mb-3">Wallet Balance: {{ walletBalance }}</h4>
          </div>
          <div class="col-12">
            <div class="card card-1">
              <h5 class="card-title">Add Amount into Wallet</h5>
              <form method="POST">
                <div class="alert alert-danger" role="alert" v-if="error">
                  {{ error }}
                </div>
                <div class="alert alert-success" role="alert" v-if="successMsg">
                  {{ successMsg }}
                </div>
                <div class="form-group">
                  <label for="amount">Add Amount</label>
                  <input type="text" name="amount" id="amount" class="form-control" v-model="amount" placeholder="Enter amount">
                </div>
                <button class="btn btn-primary material-button" @click.prevent="addAmount">Add</button>
              </form>
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
export default {
  name: 'MyWallet',
  components: { Navbar },
  data() {
    return {
      walletBalance: this.$store.getters.walletBalance,
      amount: null,
      error: null,
      successMsg: null
    };
  },

  methods: {
    async addAmount() {
      try {
        const response = await axios.put(`${this.$store.getters.base_url}/user/wallet/balance`, { amount: this.amount }, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.refreshToken}`
          }, params: {
            accessToken: this.$store.getters.token
          }
        });

        if(response.data.success) {
          this.error = null;
          this.successMsg = response.data.message;
          await this.$store.dispatch('getWalletBalance');
          this.walletBalance = this.$store.getters.walletBalance;
        } else {
          this.$store.dispatch('refreshAccessToken', response.data.accessToken);
          await this.addAmount();
        }
      } catch (error) {
        this.successMsg = null;
        this.error = error.response.data.message;
      }
    }
  }
}
</script>

<style scoped src="../../assets/css/form.css"></style>

<style scoped>
  .wrapper {
    max-width: 1450px;
    height: 100%;
    margin-top: 150px;
    margin-left: auto;
    margin-right: auto;
  }

  .container {
    min-width: 100% !important;
  }

  .card-1 {
    margin-top: 0 !important;
  }
</style>