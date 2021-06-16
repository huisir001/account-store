<!--
 * @Description: 账户列表
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-08 13:57:28
 * @LastEditTime: 2021-06-16 14:19:20
-->
<template>
    <div class="accountList">
        <div class="table" v-loading="loading">
            <el-input class="searchInput" v-model="search" clearable size="small"
                placeholder="输入名称关键字回车搜索" @blur="doSearch"
                @keydown.enter="$event.currentTarget.blur()" @clear="doSearch" />
            <el-table :data="tableData" style="width: 100%;">
                <el-table-column prop="name" label="账户名称" />
                <!-- <el-table-column prop="account"
                         label="登录账号">
        </el-table-column>
        <el-table-column prop="password"
                         label="登录密码">
        </el-table-column>
        <el-table-column prop="email"
                         label="绑定邮箱">
        </el-table-column>
        <el-table-column prop="phone"
                         label="绑定手机">
        </el-table-column>
        <el-table-column prop="update_time"
                         label="修改时间">
        </el-table-column>
        <el-table-column prop="remark"
                         label="备注">
        </el-table-column> -->
                <el-table-column label="账号信息" width="100">
                    <template #default="scope">
                        <span class="see-detail-btn"
                            @click="detail(scope.row.id,scope.row.name)">查看详情</span>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="存表时间" width="150" />
                <el-table-column align="right" width="160">
                    <template #default="scope">
                        <el-button type="primary" @click="edit(scope.row.id)" size="small">编辑
                        </el-button>
                        <el-button type="danger" @click="detele(scope.row.id)" size="small">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-pagination v-show="pageTotal>1" class="pageNav" small background
            layout="prev, pager, next" :current-page="curPage" :page-count="pageTotal"
            @current-change="bindPageChange">
        </el-pagination>
    </div>
</template>
 
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { delAccount, getAccountList } from '@/api/account'
import { showMessageBoxSync, openChildWindow } from '@/api/win'

export default defineComponent({
    name: 'AccountList',
    setup() {
        let tableData = ref([])
        let curPage = ref(1)
        let pageTotal = ref(1)
        let loading = ref(false)
        let search = ref('')

        // 查询列表
        const getList = async (page = 1, name = '') => {
            loading.value = true
            const res = await getAccountList({ page, limit: 5, name })
            // 有登录数据
            if (res && res.ok === 1) {
                const { list, page, pageTotal: pt } = res.data
                curPage.value = page
                pageTotal.value = pt
                tableData.value = list
                loading.value = false
            }
        }

        // 初始化
        getList()

        // 切换页
        const bindPageChange = (page: number) => {
            getList(page)
        }

        // 搜索
        const doSearch = () => {
            getList(1, search.value)
        }

        // 详情
        const detail = (aid: string, aName: string) => {
            // 打开子窗口
            // wid-窗口唯一标识
            const { origin, pathname } = location
            openChildWindow({
                wid: 'editWindow',
                url: `${origin + pathname}#/detail?aid=${aid}&token=${sessionStorage.getItem(
                    'token'
                )}`,
                width: 660,
                height: 350,
                title: aName,
            })
        }

        // 编辑,aid-账户id
        const edit = (aid: string) => {
            // 打开子窗口
            // wid-窗口唯一标识
            const { origin, pathname } = location
            openChildWindow(
                {
                    wid: 'editWindow',
                    url: `${origin + pathname}#/edit?aid=${aid}&token=${sessionStorage.getItem(
                        'token'
                    )}`,
                    width: 360,
                    height: 390,
                    title: '编辑账户',
                },
                ({ msg }) => {
                    // 接收消息
                    if (msg == 'saved') {
                        // 修改数据成功，刷新列表
                        getList(curPage.value, search.value)
                        // 提示
                        window.toast('修改成功')
                    }
                }
            )
        }

        // 删除
        const detele = async (id: string) => {
            const res = await showMessageBoxSync({
                title: '提示',
                msg: '确认删除？删除后无法恢复!',
            })

            if (res === 0) {
                const res = await delAccount(id)
                if (res && res.ok && res.ok === 1) {
                    window.toast(res.msg)
                    // 刷新当前页
                    getList(curPage.value, search.value)
                } else {
                    window.toast('删除失败')
                }
            }
        }

        return {
            search,
            loading,
            tableData,
            curPage,
            pageTotal,
            doSearch,
            bindPageChange,
            detele,
            detail,
            edit,
        }
    },
})
</script>
 
<style scoped lang="scss">
.accountList {
    width: 100%;
    height: 100%;
    position: relative;
    .table {
        width: 100%;
        height: 335px;
        &:deep(.el-table .cell) {
            word-break: keep-all;
        }
    }
    span.see-detail-btn {
        padding: 10px 0;
        cursor: pointer;
        color: #3e5eff;
        cursor: pointer;
    }
    .pageNav {
        width: 100%;
        text-align: center;
        position: absolute;
        bottom: 0;
        :deep(*) {
            font-weight: 100;
        }
    }
    .searchInput {
        position: absolute;
        width: 190px;
        top: 7px;
        right: 10px;
        z-index: 1;
    }
}
</style>