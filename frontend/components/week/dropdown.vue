<template>
  <el-menu
    :default-active="1"
    class="el-menu-demo h-[6vh]"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <el-sub-menu index="2">
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
        <el-menu-item index="2-2-1" @click="categoryFilterHandler">Personal</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="2-3">
        <template #title>標籤</template>
        <el-menu-item index="2-3-1">未標記</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="2-4">
        <template #title>狀態</template>
        <el-menu-item index="2-4-1">完成</el-menu-item>
        <el-menu-item index="2-4-2">未完成</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style>
.flex-grow {
  flex-grow: 1;
}
</style>
