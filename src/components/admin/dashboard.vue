<template>
  <div class="main-div">
    <AdminNavbar />
    <div class="wrapper" style="margin-top: 100px">
      <div class="container" v-if="!isLoading">
        <div class="row">
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
          this.orders = response.data.payload.orders;
          this.totalPages = response.data.payload.totalPages;
          this.currentPage = response.data.payload.currentPage;
          this.isLoading = false;
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