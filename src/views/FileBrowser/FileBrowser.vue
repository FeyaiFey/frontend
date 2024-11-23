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
                <el-header height="50px">
                    Header
                </el-header>
                <el-main height="670px">
                    <el-table :data="filterFiles" border height="100%">
                        <el-table-column prop="name" label="文件名" />
                        <>
                        <el-table-column>
                            <template #header>
                                <el-input v-model="search" size="small" placeholder="搜索文件名" style="width: 200px;"/>
                            </template>
                        <template #default="scope">
                            <el-button @click="previewFile(scope.row)" type="primary" size="small">预览</el-button>
                            <el-button @click="downloadFile(scope.row)" type="success" size="small">下载</el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>


<script setup lang="ts">
import { foldersApi,filesApi,filesDownloadApi,filesPreviewApi } from '@/api/file';
import { ref,onMounted, createApp, h, watch,computed} from 'vue';
import ExcelPreview from './components/ExcelPreview.vue';
import WordPreview from './components/WordPreview.vue';

const folderTree = ref([])
const currentFiles = ref([])
const filterFiles = ref([])
const filteredFolderTree = ref([])
const file_path = ref('')
const search = ref('')

const defaultProps = {
    //   children: 'children',
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
        filterFiles.value = res.data
    }
}

// 过滤掉文件，只显示文件夹
const filterFoldersOnly = (nodes:any) => {
      return nodes
        .filter( (node:any) => node.type === 'folder')
        .map((node:any) => ({
          ...node,
          children: filterFoldersOnly(node.children || [])  // 递归过滤子节点
        }))
    }

watch(search,async() => {
    filterFiles.value = currentFiles.value.filter( 
            (data:any) => 
                !search.value ||
                data.name.toLowerCase().includes(search.value.toLowerCase()))
    }
)


// 预览文件
const previewFile = async (row:any) => {
    const fileName = row.name
    const full_path = file_path.value+"\\"+row.name
    try{
        const res = await filesPreviewApi({path:full_path,file_name:fileName})
        if (fileName.endsWith(".pdf")) {
            const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
            const pdfWindow = window.open(url, fileName);

            // 检查是否成功打开了窗口
            if (pdfWindow) {
                pdfWindow.onload = () => {
                    // 确保 PDF 加载完成后释放 URL
                    window.URL.revokeObjectURL(url);
                };
            } else {
                console.error("Failed to open PDF window.");
                window.URL.revokeObjectURL(url); // 如果窗口未打开，立即释放 URL
            }
        }else if (fileName.endsWith(".jpg") || fileName.endsWith(".png")) {
            // 自动检测文件类型
            const mimeType = fileName.endsWith(".jpg") ? "image/jpeg" : "image/png";
            const blob = new Blob([res.data], { type: mimeType });
            const url = window.URL.createObjectURL(blob);
            
            // 打开新窗口并插入图片
            const imgWindow = window.open();
            if (imgWindow) {
                imgWindow.document.title = fileName
                const img = new Image();
                img.src = url;
                img.alt = "Image Preview";
                img.style.width='100%'
                
                // 图片加载完成后再插入到文档中
                img.onload = () => {
                    imgWindow.document.body.appendChild(img);
                    window.URL.revokeObjectURL(url); // 释放 URL
                };
                
                // 错误处理
                img.onerror = () => {
                    imgWindow.document.write("Failed to load image.");
                    window.URL.revokeObjectURL(url);
                };
            }
        }else if (fileName.endsWith(".txt")) {
            // 处理文本文件
            const blob = new Blob([res.data], { type: "text/plain" });
            const url = window.URL.createObjectURL(blob);
            
            const textWindow = window.open();
            if (textWindow) {
                fetch(url).then(response => response.text()).then(text => {
                    textWindow.document.write(`<pre>${text}</pre>`); // 使用 <pre> 格式化文本内容
                    window.URL.revokeObjectURL(url); // 释放 URL
                });
            }
        } else if (fileName.endsWith(".docx") || fileName.endsWith(".xlsx")) {
            // 根据文件扩展名确定 MIME 类型
            const fileType = fileName.endsWith(".docx")
                ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

            // 创建 Blob 并生成 URL
            const blob = new Blob([res.data], { type: fileType });
            const url = window.URL.createObjectURL(blob);

            // 打开新窗口
            const officeWindow = window.open("", "_blank");
            if (!officeWindow) {
                console.error("Failed to open Office viewer window.");
                return;
            }

            // 插入容器并渲染组件
            officeWindow.document.write('<div id="appoffice"></div>');

            // 根据文件类型选择渲染的组件
            const previewComponent = fileName.endsWith(".docx") ? WordPreview : ExcelPreview;

            // 使用 Vue 动态渲染组件
            setTimeout( () =>{
                const app = createApp({
                    render: () => h(previewComponent, { fileUrl: url })
                });
                app.mount(officeWindow.document.getElementById("appoffice") as Element);
            } ,1000)

        } else {
            console.warn("Unsupported file type for preview.");
        }
        
    }catch(error){
        alert("fail")
    }
    }

// 下载文件
const downloadFile = async (row:any) => {
    const fileName = row.name
    const full_path = file_path.value+"\\"+row.name
    try{
        const response = await filesDownloadApi({path:full_path,file_name:fileName});
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName); // 设置下载文件名
        document.body.appendChild(link);
        link.click();
        
        // 移除下载链接
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
}


</script>