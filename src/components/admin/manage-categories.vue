<template>
  <div class="main-div">
    <AdminNavbar />
    <div class="wrapper" style="margin-top: 100px">
      <div class="container" v-if="!isLoading">
        <div class="row">
          <div class="col-sm-6 col-12">
            <h4 class="mb-2 mt-2">Categories</h4>
          </div>
          <div class="col-sm-6 col-12">
            <button 
              class="btn btn-primary d-block mb-2 mt-2"
              id="add-category-link"
              @click="$router.push({ name: 'AddCategory' })"
            >Add New Category</button>
          </div>
          <div class="col-12">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th class="text-center">Category Title</th>
                    <th class="text-center">Parent Category Title</th>
                    <th class="text-center">Added By</th>
                    <th class="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="categories.length <= 0">
                    <td colspan="4" class="text-center">No Categories</td>
                  </tr>
                  <tr v-else v-for="category in categories" :key="category.id">
                    <td class="text-center vertical-center">{{ category.title }}</td>
                    <td class="text-center vertical-center" v-if="category.parent">{{ category.parent.title }}</td>
                    <td class="text-center vertical-center" v-else>None</td>
                    <td class="text-center vertical-center">{{ category.user.name }}</td>
                    <td class="text-center vertical-center">
                      <button 
                        class="btn btn-warning"
                        @click="goToEditCategory(category.id)"
                      >Edit</button>
                      <button 
                        class="btn btn-danger ml-2"
                        @click="deleteCategory(category.id)"
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
                @pageClicked="getCategories($event)"
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
  name: 'ManageCategories',
  components: { AdminNavbar, Pagination },
  data() {
    return {
      isLoading: true,
      categories: [],
      currentPage: null,
      totalPages: null,
      limit: 5
    };
  },

  methods: {
    async getCategories(requestedPage) {
      try {
        const response = await axios.get(`${this.$store.getters.base_url}/admin/limitedCategories`, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.refreshToken}`
          }, params: {
            accessToken: this.$store.getters.token,
            page: requestedPage,
            limit: this.limit
          }
        });

        if(response.data.success) {
          this.categories = response.data.payload.categories;
          this.currentPage = response.data.payload.currentPage;
          this.totalPages = response.data.payload.totalPages;
          this.isLoading = false;
        } else {
          this.$store.dispatch('refreshAccessToken', response.data.accessToken);
          await this.getCategories();
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    },

    async deleteCategoryMethod(categoryId) {
      try {
        const response = await axios.delete(`${this.$store.getters.base_url}/admin/category/${categoryId}`, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.refreshToken}`
          },  params: {
            accessToken: this.$store.getters.token,
          }
        });

        if(response.data.success) {
          this.categories.length == 1 ? this.getCategories(this.currentPage - 1) : this.getCategories(this.currentPage);
        } else {
          this.$store.dispatch('refreshAccessToken', response.data.accessToken);
          await this.deleteCategoryMethod(categoryId);
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    },

    async deleteCategory(categoryId) {
      if(confirm('Do you really want to delete this category?')) {
        this.deleteCategoryMethod(categoryId);
      }
    },

    goToEditCategory(categoryId) {
      this.$router.push({ name: 'EditCategory', params: { id: categoryId } });
    },

    showPrevious() {
      return this.currentPage == 1 ? false : true;
    },

    showNext() {
      return this.currentPage == this.totalPages ? false : true;
    }
  },

  created() {
    this.getCategories(1);
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

  #add-category-link {
    margin-left: auto;
  }

  @media (max-width: 576px) {
    #add-category-link {
      margin-left: 0;
      margin-right: auto;
    }
  }

</style>