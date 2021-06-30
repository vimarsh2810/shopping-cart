<template>
  <div class="main-div">
    <Navbar v-if="userRole === 3"/>
    <AdminNavbar v-else/>
    <div class="wrapper" style="margin-top: 100px">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="card card-1">
              <h5 class="card-title">Change Password</h5>
              <form method="POST">
                <div class="alert alert-danger" role="alert" v-if="error">
                  {{ error }}
                </div>
                <div class="alert alert-success" role="alert" v-if="successMsg">
                  {{ successMsg }}
                </div>
                <div class="form-group">
                  <label for="oldPassword">Old Password</label>
                  <input
                    type="password"
                    name="oldPassword"
                    id="oldPassword"
                    class="form-control"
                    v-model="oldPassword"
                    placeholder="Old Password"
                    @blur="checkOldPassword"
                  >
                </div>
                <div class="form-group">
                  <label for="newPassword">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    class="form-control"
                    v-model="newPassword"
                    placeholder="New Password">
                </div>
                <button class="btn btn-primary material-button" @click.prevent="changePassword">Submit</button>
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
import Navbar from './shared/navbar.vue';
import AdminNavbar from './shared/admin-navbar.vue';
export default {
  name: 'ChangePassword',
  components: { Navbar, AdminNavbar },
  data() {
    return {
      newPassword: null,
      oldPassword: null,
      error: null,
      successMsg: null,
      userRole: this.$store.getters.userData.roleId
    };
  },

  methods: {
    async checkOldPassword() {
      if(!this.oldPassword) {
        this.successMsg = null;
        this.error = 'Old password required';
        return;
      }
      
      try {
        const response = await axios.post(`${this.$store.getters.base_url}/auth/checkOldPassword`, { oldPassword: this.oldPassword }, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.refreshToken}`
          }, params: {
            accessToken: this.$store.getters.token
          }
        });

        if(response.data.success) {
          this.error = null;
          this.successMsg = response.data.message;
        } else {
          this.$store.dispatch('refreshAccessToken', response.data.accessToken);
          await this.checkOldPassword();
        }
      } catch (error) {
        this.successMsg = null;
        this.error = error.response.data.message;
      }
    },

    async changePassword() {
      if(!this.oldPassword || !this.newPassword) {
        this.successMsg = null;
        this.error = 'Please fill all details';
        return;
      }
      if(this.oldPassword === this.newPassword) {
        this.successMsg = null;
        this.error = 'New password can not be same as old password';
        return; 
      }
      try {
        const response = await axios.put(`${this.$store.getters.base_url}/auth/password`, 
        { 
          oldPassword: this.oldPassword, 
          newPassword: this.newPassword 
        }, 
        {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.refreshToken}`
          }, params: {
            accessToken: this.$store.getters.token
          }
        });

        if(response.data.success) {
          this.error = null;
          this.successMsg = response.data.message;
        } else {
          this.$store.dispatch('refreshAccessToken', response.data.accessToken);
          await this.changePassword();
        }
      } catch (error) {
        this.successMsg = null;
        this.error = error.response.data.message;
      }
    }
  }
}
</script>

<style scoped src="../assets/css/form.css"></style>

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