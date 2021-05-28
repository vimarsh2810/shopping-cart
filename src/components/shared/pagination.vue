<template>
  <div v-if="totalPages > 0" class="pagination-wrapper">
    <span class="pagination-btn" v-if="showPrevious" @click="updatePage(currentPage - 1)"><</span>
      {{ currentPage }} of {{ totalPages }} pages
    <span class="pagination-btn" v-if="showNext" @click="updatePage(currentPage + 1)">></span>
  </div>
</template>