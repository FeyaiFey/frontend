<script setup lang="ts">
import { ref,reactive } from 'vue';
import { assyHistoryApi } from '@/api/assyhistory';


function headerRowStyle(){
    return {backgroundColor: "#ddebf7", textAlign: "center",color:'black',fontSize:'15px'}
}

const queryForm = reactive({
    item_name:'',
    wafer_name:'',
    wafer_lot:'',
    print_lot:'',
    package:'',
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
    const res = await assyHistoryApi({
        wafer_name:queryForm.wafer_name,
        item_name:queryForm.item_name,
        wafer_lot:queryForm.wafer_lot,
        print_lot:queryForm.print_lot,
        package:queryForm.package,
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
    queryForm.item_name =''
    queryForm.wafer_name='',
    queryForm.wafer_lot='',
    queryForm.print_lot='',
    queryForm.package='',
    queryForm.supply='',
    queryForm.order_date_start='',
    queryForm.order_date_end=''
}



const handleCurrentChange = async (cp = currentPage.value) =>{
    loading.value = true
    const res = await assyHistoryApi({
        wafer_name:queryForm.wafer_name,
        item_name:queryForm.item_name,
        wafer_lot:queryForm.wafer_lot,
        print_lot:queryForm.print_lot,
        package:queryForm.package,
        supply:queryForm.supply,
        order_date_start:dateToString(queryForm.order_date_start),
        order_date_end:dateToString(queryForm.order_date_start),
        page:cp,page_size:pagesize.value})
    // const res = await axios.get('http://127.0.0.1:8000/test',{
    //     params:{page:cp,page_size:pagesize.value}
    // });
    assyHistoryData.value = res.data;
    totalPage.value = res.total as number;;
    currentPage.value = cp
    loading.value = false
}

const handleSizeChange = async (ps = pagesize.value) =>{
    loading.value = true
    const res = await assyHistoryApi({wafer_name:queryForm.wafer_name,
        item_name:queryForm.item_name,
        wafer_lot:queryForm.wafer_lot,
        print_lot:queryForm.print_lot,
        package:queryForm.package,
        supply:queryForm.supply,
        order_date_start:dateToString(queryForm.order_date_start),
        order_date_end:dateToString(queryForm.order_date_start),
        page:1,page_size:ps})
    // const res = await axios.get('http://127.0.0.1:8000/test',{
    //     params:{page:1,page_size:ps}
    // });
    assyHistoryData.value = res.data;
    totalPage.value = res.total as number;;
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

                <el-form-item label="晶圆名称">
                    <el-input v-model="queryForm.wafer_name" style="width: 150px;" clearable />
                </el-form-item>

                <el-form-item label="晶圆批号">
                    <el-input v-model="queryForm.wafer_lot" style="width: 150px;" clearable />
                </el-form-item>

                <el-form-item label="打印批号">
                    <el-input v-model="queryForm.print_lot" style="width: 150px;" clearable />
                </el-form-item>

                <el-form-item label="封装形式">
                    <el-input v-model="queryForm.package" style="width: 150px;" clearable />
                </el-form-item>

                <el-form-item label="封装厂">
                    <el-input v-model="queryForm.supply" style="width: 150px;" clearable />
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


                <el-form-item>
                    <el-button type="primary" @click="queryHistories" style="width: 150px;">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="queryReset" style="width: 150px;">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div>
            <el-table :data="assyHistoryData" v-loading="loading" :header-cell-style="headerRowStyle" border highlight-current-row height="640" >
                <el-table-column type="selection"  width="55" align="center" />
                <el-table-column prop="ID" label="序号" width="80" align="center"/>
                <el-table-column prop="ORDER_ID" label="订单号" width="130" sortable align="center" />
                <el-table-column prop="ITEM_NAME" label="芯片名称" width="150"  />
                <el-table-column prop="WAFER_NAME" label="晶圆名称" width="120" show-overflow-tooltip/>
                <el-table-column prop="WAFER_LOT" label="晶圆批号" width="150" show-overflow-tooltip />
                <el-table-column prop="PRINT_LOT" label="打印批号" width="200" />
                <el-table-column prop="REMARK" label="备注" width="auto" show-overflow-tooltip/>
                <el-table-column prop="BOUNDING" label="打线图号" width="150" show-overflow-tooltip align="center"/>
                <el-table-column prop="BUSINESS_QTY" label="装片数量" width="100" align="right" />
                <el-table-column prop="INCOMING_QTY" label="来料数量" width="100" align="right"/>
                <el-table-column prop="ORDER_DATE" label="订单日期" width="110" sortable align="center" />
                <el-table-column prop="SUPPLY" label="封装厂" width="100" align="center" />
            </el-table>
            <div>
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