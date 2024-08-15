<template>
  <div class="relative">
    <main
      class="input-box relative flex h-20 bg-white bg-opacity-60 rounded-lg text-white pl-2 shadow-lg mt-4"
    >
      <section class="flex items-center">
        <div
          @click="toggleCheck"
          class="relative w-5 h-5 border-2 border-gray-400 rounded-full cursor-pointer flex items-center justify-center ml-2"
        >
          <transition name="scale">
            <div v-if="taskChecked" class="w-5 h-5 bg-gray-400 rounded-full">
              <img
                class="w-5 h-5 mx-auto leading-6"
                src="../../public/radio.svg"
                alt="radio-icon"
              />
            </div>
          </transition>
        </div>
        <div class="ml-4" @click="editTaskHandler">
          <h4 class="text-[#00000099] text-[14px]">我的列表 > {{ category }}</h4>
          <h5 class="text-[#030303] text-[18px]" :class="{ 'line-through': checked }">{{ taskTitle }}</h5>
        </div>
        <div class="flex absolute right-4 top-4">
          <img
            v-show="!pinned"
            @click="pinTaskHandler"
            class="w-[1.8rem] pin-col cursor-pointer mr-4"
            src="../../public/pin.svg"
            alt="user-icon"
          />
          <img
            v-show="pinned"
            @click="pinTaskHandler"
            class="w-[1.8rem] pin-col cursor-pointer mr-4"
            src="../../public/pin-true.svg"
            alt="user-icon"
          />
          <svg
            @click="deleteTaskHandler"
            class="w-5 h-5 mr-2 cursor-pointer icon-color fill-current text-gray-500 hover:text-blue-500"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"
            />
          </svg>
        </div>
      </section>
    </main>
  </div>
</template>
<script setup>
import { useTodoStore } from "../../stores/todo";
const emit = defineEmits(["edit"]);
const props = defineProps({
  taskId: {
    type: String,
  },
  category: {
    type: String,
  },
  taskTitle: {
    type: String,
  },
  checked: {
    type: Boolean,
  },
  pinned: {
    type: Boolean,
  },
});

const todoStore = useTodoStore();
const taskChecked = ref(props.checked);
const isHover = ref(false);
const showControl = ref(false);

const bgClass = computed(() => (props.pinned ? "bg-blue-500" : ""));

watch(
  () => props.checked,
  (newVal) => {
    taskChecked.value = newVal;
  }
);

const toggleCheck = () => {
  taskChecked.value = !taskChecked.value;
  checkTaskHandler();
};

const checkTaskHandler = async () => {
  try {
    await todoStore.checkedItem({ taskId: props.taskId });
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

const pinTaskHandler = async () => {
  try {
    await todoStore.pinnedItem({ taskId: props.taskId });
  } catch (error) {
    console.error("Error pinning task:", error);
  }
};

const deleteTaskHandler = async () => {
  try {
    await todoStore.deleteItem({ taskId: props.taskId });
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

const editTaskHandler = () => {
  emit("edit", props.taskId);
};
</script>
<style lang="scss" scoped>
.input-box {
  width: 714px;
}
.scale-enter-active,
.scale-leave-active {
  transition: transform 0.3s ease-in-out;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0);
}

.scale-enter-to,
.scale-leave-from {
  transform: scale(1);
}
.pin-col{
  transform: translate(0, -5.5px);
}
</style>
