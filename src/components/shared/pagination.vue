<template>
  <div v-if="totalPages > 0" class="pagination-wrapper d-flex justify-content-center">
    <div class="pagination-arrow" @click="getProducts(currentPage - 1)" v-if="showPrevious">
      <img src="/img/left-arrow.png" alt="">
    </div>

    <div class="pagination-page-no" v-for="i in totalPages" :key="i">
      <span class="pagination-btn" v-bind:class="{ active: i == currentPage }" @click="getProducts(i)">{{i}}</span>
    </div>

    <div class="pagination-arrow" @click="getProducts(currentPage + 1)" v-if="showNext">
      <img src="/img/right-arrow.png" alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: ['currentPage', 'totalPages', 'showPrevious', 'showNext'],
  data() {
    return {

    }
  },

  methods: {
    getProducts(requiredPage) {
      this.$emit('pageClicked', requiredPage);
    }
  }
}
</script>

<style scoped>
  .pagination-wrapper {
    margin-bottom: 30px;
  }

  .pagination-arrow {
    height: 35px;
    width: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .pagination-page-no {
    margin: 0 10px;
  }

  span.active {
    background-color: #007bff;
    color: #ffffff;
    overflow: hidden;
  }

  span.pagination-btn {
    display: inline-flex;
    border: 1px solid none;
    border-radius: 50%;
    justify-content: center;
    align-items: center;
    width: 35px;
    height: 35px;
    font-size: 18px;
    line-height: 18px;
  }

  .pagination-page-no span.pagination-btn:hover {
    cursor: pointer;
    background-color: #007bff;
    color: #ffffff;
  }
</style>