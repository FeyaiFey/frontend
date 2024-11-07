<script setup lang="ts">
import { ref,reactive } from 'vue';
import { assyHistoryApi } from '@/api/assyhistory';


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

const assyHistoryData = ref([])
const totalPage = ref()
const pagesize = ref(15)
const currentPage = ref(1)


const queryHistories = async ()=>{
    const res = await assyHistoryApi({
        wafer_name:queryForm.wafer_name,
        item_name:queryForm.item_name,
        wafer_lot:queryForm.wafer_lot,
        print_lot:queryForm.print_lot,
        package:queryForm.package,
        supply:queryForm.supply,
        order_date_start:queryForm.order_date_start,
        order_date_end:queryForm.order_date_end
    })
    assyHistoryData.value = res.data
    totalPage.value = res.total
}



const handleCurrentChange = async (cp = currentPage.value) =>{
    const res = await assyHistoryApi({
        wafer_name:queryForm.wafer_name,
        item_name:queryForm.item_name,
        wafer_lot:queryForm.wafer_lot,
        print_lot:queryForm.print_lot,
        package:queryForm.package,
        supply:queryForm.supply,
        order_date_start:queryForm.order_date_start,
        order_date_end:queryForm.order_date_end,
        page:cp,page_size:pagesize.value})
    // const res = await axios.get('http://127.0.0.1:8000/test',{
    //     params:{page:cp,page_size:pagesize.value}
    // });
    assyHistoryData.value = res.data;
    totalPage.value = res.total;
    currentPage.value = cp
}

const handleSizeChange = async (ps = pagesize.value) =>{
    const res = await assyHistoryApi({wafer_name:queryForm.wafer_name,
        item_name:queryForm.item_name,
        wafer_lot:queryForm.wafer_lot,
        print_lot:queryForm.print_lot,
        package:queryForm.package,
        supply:queryForm.supply,
        order_date_start:queryForm.order_date_start,
        order_date_end:queryForm.order_date_end,
        page:1,page_size:ps})
    // const res = await axios.get('http://127.0.0.1:8000/test',{
    //     params:{page:1,page_size:ps}
    // });
    assyHistoryData.value = res.data;
    totalPage.value = res.total;
    pagesize.value = ps
    currentPage.value = 1
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
                        placeholder="在此日期之后"
                        clearable
                    />
                </el-form-item>

                <el-form-item label="订单日期">
                    <el-date-picker
                        v-model="queryForm.order_date_end"
                        type="date"
                        placeholder="在此日期之前"
                        clearable
                    />
                </el-form-item>


                <el-form-item>
                    <el-button type="primary" @click="queryHistories" style="width: 200px;">查询</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div>
            <el-table :data="assyHistoryData" border height="640" >
                <el-table-column prop="ID" label="序号" width="80" />
                <el-table-column prop="ORDER_ID" label="订单号" width="180" />
                <el-table-column prop="ITEM_NAME" label="芯片名称" width="180" />
                <el-table-column prop="WAFER_NAME" label="晶圆名称" width="100" show-overflow-tooltip/>
                <el-table-column prop="WAFER_LOT" label="晶圆批号" width="150" show-overflow-tooltip />
                <el-table-column prop="PRINT_LOT" label="打印批号" width="200" />
                <el-table-column prop="REMARK" label="备注" width="150" show-overflow-tooltip/>
                <el-table-column prop="BOUNDING" label="打线图号" width="150" show-overflow-tooltip/>
                <el-table-column prop="BUSINESS_QTY" label="装片数量" width="100" />
                <el-table-column prop="INCOMING_QTY" label="来料数量" width="100" />
                <el-table-column prop="ORDER_DATE" label="订单日期" width="auto" />
                <el-table-column prop="SUPPLY" label="封装厂" width="auto" />
            </el-table>
            <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pagesize"
                :page-sizes="[15, 20, 30, 40, 50]"
                size="default"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalPage"
                :background=true
                :hide-on-single-page=true
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>

    </div>
</template>