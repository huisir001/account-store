<!--
 * @Description: 登录页波浪背景
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-08 15:02:03
 * @LastEditTime: 2021-06-08 15:03:15
-->
<template>
    <div class="waveWrapper waveAnimation">
        <div class="waveWrapperInner bgTop">
            <div class="wave waveTop"></div>
        </div>
        <div class="waveWrapperInner bgMiddle">
            <div class="wave waveMiddle"></div>
        </div>
        <div class="waveWrapperInner bgBottom">
            <div class="wave waveBottom"></div>
        </div>
    </div>
</template>
 
<style scoped lang="scss">
.waveWrapper {
    overflow: hidden;
    height: 235px;
    width: 100%;
    position: relative;
}
.waveWrapperInner {
    position: absolute;
    width: 100%;
    overflow: hidden;
    height: 100%;
    top: 0;
    background-image: linear-gradient(to top, #854cff 20%, #663bc1 80%);
}
.bgTop {
    z-index: 15;
    opacity: 0.5;
}
.bgMiddle {
    z-index: 10;
    opacity: 0.75;
}
.bgBottom {
    z-index: 5;
}
.wave {
    position: absolute;
    left: 0;
    width: 200%;
    height: 100%;
    background-repeat: repeat no-repeat;
    background-position: 0 bottom;
    transform-origin: center bottom;
}
.waveTop {
    background-size: 50% 40px;
    background-image: url('../assets/imgs/wave-top.png');
}
.waveAnimation .waveTop {
    animation: move-wave 3s;
    -webkit-animation: move-wave 3s;
    -webkit-animation-delay: 1s;
    animation-delay: 1s;
}
.waveMiddle {
    background-size: 50% 50px;
    background-image: url('../assets/imgs/wave-mid.png');
}
.waveAnimation .waveMiddle {
    animation: move_wave 10s linear infinite;
}
.waveBottom {
    background-size: 50% 40px;
    background-image: url('../assets/imgs/wave-bot.png');
}
.waveAnimation .waveBottom {
    animation: move_wave 15s linear infinite;
}
@keyframes move_wave {
    0% {
        transform: translateX(0) translateZ(0) scaleY(1);
    }
    50% {
        transform: translateX(-25%) translateZ(0) scaleY(0.55);
    }
    100% {
        transform: translateX(-50%) translateZ(0) scaleY(1);
    }
}
</style>
