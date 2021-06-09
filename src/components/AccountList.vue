<!--
 * @Description: 账户列表
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-08 13:57:28
 * @LastEditTime: 2021-06-10 01:00:05
-->
<template>
    <div class="accountList">
        <div class="table"
             v-loading="loading">
            <el-input class="searchInput"
                      v-model="search"
                      clearable
                      size="small"
                      placeholder="输入名称关键字回车搜索"
                      @blur="doSearch"
                      @keydown.enter="doSearch"
                      @clear="doSearch" />
            <el-table :data="tableData"
                      style="width: 100%;">
                <el-table-column prop="name"
                                 label="账户名称" />
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
        <el-table-column prop="remark"
                         label="备注">
        </el-table-column> -->
                <el-table-column label="账号信息"
                                 width="100">
                    <template #default="scope">
                        <span class="see-detail-btn"
                              @click="handleClick(scope.row)">查看详情</span>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time"
                                 label="存表时间"
                                 width="150" />
                <el-table-column align="right"
                                 width="160">
                    <template #default="scope">
                        <el-button type="primary"
                                   @click="handleClick(scope.row)"
                                   size="small">编辑</el-button>
                        <el-button type="danger"
                                   @click="handleClick(scope.$index)"
                                   size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-pagination v-show="pageTotal>1"
                       class="pageNav"
                       small
                       background
                       layout="prev, pager, next"
                       :current-page="curPage"
                       :page-count="pageTotal"
                       @current-change="bindPageChange">
        </el-pagination>
    </div>
</template>
 
<script lang="ts">
import { defineComponent, ref } from 'vue'
import Api from '@/api'

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
            const res = await Api('getAccountList', { page, limit: 5, name })
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

        return {
            search,
            loading,
            tableData,
            curPage,
            pageTotal,
            doSearch,
            bindPageChange,
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
    }
    .pageNav {
        width: 100%;
        text-align: center;
        position: absolute;
        bottom: 0;
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