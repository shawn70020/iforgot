<template>
  <div
    class="layout w-full h-full min-h-screen bg-cover bg-center"
    :style="{ backgroundImage: `url(${bgStore.bgImage})` }"
  >
    <Sidebar @openCategory="showAddCag = true" @openTag="showAddTag = true" />
    <div class="main-content">
      <NuxtPage />
      <add-category v-if="showAddCag" @close="showAddCag = false"></add-category>
      <add-tag v-if="showAddTag" @close="showAddTag = false"></add-tag>
    </div>
  </div>
</template>

<script setup>
import Sidebar from "~/components/Sidebar.vue";
import { useBackgroundStore } from "~/stores/background";

const bgStore = useBackgroundStore();

const showAddCag = ref(false);
const showAddTag = ref(false);
</script>

<style scoped>
.layout {
  display: flex;
}

.sidebar {
  width: 15rem;
}

.main-content {
  width: 100vw;
}
</style>
