<template>
  <div class="container">
    <div class="card card-1">
      <h5 class="card-title">Signup</h5>
      <form method="POST">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" name="name" id="name" class="form-control" v-model="name" />
          <small class="form-text text-muted"></small>
        </div>
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" name="username" id="username" class="form-control" v-model="username" />
          <small class="form-text text-muted"></small>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="text" name="email" id="email" class="form-control" v-model="email" />
          <small class="form-text text-muted"></small>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" name="password" id="password" class="form-control" v-model="password" />
          <small class="form-text text-muted"></small>
        </div>
        <button class="btn btn-primary material-button" @click.prevent="signup">Signup</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Signup',
  data() {
    return {
      name: '',
      email: '',
      username: '',
      password: ''
    };
  },
  methods: {
    async signup() {
      const formData = {
        name: this.name,
        email: this.email,
        username: this.username,
        password: this.password
      };
      try {
        const response = await axios.post(`${this.$store.getters.base_url}/auth/signup`, formData);
        if(response.data.success) {
          this.$router.push('/login');
        }
      } catch (error) {
        console.log(error.response);
      }
    }
  }
}
</script>

<style scoped>
.card-1 {
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 100px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

form {
  padding: 20px;
}

.card {
  border: none !important;
}

.card-title {
  margin-bottom: 0;
  color: white;
  padding: 20px;
  background-color: #007bff;
  border-top-left-radius: .25rem;
  border-top-right-radius: .25rem;
}

.material-button {
  box-shadow: 0 2px 4px rgba(0,0,0,0.16), 0 2px 4px rgba(0,0,0,0.23);
}

.form-control:focus,
.btn:focus {
  box-shadow:none !important;
}
</style>