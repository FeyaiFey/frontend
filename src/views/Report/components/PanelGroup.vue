<script setup lang="ts">
import { ref,onMounted } from 'vue'
import { caiwuApi } from '@/api/bi'
import { useDesign } from '@/hooks/useDesign'
import { CountTo } from '@/components/CountTo'

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('panel')
const loading = ref(true)

const purchase_qty = ref(0)
const qty_dif = ref(0)

const purchase_amount = ref(0)
const amount_dif = ref(0)

const purchase_avg_price = ref(0)
const avg_price_dif = ref(0)

onMounted( async ()=>{
    try{
        const res = await caiwuApi()
        purchase_qty.value = res.data.find((item:any) => item.MONTH === 'ThisMonth').qty
        purchase_amount.value = res.data.find((item:any) => item.MONTH === 'ThisMonth').amount
        purchase_avg_price.value = res.data.find((item:any) => item.MONTH === 'ThisMonth').price
        qty_dif.value = Math.round((purchase_qty.value - res.data.find((item:any) => item.MONTH === 'LastMonth').qty)/(res.data.find((item:any) => item.MONTH === 'LastMonth').qty)*10000)/100
        amount_dif.value = Math.round((purchase_amount.value - res.data.find((item:any) => item.MONTH === 'LastMonth').amount)/(res.data.find((item:any) => item.MONTH === 'LastMonth').amount)*10000)/100
        avg_price_dif.value = Math.round((purchase_avg_price.value - res.data.find((item:any) => item.MONTH === 'LastMonth').price)/(res.data.find((item:any) => item.MONTH === 'LastMonth').price)*10000)/100
    }catch (error) {
        console.error("加载财务数据失败！:", error);
    }
    loading.value=false
})
</script>

<template>
    <ElRow :gutter="20" justify="space-between" :class="prefixCls">
        <ElCol :xl="6" :lg="6" :md="12" :sm="12" :xs="24">
            <ElCard shadow="hover" class="mb-20px">
                <ElSkeleton :loading="loading" animated :rows="2">
                    <template #default>
                        <div :class="`${prefixCls}__item flex justify-between`">
                            <div>
                                <div :class="`${prefixCls}__item--icon ${prefixCls}__item--peoples p-16px inline-block rounded-6px`">
                                    <Icon icon="typcn:shopping-cart" :size="50"/>
                                </div>
                            </div>
                            <div class="flex flex-col justify-between">
                                <div :class="`${prefixCls}__item--text text-20px text-gray-500 text-right`">采购总量(PCS)</div>
                                <CountTo
                                    class="text-20px font-700 text-right"
                                    :start-val="0"
                                    :end-val="purchase_qty"
                                    :duration="1500"
                                    />
                                <div :class="`${prefixCls}__item--text text-13px text-gray-500 text-right`">
                                    <span>相比上月</span>
                                    <span class="green" v-if="qty_dif > 0">
                                        {{ qty_dif }}%
                                        <el-icon >
                                            <CaretTop />
                                        </el-icon>
                                    </span>
                                    <span class="red" v-else>
                                        {{ qty_dif }}%
                                        <el-icon >
                                            <CaretBottom />
                                        </el-icon>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </template>
                </ElSkeleton>
            </ElCard>
        </ElCol>

        <ElCol :xl="6" :lg="6" :md="12" :sm="12" :xs="24">
            <ElCard shadow="hover" class="mb-20px">
                <ElSkeleton :loading="loading" animated :rows="2">
                    <template #default>
                        <div :class="`${prefixCls}__item flex justify-between`">
                            <div>
                                <div :class="`${prefixCls}__item--icon ${prefixCls}__item--money p-16px inline-block rounded-6px`">
                                    <Icon icon="fa:rmb" :size="50"/>
                                </div>
                            </div>
                            <div class="flex flex-col justify-between">
                                <div :class="`${prefixCls}__item--text text-20px text-gray-500 text-right`">采购金额(RMB)</div>
                                <CountTo
                                    class="text-20px font-700 text-right"
                                    :start-val="0"
                                    :end-val="purchase_amount"
                                    :duration="1500"
                                    />
                                <div :class="`${prefixCls}__item--text text-13px text-gray-500 text-right`">
                                    <span>相比上月</span>
                                    <span class="green" v-if="amount_dif > 0">
                                        {{ amount_dif }}%
                                        <el-icon >
                                            <CaretTop />
                                        </el-icon>
                                    </span>
                                    <span class="red" v-else>
                                        {{ amount_dif }}%
                                        <el-icon >
                                            <CaretBottom />
                                        </el-icon>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </template>
                </ElSkeleton>
            </ElCard>
        </ElCol>

        <ElCol :xl="6" :lg="6" :md="12" :sm="12" :xs="24">
            <ElCard shadow="hover" class="mb-20px">
                <ElSkeleton :loading="loading" animated :rows="2">
                    <template #default>
                        <div :class="`${prefixCls}__item flex justify-between`">
                            <div>
                                <div :class="`${prefixCls}__item--icon ${prefixCls}__item--price p-16px inline-block rounded-6px`">
                                    <Icon icon="ion:pricetag-sharp" :size="50"/>
                                </div>
                            </div>
                            <div class="flex flex-col justify-between">
                                <div :class="`${prefixCls}__item--text text-20px text-gray-500 text-right`">平均单价</div>
                                <CountTo
                                    class="text-20px font-700 text-right"
                                    :start-val="0"
                                    :end-val="purchase_avg_price"
                                    :duration="1500"
                                    />
                                <div :class="`${prefixCls}__item--text text-13px text-gray-500 text-right`">
                                    <span>相比上月</span>
                                    <span class="green" v-if="avg_price_dif > 0">
                                        {{ avg_price_dif }}%
                                        <el-icon >
                                            <CaretTop />
                                        </el-icon>
                                    </span>
                                    <span class="red" v-else>
                                        {{ avg_price_dif }}%
                                        <el-icon >
                                            <CaretBottom />
                                        </el-icon>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </template>
                </ElSkeleton>
            </ElCard>
        </ElCol>

        <ElCol :xl="6" :lg="6" :md="12" :sm="12" :xs="24">
            <ElCard shadow="hover" class="mb-20px">
                <ElSkeleton :loading="loading" animated :rows="2">
                    <template #default>
                        <div :class="`${prefixCls}__item flex justify-between`">
                            <div>
                                <div :class="`${prefixCls}__item--icon ${prefixCls}__item--peoples p-16px inline-block rounded-6px`">
                                    <Icon icon="typcn:shopping-cart" :size="50"/>
                                </div>
                            </div>
                            <div class="flex flex-col justify-between">
                                <div :class="`${prefixCls}__item--text text-20px text-gray-500 text-right`">本月采购(PCS)</div>
                                <CountTo
                                    class="text-20px font-700 text-right"
                                    :start-val="0"
                                    :end-val="purchase_qty"
                                    :duration="1500"
                                    />
                                <div :class="`${prefixCls}__item--text text-13px text-gray-500 text-right`">
                                    <span>相比上月</span>
                                    <span class="green" v-if="qty_dif > 0">
                                        {{ qty_dif }}%
                                        <el-icon >
                                            <CaretTop />
                                        </el-icon>
                                    </span>
                                    <span class="red" v-else>
                                        {{ qty_dif }}%
                                        <el-icon >
                                            <CaretBottom />
                                        </el-icon>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </template>
                </ElSkeleton>
            </ElCard>
        </ElCol>
    </ElRow>
</template>

<style scoped>
.green {
  color: var(--el-color-success);
}
.red {
  color: var(--el-color-error);
}
</style>

<style lang="less" scoped>
@prefix-cls: ~'@{adminNamespace}-panel';

.@{prefix-cls} {
  &__item {
    &--peoples {
      color: #40c9c6;
    }

    &--price {
      color: #36a3f7;
    }

    &--money {
      color: #f4516c;
    }

    &--shopping {
      color: #34bfa3;
    }

    &:hover {
      :deep(.@{adminNamespace}-icon) {
        color: #fff !important;
      }
      .@{prefix-cls}__item--icon {
        transition: all 0.38s ease-out;
      }
      .@{prefix-cls}__item--peoples {
        background: #40c9c6;
      }
      .@{prefix-cls}__item--price {
        background: #36a3f7;
      }
      .@{prefix-cls}__item--money {
        background: #f4516c;
      }
      .@{prefix-cls}__item--shopping {
        background: #34bfa3;
      }
    }
  }
}
</style>