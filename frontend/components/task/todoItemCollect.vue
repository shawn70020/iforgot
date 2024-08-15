<template>
  <div>
    <div class="todo-list-container">
      <div v-if="todoItems.length > 0">
        <div v-for="(item, index) in todoItems" :key="item._id">
          <taskTodoItem
            :category="item.category"
            :taskTitle="item.name"
            :checked="item.checked"
            :pinned="item.pinned"
            :taskId="item._id"
            @edit="openEditModal(item)"
          />
        </div>
      </div>
    </div>
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
const todoItems = computed(() => todoStore.todoItems);
const isEditModalVisible = ref(false);
const selectedTask = ref(null);

onMounted(async () => {
  await todoStore.fetchTodoItems();
});

const openEditModal = (taskId) => {
  selectedTask.value = todoItems.value.find((item) => item._id === taskId._id);
  isEditModalVisible.value = true;
};

const resetTask = (taskId) => {
  selectedTask.value = todoItems.value.find((item) => item._id === taskId._id);
  console.log(selectedTask.value);
};

const closeEditModal = () => {
  isEditModalVisible.value = false;
  selectedTask.value = null;
};

const saveTask = async (updatedTask) => {
  await todoStore.updateTask(updatedTask);
  closeEditModal();
};
</script>

<style scoped>
/* 在這裡添加自定義的最大高度類 */
.max-h-800 {
  max-height: 50vh;
}
</style>
