<script setup lang="ts">
import { ref } from 'vue'
import { Dialog } from '@/components/Dialog'
import type { FormInstance } from 'element-plus';
import { reactive, computed } from 'vue'
import { useDesign } from '@/hooks/useDesign'
import { useLockStore } from '@/stores/lock'
import { ElMessage } from 'element-plus';

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('lock-dialog')

const lockStore = useLockStore()

const props = defineProps({
  modelValue: {
    type: Boolean
  }
})

const lockFormRef = ref<FormInstance>();
const lockForm = reactive({password:""});

const emit = defineEmits(['update:modelValue'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => {
    console.log('set: ', val)
    emit('update:modelValue', val)
  }
})

const dialogTitle = ref('锁定屏幕')

const handleLock = async () => {
  if(!lockFormRef.value) return
  const validateLockForm = () => {
      return new Promise<boolean>((resolve, reject) => {
        lockFormRef.value!.validate((valid, fields) => {
            if (valid) {
                resolve(true);  // 验证通过
            } else {
                reject(fields);  // 验证不通过，传递错误信息
            }
        });
      });
  };
  try {
    const valid = await validateLockForm();
    if(valid){
      dialogVisible.value = false
      lockStore.setLockInfo({
        isLock: true,
        password:lockForm.password
      })
    }
    }catch(errorFields){
      ElMessage.error('密码错误！');
    }
}

</script>

<template>
  <Dialog
    v-model="dialogVisible"
    width="500px"
    max-height="170px"
    :class="prefixCls"
    :title="dialogTitle"
  >
    <div class="flex flex-col items-center">
      <img src="@/assets/imgs/avatar.jpg" alt="" class="w-70px h-70px rounded-[50%]" />
      <span class="text-14px my-10px text-[var(--top-header-text-color)]">Archer</span>
    </div>
    <el-form :model="lockForm" ref="lockFormRef">
      <el-form-item prop="password" :rules="[{required:true,message: '请输入密码',trigger: ['blur', 'change']}]">
        <el-input v-model="lockForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock" show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="handleLock">锁定</el-button> 
    </template>
  </Dialog>
</template>

<style lang="less" scoped>
:global(.v-lock-dialog) {
  @media (width <= 767px) {
    max-width: calc(100vw - 16px);
  }
}
</style>
