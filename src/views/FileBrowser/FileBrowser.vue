<template>
    <div class="common-layout">
        <el-container class="w-100% h-780px">
            <el-aside>
                <ElCard class="h-100%">
                    <div class="w-100% my-2">
                        <Icon icon="simple-icons:files" class='mr-2' />
                        <span class="w-100% my-2">全部文件</span>
                    </div>
                    <el-tree
                        :data="filteredFolderTree"
                        :props="defaultProps"
                        node-key="name"
                        @node-click="handleNodeClick"
                        highlight-current
                    >
                        <template #default="{ node, data }">
                            <!-- 添加文件夹图标 -->
                            <Icon icon="simple-icons:files" class='mr-2'/>
                            <span>{{ data.name }}</span>
                        </template>
                    </el-tree>
                </ElCard>
            </el-aside>
            <el-container>
                <el-header height="50px">Header</el-header>
                <el-main height="670px">
                    <el-table :data="currentFiles" border height="100%" v-if="currentFiles.length">
                        <el-table-column prop="name" label="文件名" />
                        <>
                        <el-table-column label="操作">
                        <template #default="scope">
                            <el-button @click="previewFile(scope.row)" type="primary" size="small">预览</el-button>
                            <el-button @click="downloadFile(scope.row)" type="success" size="small">下载</el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                    <p v-else>请选择一个文件夹查看文件</p>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>


<script setup lang="ts">
import { foldersApi,filesApi,filesDownloadApi,filesPreviewApi } from '@/api/file';
import { ref,onMounted } from 'vue';

const folderTree = ref([])
const currentFiles = ref([])
const filteredFolderTree = ref([])
const file_path = ref("")

const defaultProps = {
      children: 'children',
      label: 'name',
    }


onMounted(async()=>{
    const res = await foldersApi()
    folderTree.value = res.data
    filteredFolderTree.value = filterFoldersOnly(folderTree.value)
})

// 点击文件夹节点时获取文件列表
const handleNodeClick = async (nodeData:any) => {
    if (!nodeData.children || nodeData.children.length === 0){
        const current_path = nodeData.path
        file_path.value = current_path
        const res = await filesApi({path:current_path})
        currentFiles.value = res.data
        console.log(file_path.value)
    }
}

// 过滤掉文件，只显示文件夹
const filterFoldersOnly = (nodes:any) => {
      return nodes
        .filter(node => node.type === 'folder')
        .map(node => ({
          ...node,
          children: filterFoldersOnly(node.children || [])  // 递归过滤子节点
        }))
    }


// 预览文件
const previewFile = async (row:any) => {
    const full_path = file_path.value+"\\"+row.name
    console.log(full_path)
    try{
        const res = await filesPreviewApi({path:full_path})
        window.open(res.data,'_blank')
    }catch(error){
        alert("fail")
    }
    
    
      
      // 实现预览逻辑，如打开文件内容窗口
    }

// 下载文件
const downloadFile = (file:any) => {
    alert(`下载文件: ${file.name}`)
    // 实现下载逻辑
}

</script>