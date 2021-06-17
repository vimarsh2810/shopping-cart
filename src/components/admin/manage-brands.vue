<template>
  <div class="main-div">
    <AdminNavbar />
    <div class="wrapper" style="margin-top: 100px">
      <div class="container" v-if="!isLoading">
        <div class="row">
          <div class="col-sm-6 col-12">
            <h4 class="mb-2 mt-2">Brands</h4>
          </div>
          <div class="col-sm-6 col-12">
            <button 
              class="btn btn-primary d-block mb-2 mt-2"
              id="add-brand-link"
              @click="$router.push({ name: 'AddBrand' })"
            >Add New Brand</button>
          </div>
          <div class="col-12">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th class="text-center">Brand ID</th>
                    <th class="text-center">Brand Name</th>
                    <th class="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="brands.length <= 0">
                    <td colspan="3" class="text-center">No Brands</td>
                  </tr>
                  <tr v-else v-for="brand in brands" :key="brand.id">
                    <td class="text-center vertical-center">{{ brand.id }}</td>
                    <td class="text-center vertical-center">{{ brand.name }}</td>
                    <td class="text-center vertical-center">
                      <button 
                        class="btn btn-warning"
                        @click="$router.push({ name: 'EditBrand', params: { id: brand.id } })"
                      >Edit</button>
                      <button 
                        class="btn btn-danger ml-2"
                        @click="deleteBrand(brand.id)"
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
                @pageClicked="getBrands($event)"
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
  name: 'ManageBrands',
  components: { AdminNavbar, Pagination },
  data() {
    return {
      isLoading: true,
      brands: [],
      currentPage: null,
      totalPages: null,
      limit: 5
    };
  },

  methods: {
    async getBrands(requestedPage) {
      try {
        const response = await axios.get(`${this.$store.getters.base_url}/admin/limitedBrands`, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.token}`
          }, params: {
            page: requestedPage,
            limit: this.limit
          }
        });

        if(response.data.success) {
          this.brands = response.data.payload.brands;
          this.currentPage = response.data.payload.currentPage;
          this.totalPages = response.data.payload.totalPages;
          this.isLoading = false;
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    },

    async deleteBrand(brandId) {
      if(confirm('Do you really want to delete this brand?')) {
        try {
          const response = await axios.delete(`${this.$store.getters.base_url}/admin/brand/${brandId}`, {
            headers: {
              'Authorization': `Bearer ${this.$store.getters.token}`
            }
          });

          if(response.data.success) {
            this.brands.length == 1 ? this.getBrands(this.currentPage - 1) : this.getBrands(this.currentPage);
          }
        } catch (error) {
          console.log(error.response.data.message);
        }
      }
    },

    showPrevious() {
      return this.currentPage == 1 ? false : true;
    },

    showNext() {
      return this.currentPage == this.totalPages ? false : true;
    }
  },

  created() {
    this.getBrands(1);
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

  #add-brand-link {
    margin-left: auto;
  }

  @media (max-width: 576px) {
    #add-brand-link {
      margin-left: 0;
      margin-right: auto;
    }
  }

</style>