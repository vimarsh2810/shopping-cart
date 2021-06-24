<template>
  <div class="main-div">
    <AdminNavbar />
    <div class="wrapper" style="margin-top: 100px">
      <div class="container" v-if="!isLoading">
        <div class="row">
          <div class="col-sm-6 col-12">
            <h4 class="mb-2 mt-2">SubAdmins</h4>
          </div>
          <div class="col-sm-6 col-12">
            <button 
              class="btn btn-primary d-block mb-2 mt-2"
              id="add-subAdmin-link"
              @click="$router.push({ name: 'AddSubAdmin' })"
            >Add New SubAdmin</button>
          </div>
          <div class="col-12">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th class="text-center">Name</th>
                    <th class="text-center">Username</th>
                    <th class="text-center">Email</th>
                    <th class="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="visibleSubAdmins.length <= 0">
                    <td colspan="4" class="text-center">No Record</td>
                  </tr>
                  <tr v-else v-for="subAdmin in visibleSubAdmins" :key="subAdmin.id">
                    <td class="text-center vertical-center">{{ subAdmin.name }}</td>
                    <td class="text-center vertical-center">{{ subAdmin.username }}</td>
                    <td class="text-center vertical-center">{{ subAdmin.email }}</td>
                    <td class="text-center vertical-center">
                      <button 
                        class="btn btn-warning"
                        @click="goToEditSubAdmin(subAdmin.id)"
                      >Edit</button>
                      <button 
                        class="btn btn-danger ml-2"
                        @click="deleteSubAdmin(subAdmin.id)"
                      >Delete</button>
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
                @pageClicked="filterItems($event)"
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

export default {
  name: 'ManageSubAdmins',
  components: { AdminNavbar, Pagination },
  data() {
    return {
      isLoading: true,
      allSubAdmins: [],
      visibleSubAdmins: [],
      currentPage: null,
      totalPages: null,
      limit: 5
    };
  },

  methods: {
    async getSubAdmins() {
      try {
        const response = await axios.get(`${this.$store.getters.base_url}/admin/subAdmins`, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.refreshToken}`
          }, params: {
            accessToken: this.$store.getters.token
          }
        });

        if(response.data.success) {
          this.allSubAdmins = response.data.payload;
          this.totalPages = Math.ceil(this.allSubAdmins.length / this.limit);
          this.isLoading = false;
          this.filterItems(1);
        } else {
          this.$store.dispatch('refreshAccessToken', response.data.accessToken);
          await this.getSubAdmins();
        }
      } catch (error) {
        console.log(error);
      }
    },

    async deleteSubAdminMethod(subAdminId) {
      try {
        const response = await axios.delete(`${this.$store.getters.base_url}/admin/subAdmin/${subAdminId}`, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.refreshToken}`
          }, params: {
            accessToken: this.$store.getters.token
          }
        });

        if(response.data.success) {
          this.getSubAdmins();
        } else {
          this.$store.dispatch('refreshAccessToken', response.data.accessToken);
          await this.deleteSubAdminMethod(subAdminId);
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    },

    async deleteSubAdmin(subAdminId) {
      if(confirm('Do you really want to delete this subadmin?')) {
        await this.deleteSubAdminMethod(subAdminId);
      }
    },

    filterItems(requiredPage) {
      const startIndex = (parseInt(requiredPage) - 1) * this.limit;
      const endIndex = startIndex + this.limit - 1;
      this.visibleSubAdmins = this.allSubAdmins.filter((product, index) => index >= startIndex && index <= endIndex);
      this.currentPage = requiredPage;
    },

    goToEditSubAdmin(subAdminId) {
      this.$router.push({ name: 'EditSubAdmin', params: { id: subAdminId } });
    },

    showPrevious() {
      return this.currentPage == 1 ? false : true;
    },

    showNext() {
      return this.currentPage == this.totalPages ? false : true;
    }
  },

  created() {
    this.getSubAdmins();
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

  .vertical-center {
    vertical-align: middle;
  }

  #add-subAdmin-link {
    margin-left: auto;
  }

  @media (max-width: 576px) {
    #add-subAdmin-link {
      margin-left: 0;
      margin-right: auto;
    }
  }

</style>