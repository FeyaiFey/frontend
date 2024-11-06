<script setup lang="ts">
import { computed } from 'vue'
import { ElDropdown, ElDropdownMenu, ElDropdownItem, type ComponentSize } from 'element-plus'
import { useAppStore } from '@/stores/app'
import { propTypes } from '@/utils/propTypes'
import { useDesign } from '@/hooks/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('size-dropdown')

defineProps({
  color: propTypes.string.def('')
})

const appStore = useAppStore()

const sizeMap = computed(() => appStore.sizeMap)

const setCurrentSize = (size: ComponentSize) => {
  appStore.setCurrentSize(size)
}
</script>

<template>
  <ElDropdown :class="prefixCls" trigger="click" @command="setCurrentSize">
    <Icon :size="18" icon="vi-mdi:format-size" :color="color" class="cursor-pointer" />
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem v-for="item in sizeMap" :key="item" :command="item">
          {{ item }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
