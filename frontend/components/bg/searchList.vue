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
        class="fixed flex flex-col items-center inset-0 text-center bg-black bg-opacity-80 z-50 pt-20"
      >
        <h2 class="text-white text-3xl font-bold">Choose your background !</h2>
        <div class="flex w-1/3 items-center justify-center">
          <input
            @keyup.enter.stop.prevent="searchPhotosHandler"
            v-model="query"
            placeholder="Search for 10000 images..."
            class="input w-4/5 mt-4"
          />
          <img
            @click="reloadHandler"
            class="w-5 h-5"
            src="../../public/bg-reload.svg"
            alt="radio-icon"
          />
        </div>

        <div v-if="photos.length" class="photos-container flex flex-wrap">
          <div
            v-for="photo in filteredPhotos"
            :key="photo.id"
            class="mx-auto image-container border-2 border-gray-400 rounded-md cursor-pointer"
          >
            <img
              @click="setBackgroundHandler(photo.urls.full)"
              class="thumbnail"
              :src="photo.urls.small"
              :alt="photo.alt_description"
            />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import unsplash from "~/utils/unsplash";
import { useBackgroundStore } from "../../stores/background.js";

const bgStore = useBackgroundStore();
const page = ref(1);
const query = ref("");
const orientation = ref("");
const photos = ref([]);

const emit = defineEmits(["close"]);

onMounted(async () => {
  await searchPhotosHandler();
});

const searchPhotosHandler = async () => {
  try {
    const result = await unsplash.search.getPhotos({
      query: query.value || "dog",
      orientation: "landscape",
      page: page.value,
      perPage: 20,
    });
    if (result.errors) {
      console.error("Error occurred:", result.errors[0]);
    } else {
      photos.value = result.response.results;
    }
  } catch (error) {
    console.error("Error fetching photos:", error);
  }
};

const reloadHandler = async () => {
  if (page.value < 8) {
    page.value++;
  } else {
    page.value = 1;
  }

  await searchPhotosHandler();
};

// 根據尺寸過濾圖片
const filteredPhotos = computed(() => {
  return photos.value.filter((photo) => {
    // 這裡可以根據需要調整尺寸限制條件
    return photo.width > 1600 && photo.height > 1200;
  });
});

const setBackgroundHandler = async (url) => {
  await bgStore.setBackground(url);
  emit("close");
};
</script>

<style scoped>
.container {
  background-color: black;
  text-align: center;
  padding: 20px;
  min-height: 100vh;
}
.input {
  margin: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 9999px;
  background-color: gray;
  color: white;
  font-size: 16px;
}

.photos-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.image-container {
  margin: 10px;
}

.thumbnail {
  width: 180px;
  height: 120px;
  object-fit: cover; /* 這確保圖片會覆蓋容器並保持比例 */
}
</style>
