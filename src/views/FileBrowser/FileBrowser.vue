<template>
    <div>
      <h1>文件浏览</h1>
      <ul>
        <li v-for="item in folderContents" :key="item.name">
          <span v-if="item.type === 'folder'" @click="openFolder(item)">
            📁 {{ item.name }}
          </span>
          <span v-else>
            📄 {{ item.name }} 
            <button @click="downloadFile(item.path)">下载</button>
          </span>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted,ref } from 'vue';
  import { foldersApi, filesApi } from '@/api/file';
  import { ElMessage } from 'element-plus';

  const folderContents = ref<any[]>([]);

  onMounted(async()=>{
    try{
      const res =await foldersApi()
      folderContents.value = res.data
    }catch(error:any){
      ElMessage.error(error.response.data.detail)
    }
  })

  const openFolder = (folder: any) => {
      folderContents.value = folder.children;
    };

  const downloadFile = async (filePath: string) => {
    try {
      const response = await filesApi(filePath);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filePath.split('/').pop() || '');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  </script>