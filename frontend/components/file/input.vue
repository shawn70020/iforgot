<template>
  <div class="file-input-wrapper mt-8">
    <input type="file" @change="onFileChange" ref="fileInput" />
    <button
      class="mx-auto mt-2 rounded-lg text-gray-400 bg-white border border-dashed w-full block h-12 cursor-pointer text-center py-2 hover:border-blue-500 hover:text-blue-500"
      @click="triggerFileInput"
    >
      點擊此處添加/刪除文件
    </button>
  </div>
</template>

<script>
export default {
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    onFileChange(event) {
      const file = event.target.files[0];
      this.$emit("file-changed", file);
    },
  },
};
</script>

<style>
.file-input-wrapper input[type="file"] {
  display: none;
}
</style>
