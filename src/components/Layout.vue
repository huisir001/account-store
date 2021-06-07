<!--
 * @Description: 布局外层
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-24 10:42:53
 * @LastEditTime: 2021-06-07 18:51:24
-->
<template>
    <div class="layout">
        <div class="navs">
            <div class="actbox"></div>
            <div class="menu-box">
                <router-link to="/home/createAccount"
                             class="menu-item">
                    <i class="el-icon-folder-add"></i>
                    <span>新增账户</span>
                </router-link>
                <router-link to="/home/accountList"
                             class="menu-item">
                    <i class="el-icon-folder-add"></i>
                    <span>账户列表</span>
                </router-link>
                <router-link to="/home/operateLogs"
                             class="menu-item">
                    <i class="el-icon-folder-add"></i>
                    <span>操作日志</span>
                </router-link>
                <router-link to="/home/options"
                             class="menu-item">
                    <i class="el-icon-folder-add"></i>
                    <span>设置选项</span>
                </router-link>
            </div>
        </div>
        <div class="content">
            <slot />
        </div>
    </div>
</template>
 
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'Layout',
    setup() {},
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
                .actbox {
                    display: block;
                }
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
        }
        .actbox {
            position: absolute;
            display: none;
            left: 0;
            top: 110px;
            width: 100%;
            height: 50px;
            background-image: linear-gradient(to right, #e270ffbf, #e270ff00);
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