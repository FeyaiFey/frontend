<template>
    <div>
      <vue-office-docs
          :src="fileUrl"
      />
    </div>
  </template>
  
  <script>
//引入VueOfficeDocx组件
import VueOfficeDocx from '@vue-office/docx'
//引入相关样式
import '@vue-office/docx/lib/index.css'
  
  export default {
      components: {
        VueOfficeDocx
      },
      props:{
        fileUrl:{
          type:String,
          required:true
        }
      }
  }
  </script>