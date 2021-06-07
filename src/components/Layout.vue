<!--
 * @Description: 布局外层
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-24 10:42:53
 * @LastEditTime: 2021-06-07 21:24:47
-->
<template>
    <div class="layout">
        <div class="navs">
            <div class="menu-box">
                <div class="routers-box">
                    <router-link v-for="nav in navList"
                                 :key="nav.path"
                                 :to="nav.path"
                                 class="menu-item"
                                 @mouseenter="bindNavMouseEnter">
                        <i :class="nav.icon"></i>
                        <span>{{nav.title}}</span>
                    </router-link>
                    <router-link to="/home/accountList"
                                 class="menu-item"
                                 @mouseenter="bindNavMouseEnter">
                        <i class="el-icon-folder-add"></i>
                        <span>账户列表</span>
                    </router-link>
                    <router-link to="/home/operateLogs"
                                 class="menu-item"
                                 @mouseenter="bindNavMouseEnter">
                        <i class="el-icon-folder-add"></i>
                        <span>操作日志</span>
                    </router-link>
                    <router-link to="/home/options"
                                 class="menu-item"
                                 @mouseenter="bindNavMouseEnter">
                        <i class="el-icon-folder-add"></i>
                        <span>设置选项</span>
                    </router-link>
                </div>
                <div class="navHoverBox"
                     :style="{top:navHoverBoxTop+'px'}"></div>
            </div>
        </div>
        <div class="content">
            <slot />
        </div>
    </div>
</template>
 
<script lang="ts">
import { defineComponent, ref } from 'vue'
import router from '@/router'

export default defineComponent({
    name: 'Layout',
    setup() {
        // 导航列表
        const navList: any = router.options.routes
            .find((route) => route.name == 'Home')!
            .children?.map(({ path, meta }) => ({
                path: '/home/' + path,
                ...meta,
            }))

        const navHoverBoxTop = ref(10)

        const bindNavMouseEnter = (e: any) => {
            navHoverBoxTop.value = e.target.offsetTop
        }

        return {
            navList,
            navHoverBoxTop,
            bindNavMouseEnter,
        }
    },
})
</script>
 
<style scoped lang="scss">
@import '@/assets/styles/var.scss';
.layout {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 8px 8px 8px 0;
    background: $--color-primary;
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
                    display: block;
                }
            }
            .routers-box {
                position: absolute;
                z-index: 2;
                width: 100%;
                height: 100%;
            }
            .menu-item {
                display: block;
                height: 50px;
                line-height: 50px;
                margin: 10px 0;
                text-align: center;
                color: #fff;
                i {
                    margin-right: 10px;
                }
            }
            .navHoverBox {
                transition: top 0.5s;
                position: absolute;
                z-index: 1;
                display: none;
                left: 0;
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
    }
}
</style>