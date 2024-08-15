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
        <div
          class="add-list relative bg-white pb-4 rounded-xl text-gray-600 z-900 flex items-center justify-center"
        >
          <img
            @click="closeHandler"
            class="w-6 cursor-pointer absolute right-5 top-5"
            src="../public/close.svg"
            alt="back-btn"
          />
          <input
            type="text"
            class="w-2/3 h-10 focus:outline-none"
            v-model="text"
            placeholder="請輸入類別名稱..."
          />
          <button
            @click="submitHandler"
            type="button"
            class="absolute right-5 bottom-5 w-20 h-10 bg-blue-500 text-white rounded-full"
          >
            繼續
          </button>
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

const emit = defineEmits(["close"]);
const selectCategory = ref("Personal");
const listToggle = ref(false);
const userStore = useUserStore();
const text = ref("");
const categoryList = computed(() => userStore.userStoreInfo.category);

const submitHandler = async () => {
  try {
    userStore.addUserCategory(text.value)
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

.list-item {
  width: 95%;
  display: flex;
}
.add-list {
  width: 30rem;
  height: 15rem;
  outline: none;
}
</style>
