import ContextMenu from './src/ContextMenu.vue'
import { ElDropdown } from 'element-plus'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

export type { ContextMenuSchema } from './src/types'

type ComponentRef<T extends abstract new (...args: any) => any> = InstanceType<T>;


export interface ContextMenuExpose {
  elDropdownMenuRef: ComponentRef<typeof ElDropdown>
  tagItem: RouteLocationNormalizedLoaded
}

export { ContextMenu }
