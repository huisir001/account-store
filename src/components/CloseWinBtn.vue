<!--
 * @Description: 关闭窗口按钮
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-07 18:32:02
 * @LastEditTime: 2021-06-10 18:12:43
-->
<template>
    <svg t="1622891709537"
         @click="close"
         class="icon close-icon"
         :style="{top,bottom,left,right,'--hover':hoverColor}"
         viewBox="0 0 1024 1024"
         version="1.1"
         xmlns="http://www.w3.org/2000/svg"
         p-id="34945"
         :width="size"
         :height="size">
        <path d="M832.8704 846.2848c-2.6112 0-5.2224-1.024-7.2192-3.0208L183.9104 201.5232c-3.9936-3.9936-3.9936-10.496 0-14.4896 3.9936-3.9936 10.496-3.9936 14.4896 0l641.7408 641.7408c3.9936 3.9936 3.9936 10.496 0 14.4896-2.048 1.9968-4.6592 3.0208-7.2704 3.0208z"
              p-id="34946"
              :fill="color"></path>
        <path d="M191.1296 846.2848a10.26048 10.26048 0 0 1-7.2192-17.5104L825.6 187.0848c3.9936-3.9936 10.496-3.9936 14.4896 0 3.9936 3.9936 3.9936 10.496 0 14.4896L198.3488 843.264c-1.9968 1.9968-4.608 3.0208-7.2192 3.0208z"
              p-id="34947"
              :fill="color"></path>
    </svg>
</template>
 
<script lang="ts">
import { defineComponent } from 'vue'
import { close } from '@/api/win'

export default defineComponent({
    name: 'CloseWinBtn',
    props: {
        size: {
            // 像素，长宽尺寸
            type: Number,
            default: 20,
        },
        top: {
            type: String,
            default: 'auto',
        },
        bottom: {
            type: String,
            default: 'auto',
        },
        left: {
            type: String,
            default: 'auto',
        },
        right: {
            type: String,
            default: 'auto',
        },
        color: {
            type: String,
            default: '#ffffff',
        },
        hoverColor: {
            type: String,
            default: '#ffffff1a',
        },
    },
    setup() {
        return {
            close,
        }
    },
})
</script>
 
<style scoped lang="scss">
.icon.close-icon {
    position: absolute;
    z-index: 99999;
    cursor: pointer;
    -webkit-app-region: no-drag;
    &:hover {
        background: var(--hover);
    }
}
</style>