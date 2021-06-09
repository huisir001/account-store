<!--
 * @Description: 布局外层
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-24 10:42:53
 * @LastEditTime: 2021-06-09 16:57:07
-->
<template>
    <div class="layout">
        <div class="navs">
            <div class="menu-box">
                <div class="routers-box">
                    <router-link v-for="nav in navList"
                                 :key="nav.path"
                                 :to="nav.path"
                                 :class="{'menu-item':true,act:nav.path==curRoute.fullPath}"
                                 @mouseenter="bindNavMouseEnter">
                        <i :class="nav.icon"></i>
                        <span>{{nav.title}}</span>
                    </router-link>
                </div>
                <div class="navHoverBox"
                     :style="{transform:'translateY('+navHoverBoxTop+'px)'}"></div>
            </div>
        </div>
        <div class="content">
            <MinWinBtn color="#4f5d68"
                       hoverColor="#854cff2e"
                       right="50px"
                       top="16px" />
            <CloseWinBtn color="#4f5d68"
                         hoverColor="#854cff2e"
                         right="20px"
                         top="16px" />
            <slot />
        </div>
    </div>
</template>
 
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import CloseWinBtn from './CloseWinBtn.vue'
import MinWinBtn from './MinWinBtn.vue'

export default defineComponent({
    name: 'Layout',
    components: {
        CloseWinBtn,
        MinWinBtn,
    },
    setup() {
        const router = useRouter()

        // 导航列表
        const navList: any = router.options.routes
            .find((route) => route.name == 'Home')!
            .children?.map(({ path, meta }) => ({
                path: '/home/' + path,
                ...meta,
            }))

        const curRoute = router.currentRoute

        const navHoverBoxTop = ref(10)

        const bindNavMouseEnter = (e: any) => {
            navHoverBoxTop.value = e.target.offsetTop
        }

        return {
            navList,
            curRoute,
            navHoverBoxTop,
            bindNavMouseEnter,
        }
    },
})
</script>
 
<style scoped lang="scss">
.layout {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 8px 8px 8px 0;
    background: #854cff;
    .navs {
        position: relative;
        width: 180px;
        height: 100%;
        float: left;
        .menu-box {
            position: absolute;
            width: 100%;
            top: 100px;
            left: 0;
            &:hover {
                .navHoverBox {
                    opacity: 1;
                }
            }
            .routers-box {
                position: absolute;
                z-index: 2;
                width: 100%;
                height: 100%;
            }
            .menu-item {
                display: flex;
                height: 50px;
                margin: 10px 0;
                color: rgba(255, 255, 255, 0.74);
                align-items: center;
                justify-content: center;
                i {
                    margin-right: 10px;
                    font-size: 24px;
                }
                span {
                    font-size: 17px;
                }
                &.act {
                    color: #fff;
                    background-image: linear-gradient(
                        to right,
                        #fa5ee0d7,
                        #e270ff00
                    );
                }
            }
            .navHoverBox {
                transition: all 0.5s;
                position: absolute;
                z-index: 1;
                opacity: 0;
                left: 0;
                top: 0;
                width: 100%;
                height: 50px;
                background-image: linear-gradient(
                    to right,
                    #e270ffbf,
                    #e270ff00
                );
            }
        }
    }
    .content {
        width: calc(100% - 180px);
        height: 100%;
        float: left;
        background: #fff;
        border-radius: 16px;
        padding: 60px 40px 40px 40px;
    }
}
</style>