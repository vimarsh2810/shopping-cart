<template>
  <div class="main-div">
    <AdminNavbar />
    <div class="wrapper" style="margin-top: 100px">
      <div class="container" v-if="!isLoading">
        <div class="row">
          <div class="col-12">
            <h4 class="mb-0">Dashboard</h4>
          </div>
          <div class="col-sm-3 col-6">
            <div 
              class="statistic-div" 
              style="background-color: #be95ed"
              @click="$router.push({ name: 'ManageProducts' })"
            >
              <h4 style="text-align: left">Products<span style="float: right">{{ statistics.productsCount }}</span></h4>
            </div>
          </div>
          <div class="col-sm-3 col-6">
            <div 
              class="statistic-div" 
              style="background-color: #f7678b"
              @click="$router.push({ name: 'ManageBrands' })"
            >
              <h4 style="text-align: left">Brands<span style="float: right">{{ statistics.brandsCount }}</span></h4>
            </div>
          </div>
          <div class="col-sm-3 col-6">
            <div 
              class="statistic-div" 
              style="background-color: #33d4f4"
              @click="$router.push({ name: 'ManageCategories' })"
            >
              <h4 style="text-align: left">Categories<span style="float: right">{{ statistics.categoriesCount }}</span></h4>
            </div>
          </div>
          <div class="col-sm-3 col-6">
            <div 
              class="statistic-div" 
              style="background-color: #33f463"
            >
              <h4 style="text-align: left">Earnings<span style="float: right">{{ statistics.totalAmountEarned }}</span></h4>
            </div>
          </div>

          <div class="col-12">
            <h4 class="mb-0">In Process Orders</h4>
          </div>

          <div class="col-12">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th class="text-center">Order ID</th>
                    <th class="text-center">Customer</th>
                    <th class="text-center">Date</th>
                    <th class="text-center">Status</th>
                    <th class="text-center">Amount</th>
                    <th class="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="orders.length <= 0">
                    <td colspan="6" class="text-center">No Orders</td>
                  </tr>
                  <tr v-else v-for="order in orders" :key="order.id">
                    <td class="text-center">{{ order.id }}</td>
                    <td class="text-center">{{ order.user.username }}</td>
                    <td class="text-center">{{ new Date(order.createdAt).toLocaleString() }}</td>
                    <td class="text-center">{{ order.status }}</td>
                    <td class="text-center">{{ order.amount }}</td>
                    <td class="text-center">
                      <button 
                        class="btn btn-primary"
                        @click="markDelivery(order.id)"
                      >Mark Delivery</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="col-12">
            <Pagination 
              :currentPage="currentPage" 
              :totalPages="totalPages" 
              :showPrevious="showPrevious()" 
              :showNext="showNext()"
              @pageClicked="getProducts($event)"
            ></Pagination>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import AdminNavbar from '../shared/admin-navbar.vue';
import Pagination from '../shared/pagination.vue';
import { development } from '../../../server/config/config.js';

export default {
  name: 'AdminDashboard',
  components: { AdminNavbar, Pagination },
  data() {
    return {
      isLoading: true,
      orders: [],
      statistics: [],
      totalPages: null,
      currentPage: null,
      limit: 10
    };
  },

  methods: {
    async getOrders(requestedPage) {
      try {
        const response = await axios.get(`${this.$store.getters.base_url}/admin/orders/${development.orderStatus.InProcess}`, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.token}`
          }, params: {
            page: requestedPage,
            limit: this.limit
          }
        });

        if(response.data.success) {
          this.getStatistics();
          this.orders = response.data.payload.orders;
          this.totalPages = response.data.payload.totalPages;
          this.currentPage = response.data.payload.currentPage;
          this.isLoading = false;
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    },

    async getStatistics() {
      try {
        const response = await axios.get(`${this.$store.getters.base_url}/admin/statistics`, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.token}`
          }
        });

        if(response.data.success) {
          this.statistics = response.data.payload;
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    },

    async markDelivery(orderId) {
      try {
        const response = await axios.get(`${this.$store.getters.base_url}/admin/order/${orderId}/otp`, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.token}`
          }
        });

        if(response.data.success) {
          this.$router.push({ name: 'MarkDelivery', params: { id: orderId } });
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    },

    showPrevious() {
      return this.currentPage == 1 ? false : true;
    },

    showNext() {
      return this.currentPage == this.totalPages ? false : true;
    },
  },

  created() {
    this.getOrders(1);
  }
}
</script>

<style scoped>
  .wrapper {
    max-width: 1450px;
    height: 100%;
    margin-left: auto;
    margin-right: auto;
  }

  .container {
    min-width: 100% !important;
  }

  [class*="col-"] {
    margin-bottom: 30px;
  }

  .statistic-div {
    color: #ffffff;
    height: 130px;
    border: 1px solid none;
    border-radius: 5px;
    display: flex;
    align-items: center;
  }

  .statistic-div:hover {
    cursor: pointer;
  }

  .statistic-div h4 {
    width: 100%;
    display: block;
    margin-bottom: 0;
    padding: 0 10px;
  }

  tr:last-child {
    border-bottom: 1px solid #dee2e6;
  }
</style>