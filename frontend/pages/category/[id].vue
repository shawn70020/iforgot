<template>
  <div>
    <categoryFilter :cg="category" />
  </div>
  <div>
    <categoryTodoItemCollect :cg="category" />
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
definePageMeta({
  layout: "default",
  middleware: "auth",
});

const category = ref(router.currentRoute.value.params.id);
</script>
<style></style>
