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
          <div class="font-bold text-center py-4 shadow-lg">移動到...</div>
          <div>
            <h5 class="font-bold leading-10 px-4 py-2 text-lg">我的標籤</h5>
            <ul>
              <li
                v-for="(item, index) in tagList"
                :key="index"
                class="flex items-center px-4 py-4 mx-auto leading-20 border-t border-gray-200 cursor-pointer"
                :style="{ backgroundColor: getColor(item.color) }"
              >
                <input type="checkbox" v-model="checkedTag" :value="item" />
                <h5 class="text-black ml-2">{{ item.name }}</h5>
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
                @click="taskTagHandler"
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
import { ref, reactive, watch } from "vue";
import { getColor } from "../../utils/color.js";
const props = defineProps({
  tags: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["editTag", "close"]);
const selectCategory = ref("Personal");
const userStore = useUserStore();

const tagList = computed(() => userStore.userStoreInfo.tag);
const checkedTag = ref([]);

// 將 props 中的已經勾選的項目設置到 checkedTag 中
watch(
  () => props.tags,
  (newTags) => {
    checkedTag.value = [...newTags];
  },
  { immediate: true } // 確保在組件初始化時立即執行
);

const taskTagHandler = () => {
  emit("editTag", checkedTag.value);
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

.list-item {
  width: 95%;
  display: flex;
}
</style>
