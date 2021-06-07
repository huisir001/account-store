<!--
 * @Description: 最小化按钮
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-07 18:32:44
 * @LastEditTime: 2021-06-07 18:48:02
-->
<template>
    <svg t="1622900690444"
         @click="minIconNoHover=true;Api('winMinimize')"
         @mouseenter="bindMinIconMouseenter"
         :class="{
                 'icon':true,
                  'mini-icon':true,
                  'no-hover':minIconNoHover
             }"
         viewBox="0 0 1024 1024"
         version="1.1"
         xmlns="http://www.w3.org/2000/svg"
         p-id="7843"
         :width="size"
         :height="size">
        <path d="M98.23 451.003l829.685-1.992 0.154 64-829.685 1.992z"
              fill="#ffffff"
              p-id="7844"></path>
    </svg>
</template>
 
<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import Api from '@/api'

export default defineComponent({
    name: 'MinWinBtn',
    props: {
        size: {
            // 像素，长宽尺寸
            type: Number,
            default: 20,
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
            Api,
        }
    },
})
</script>
 
<style scoped lang="scss">
$iconMargin: 20px;
.icon {
    position: absolute;
    z-index: 99999;
    top: 15px;
    cursor: pointer;
    -webkit-app-region: no-drag;
    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }
}
.mini-icon {
    right: $iconMargin;
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