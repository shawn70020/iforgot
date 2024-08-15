<template>
  <div>
    <main
      class="input-box relative flex justify-between h-14 rounded-lg text-white pl-2 shadow-lg mt-4"
    >
      <section class="flex items-center">
        <div
          @click="toggleCheck"
          class="relative w-5 h-5 border-2 border-gray-400 rounded-full cursor-pointer flex items-center justify-center ml-2"
        >
          <transition name="scale">
            <div v-if="subChecked" class="w-5 h-5 bg-gray-400 rounded-full">
              <img
                class="w-4 h-5 mx-auto leading-6"
                src="../../public/radio.svg"
                alt="radio-icon"
              />
            </div>
          </transition>
        </div>
        <input
          @input="debounceEditSub"
          class="text-gray-500 w-full focus:outline-none w-full ml-2"
          :class="{ 'line-through': subChecked }"
          type="text"
          v-model="subValue"
          placeholder="輸入任務名稱"
        />
      </section>
      <img
        @click="deleteSubHandler"
        class="w-5 cursor-pointer mr-5"
        src="../../public/circle-close.svg"
        alt="back-btn"
      />
    </main>
  </div>
</template>
<script setup>
import { useSubStore } from "../../stores/sub";
import { debounce } from "~/utils/debounce";
const emit = defineEmits(["edit"]);
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});
const subStore = useSubStore();
const subChecked = ref(props.completed);
const subValue = ref(props.name);

const bgClass = computed(() => (props.pinned ? "bg-blue-500" : ""));

watch(
  () => props.checked,
  (newVal) => {
    subChecked.value = newVal;
  }
);

const toggleCheck = () => {
  subChecked.value = !subChecked.value;
  emit("check", props.id);
};

const deleteSubHandler = async () => {
  emit("close", props.id);
};

const editSubHandler = async () => {
  emit("edit", { id: props.id, value: subValue.value });
};

const debounceEditSub = debounce(editSubHandler, 2000);
</script>
<style lang="scss" scoped>
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
</style>
