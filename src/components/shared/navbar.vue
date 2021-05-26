<template>
  <nav class="navbar navbar-expand-sm navbar-dark bg-primary fixed-top">
    <a class="navbar-brand" href="/user/dashboard"><i class="fas fa-home"></i>&nbsp;&nbsp;Home</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav" style="width: 100%;">
      <li class="nav-item">
        <a class="nav-link" href="/user/categories">
          <i class="fas fa-receipt"></i>&nbsp;&nbsp;Categories
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/user/cart"><i class="fas fa-shopping-cart"></i>&nbsp;&nbsp;My Cart</a>
        <!-- <router-link to="/user/cart" class="nav-link">My Cart</router-link> -->
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/user/my-orders">
          <i class="fas fa-receipt"></i>&nbsp;&nbsp;My Orders
        </a>
      </li>
      <li class="nav-item dropdown ml-auto">
        <a class="nav-link dropdown-toggle" href="#" id="orderDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i class="fas fa-user-circle mr-1"></i>{{ $store.getters.userData.username}}
        </a>
        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="orderDropdown">
          <a class="dropdown-item" href="/user/edit-profile"><i class="fas fa-user-edit"></i>&nbsp;&nbsp;Edit Profile</a>
          <a class="dropdown-item" href="/user/wishlist"><i class="fas fa-heart"></i>&nbsp;&nbsp;My Wishlist</a>
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
.menu-item:hover > .dropdown-menu {
  display: block;
}

/* makes sub-menu S open on hover */
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