<template>
  <nav class="navbar navbar-expand-sm navbar-dark bg-primary fixed-top">
    <button 
      class="navbar-toggler" 
      type="button" 
      data-toggle="collapse" 
      data-target="#navbarSupportedContent" 
      aria-controls="navbarSupportedContent" 
      aria-expanded="false" 
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav" style="width: 100%;">
        <li class="nav-item">
          <router-link 
            to="/user/home" 
            class="nav-link"
          >
            <i class="fas fa-home mr-1"></i>Home
          </router-link>
        </li>

        <li class="nav-item">
          <router-link 
            to="/user/category" 
            class="nav-link"
          >
            <i class="fas fa-th-large mr-1"></i>Categories
          </router-link>
        </li>

        <li class="nav-item" v-if="isAuthenticated">
          <router-link 
            to="/user/cart" 
            class="nav-link"
          >
            <i class="fas fa-shopping-cart mr-1"></i>My Cart
          </router-link>
        </li>

        <li class="nav-item" v-if="isAuthenticated">
          <router-link 
            to="/user/orders" 
            class="nav-link"
          >
            <i class="fas fa-receipt mr-1"></i>My Orders
          </router-link>
        </li>

        <div class="navbar-collapse">
          <ul class="navbar-nav ml-auto">
            <form class="form-inline mr-2" v-if="$route.name === 'UserHome' || $route.name === 'ShopByCategory'">
              <input class="form-control mr-sm-2" type="search" placeholder="Search" v-model="searchText" aria-label="Search">
              <button class="btn btn-search my-2 my-sm-0" type="button" @click.prevent="searchProduct">Search</button>
            </form>
            <li class="nav-item dropdown mr-2" v-if="isAuthenticated">
              <a 
                class="nav-link dropdown-toggle" 
                href="#" 
                id="orderDropdown" 
                role="button" 
                data-toggle="dropdown" 
                aria-haspopup="true" 
                aria-expanded="false"
              >
                <i class="fas fa-bell mr-1"></i><span id="notification-length">{{ notifications.length }}</span>
              </a>
                
              <div class="dropdown-menu dropdown-menu-right" aria-labelledby="orderDropdown" v-if="notifications.length > 0">
                <a 
                  href="/user/verify-email" 
                  class="dropdown-item" 
                  v-for="(notification, index) in notifications" 
                  :key="index"
                >
                  {{ notification }}
                </a>
              </div>

              <div class="dropdown-menu dropdown-menu-right" aria-labelledby="orderDropdown" v-else>
                <a class="dropdown-item">No Notifications</a>
              </div>
            </li>
            <li class="nav-item dropdown" v-if="isAuthenticated">
              <a 
                class="nav-link dropdown-toggle" 
                href="#" 
                id="orderDropdown" 
                role="button" 
                data-toggle="dropdown" 
                aria-haspopup="true" 
                aria-expanded="false"
              >
                <i class="fas fa-user-circle mr-1"></i>{{ $store.getters.userData.username }}
              </a>
                
              <div class="dropdown-menu dropdown-menu-right" aria-labelledby="orderDropdown">
                <router-link 
                  to="/user/edit-profile" 
                  class="dropdown-item"
                >
                  <i class="fas fa-user-edit mr-1"></i>Edit Profile
                </router-link>

                <router-link 
                  to="/user/wallet" 
                  class="dropdown-item" 
                  v-if="isUserActive"
                >
                  <i class="fas fa-wallet mr-1"></i>My Wallet
                </router-link>

                <router-link 
                  to="/user/wishlist" 
                  class="dropdown-item"
                >
                  <i class="fas fa-heart mr-1"></i>My WishList
                </router-link>

                <router-link 
                  to="/user/verify-email" 
                  class="dropdown-item" 
                  v-if="!isUserActive"
                >
                  <i class="fas fa-envelope mr-1"></i>Verify Email
                </router-link>
                <a 
                  class="dropdown-item" 
                  @click.prevent="logout"
                >
                  <i class="fas fa-power-off mr-1"></i>Logout
                </a>
              </div>
            </li>

            <li class="nav-item" v-if="!isAuthenticated">
              <router-link 
                to="/login" 
                class="nav-link"
              >
                Login
              </router-link>
            </li>

            <li class="nav-item" v-if="!isAuthenticated">
              <router-link 
                to="/signup" 
                class="nav-link"
              >
                Signup
              </router-link>
            </li>

          </ul>
        </div>

      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      notifications: this.$store.getters.notifications || [],
      isUserActive: this.$store.getters.isActive,
      isAuthenticated: this.$store.getters.authStatus,
      searchText: null
    };
  },
  methods: {
    logout(event) {
      this.$store.dispatch("logout");
    },

    searchProduct() {
      this.$emit('searchProduct', this.searchText);
    }
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
  background-color: #ffffff;
  color: #007bff !important;
  border: none;
  border-radius: 3px;
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

li a {
  height: 100%;
  display: flex;
  align-items: center;
}

.btn-search {
  border: 1px solid #ffffff;
  color: #ffffff;
}

</style>