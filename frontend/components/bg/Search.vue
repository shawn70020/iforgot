<template>
  <div
    @click="showList = true"
    class="square bg-cover bg-center rounded-lg border-2 border-gray-400 cursor-pointer"
    :style="{ backgroundImage: `url(${bgStore.bgImage})` }"
  ></div>
  <bgSearchList v-if="showList" @close="showList = false" />
</template>

<script setup>
import { useBackgroundStore } from '~/stores/background';
const bgStore = useBackgroundStore();

const showList = ref(false);
</script>

<style scoped>
.square {
  width: 50px; /* 可以根據需要調整大小 */
  height: 50px;
  position: fixed;
  right: 2rem;
  bottom: 1.5rem;
}
</style>
