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
          <router-link to="/admin/dashboard" class="nav-link">Dashboard</router-link>
        </li>

        <li class="nav-item dropdown">
          <a 
            class="nav-link dropdown-toggle" 
            id="settingDropdown" 
            role="button" 
            data-toggle="dropdown" 
            aria-haspopup="true" 
            aria-expanded="false"
          >
            <i class="fas fa-cog"></i>&nbsp;&nbsp;Settings
          </a>

          <div class="dropdown-menu" aria-labelledby="settingDropdown">
            <router-link 
              to="/admin/manage-products" 
              class="dropdown-item"
            > 
              Manage Products
            </router-link>

            <router-link 
              to="/admin/manage-categories" 
              class="dropdown-item"
            >
              Manage Categories
            </router-link>

            <router-link 
              to="/admin/manage-brands" 
              class="dropdown-item"
            >
              Manage Brands
            </router-link>

            <router-link 
              to="/admin/manage-subadmins" 
              class="dropdown-item" 
              v-if="userRole == allRoles.SuperAdmin"
            >
              Manage SubAdmins
            </router-link>
          </div>
        </li>

        <li class="nav-item">
          <router-link 
            to="/admin/orders" 
            class="nav-link"
          >
            <i class="fas fa-receipt"></i>&nbsp;&nbsp;Orders
          </router-link>
        </li>

        <li class="nav-item dropdown ml-auto">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            id="profileDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <i class="fas fa-user-circle mr-1"></i>{{ username }}
          </a>

          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="profileDropdown">
            <router-link
              to="/admin/edit-profile"
              class="dropdown-item"
            >
              <i class="fas fa-user-edit"></i>&nbsp;&nbsp;Edit Profile
            </router-link>

            <router-link
              to="/auth/change-password"
              class="dropdown-item"
            >
              <i class="fas fa-key"></i>&nbsp;&nbsp;Change Password
            </router-link>

            <a 
              class="dropdown-item" 
              @click.prevent="logout"
            >
              <i class="fas fa-power-off"></i>&nbsp;&nbsp;Logout
            </a>
          </div>
        </li>

      </ul>
    </div>
  </nav>
</template>

<script>
import { development } from '../../../server/config/config.js';
export default {
  name: "AdminNavbar",
  data() {
    return {
      username: this.$store.getters.userData.username,
      allRoles: development.roles,
      userRole: this.$store.getters.userData.roleId
    };
  },
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