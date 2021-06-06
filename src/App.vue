<!--
 * @Description: 
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-22 15:46:37
 * @LastEditTime: 2021-06-06 12:30:01
-->
<template>
    <router-view />
</template>

<style lang="scss">
#app {
    width: 100%;
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    -webkit-app-region: drag; // 窗口拖拽
    visibility: hidden;
    transition: all 0.5s;
    &.slidein {
        box-shadow: 0 0 6px 1px #000000a6;
        visibility: visible;
        animation: slide-in-anim 3s ease;
    }
}
@keyframes slide-in-anim {
    0% {
        border-right: 1px solid #854cff;
        transform: scaleY(0) translateX(calc(-9px - 100%)) translateZ(0);
        box-shadow: none;
    }
    40% {
        border-right: 1px solid #854cff;
        transform: scaleY(1) translateX(calc(-9px - 100%)) translateZ(0);
        box-shadow: none;
    }
    41% {
        border-right: 1px solid #854cff;
        transform: scaleY(1) translateX(calc(-9px - 100%)) translateZ(0);
    }
    100% {
        border-right: 1px solid #854cff;
        transform: translateX(0) translateZ(0);
    }
}
</style>
