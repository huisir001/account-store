<!--
 * @Description: 路由入口
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-22 15:46:37
 * @LastEditTime: 2021-12-05 12:09:02
-->
<template>
    <router-view />
</template>

<style lang="scss">
#app {
    width: 100%;
    height: var(--appHeight); // new
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    -webkit-app-region: drag; // 窗口拖拽
    transition: all 0.5s;
    &.slidein {
        box-shadow: 0 0 6px 1px #00000042;
        visibility: visible;
        animation: slide-in-anim 2.5s ease;
    }
    &.show {
        transition: none !important;
        visibility: visible !important;
        border-radius: 0 !important;
        height: 100%;
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
