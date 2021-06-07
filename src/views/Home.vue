<!--
 * @Description: 首页
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-24 10:42:53
 * @LastEditTime: 2021-06-07 16:37:43
-->
<template>
    <div class="home">
        <Layout>
            <router-view />
        </Layout>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, nextTick } from 'vue'
import Layout from '@/components/Layout.vue'
import { useStore } from 'vuex'

export default defineComponent({
    name: 'Home',
    components: {
        Layout,
    },
    setup() {
        const store = useStore()
        onMounted(() => {
            nextTick(() => {
                // 显示界面，展示滑入动画
                store.dispatch('showSlideInAnimate')
            })
        })
    },
})
</script>
<style scoped lang="scss">
.home {
    height: calc(100vh - 20px);
}
</style>
