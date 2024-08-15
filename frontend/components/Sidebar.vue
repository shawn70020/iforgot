<template>
  <div class="sidebar bg-white bg-opacity-60 backdrop-blur-md relative z-50">
    <div class="user-list flex items-center">
      <img class="w-12 cursor-pointer" src="../public/user.svg" alt="user-icon" />
      <h5 class="ml-2 font-bold">{{ userName }}</h5>
    </div>
    <nav class="mt-4 ml-2">
      <ul>
        <li class="flex mb-4">
          <img class="w-5 cursor-pointer mr-4" src="../public/idea.svg" alt="user-icon" />
          <router-link to="/">我的一天</router-link>
        </li>
        <li class="flex mb-4">
          <img class="w-5 cursor-pointer mr-4" src="../public/week.svg" alt="user-icon" />
          <router-link to="/week">接下來的7天</router-link>
        </li>
        <li class="flex mb-4">
          <img class="w-5 cursor-pointer mr-4" src="../public/all.svg" alt="user-icon" />
          <router-link to="/all">我所有的任務</router-link>
        </li>
      </ul>
    </nav>
    <nav class="category-list mt-8">
      <div class="flex justify-between">
        <h5 class="font-bold text-lg">我的列表</h5>
        <img
          @click="openCategory"
          class="w-5 cursor-pointer mr-4"
          src="../public/plus.svg"
          alt="user-icon"
        />
      </div>
      <ul class="mt-2">
        <li
          class="mt-4 flex items-center"
          v-for="(cg, index) in categoryList"
          :key="index"
        >
          <router-link :to="`/category/${cg}`">{{ cg }}</router-link>
          <h5
            class="ml-2 w-5 h-5 text-center leading-5 text-sm rounded-full bg-white bg-opacity-50 text-gray-500"
          >
            {{ countList.categories?.[cg] ?? 0 }}
          </h5>
        </li>
      </ul>
    </nav>
    <nav class="tag-list mt-8">
      <div class="flex justify-between">
        <h5 class="font-bold text-lg">標籤</h5>
        <img
          class="w-5 cursor-pointer mr-4"
          @click="openTag"
          src="../public/plus.svg"
          alt="user-icon"
        />
      </div>
      <ul class="mt-2">
        <li
          class="mt-4 flex items-center"
          v-for="(tag, index) in tagList"
          :key="index"
        >
          <router-link :to="`/tag/${tag.name}`" :style="{ color: getColor(tag.color) }"> #{{ tag.name }}</router-link>
          <h5
            class="ml-2 w-5 h-5 text-center leading-5 text-sm rounded-full bg-white bg-opacity-50 text-gray-500"
          >
            {{ countList.tags?.[tag.name] ?? 0 }}
          </h5>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { useUserStore } from "../../stores/user.js";
import { getColor } from "../../utils/color.js";
const userStore = useUserStore();

const userInfo = computed(() => userStore.userStoreInfo);

const emit = defineEmits(["openCategory", "openTag"]);

const categoryList = computed(() => userInfo.value.category);
const tagList = computed(() => userInfo.value.tag);
const countList = computed(() => userStore.userTasksCount);

const showAddCag = ref(false);

const userName = computed(() => userStore.userStoreInfo.name);

const taskNumList = async () => {
  try {
    await userStore.getUserCount();
  } catch (error) {
    console.error("Login error:", error);
  }
};

const openCategory = () => {
  emit("openCategory");
};

const openTag = () => {
  emit("openTag");
};

onMounted(async () => {
  await taskNumList();
});
</script>

<style scoped>
.sidebar {
  position: fixed;
  padding: 1rem;
  height: 100vh; /* Full height */
}

.sidebar nav ul {
  list-style: none;
  padding: 0;
}

.sidebar nav ul li a {
  text-decoration: none;
  color: #333;
}

.sidebar nav ul li a:hover {
  text-decoration: underline;
}
</style>
