<template>
  <div class="flex items-center space-x-2">
    <label class="flex items-center">
      <input
        type="checkbox"
        v-model="checked"
        class="hidden"
        @change="emitChange"
      />
      <div
        class="w-6 h-6 flex items-center justify-center border-2 border-gray-300 rounded cursor-pointer"
        :class="{ 'bg-white border-blue-500': checked, 'bg-gray-100': !checked }"
        @click="toggleCheckbox"
      >
        <svg
          v-if="checked"
          class="w-4 h-4 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>
      <span class="ml-2">Check me</span>
    </label>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 定義 emit 事件
const emit = defineEmits(['update:checked']);

const checked = ref(false);

const emitChange = () => {
  emit('update:checked', checked.value);
};

const toggleCheckbox = () => {
  checked.value = !checked.value;
  emitChange();
};
</script>
