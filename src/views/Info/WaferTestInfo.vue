<script setup lang="ts">
import { ref,reactive,onMounted,computed} from 'vue';
import { cpListApi,bomListApi,selectCpDownload,queryCpDownload } from '@/api/mo';
import { zhCn,en } from 'element-plus/es/locales.mjs';

interface TableRow {
  id: number;  // 假设 id 是数字类型，如果是其他类型请修改
  [key: string]: any;  // 其他字段，根据需要添加
}

const language = ref('zh-cn')
const locale = computed(() => (language.value === 'zh-cn' ? zhCn : en))

const queryForm = reactive({
    supply:'',
    wafer_name:'',
    lot_code:'',
    program:'',
    order_date_start:'',
    order_date_end:''
})

const loading = ref(false)
const cpHistoryData = ref([])
const totalPage = ref(0)
const pagesize = ref(15)
const currentPage = ref(1)
// 存储选中的行
const selectedRows = ref<TableRow[]>([])
const isSearch = ref(false)
const downloading = ref(false)
const sdownloading = ref(false)


// function dateToString(date:any){
//     if(date){
//         const newDate = new Date(date)
//         return newDate.toISOString()
//     }else{
//         return
//     }
// }

function headerRowStyle(){
    return {backgroundColor: "#ddebf7", textAlign: "center",color:'black',fontSize:'15px'}
}

const statusClass = ({row,rowIndex,}: {row: any,rowIndex: number}) => {
  if (row.status === "Y") {
    return 'success-row'
  } 
  return ''
}

const queryHistories = async ()=>{
    loading.value = true
    isSearch.value = true
    try{
        const res = await cpListApi({
            supply:queryForm.supply,
            wafer_name:queryForm.wafer_name,
            lot_code:queryForm.lot_code,
            program:queryForm.program,
            order_date_start:queryForm.order_date_start,
            order_date_end:queryForm.order_date_end,
            page:1,
            pagesize:pagesize.value
        })
        currentPage.value = 1
        cpHistoryData.value = res.data
        totalPage.value = res.total as number;
        loading.value = false
        isSearch.value = false 
    }catch (error) {
      console.error("查询请求失败！", error);
      loading.value = false
      isSearch.value = false 
    }
}

const queryReset = () => {
    window.location.reload();
}

const handleCurrentChange = async (cp = currentPage.value) =>{
    loading.value = true
    const res = await cpListApi({
        supply:queryForm.supply,
        wafer_name:queryForm.wafer_name,
        lot_code:queryForm.lot_code,
        program:queryForm.program,
        order_date_start:queryForm.order_date_start,
        order_date_end:queryForm.order_date_end,
        page:cp,page_size:pagesize.value})
    // const res = await axios.get('http://127.0.0.1:8000/test',{
    //     params:{page:cp,page_size:pagesize.value}
    // });
    cpHistoryData.value = res.data;
    totalPage.value = res.total as number;
    currentPage.value = cp
    loading.value = false
}

const handleSizeChange = async (ps = pagesize.value) =>{
    loading.value = true
    const res = await cpListApi({
        supply:queryForm.supply,
        wafer_name:queryForm.wafer_name,
        lot_code:queryForm.lot_code,
        program:queryForm.program,
        order_date_start:queryForm.order_date_start,
        order_date_end:queryForm.order_date_end,
        page:1,page_size:ps})
    cpHistoryData.value = res.data;
    totalPage.value = res.total as number;
    pagesize.value = ps
    currentPage.value = 1
    loading.value = false
}

const queryContentDownload = async () => {
    downloading.value = true
    try{
        const res = await queryCpDownload({supply:queryForm.supply,
                                         wafer_name:queryForm.wafer_name,
                                         lot_code:queryForm.lot_code,
                                         program:queryForm.program,
                                         order_date_start:queryForm.order_date_start,
                                         order_date_end:queryForm.order_date_end,
        })
        const url = window.URL.createObjectURL(new Blob([res.data],{ type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download","cpList.xlsx"); // 设置下载文件名 csv 改成 .csv
        document.body.appendChild(link);
        link.click();
        // 移除下载链接
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        downloading.value = false
    } catch (error) {
      console.error("Download failed:", error);
      downloading.value = false
    }
}


// 处理选择行变化
const handleSelectionChange = (selection: TableRow[]) => {
      selectedRows.value = selection;
    //   console.log("选中行：", selectedRows.value);
    };

const handleSelectDownload = async () =>{
    sdownloading.value = true
    try{
        const selectedIds = selectedRows.value.map((row) => row.id);
        console.log("选中ID列表：", selectedIds);
        const res = await selectCpDownload({ids: selectedIds.join(",")})
        const url = window.URL.createObjectURL(new Blob([res.data],{ type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })); // { type: 'text/csv' }
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download","cpList.xlsx"); // 设置下载文件名
        document.body.appendChild(link);
        link.click();
        // 移除下载链接
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        sdownloading.value = false
    } catch (error) {
      console.error("Download failed:", error);
      sdownloading.value = false
    }  
}

 // 处理行展开事件
 const handleExpandChange = async (row:any, expandedRows:any) => {
      if (row.children === null) {
        try {
          // 假设后端 API 返回格式为 [{ id, name, age, children }]
          const response = await bomListApi({order_id:row.order_id});
          row.children = response.data;
        } catch (error) {
          console.error("加载子节点数据失败:", error);
        }
      }
    };


</script>

<template>

<el-config-provider :locale="locale">
    <div>
        <el-form :inline="true" :model="queryForm" class="demo-form-inline">
            <el-form-item label="中测厂商">
                <el-input v-model="queryForm.supply" style="width: 150px;" clearable />
            </el-form-item>

            <el-form-item label="晶圆名称">
                <el-input v-model="queryForm.wafer_name" style="width: 150px;" clearable />
            </el-form-item>

            <el-form-item label="晶圆批号">
                <el-input v-model="queryForm.lot_code" style="width: 150px;" clearable />
            </el-form-item>

            <el-form-item label="测试程序">
                <el-input v-model="queryForm.program" style="width: 150px;" clearable />
            </el-form-item>

            <el-form-item label="订单日期">
                <el-date-picker
                    v-model="queryForm.order_date_start"
                    type="date"
                    placeholder="起始于"
                    style="width: 150px;"
                    value-format="YYYY-MM-DD"
                    clearable
                />
            </el-form-item>

            <el-form-item label="订单日期">
                <el-date-picker
                    v-model="queryForm.order_date_end"
                    type="date"
                    placeholder="结束于"
                    style="width: 150px;"
                    value-format="YYYY-MM-DD"
                    clearable
                />
            </el-form-item>
            <div>
                <el-form-item>
                    <el-button type="primary" @click="queryHistories" style="width: 100px;" :loading="isSearch">
                        <template #icon>
                            <Icon icon="material-symbols:search" />
                        </template>
                        查询
                    </el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="queryReset" style="width: 100px;">
                        <template #icon>
                            <Icon icon="ix:reset" />
                        </template>
                        重置
                    </el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="queryContentDownload" :loading="downloading" style="width: 100px;">
                        <template #icon>
                            <Icon icon="vscode-icons:file-type-excel" />
                        </template>
                        导出excel
                    </el-button>
                </el-form-item>
            </div>
        </el-form>
        <div style="position: relative;">
            <!-- 下载按钮 -->
            <el-button 
                :disabled="selectedRows.length === 0"
                style="position: absolute; top: -35px; right: 0; z-index: 1;" 
                @click="handleSelectDownload"
                :loading="sdownloading"
                >
                <template #icon>
                    <Icon icon="material-symbols-light:download" :size='28' />
                </template>
            下载已选择
            </el-button>
            <el-table 
                :data="cpHistoryData" 
                v-loading="loading" 
                :header-cell-style="headerRowStyle" 
                :row-class-name="statusClass"
                @selection-change="handleSelectionChange"
                border 
                lazy  
                row-key="order_id"
                @expand-change="handleExpandChange"
                highlight-current-row 
                height="640" 
                style="width: 100%;">
                <el-table-column type="expand">
                    <template #default="props">
                        <div class="ml-5 w-500">
                            <div v-for="item in props.row.children" :key="item.id" style="margin-bottom: 20px;width: 80%;">
                                <el-descriptions 
                                    class="margin-top"
                                    :title="item.main_chip"
                                    :column="4"
                                    border
                                >
                                <el-descriptions-item label-align="center">
                                    <template #label>
                                        <div class="cell-item">
                                            物料编码
                                        </div>
                                    </template>
                                    {{item.bom_code}}
                                </el-descriptions-item>

                                <el-descriptions-item label-align="center">
                                    <template #label>
                                        <div class="cell-item">
                                            物料名称
                                        </div>
                                    </template>
                                    {{item.item_name}}
                                </el-descriptions-item>

                                <el-descriptions-item label-align="center">
                                    <template #label>
                                        <div class="cell-item">
                                            片数
                                        </div>
                                    </template>
                                    {{item.bom_second_qty}}
                                </el-descriptions-item>

                                <el-descriptions-item label-align="center">
                                    <template #label>
                                        <div class="cell-item">
                                            Die数
                                        </div>
                                    </template>
                                    {{item.bom_business_qty}}
                                </el-descriptions-item>
                                
                                <el-descriptions-item label-align="center">
                                    <template #label>
                                        <div class="cell-item">
                                            批号
                                        </div>
                                    </template>
                                    {{item.bom_lot}}
                                </el-descriptions-item>

                                <el-descriptions-item label-align="center" width="100" span="2.5">
                                    <template #label>
                                        <div class="cell-item">
                                            片号
                                        </div>
                                    </template>
                                    {{item.bom_wafer_id}}
                                </el-descriptions-item>

                                </el-descriptions>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column type="selection" width="50" align="center" />
                <el-table-column prop="id" label="序号" width="80" align="center" sortable  />
                <el-table-column prop="order_id" label="订单号" width="150" sortable align="center" show-overflow-tooltip />
                <el-table-column prop="item_name" label="芯片名称" width="150" align="center" show-overflow-tooltip />
                <el-table-column prop="lot_code" label="晶圆批号" width="150" align="center" show-overflow-tooltip />
                <el-table-column prop="business_qty" label="订单数量" width="100" align="center"/>
                <el-table-column prop="arrive_qty" label="来料数量" width="100" align="center"/>
                
                <el-table-column prop="cp_step" label="测试流程" width="250" show-overflow-tooltip align="center"/>
                <el-table-column prop="pgm_name" label="测试程序" width="150" show-overflow-tooltip align="center" />
                <el-table-column prop="remark" label="备注" width="100" show-overflow-tooltip align="left" />
                <el-table-column prop="complete_date" label="结束日期" width="110" sortable align="center" /> 
                <el-table-column prop="order_date" label="订单日期" width="110" fixed="right" sortable align="center" />
                <el-table-column prop="supply" label="中测厂" show-overflow-tooltip fixed="right" width="150" align="center" />
            </el-table>
            <div class="mt-3">
                <el-pagination
                    v-model:current-page="currentPage"
                    v-model:page-size="pagesize"
                    :page-sizes="[15, 20, 30, 40, 50]"
                    size="default"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total='totalPage'
                    :background=true
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" />
            </div>
        </div>
    </div>
</el-config-provider>

</template>

<style>
.el-table__placeholder {
  width: 0 !important;
}

.el-descriptions {
  margin-top: 20px;
}
/* .cell-item {
  display: flex;
  align-items: center;
} */
/* .margin-top {
  margin-top: 20px;
} */
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>