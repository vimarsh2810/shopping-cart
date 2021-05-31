<template>
  <div class="main-div d-flex justify-content-center">
    <div class="wrapper">
      <div class="error-404">
        <h4>Error 404: Page Not Found!</h4>
      </div>
      <div class="login-link">
        <a @click="$router.go(-1)">Back</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageNotFound'
}
</script>

<style scoped>
  .wrapper {
    margin-top: 100px;
  }

  .login-link {
    text-align: center;
  }

  a {
    color: #007bff !important;
  }

  a:hover {
    text-decoration: underline !important;
    cursor: pointer;
  }
</style>