<template>
  <div>
    <weekFilter />
  </div>
  <div class="week">
    <weekTodoItemCollect />
  </div>
</template>
<script setup>
import { useUserStore } from "../../stores/user";
definePageMeta({
  layout: "default",
  middleware: "auth",
});
</script>
<style>
.week {
  height: 100vh;
  overflow-x: scroll;
}
</style>
