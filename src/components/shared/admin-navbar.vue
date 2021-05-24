<template>
  <nav class="navbar navbar-expand-sm navbar-dark bg-dark fixed-top">
    <a class="navbar-brand" href="/user/dashboard"><i class="fas fa-home"></i>&nbsp;&nbsp;Home</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav" style="width: 100%;">
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="settingDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i class="fas fa-user-circle mr-1"></i>Settings
        </a>
        <div class="dropdown-menu" aria-labelledby="settingDropdown">
          <a class="dropdown-item" ><i class="fas fa-user-edit"></i>&nbsp;&nbsp;Manage Products</a>
          <a class="dropdown-item" ><i class="fas fa-heart"></i>&nbsp;&nbsp;Manage Admins</a>
          <a class="dropdown-item" ><i class="fas fa-power-off"></i>&nbsp;&nbsp;Manage Categories</a>
        </div>
      </li>
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="orderDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i class="fas fa-user-circle mr-1"></i>Orders
        </a>
        <div class="dropdown-menu" aria-labelledby="orderDropdown">
          <a class="dropdown-item" ><i class="fas fa-user-edit"></i>&nbsp;&nbsp;Completed Orders</a>
          <a class="dropdown-item" ><i class="fas fa-heart"></i>&nbsp;&nbsp;Cancelled Orders</a>
          <a class="dropdown-item" ><i class="fas fa-power-off"></i>&nbsp;&nbsp;Pending Orders</a>
        </div>
      </li>
      <li class="nav-item dropdown ml-auto">
        <a class="nav-link dropdown-toggle" href="#" id="orderDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i class="fas fa-user-circle mr-1"></i>Username
        </a>
        <div class="dropdown-menu" aria-labelledby="orderDropdown">
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
  name: "AdminNavbar",
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