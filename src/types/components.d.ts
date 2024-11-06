declare module 'vue' {
  export interface GlobalComponents {
    Icon: (typeof import('../../../hsunWeb/vue-element-plus-admin/src/components/Icon/index'))['Icon']
    Permission: (typeof import('../../../hsunWeb/vue-element-plus-admin/src/components/Permission/index'))['Permission']
    BaseButton: (typeof import('../../../hsunWeb/vue-element-plus-admin/src/components/Button/index'))['BaseButton']
  }
}

export {}
