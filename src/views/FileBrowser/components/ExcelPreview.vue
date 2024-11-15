<template>
    <vue-office-excel
        :src="fileUrl"
    />
</template>

<script>
import VueOfficeExcel from '@vue-office/excel';
import '@vue-office/excel/lib/index.css'

export default {
    components: {
        VueOfficeExcel
    },
    props:{
      fileUrl:{
        type:String,
        required:true
      }
    }
}
</script>