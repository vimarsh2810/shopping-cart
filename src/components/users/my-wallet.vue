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
            'Authorization': `Bearer ${this.$store.getters.token}`
          }
        });
        if(response.data.success) {
          this.error = null;
          this.successMsg = response.data.message;
          await this.$store.dispatch('getWalletBalance');
          this.walletBalance = this.$store.getters.walletBalance;
        }
      } catch (error) {
        this.successMsg = null;
        this.error = error.response.data.message;
      }
    }
  }
}
</script>

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
  
  .alert {
    font-size: 14px !important;
    padding: 6px 10px !important;
    margin-bottom: 10px !important;
  }

  .card-1 {
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
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