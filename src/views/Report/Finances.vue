<script setup lang="ts">
import { ref,onMounted } from 'vue'
import PanelGroup from './components/PanelGroup.vue'
import { Echart } from '@/components/Echarts'
import type { EChartsOption } from 'echarts'
import { purchasePieOptions } from './echarts-data'

const loading = ref(false)

</script>

<template>
    <PanelGroup />
    <ElRow :gutter="20" justify="space-between">
        <ElCol :xl="8" :lg="12" :md="24" :sm="24" :xs="24">
            <ElCard shadow="hover" class="mb-20px">
                <ElSkeleton :loading="loading" animated>
                    <Echart :options="purchasePieOptions" :height="400" />
                </ElSkeleton>
            </ElCard>
        </ElCol>
    </ElRow>
</template>