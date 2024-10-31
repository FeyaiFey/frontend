<script setup lang="ts">
import axios from 'axios';
import { onMounted } from 'vue';
import { ref } from 'vue';

const testData = ref([])
const totalPage = ref(null)
const pagesize = ref(15)
const currentPage = ref(1)



onMounted(async ()=>{
    const res = await axios.get("http://127.0.0.1:8000/test")
    testData.value = res.data.data
    totalPage.value = res.data.total
})


const handleCurrentChange = async (page = currentPage.value) =>{
    const res = await axios.get('http://127.0.0.1:8000/test',{
        params:{page,page_size:pagesize.value}
    });
    testData.value = res.data.data;
    totalPage.value = res.data.total;
    currentPage.value = page
}

const handleSizeChange = async (ps = pagesize.value) =>{
    const res = await axios.get('http://127.0.0.1:8000/test',{
        params:{page:1,page_size:ps}
    });
    testData.value = res.data.data;
    totalPage.value = res.data.total;
    pagesize.value = ps
    currentPage.value = 1
}

// const getData = async()=>{
//     const res = await axios.get("http://127.0.0.1:8000/test")
//     const data = res.data
//     console.log(data)
//     return data
// }

// const data = [
//     {
//         'item_name':'HS9069',
//         'item_class':"FSDFS",
//         'main_chip':"main_chipV",
//         'deputy_chip':'FSDFSD'
//     }
// ]
    
</script>

<template>
    <!-- <el-button type="primary" @click="getData">获取数据</el-button> -->
    <div w:w="lg:3/5 md:4/5 sm:full">
        <el-table :data="testData" border w:w="lg:4/5 md:1/2 sm:11/12">
            <el-table-column prop="item_name" label="物料名称" width="400" />
            <el-table-column prop="item_class" label="类别" width="100" />
            <el-table-column prop="main_chip" label="主芯" width="300" />
            <el-table-column prop="deputy_chip" label="副芯" width="auto" />
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[15, 20, 30, 40, 50]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalPage">
        </el-pagination>
    </div>
</template>