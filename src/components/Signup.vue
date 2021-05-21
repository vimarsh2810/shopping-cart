<template>
  <div>
    <form method="POST">
      <input type="text" name="name" id="name" v-model="name">
      <input type="text" name="username" id="username" v-model="username">
      <input type="text" name="email" id="email" v-model="email">
      <input type="text" name="password" id="password" v-model="password">
      <button @click.prevent="onSubmit" type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
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
    onSubmit() {
      const formData = {
        name: this.name,
        email: this.email,
        username: this.username,
        password: this.password
      };
      this.$store.dispatch('signup', formData);
      
    }
  }
}
</script>