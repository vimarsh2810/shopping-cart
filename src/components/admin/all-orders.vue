<template>
  <div class="main-div">
    <AdminNavbar />
    <div class="wrapper" style="margin-top: 100px">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <h4>Orders</h4>
          </div>
          <div class="col-2 mb-4">
            <div class="status-select-div">
              <select name="status" id="status" class="form-control" @change="filterOrders(1)">
                <option value="" selected hidden>Select Order Status</option>
                <option value="All Orders">All Orders</option>
                <option :value="status" v-for="status in orderStatuses" :key="status">{{status}}</option>
              </select>
            </div>
          </div>
          <div class="col-12">
            <div class="alert alert-danger" role="alert" v-if="!isUserActive">
              Verify Email Id to add products in cart
            </div>
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th class="text-center">Order Id</th>
                    <th class="text-center">Customer Name</th>
                    <th class="text-center">Order Date</th>
                    <th class="text-center">Order Amount</th>
                    <th class="text-center">Order Status</th>
                    <th class="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="visibleOrders.length <= 0">
                    <td colspan="5" class="text-center">No Orders with selected status</td>
                  </tr>
                  <tr v-else v-for="order in visibleOrders" :key="order.id">
                    <td class="text-center">{{ order.id }}</td>
                    <td class="text-center">{{ order.user.name }}</td>
                    <td class="text-center">{{ new Date(order.createdAt).toLocaleString() }}</td>
                    <td class="text-center">{{ order.amount }}</td>
                    <td class="text-center">{{ order.status }}</td>
                    <td class="text-center">
                      <button 
                        class="btn btn-primary"
                        @click="redirectToOrderDetails(order.id)"
                      >Details</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="col-12">
              <Pagination 
                :currentPage="currentPage" 
                :totalPages="totalPages" 
                :showPrevious="showPrevious()" 
                :showNext="showNext()"
                @pageClicked="filterOrders($event)"
              ></Pagination>
            </div>

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
  name: 'AllOrders',
  components: { AdminNavbar, Pagination},
  data() {
    return {
      allOrders: [],
      visibleOrders: [],
      ordersByStatus: [],
      currentPage: null,
      totalPages: null,
      limit: 5,
      orderStatuses: development.orderStatus,
      isUserActive: this.$store.getters.userData.isActive
    };
  },

  methods: {
    async getOrders() {
      try {
        const response = await axios.get(`${this.$store.getters.base_url}/admin/orders`, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.refreshToken}`
          }, params: {
            accessToken: this.$store.getters.token
          }
        });

        if(response.data.success) {
          this.allOrders = response.data.payload;
          this.totalPages = Math.ceil(this.allOrders.length / this.limit);
          this.filterOrders(1);
        } else {
          this.$store.dispatch('refreshAccessToken', response.data.accessToken);
          await this.getOrders();
        }
      } catch (error) {
        console.log(error.response.data);
      }
    },

    filterOrders(requiredPage) {
      const startIndex = (requiredPage - 1) * this.limit;
      const endIndex = startIndex + this.limit - 1;
      const status = document.getElementById('status').value;
      this.ordersByStatus = this.allOrders.filter((order, index) => {
        return order.status === status;
      });

      if(!status || status === 'All Orders') {
        this.visibleOrders = this.allOrders.filter((order, index) => index >= startIndex && index <= endIndex);
        this.currentPage = requiredPage;
        this.totalPages = Math.ceil(this.allOrders.length / this.limit);
      } else {
        this.visibleOrders = this.ordersByStatus.filter((order, index) => index >= startIndex && index <= endIndex);
        this.currentPage = requiredPage;
        this.totalPages = Math.ceil(this.ordersByStatus.length / this.limit);
      }
    },

    showPrevious() {
      return this.currentPage == 1 ? false : true;
    },

    showNext() {
      return this.currentPage == this.totalPages ? false : true;
    },

    redirectToOrderDetails(orderId) {
      this.$router.push({ name: 'AdminOrderDetails', params: { id: orderId } });
    }
  },

  created() {
    this.getOrders();
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

  tbody tr:last-child {
    border-bottom: 1px solid #dee2e6;
  }
</style>