<template>
  <li class="w-full h-48">
    <div v-if="isImage(file.url)" class="relative group w-full h-full mx-auto">
      <img class="w-full h-full object-cover" :src="file.url" :alt="'測試'" />
      <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
        <button @click="$emit('download', file.url, file.filename)" class="text-white mx-2">
          <img class="w-6 cursor-pointer" src="../../public/download.svg" alt="download-btn" />
        </button>
        <button @click="$emit('delete', file._id)" class="text-white mx-2">
          <img class="w-6 cursor-pointer" src="../../public/trash.svg" alt="delete-btn" />
        </button>
      </div>
    </div>
    <div v-else class="relative group w-full h-full mx-auto">
      <embed class="w-full h-full" :src="file.url" :type="file.contentType" />
      <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
        <button @click="$emit('download', file.url, file.filename)" class="text-white mx-2">
          <img class="w-6 cursor-pointer" src="../../public/download.svg" alt="download-btn" />
        </button>
        <button @click="$emit('delete', file._id)" class="text-white mx-2">
          <img class="w-6 cursor-pointer" src="../../public/trash.svg" alt="delete-btn" />
        </button>
      </div>
    </div>
    <h5>{{ file.filename }}</h5>
  </li>
</template>

<script setup>
import { isImage } from '../../utils/file.js';

const props = defineProps({
  file: {
    type: Object,
    required: true,
  },
});
</script>
