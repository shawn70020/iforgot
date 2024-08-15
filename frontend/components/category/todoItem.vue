<template>
  <div class="all-todo-item h-[100vh] m-2">
    <div class="rounded-tl-lg rounded-tr-lg min-h-[65vh] max-h-[71vh] overflow-y-auto bg-white p-4">
      <ul v-if="todoItems.length > 0" class="mb-4">
        <li
          v-for="item in todoItems"
          :key="item._id"
          class="w-list shadow-lg mx-auto p-2 mb-4 rounded-lg hover:bg-gray-200"
          :class="{ 'bg-gray-200': nowSelected === item._id }"
        >
          <div class="flex items-center">
            <div
              @click="toggleCheck(item._id)"
              class="relative w-5 h-5 border-2 border-gray-400 rounded-full cursor-pointer flex items-center justify-center ml-2"
            >
              <transition name="scale">
                <div v-if="item.checked" class="w-5 h-5 bg-gray-400 rounded-full">
                  <img
                    class="w-5 h-5 mx-auto leading-6"
                    src="../../public/radio.svg"
                    alt="radio-icon"
                  />
                </div>
              </transition>
            </div>
            <div
              @click="editTaskHandler(item._id, 'today')"
              class="text-left ml-2 cursor-pointer"
            >
              <div :class="{ 'line-through': item.checked }">{{ item.name }}</div>
              <div class="flex items-center text-sm text-gray-500">
                {{ item.category }}
                <div class="flex items-center" v-if="item.tags && item.tags.length > 0">
                  <img
                    class="w-4 ml-2 cursor-pointer"
                    src="../../public/link.svg"
                    alt="link-tag"
                  />
                  <div
                    v-for="(tag, index) in item.tags"
                    :key="index"
                    class="ml-1 h-[5px] w-[20px] rounded-md"
                    :style="{ backgroundColor: getColor(tag.color) }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- 底部 -->
    <div class="bg-white relative z-100 shadow p-4 rounded-bl-lg rounded-br-lg">
      <div
        class="input-box flex h-10 bg-gray-300 rounded-lg text-white pl-2 box-border border hover:border-blue-500 shadow-lg"
      >
        <section class="flex items-center w-full hover:cursor-text relative">
          <input
            class="text-gray-500 bg-gray-300 focus:outline-none w-4/5 ml-2"
            type="text"
            v-model="taskValue"
            @keyup.enter.stop.prevent="submitTaskHandler"
            placeholder="輸入任務名稱"
          />
          <svg
            @click.prevent="submitTaskHandler"
            class="w-6 h-6 absolute right-2 cursor-pointer"
            viewBox="0 0 24 24"
            fill="#000000"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 3C12.2652 3 12.5196 3.10536 12.7071 3.29289L19.7071 10.2929C20.0976 10.6834 20.0976 11.3166 19.7071 11.7071C19.3166 12.0976 18.6834 12.0976 18.2929 11.7071L13 6.41421V20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20V6.41421L5.70711 11.7071C5.31658 12.0976 4.68342 12.0976 4.29289 11.7071C3.90237 11.3166 3.90237 10.6834 4.29289 10.2929L11.2929 3.29289C11.4804 3.10536 11.7348 3 12 3Z"
            />
          </svg>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTodoStore } from "../../stores/todo";
import { getColor } from "../../utils/color.js";

const props = defineProps({
  category: {
    type: String,
    default: () => "",
  },
});

const todoStore = useTodoStore();
const emit = defineEmits(["edit", "check", "reset"]);
const nowSelected = ref("");
const showCategory = ref(false);
const showTag = ref(false);
const nowCategory = ref("");
const nowTag = ref("");
const taskValue = ref("");

const todoItems = computed(() => todoStore.todoItems || []);

const toggleCheck = (taskId) => {
  emit("check", taskId);
};

const editTaskHandler = (taskId, position) => {
  nowSelected.value = taskId;
  emit("edit", taskId, position);
};

const setCategory = async (category) => {
  nowCategory.value = category;
  showCategory.value = false;
};

const setTag = async (tag) => {
  nowTag.value = tag;
  showTag.value = false;
};

const submitTaskHandler = async () => {
  try {
    await todoStore.addTodoItem({
      name: taskValue.value,
      category: props.category,
      noReload: true,
    });
    taskValue.value = "";
    emit("reset", "category");
  } catch (error) {
    console.error("Error submitting task:", error);
  }
};
</script>
<style lang="scss" scoped>
.all-todo-item {
  width: 47%;
}
.w-list {
  width: 97%;
}
.slide-up-down-enter-active,
.slide-up-down-leave-active {
  transition: all 0.3s ease;
}
.slide-up-down-enter-from {
  opacity: 0;
  transform: translateY(100%);
}
.slide-up-down-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.slide-up-down-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.slide-up-down-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
