<template>
  <div>
    <main
      @click="isFocus = true"
      class="input-box flex h-10 bg-gray-300 rounded-lg text-white pl-2 absolute bottom-6 box-border border hover:border-blue-500 shadow-lg"
    >
      <section v-if="!isFocus" class="flex items-center">
        <img class="w-6 h-6" src="../../public/add.svg" alt="add-icon" />
        <h5>添加任務</h5>
      </section>
      <section v-else class="flex items-center w-full hover:cursor-text relative">
        <img
          @click="listToggle = !listToggle"
          class="w-6 h-6 cursor-pointer"
          src="../../public/category-list.svg"
          alt="list-icon"
        />
        <input
          class="text-gray-500 bg-gray-300 focus:outline-none w-4/5 ml-2"
          type="text"
          v-model="taskValue"
          @keydown.enter.prevent="onKeyDownEnter"
          @keyup.enter="onKeyUpEnter"
          @compositionstart="onCompositionStart"
          @compositionend="onCompositionEnd"
          placeholder="輸入任務名稱"
        />
        <svg
          @click.prevent="submitTaskHandler"
          class="w-6 h-6 absolute right-2 cursor-pointer"
          :class="{ sendColor: isTyping }"
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
        <transition
          enter-active-class="transition-all duration-500 ease-in-out"
          enter-from-class="max-h-0 opacity-0"
          enter-to-class="max-h-screen opacity-100"
          leave-active-class="transition-all duration-500 ease-in-out"
          leave-from-class="max-h-screen opacity-100"
          leave-to-class="max-h-0 opacity-0"
        >
          <div
            v-show="listToggle"
            class="pop-up-list absolute w-96 h-88 bg-white rounded-lg bottom-12 text-gray-600 left-0 p-2"
          >
            <h5 class="font-bold leading-10 px-2 py-2 text-lg">我的列表</h5>
            <ul class="max-h-800 overflow-y-auto">
              <li
                v-for="(item, index) in categoryList"
                :key="index"
                @click="setCategory(item)"
                class="flex items-center justify-between px-2 py-4 mx-auto leading-20 border-t border-gray-200 cursor-pointer hover:bg-gray-200"
              >
                <h5 class="text-black">{{ item }}</h5>
                <img
                  v-if="item === selectCategory"
                  class="w-6 h-6"
                  src="../../public/correct.svg"
                  alt="check-icon"
                />
              </li>
            </ul>
          </div>
        </transition>
      </section>
    </main>
  </div>
</template>

<script setup>
import { useTodoStore } from "../../stores/todo";
import { useUserStore } from "../../stores/user";
import { ref, reactive, watch } from "vue";

const isFocus = ref(false);
const isTyping = ref(false);
const taskValue = ref("");
const isComposing = ref(false);
const compositionJustEnded = ref(false);
const selectCategory = ref("Personal");
const listToggle = ref(false);
const todoStore = useTodoStore();
const userStore = useUserStore();

const categoryList = computed(() => userStore.userStoreInfo.category);

const setCategory = (value) => {
  selectCategory.value = value;
  items.forEach((item) => {
    item.checked = item.title === selectedTitle;
  });
};

const onCompositionStart = () => {
  isComposing.value = true;
};

const onCompositionEnd = () => {
  isComposing.value = false;
  compositionJustEnded.value = true;
};

const onKeyDownEnter = (event) => {
  if (isComposing.value) {
    // 組字中按下 Enter，阻止提交
    event.preventDefault();
  }
};

const onKeyUpEnter = (event) => {
  if (!isComposing.value && !compositionJustEnded.value) {
    // 組字完成後再按 Enter 鍵，進行提交
    handleEnter();
  } else {
    // 重置組字完成狀態
    compositionJustEnded.value = false;
  }
};

const handleEnter = async () => {
  try {
    await todoStore.addTodoItem({
      name: taskValue.value,
      category: selectCategory.value,
    });
    taskValue.value = "";
    isTyping.value = false;
    listToggle.value = false;
    isFocus.value = false;
  } catch (error) {
    console.error("Error submitting task:", error);
  }
};

watch(taskValue, (value) => {
  isTyping.value = !!value;
});
</script>

<style lang="scss" scoped>
.input-box {
  width: 714px;
  border-width: 1px;
}
.sendColor {
  fill: rgb(59, 130, 246);
}
.pop-up-list {
  width: 400px;
  height: 350px;
}
.list-item {
  width: 95%;
  display: flex;
}
.max-h-800 {
  max-height: 35vh;
}
</style>
