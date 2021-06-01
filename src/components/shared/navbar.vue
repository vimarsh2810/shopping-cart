<template>
  <nav class="navbar navbar-expand-sm navbar-dark bg-primary fixed-top" v-if="!isLoading">
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav" style="width: 100%;">
        <li class="nav-item">
          <router-link to="/user/home" class="nav-link"><i class="fas fa-home"></i>&nbsp;&nbsp;Home</router-link>
        </li>

        <li class="nav-item">
          <router-link to="/user/category" class="nav-link"><i class="fas fa-th-large"></i>&nbsp;&nbsp;Categories</router-link>
        </li>

        <li class="nav-item">
          <router-link to="/user/cart" class="nav-link"><i class="fas fa-shopping-cart"></i>&nbsp;&nbsp;My Cart</router-link>
        </li>

        <li class="nav-item">
          <router-link to="/user/orders" class="nav-link"><i class="fas fa-receipt"></i>&nbsp;&nbsp;My Orders</router-link>
        </li>

        <div class="navbar-collapse">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item dropdown mr-2">
              <a class="nav-link dropdown-toggle" href="#" id="orderDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-bell"></i>&nbsp;&nbsp;&nbsp;<span id="notification-length">{{ notifications.length }}</span>
              </a>
                
              <div class="dropdown-menu dropdown-menu-right" aria-labelledby="orderDropdown" v-if="notifications.length > 0">
                <a href="/user/verify-email" class="dropdown-item" v-for="(notification, index) in notifications" :key="index">{{ notification }}</a>
              </div>

              <div class="dropdown-menu dropdown-menu-right" aria-labelledby="orderDropdown" v-else>
                <a class="dropdown-item">No Notifications</a>
              </div>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="orderDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-user-circle mr-1"></i>{{ $store.getters.userData.username }}
              </a>
                
              <div class="dropdown-menu dropdown-menu-right" aria-labelledby="orderDropdown">
                <router-link to="/user/edit-profile" class="dropdown-item"><i class="fas fa-user-edit"></i>&nbsp;&nbsp;Edit Profile</router-link>
                <router-link to="/user/wishlist" class="dropdown-item"><i class="fas fa-heart"></i>&nbsp;&nbsp;My WishList</router-link>
                <router-link to="/user/verify-email" class="dropdown-item"><i class="fas fa-envelope"></i>&nbsp;&nbsp;Verify Email</router-link>
                <a class="dropdown-item" @click.prevent="logout"><i class="fas fa-power-off"></i>&nbsp;&nbsp;Logout</a>
              </div>
            </li>
          </ul>
        </div>

      </ul>
    </div>
  </nav>
</template>

<script>
import axios from 'axios';
export default {
  name: "Navbar",
  data() {
    return {
      notifications: [],
      isLoading: true
    };
  },
  methods: {
    logout(event) {
      this.$store.dispatch("logout");
    },

    async getNotifications() {
      try {
        const response = await axios.get(`${this.$store.getters.base_url}/user/notifications`, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.token}`
          }
        });

        if(response.data.success) {
          this.notifications = response.data.payload;
        }
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.log(error.response.data.message);
      }
    },
  },
  created() {
    this.getNotifications();
  }
};
</script>

<style scoped>

.navbar {
  padding: 1rem 1rem !important;
}

.nav-link {
  text-transform: uppercase;
  padding-bottom: 0 !important;
  padding-top: 0 !important;
  color: #ffffff !important;
}

a.dropdown-item:hover {
  cursor: pointer;
}

.router-link-active {
  text-decoration: underline;
  text-decoration-thickness: 3px;
  text-underline-offset: 8px;
}

.menu-item:hover > .dropdown-menu {
  display: block;
}

/* makes sub-menu open on hover */
.submenu-item:hover > .dropdown-menu {
  display: block;
}

.parent-menu {
  position: relative;
}

.child-menu {
  position: absolute;
  left: 100% !important;
  top: -50%;
  /* height: 100%; */
}

.dropdown-toggle::after {
  display: none !important; 
}

#notification-length {
  padding: 0 5px;
  background-color: rgb(247, 81, 59);
  border: 1px solid none;
  border-radius: 3px;
}

</style>