<!--
 * @Description: 首页
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-05-24 10:42:53
 * @LastEditTime: 2021-12-05 11:34:17
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
import { getUrlQuery } from '../../sys/tools/utils'

export default defineComponent({
    name: 'Home',
    components: {
        Layout,
    },
    setup() {
        // 改标题
        document.title = '账号仓库'

        // 存token
        const { token } = getUrlQuery()
        sessionStorage.setItem('token', token)

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
    // height: calc(100vh - 20px);
    height: 100%;
}
</style>
