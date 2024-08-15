<template>
  <div class="flex pl-[17rem] mt-4">
   <allTodoItem
      @edit="openEditModal"
      @check="checkItemHandler"
    ></allTodoItem>
    <all-edit-modal
      :task="selectedTask"
      :position="nowPosition"
      @close="closeEditModal"
      @reset="resetTask"
    />
  </div>
</template>
<script setup>
import { useTodoStore } from "../../stores/todo";
const todoStore = useTodoStore();

const isEditModalVisible = ref(false);

const todoItems = computed(() => todoStore.todoItems);

const selectedTask = ref({})

const nowPosition = ref('')

const togglePosition = ref(null);

onMounted(async () => {
  await todoStore.fetchTodoItems();
  selectedTask.value = todoStore.todoItems.today[0]
  nowPosition.value = 'today'
});


const openEditModal = (taskId, position) => {
  selectedTask.value = todoItems.value[position].find(
    (item) => item._id === taskId
  );
  nowPosition.value = position
};

const checkItemHandler = async (taskId) => {
  await todoStore.checkedItem({ taskId });
}

const resetTask = (taskId) => {
  selectedTask.value = todoItems.value[nowPosition.value].find(
    (item) => item._id === taskId
  );
};

const closeEditModal = () => {
  isEditModalVisible.value = false;
  selectedTask.value = null;
};
</script>
<style>

</style>
