<script setup lang="ts">
import { ref,reactive } from 'vue';
import { packageListApi,bomListApi} from '@/api/mo';


function headerRowStyle(){
    return {backgroundColor: "#ddebf7", textAlign: "center",color:'black',fontSize:'15px'}
}

const queryForm = reactive({
    item_name:'',
    package:'',
    bonding:'',
    lot_code:'',
    supply:'',
    order_date_start:'',
    order_date_end:''
})

const loading = ref(false)
const assyHistoryData = ref([])
const totalPage = ref(0)
const pagesize = ref(15)
const currentPage = ref(1)

function dateToString(date:any){
    if(date){
        const newDate = new Date(date)
        return newDate.toISOString()
    }else{
        return
    }
}


const queryHistories = async ()=>{
    loading.value = true
    const res = await packageListApi({
        item_name:queryForm.item_name,
        package:queryForm.package,
        bonding:queryForm.bonding,
        lot_code:queryForm.lot_code,
        supply:queryForm.supply,
        order_date_start:dateToString(queryForm.order_date_start),
        order_date_end:dateToString(queryForm.order_date_end),
        page:1,
        pagesize:pagesize.value
    })
    currentPage.value = 1
    assyHistoryData.value = res.data
    totalPage.value = res.total as number;
    loading.value = false
}

const queryReset = () => {
    window.location.reload();
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




const handleCurrentChange = async (cp = currentPage.value) =>{
    loading.value = true
    const res = await packageListApi({
        item_name:queryForm.item_name,
        package:queryForm.package,
        bonding:queryForm.bonding,
        lot_code:queryForm.lot_code,
        supply:queryForm.supply,
        order_date_start:dateToString(queryForm.order_date_start),
        order_date_end:dateToString(queryForm.order_date_end),
        page:cp,page_size:pagesize.value})
    // const res = await axios.get('http://127.0.0.1:8000/test',{
    //     params:{page:cp,page_size:pagesize.value}
    // });
    assyHistoryData.value = res.data;
    totalPage.value = res.total as number;
    currentPage.value = cp
    loading.value = false
}

const handleSizeChange = async (ps = pagesize.value) =>{
    loading.value = true
    const res = await packageListApi({
        item_name:queryForm.item_name,
        package:queryForm.package,
        bonding:queryForm.bonding,
        lot_code:queryForm.lot_code,
        supply:queryForm.supply,
        order_date_start:dateToString(queryForm.order_date_start),
        order_date_end:dateToString(queryForm.order_date_end),
        page:1,page_size:ps})
    // const res = await axios.get('http://127.0.0.1:8000/test',{
    //     params:{page:1,page_size:ps}
    // });
    assyHistoryData.value = res.data;
    totalPage.value = res.total as number;
    pagesize.value = ps
    currentPage.value = 1
    loading.value = false
}

    
</script>

<template>
    <div>
        <div>
            <el-form :inline="true" :model="queryForm" class="demo-form-inline">
                <el-form-item label="芯片名称">
                    <el-input v-model="queryForm.item_name" style="width: 150px;" clearable />
                </el-form-item>

                <el-form-item label="封装形式">
                    <el-input v-model="queryForm.package" style="width: 150px;" clearable />
                </el-form-item>

                <el-form-item label="打印批号">
                    <el-input v-model="queryForm.lot_code" style="width: 150px;" clearable />
                </el-form-item>

                <el-form-item label="打线图号">
                    <el-input v-model="queryForm.bonding" style="width: 150px;" clearable />
                </el-form-item>

                <el-form-item label="订单日期">
                    <el-date-picker
                        v-model="queryForm.order_date_start"
                        type="date"
                        placeholder="起始于"
                        style="width: 150px;"
                        clearable
                    />
                </el-form-item>

                <el-form-item label="订单日期">
                    <el-date-picker
                        v-model="queryForm.order_date_end"
                        type="date"
                        placeholder="结束于"
                        style="width: 150px;"
                        clearable
                    />
                </el-form-item>

                <el-form-item label="封装厂">
                    <el-input v-model="queryForm.supply" style="width: 150px;" clearable />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="queryHistories" style="width: 150px;">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="queryReset" style="width: 150px;">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div>
            <el-table 
                :data="assyHistoryData" 
                v-loading="loading" 
                :header-cell-style="headerRowStyle" 
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
                            <!-- <el-table :data="props.row.children" border lazy :header-cell-style="headerRowStyle">
                                <el-table-column prop="main_chip" label="主芯" align="center" width="80" show-overflow-tooltip />
                                <el-table-column prop="bom_code" label="物料编码" align="center" width="350" show-overflow-tooltip  />
                                <el-table-column prop="item_name" label="物料名称" align="center" width="200" show-overflow-tooltip />
                                <el-table-column prop="bom_lot" label="批号" width="150" align="center" show-overflow-tooltip />
                                <el-table-column prop="bom_business_qty" label="Die数" align="center" width="120" />
                                <el-table-column prop="bom_second_qty" label="数量" width="60" align="center" show-overflow-tooltip />
                                <el-table-column prop="bom_wafer_id" label="片号" width="680" show-overflow-tooltip />
                            </el-table> -->
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
                <el-table-column prop="id" label="序号" width="80" align="center" sortable  />
                <el-table-column prop="order_id" label="订单号" width="150" sortable align="center" show-overflow-tooltip />
                <el-table-column prop="item_name" label="芯片名称" width="250" align="right" show-overflow-tooltip />
                <el-table-column prop="package" label="封装形式" width="100" show-overflow-tooltip />
                <el-table-column prop="lot_code" label="打印批号" width="150" show-overflow-tooltip />
                <el-table-column prop="business_qty" label="订单数量" width="100" align="right"/>
                <el-table-column prop="arrive_qty" label="来料数量" width="100" align="right"/>
                <el-table-column prop="remark" label="备注" width="100" show-overflow-tooltip align="left" />
                <el-table-column prop="order_date" label="订单日期" width="110" sortable align="center" />
                
                
                <el-table-column prop="assy_step" label="加工类型" width="150" show-overflow-tooltip align="center"/>
                <el-table-column prop="pgm_name" label="成测程序" width="100" show-overflow-tooltip align="right" />
                <el-table-column prop="loading_method" label="装片方式" width="90" show-overflow-tooltip/>
                <el-table-column prop="bonding" label="打线图号" width="150" show-overflow-tooltip/>
                <el-table-column prop="wire" label="线材" width="100" align="right" show-overflow-tooltip/>
                <el-table-column prop="package_remark" label="特殊备注" width="100" show-overflow-tooltip />
                <el-table-column prop="complete_date" label="结束日期" width="110" sortable align="center" />               
                <el-table-column prop="supply" label="封装厂" show-overflow-tooltip fixed="right" width="100" align="center" />
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

</style>