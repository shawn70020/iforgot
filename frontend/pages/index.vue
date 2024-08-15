<template>
  <div>
    <main class="container h-screen relative mx-auto py-12">
      <section>
        <h2 class="text-[28px] text-[#e4e4e4]">{{title}}，{{ userName }}</h2>
        <p class="text-[28px] text-[#a2a2a2]">這是您的私人專屬空間</p>
      </section>
      <section>
        <taskTodoItemCollect class="max-h-800 overflow-y-auto" />
      </section>
      <section>
        <taskAddbox />
      </section>
      <div>
        <bgSearch />
      </div>
    </main>
  </div>
</template>

<script setup>
import { useUserStore } from "../../stores/user";
const userStore = useUserStore();
definePageMeta({
  layout: "default",
  middleware: 'auth',
});
const userName = computed(() => userStore.userStoreInfo.name);

function getGreeting() {
  const currentHour = new Date().getHours();
  let greeting;

  if (currentHour >= 18 && currentHour < 24) {
    greeting = "晚安";
  } else if (currentHour >= 0 && currentHour < 6) {
    greeting = "該休息了";
  } else if (currentHour >= 6 && currentHour < 12) {
    greeting = "早安";
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = "下午好";
  }

  return greeting;
}

const title = ref(getGreeting())
</script>
<style lang="scss" scoped>
.container {
  width: 714px;
}
.max-h-800{
  max-height:70vh;
}
</style>
