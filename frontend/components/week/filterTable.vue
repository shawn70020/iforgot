<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
  >
    <el-sub-menu index="">
      <template #title>
        <img
          class="w-4 cursor-pointer mr-2"
          src="../../public/filter.svg"
          alt="user-icon"
        />
        <h5>篩選</h5></template
      >
      <el-sub-menu index="2-2">
        <template #title>我的列表</template>
        <el-menu-item
          v-for="(cg, idx) in categoryList"
          :key="idx"
          :index="`2-2-${idx + 1}`"
          :class="{ 'custom-active-class': filterCategory.includes(cg) }"
          @click="categoryFilterHandler(cg)"
        >
          {{ cg }}
        </el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="2-3">
        <template #title>標籤</template>
        <el-menu-item
          v-for="(tag, idx) in tagList"
          :key="idx"
          :index="`2-3-${idx + 1}`"
          :class="{ 'is-active': filterTag.includes(tag.name) }"
          @click="tagFilterHandler(tag.name)"
        >
          {{ tag.name }}
        </el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="2-4">
        <template #title>狀態</template>
        <el-menu-item index="2-4-1" @click="finishFilterHandler(true)">完成</el-menu-item>
        <el-menu-item index="2-4-2" @click="finishFilterHandler(false)"
          >未完成</el-menu-item
        >
      </el-sub-menu>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { useTodoStore } from "../../stores/todo";

const activeIndex = ref("2");
const todoStore = useTodoStore();
const categoryList = computed(() => todoStore.categoryItems || []);
const tagList = computed(() => todoStore.tagItems || []);

const filterCategory = ref([]);
const filterTag = ref([]);
const filterChecked = ref([]);

const toggleValue = async (array, value) => {
  const index = array.value.indexOf(value);
  if (index === -1) {
    array.value.push(value);
  } else {
    array.value.splice(index, 1);
  }
  // 通過 slice() 創建新的數組以觸發 Vue 的響應式系統
  array.value = array.value.slice();
  await nextTick();
};

const categoryFilterHandler = async (cg) => {
  await toggleValue(filterCategory, cg);
  await filterHandler();
};

const tagFilterHandler = async (tag) => {
  await toggleValue(filterTag, tag);
  await filterHandler();
};

const finishFilterHandler = async (flag) => {
  await toggleValue(filterChecked, flag);
  await filterHandler();
};

const filterHandler = async () => {
  try {
    const params = {
      categories: filterCategory.value,
      tags: filterTag.value,
      checked: filterChecked.value,
    };
    await todoStore.fetchTodoWeekItems(params);
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};
</script>

<style scoped>
.el-menu--horizontal {
  height: 6vh;
}
.custom-active-class.is-active {
  background-color: #409eff; /* 自定義選中狀態的背景顏色 */
  color: white;
}
</style>
