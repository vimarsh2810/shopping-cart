<template>
  <nav class="navbar navbar-expand-sm navbar-dark bg-primary fixed-top">
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav" style="width: 100%;">
        <li class="nav-item">
          <router-link to="/user/home" class="nav-link">Home</router-link>
        </li>

        <li class="nav-item">
          <router-link to="/user/category" class="nav-link">Categories</router-link>
        </li>

        <li class="nav-item">
          <router-link to="/user/cart" class="nav-link">My Cart</router-link>
        </li>

        <li class="nav-item">
          <router-link to="/user/orders" class="nav-link">My Orders</router-link>
        </li>

        <li class="nav-item dropdown ml-auto">
          <a class="nav-link dropdown-toggle" href="#" id="orderDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="fas fa-user-circle mr-1"></i>{{ $store.getters.userData.username}}
          </a>
          
          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="orderDropdown">
            <router-link to="/user/edit-profile" class="dropdown-item">Edit Profile</router-link>
            <router-link to="/user/wishlist" class="dropdown-item">My WishList</router-link>
            <a class="dropdown-item" @click.prevent="logout"><i class="fas fa-power-off"></i>&nbsp;&nbsp;Logout</a>
          </div>
        </li>

      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  methods: {
    logout(event) {
      this.$store.dispatch("logout");
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

.router-link-active {
  color: #fff !important;
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

</style>