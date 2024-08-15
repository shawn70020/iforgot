<template>
  <loading :active.sync="isLoading" :is-full-page="true" />
</template>

<script setup>
import { ref } from "vue";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
const isLoading = ref(true);
</script>
