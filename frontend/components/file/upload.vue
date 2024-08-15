<template>
  <div class="mt-4">
    <h1>附件</h1>

    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

    <ul v-if="uploadedFiles" class="w-full grid grid-cols-2 gap-4">
      <li
        class="w-full h-48"
        v-for="uploadedFile in uploadedFiles"
        :key="uploadedFile._id"
      >
        <div
          class="relative group w-full h-full mx-auto"
          v-if="isImage(uploadedFile.url)"
        >
          <img class="w-full h-full object-cover" :src="uploadedFile.url" :alt="'測試'" />
          <div
            class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <button
              @click="downloadFile(uploadedFile.url, uploadedFile.filename)"
              class="text-white mx-2"
            >
              <img
                class="w-6 cursor-pointer"
                src="../../public/download.svg"
                alt="back-btn"
              />
            </button>
            <button @click="deleteFile(uploadedFile._id)" class="text-white mx-2">
              <img
                class="w-6 cursor-pointer"
                src="../../public/trash.svg"
                alt="back-btn"
              />
            </button>
          </div>
        </div>

        <div class="relative group w-full h-full mx-auto" v-else>
          <embed
            class="w-full h-full"
            :src="uploadedFile.url"
            :type="uploadedFile.contentType"
          />
          <div
            class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <button
              @click="downloadFile(uploadedFile.url, uploadedFile.filename)"
              class="text-white mx-2"
            >
              <img
                class="w-6 cursor-pointer"
                src="../../public/download.svg"
                alt="back-btn"
              />
            </button>
            <button @click="deleteFile(uploadedFile._id)" class="text-white mx-2">
              <img
                class="w-6 cursor-pointer"
                src="../../public/trash.svg"
                alt="back-btn"
              />
            </button>
          </div>
        </div>
        <h5>{{ uploadedFile.filename }}</h5>
      </li>
    </ul>
    <FileInput @file-changed="onFileChange" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const props = defineProps({
  taskId: {
    type: String,
    required: true,
  },
});
const file = ref(null);
const fileUrl = ref(null);
const fileName = ref(null);
const uploadedFiles = ref([]);
const errorMessage = ref("");

const onFileChange = (inputFile) => {
  if (inputFile.size > 2 * 1024 * 1024) {
    errorMessage.value = "File size exceeds 2MB limit.";
    file.value = null;
    fileUrl.value = null;
  } else {
    errorMessage.value = "";
    file.value = inputFile;
    fileUrl.value = URL.createObjectURL(inputFile); // 生成本地预览 URL
    fileName.value = inputFile.name;
    uploadFile();
  }
};
const downloadFile = async (url, filename) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Failed to download file:", error);
  }
};
const uploadFile = async () => {
  if (!file.value) return;

  // 獲取簽名 URL
  let { url } = await $fetch("/api/files/upload-file", {
    method: "POST",
    body: {
      filename: file.value.name,
      contentType: file.value.type,
    },
  });

  // 使用簽名URL 上傳文件到 S3
  const response = await fetch(url, {
    method: "PUT",
    body: file.value,
    headers: {
      "Content-Type": file.value.type,
    },
  });

  if (response.ok) {
    // response.ok 是基于状态码
    const uploadedFileUrl = url.split("?")[0];

    function extractFilename(url) {
      const regex = /amazonaws\.com\/([^?]+)/;
      const match = url.match(regex);
      if (match && match[1]) {
        return match[1];
      }
      return null;
    }

    let filename = extractFilename(url);

    // 上传成功后，将文件信息存储到 MongoDB
    await $fetch("/api/files/save-info", {
      method: "POST",
      body: {
        filename: filename,
        url: uploadedFileUrl,
        contentType: file.value.type,
        size: file.value.size,
        taskId: props.taskId,
      },
    });

    // 刷新文件列表
    fetchFiles();
  } else {
    alert("Failed to upload file");
  }
};

const fetchFiles = async () => {
  const taskId = props.taskId; // 获取 props 中的 taskId
  const response = await $fetch(`/api/files/lists?taskId=${taskId}`);
  uploadedFiles.value = response.map((file) => {
    const filenameParts = file.filename.split("-");
    const encodedPart = filenameParts.slice(1).join("-"); // 將第一個 "-" 後面的部分重新組合
    const decodedFilename = decodeURIComponent(encodedPart); // 解碼中文字符
    return {
      ...file,
      filename: decodedFilename,
    };
  });
};

const deleteFile = async (fileId) => {
  await fetch(`/api/files/${fileId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  // 刷新文件列表
  fetchFiles();
};

watch(
  () => props.taskId,
  (newTask) => {
    fetchFiles()
  }
);

const isImage = (url) => {
  return /\.(jpg|jpeg|png|gif)$/.test(url);
};

const isPDF = (url) => {
  return /\.pdf$/.test(url);
};

onMounted(fetchFiles);
</script>

<style>
.error {
  color: red;
}
</style>
