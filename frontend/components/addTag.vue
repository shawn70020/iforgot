<template>
  <div>
    <transition
      enter-active-class="transition-all duration-500 ease-in-out"
      enter-from-class="max-h-0 opacity-0"
      enter-to-class="max-h-screen opacity-100"
      leave-active-class="transition-all duration-500 ease-in-out"
      leave-from-class="max-h-screen opacity-100"
      leave-to-class="max-h-0 opacity-0"
    >
      <div
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      >
        <div class="relative w-96 h-88 bg-white pb-4 rounded-xl text-gray-600 z-900">
          <div class="font-bold text-center py-4 shadow-lg">新標籤...</div>
          <div>
            <div class="flex items-center">
              <h5 class="font-bold leading-10 px-4 py-2 text-lg">標籤名稱</h5>
              <input
                class="focus:outline-none w-3/5"
                v-model="tagName"
                type="text"
                placeholder="Type a Name..."
              />
            </div>

            <ul class="flex flex-wrap justify-around">
              <li
                v-for="(item, index) in colorList"
                :key="index"
                @click="setColorHandler(item)"
                class="ball rounded-full cursor-pointer flex justify-center items-center"
                :style="{ backgroundColor: getColor(item.name) }"
              >
                <img
                  v-show="item.name === selectColor.name"
                  class="w-8"
                  src="../public/select.svg"
                  alt="user-icon"
                />
              </li>
            </ul>
            <div class="flex mt-4">
              <h5
                @click="closeHandler"
                class="w-1/2 text-center cursor-pointer hover:text-blue-500"
              >
                取消
              </h5>
              |
              <h5
                @click="submitHandler"
                class="w-1/2 text-center cursor-pointer hover:text-blue-500"
              >
                保存
              </h5>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { useUserStore } from "../../stores/user";
import { colors } from "../../utils/color.js";
import { ref, reactive, watch } from "vue";

const props = defineProps({
  category: {
    type: String,
    default: "Personal",
  },
});

const colorList = Array.from(colors, ([name, color]) => ({ name, color }));

const emit = defineEmits(["close"]);
const tagName = ref("");
const selectColor = ref("");
const userStore = useUserStore();

const setColorHandler = (color) => {
  selectColor.value = color;
};

const submitHandler = async () => {
  try {
    userStore.addUserTag({
      name: tagName.value,
      color: selectColor.value.name,
    });
    emit("close");
  } catch (error) {
    console.error(error);
  }
};

const closeHandler = () => {
  emit("close");
};
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
  z-index: 1050; /* 高層級 */
}

.ball {
  width: 4rem;
  height: 4rem;
  margin: 0.5rem;
}

.list-item {
  width: 95%;
  display: flex;
}
</style>
