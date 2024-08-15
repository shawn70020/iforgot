<template>
  <div class="pl-[17rem] mt-6 flex items-center">
    <div
      class="week-filter w-[20rem] h-[6vh] bg-white rounded-full flex items-center justify-around"
    >
      <div class="flex">
        <img
          class="w-4 cursor-pointer mr-2"
          src="../../public/week.svg"
          alt="user-icon"
        />
        <h5 class="text-10">我所有的任務</h5>
      </div>

      <div class="filter-group flex relative h-[6vh]">
        <weekFilterTable />
        <img
          class="w-4 cursor-pointer mr-2"
          :class="{ 'animate-spin': isSpinning }"
          src="../../public/reload.svg"
          alt="user-icon"
          @click="resetItems"
        />
      </div>
    </div>
    <div
      @click="delAllChecked"
      class="w-[12rem] h-[6vh] rounded-full bg-white flex items-center justify-center ml-4 text-blue-500 cursor-pointer"
    >
      <img class="w-4 cursor-pointer mr-2" src="../../public/del.svg" alt="user-icon" />
      清除已完成任務
    </div>
  </div>
</template>
<script setup>
const isSpinning = ref(false);
import { useTodoStore } from "../../stores/todo";
const todoStore = useTodoStore();
const resetItems = async () => {
  isSpinning.value = true;
  setTimeout(() => {
    isSpinning.value = false;
  }, 1000); // 與動畫持續時間一致
  await todoStore.fetchTodoItems();
};

const delAllChecked = async () => {
  await todoStore.deleteCheckedItem();
};
</script>
<style lang="scss" scoped></style>
