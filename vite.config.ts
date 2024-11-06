import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import WindiCSS from 'vite-plugin-windicss'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import UnoCSS from 'unocss/vite'


const root = process.cwd()

function pathResolve(dir: string) {
  return resolve(root, '.', dir)
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    WindiCSS(),
    createSvgIconsPlugin({
      iconDirs: [pathResolve('src/assets/svgs')],
      symbolId: 'icon-[dir]-[name]',
      svgoOptions: true
    }),
    UnoCSS()
  ],
  css: {
    preprocessorOptions: {
      less: {
        additionalData: '@import "./src/styles/variables.module.less";',
        javascriptEnabled: true
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
