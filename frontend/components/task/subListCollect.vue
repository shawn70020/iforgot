<template>
  <div>
    <div class="todo-list-container max-h-800 overflow-y-auto">
      <div v-for="(item, index) in subTasks" :key="item._id">
        <taskSubList
          :name="item.name"
          :completed="item.completed"
          :id="item._id"
          @close="deleteSubHandler"
          @check="checkSubHandler"
          @edit="editSubHandler"
        />
      </div>
    </div>
    <main class="input-box relative flex h-14 rounded-lg text-white pl-2 shadow-lg mt-4">
      <section class="flex items-center">
        <input
          class="text-gray-500 w-full focus:outline-none w-full ml-2"
          type="text"
          v-model="subValue"
          @keyup.enter.stop.prevent="submitSubHandler"
          placeholder="輸入任務名稱"
        />
      </section>
    </main>
  </div>
</template>

<script setup>
import { useSubStore } from "../../stores/sub";
const props = defineProps({
  taskId: {
    type: String,
    required: true,
  },
  subTask: {
    type: Array,
    default: [],
  },
});
const subStore = useSubStore();
const subTasks = computed(() => subStore.subItems.subtasks);
const isEditModalVisible = ref(false);
const subValue = ref("");

// onMounted(async () => {
//   await subStore.fetchSubItems(props.taskId);
// });

watch(
  () => props.taskId,
  async (newTask) => {
    await subStore.fetchSubItems(newTask);
  }
);

const deleteSubHandler = async (subId) => {
  try {
    await subStore.deleteItem({
      taskId: props.taskId,
      subId,
    });
  } catch (error) {
    console.error("Error submitting task:", error);
  }
};

const checkSubHandler = async (subId) => {
  try {
    await subStore.checkItem({
      taskId: props.taskId,
      subId,
    });
  } catch (error) {
    console.error("Error submitting task:", error);
  }
};

const submitSubHandler = async () => {
  try {
    await subStore.addSubItem({
      taskId: props.taskId,
      name: subValue.value,
    });
    subValue.value = "";
  } catch (error) {
    console.error("Error submitting task:", error);
  }
};

const editSubHandler = async ({ id, value }) => {
  try {
    await subStore.editSubItem({
      taskId: props.taskId,
      subId: id,
      name: value,
    });
  } catch (error) {
    console.error("Error submitting task:", error);
  }
};
</script>

<style scoped>
/* 在這裡添加自定義的最大高度類 */
.max-h-800 {
  max-height: 75vh;
}
</style>
