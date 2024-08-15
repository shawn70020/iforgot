<template>
  <div>
    <tagFilter />
  </div>
  <div class="week">
    <tagTodoItemCollect :tag="tag" />
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/user";
const router = useRouter();
definePageMeta({
  layout: "default",
  middleware: "auth",
});

const tag = ref(router.currentRoute.value.params.id);
console.log(tag.value)
</script>
<style>
.week {
  height: 100vh;
  overflow-x: scroll;
}
</style>
