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

        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" id="settingDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="fas fa-user-circle mr-1"></i>Settings
          </a>

          <div class="dropdown-menu" aria-labelledby="settingDropdown">
            <router-link to="/admin/add-product" class="dropdown-item">Add Product</router-link>
            <router-link to="/admin/add-category" class="dropdown-item">Add Category</router-link>
            <router-link to="/admin/add-subadmin" class="dropdown-item">Add SubAdmin</router-link>
          </div>
        </li>

        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="orderDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="fas fa-user-circle mr-1"></i>Orders
          </a>

          <div class="dropdown-menu" aria-labelledby="orderDropdown">
            <router-link to="/admin/completed-orders" class="dropdown-item">Add SubAdmin</router-link>
            <router-link to="/admin/pending-orders" class="dropdown-item">Add SubAdmin</router-link>
            <router-link to="/admin/cancelled-orders" class="dropdown-item">Add SubAdmin</router-link>
          </div>
        </li>

        <li class="nav-item dropdown ml-auto">
          <a class="nav-link dropdown-toggle" href="#" id="orderDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="fas fa-user-circle mr-1"></i>Username
          </a>

          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="orderDropdown">
            <router-link to="/admin/edit-profile" class="dropdown-item">Edit Profile</router-link>
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


.navbar {
  padding: 1rem 1rem !important;
}

.nav-link {
  text-transform: uppercase;
  padding-bottom: 0 !important;
  padding-top: 0 !important;
  color: #ffffff !important;
}

.router-link-exact-active {
  text-decoration: underline;
  text-decoration-thickness: 3px;
  text-underline-offset: 8px;
}

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