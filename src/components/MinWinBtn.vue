<!--
 * @Description: 最小化按钮
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-07 18:32:44
 * @LastEditTime: 2021-06-10 18:11:21
-->
<template>
    <svg t="1622900690444"
         @click="minIconNoHover=true;minimize()"
         @mouseenter="bindMinIconMouseenter"
         :class="{
                 'icon':true,
                  'mini-icon':true,
                  'no-hover':minIconNoHover
             }"
         :style="{top,bottom,left,right,'--hover':hoverColor}"
         viewBox="0 0 1024 1024"
         version="1.1"
         xmlns="http://www.w3.org/2000/svg"
         p-id="7843"
         :width="size"
         :height="size">
        <path d="M98.23 451.003l829.685-1.992 0.154 64-829.685 1.992z"
              :fill="color"
              p-id="7844"></path>
    </svg>
</template>
 
<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import { minimize } from '@/api/win'

export default defineComponent({
    name: 'MinWinBtn',
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
        // 按钮hover移除
        const minIconNoHover: Ref = ref(false)

        // 窗口icon鼠标移入显示hover
        const bindMinIconMouseenter = () => {
            if (minIconNoHover.value) {
                minIconNoHover.value = false
            }
        }

        return {
            minIconNoHover,
            bindMinIconMouseenter,
            minimize,
        }
    },
})
</script>
 
<style scoped lang="scss">
.icon.mini-icon {
    position: absolute;
    z-index: 99999;
    cursor: pointer;
    -webkit-app-region: no-drag;
    &:hover {
        background: var(--hover);
    }
    path {
        transform-origin: center;
        transform: scaleY(0.8) scaleX(0.9);
        opacity: 0.7;
    }
    &.no-hover {
        background: none !important;
    }
}
</style>