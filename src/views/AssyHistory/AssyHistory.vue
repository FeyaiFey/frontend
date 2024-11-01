<script setup lang="ts">
import { onMounted } from 'vue';
import { ref } from 'vue';
import { testapi } from '@/api/test';

const testData = ref([])
const totalPage = ref()
const pagesize = ref(15)
const currentPage = ref(1)



onMounted(async ()=>{
    const res = await testapi()
    testData.value = res.data
    totalPage.value = res.total
})


const handleCurrentChange = async (cp = currentPage.value) =>{
    const res = await testapi({page:cp,page_size:pagesize.value})
    // const res = await axios.get('http://127.0.0.1:8000/test',{
    //     params:{page:cp,page_size:pagesize.value}
    // });
    testData.value = res.data;
    totalPage.value = res.total;
    currentPage.value = cp
}

const handleSizeChange = async (ps = pagesize.value) =>{
    const res = await testapi({page:1,page_size:ps})
    // const res = await axios.get('http://127.0.0.1:8000/test',{
    //     params:{page:1,page_size:ps}
    // });
    testData.value = res.data;
    totalPage.value = res.total;
    pagesize.value = ps
    currentPage.value = 1
}
    
</script>

<template>
    <div w:w="lg:3/5 md:4/5 sm:full">
        <el-table :data="testData" border w:w="lg:4/5 md:1/2 sm:11/12">
            <el-table-column prop="item_name" label="物料名称" width="400" />
            <el-table-column prop="item_class" label="类别" width="100" />
            <el-table-column prop="main_chip" label="主芯" width="300" />
            <el-table-column prop="deputy_chip" label="副芯" width="auto" />
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
</template>