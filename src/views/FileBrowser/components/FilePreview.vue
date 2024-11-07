<template>
    <div v-if="isImage" class="preview-container">
      <img :src="fileUrl" alt="Image Preview" />
    </div>
    <div v-else-if="isPDF" class="preview-container">
      <iframe :src="fileUrl" width="100%" height="600px"></iframe>
    </div>
    <div v-else>
      <p>预览暂不支持该文件类型。</p>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  
  export default defineComponent({
    setup() {
      const route = useRoute();
      const fileUrl = ref('');
      const isImage = ref(false);
      const isPDF = ref(false);
  
      onMounted(() => {
        const filePath = route.params.filePath as string;
        fileUrl.value = `http://127.0.0.1:8000/files/${filePath}`;
  
        if (filePath.endsWith('.png') || filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
          isImage.value = true;
        } else if (filePath.endsWith('.pdf')) {
          isPDF.value = true;
        }
      });
  
      return { fileUrl, isImage, isPDF };
    },
  });
  </script>
  
  <style>
  .preview-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
  }
  img {
    max-width: 100%;
    max-height: 100%;
  }
  </style>