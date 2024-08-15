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
            <h5 class="font-bold leading-10 px-4 py-2 text-lg">我的列表</h5>
            <ul>
              <li
                v-for="(item, index) in categoryList"
                :key="index"
                @click="taskCategoryHandler(item)"
                class="flex items-center justify-between px-4 py-4 mx-auto leading-20 border-t border-gray-200 cursor-pointer hover:bg-gray-200"
              >
                <h5 class="text-black">{{ item }}</h5>
                <img
                  v-if="item === category"
                  class="w-6 h-6"
                  src="../../public/correct.svg"
                  alt="check-icon"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { useUserStore } from "../../stores/user";
import { ref, reactive, watch } from "vue";

const props = defineProps({
  category: {
    type: String,
    default: "Personal",
  },
});


const emit = defineEmits(["editCategory"]);
const selectCategory = ref("Personal");
const listToggle = ref(false);
const userStore = useUserStore();

const categoryList = computed(() => userStore.userStoreInfo.category);

const items = reactive([
  { title: "Personal", checked: true },
  { title: "Shop List", checked: false },
  { title: "Work", checked: false },
  { title: "Weekend", checked: false },
]);

const taskCategoryHandler = (selectedCategory) => {
    emit("editCategory", selectedCategory)
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
