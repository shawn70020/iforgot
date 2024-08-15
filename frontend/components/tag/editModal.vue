<template>
  <div class="modal z-50">
    <div
      class="modal-content w-[570px] h-[80vh] rounded-xl py-8 px-6 bg-white overflow-y-auto max-h-[90vh]"
    >
      <nav class="flex justify-between">
        <a>我的列表 > {{ editedTask.category }}</a>
        <ul class="flex">
          <li class="mr-2">標記為已完成</li>
          <li class="mr-2">刪除</li>
          <li>
            <img
              @click="closeModal"
              class="w-6 cursor-pointer"
              src="../../public/close.svg"
              alt="back-btn"
            />
          </li>
        </ul>
      </nav>
      <div class="mt-4 text-4xl text-[#030303]">{{ editedTask.name }}</div>
      <ul class="flex mt-8">
        <li
          @click="categorySelect = true"
          class="flex justify-center items-center w-1/5 rounded-2xl shadow-lg py-2 text-[#030303] text-sm ml-4 cursor-pointer"
        >
          <img
            class="w-4 cursor-pointer mr-2"
            src="../../public/category.svg"
            alt="back-btn"
          />{{ editedTask.category }}
        </li>
        <taskCategory
          v-if="categorySelect"
          :category="editedTask.category"
          @editCategory="taskCategoryHandler"
        />
        <li
          @click="tagSelect = true"
          class="flex justify-center items-center w-1/5 rounded-2xl shadow-lg py-2 text-[#030303] text-sm ml-4 cursor-pointer"
        >
          <img
            class="w-4 cursor-pointer mr-2"
            src="../../public/blue-tag.svg"
            alt="back-btn"
          />標籤
        </li>
        <taskTag
          v-if="tagSelect"
          :tags="editedTask.tags"
          @editTag="taskTagHandler"
          @close="tagSelect = false"
        />
      </ul>
      <div class="tag-list flex mt-4">
        <h5
          class="block text-white text-center px-4 py-2 rounded-full text-xs mr-2"
          :style="{ backgroundColor: getColor(tag.color) }"
          v-for="(tag, index) in editedTask.tags"
          :key="index"
        >
          {{ tag.name }}
        </h5>
      </div>
      <div class="mt-4">
        <h5>備註</h5>
        <textarea
          @input="debouncedNote"
          class="mt-2 w-full focus:outline-none w-9/12 resize-y"
          v-model="notes"
          placeholder="在此插入筆記"
          rows="4"
        ></textarea>
      </div>
      <div class="mt-10">SUBTASKS</div>
      <taskSubListCollect :taskId="editedTask._id" :subTask="editedTask.subtasks" />
      <fileUpload :taskId="editedTask._id" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { debounce } from "~/utils/debounce";
import { useTodoStore } from "../../stores/todo";
import { getColor } from "../../utils/color.js";

const categorySelect = ref(false);
const tagSelect = ref(false);

const todoStore = useTodoStore();

const props = defineProps({
  task: {
    type: Object,
    required: true,
    default: () => [],
  },
});

const emit = defineEmits(["close", "reset"]);
const editedTask = ref({ ...props.task });
const notes = ref(editedTask.value.description);

watch(
  () => props.task,
  (newTask) => {
    editedTask.value = { ...newTask };
    notes.value = newTask.description;
  }
);

const closeModal = () => {
  emit("close");
};

const resetTask = () => {
  emit("reset", props.task);
};

const taskNoteHandler = async () => {
  try {
    await todoStore.addTaskNote({
      taskId: props.task._id,
      note: notes.value,
      noReload: true,
    });
    emit("reset", "note");
  } catch (error) {
    console.error("Error submitting task:", error);
  }
};
const debouncedNote = debounce(taskNoteHandler, 2000);

const taskCategoryHandler = async (selectedCategory) => {
  await todoStore.editTaskCategory({
    taskId: editedTask.value._id,
    selectedCategory,
    noReload: true,
  });
  categorySelect.value = false;
  await emit("reset", {
    type: "category",
    id: editedTask.value._id,
    cg: selectedCategory,
  });
};

const taskTagHandler = async (selectedTag) => {
  await todoStore.editTaskTag({
    taskId: editedTask.value._id,
    selectedTag,
    noReload: true,
  });
  tagSelect.value = false;
  await emit("reset", {
    type: "tag",
    id: editedTask.value._id,
    tag: selectedTag
  });
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
