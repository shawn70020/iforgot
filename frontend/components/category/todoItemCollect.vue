<template>
  <div class="flex pl-[17rem] mt-4">
    <categoryTodoItem
      :category="cg"
      @reset="resetHandler"
      @edit="openEditModal"
      @check="checkItemHandler"
    ></categoryTodoItem>
    <category-edit-modal
     v-if="todoItems.length > 0"
      :task="selectedTask"
      @close="closeEditModal"
      @reset="resetHandler"
    />
  </div>
</template>
<script setup>
import { useTodoStore } from "../../stores/todo";
const props = defineProps({
  cg: {
    type: String,
    default: () => "",
  },
});
const todoStore = useTodoStore();

const isEditModalVisible = ref(false);

const todoItems = computed(() => todoStore.todoItems);

const selectedTask = ref({});

onMounted(async () => {
  await initStatus(props.cg);
});

watch(
  () => props.cg,
  async (newCg) => {
    await initStatus(newCg);
  }
);

const initStatus = async (cg) => {
  await todoStore.fetchTodoItems(cg);
  selectedTask.value = todoItems.value[0];
};

const openEditModal = (taskId) => {
  selectedTask.value = todoItems.value.find((item) => item._id === taskId);
};

const checkItemHandler = async (taskId) => {
  await todoStore.checkedItem({ taskId }, true);
  await todoStore.fetchTodoItems(props.cg);
};

const resetHandler = async (type, taskId) => {
  await todoStore.fetchTodoItems(props.cg);

  if (type === "category") {
    selectedTask.value = todoItems.value[0];
  }
  if (type === "tag") {
    selectedTask.value = todoItems.value.find((item) => item._id === taskId);
  }
};

const closeEditModal = () => {
  isEditModalVisible.value = false;
  selectedTask.value = null;
};
</script>
<style></style>
