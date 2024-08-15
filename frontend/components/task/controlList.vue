<template>
  <div class="task-control-list">
    <ul>
      <li
        class="mx-auto flex items-center justify-evenly w-auto leading-10 border-b border-b-gray-300 cursor-pointer hover:bg-gray-300"
        v-for="(item, index) in controlItems"
        :key="index"
      >
        <img class="w-5 h-5" :src="item.icon" alt="check-icon" />
        <h5 class="text-[#030303]">
          {{ item.title }}
        </h5>
      </li>
    </ul>
  </div>
</template>

<script setup>
const controlItems = reactive([
  {
    title: "提醒",
    icon: "ring.svg",
  },
  {
    title: "列表",
    icon: "list.svg",
  },
  {
    title: "標籤",
    icon: "tag.svg",
  },
  {
    title: "釘選",
    icon: "pin.svg",
  },
]);
</script>

<style lang="scss" scoped>
.task-control-list {
 position: absolute; /* 絕對定位 */
  top: 40px; /* 根據需要調整位置 */
  right: 0;
  width: 100px;
  max-height: 180px;
  background-color: #e0e0e0;
  border-radius: 8px;
  padding: 8px;
  overflow-y: auto; /* 確保內容超出時出現滾動條 */
  z-index: 10; /* 確保在其他元素之上顯示 */
}
</style>
