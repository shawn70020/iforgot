<template>
  <div class="flex pl-[17rem] mt-5">
   <weekTodoItem
      v-for="(item, idx) in todoItems"
      :key="idx"
      :position="idx"
      :formattedDays="formattedDays"
      :items="item.tasks"
      @edit="openEditModal"
      @check="checkItemHandler"
    ></weekTodoItem>
    <task-edit-modal
      v-if="isEditModalVisible"
      :task="selectedTask"
      @close="closeEditModal"
      @reset="resetTask"
    />
  </div>
</template>
<script setup>
import { useTodoStore } from "../../stores/todo";
const todoStore = useTodoStore();
const todoItems = computed(() => todoStore.todoItems || []);
const isEditModalVisible = ref(false);
const selectedTask = ref(null);
const togglePosition = ref(null);
onMounted(async () => {
  await todoStore.fetchTodoItems();
});
// 获取今天的日期和星期几索引
const today = new Date();
const dayNames = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
const todayIndex = today.getDay();

// 生成接下来七天的日期
const days = [];
for (let i = 0; i < 7; i++) {
  const date = new Date();
  date.setDate(today.getDate() + i);
  days.push(dayNames[date.getDay()]);
}

// 格式化输出
const formattedDays = ref([]);
formattedDays.value.push(`今天 ${days[0]}`);
formattedDays.value.push(`明天 ${days[1]}`);
for (let i = 2; i < 7; i++) {
  formattedDays.value.push(`${days[i]}`);
}

const openEditModal = (taskId, position) => {
  togglePosition.value = position;
  selectedTask.value = todoItems.value[position].tasks.find(
    (item) => item._id === taskId
  );
  isEditModalVisible.value = true;
};

const checkItemHandler = async (taskId) => {
  await todoStore.checkedItem({ taskId });
}

const resetTask = (taskId) => {
  selectedTask.value = todoItems.value[togglePosition.value].tasks.find(
    (item) => item._id === taskId._id
  );
};

const closeEditModal = () => {
  isEditModalVisible.value = false;
  selectedTask.value = null;
};
</script>
<style>
.week-list {
  width: 100vw;
  overflow-x: scroll;
}
</style>
