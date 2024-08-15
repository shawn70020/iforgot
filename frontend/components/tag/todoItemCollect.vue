<template>
  <div class="flex pl-[17rem] mt-5">
    <tagTodoItem
      v-for="(item, key, idx) in todoItems"
      :key="idx"
      :title="key"
      :items="item"
      @edit="openEditModal"
      @check="checkItemHandler"
      @add="addHandler"
    ></tagTodoItem>
    <tag-edit-modal
      v-if="isEditModalVisible"
      :task="selectedTask"
      @close="closeEditModal"
      @reset="resetHandler"
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
const props = defineProps({
  tag: {
    type: String,
    default: () => "",
  },
});
onMounted(async () => {
  await todoStore.fetchTodoItems(props.tag);
});

const openEditModal = (taskId, position) => {
  togglePosition.value = position;
  selectedTask.value = todoItems.value[position].find((item) => item._id === taskId);
  isEditModalVisible.value = true;
};

const checkItemHandler = async (taskId) => {
  await todoStore.checkedItem({ taskId });
};

const resetTask = (taskId) => {
  selectedTask.value = todoItems.value[togglePosition.value].tasks.find(
    (item) => item._id === taskId
  );
  console.log(selectedTask.value);
};

const resetHandler = async (params) => {
  await todoStore.fetchTodoItems(props.tag);
  if (params.type === "category") {
    selectedTask.value = todoItems.value[params.cg].find(
      (item) => item._id === params.id
    );
  }
  if (params.type === "tag") {
    if (params.tag.some((item) => item.name === props.tag)) {
      selectedTask.value = todoItems.value[togglePosition.value].find(
        (item) => item._id === params.id
      );
    } else {
      isEditModalVisible.value = false;
    }
  }
};

const addHandler = async () => {
    await todoStore.fetchTodoItems(props.tag);
}

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
