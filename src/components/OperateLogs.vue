<!--
 * @Description: 日志列表
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-08 13:57:41
 * @LastEditTime: 2021-06-14 20:06:22
-->
<template>
    <div class="operateLogs">
        <div class="table" v-loading="loading">
            <el-table :data="tableData" size="small" height="370"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" />
                <!-- <el-table-column type="index" label="序号" /> -->
                <el-table-column prop="create_time" width="150">
                    <template #header>
                        时间
                        <el-popover placement="bottom" :width="246" v-model:visible="searchVisible">
                            <el-date-picker v-model="searchVal" range-separator="至"
                                start-placeholder="开始" end-placeholder="结束" size="small"
                                class="date-picker" type="daterange" placeholder="选择日期"
                                :clearable="false" @change="doSearch">
                            </el-date-picker>
                            <div style="text-align: right; margin-top: 10px">
                                <el-button size="mini" @click="searchVisible = false">取消
                                </el-button>
                                <el-button size="mini" @click="reset">重置
                                </el-button>
                            </div>
                            <template #reference>
                                <i @click="searchVisible = true"
                                    class="el-icon-search searchBtn"></i>
                            </template>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="log" label="操作内容" />
            </el-table>
        </div>
        <el-pagination v-show="pageTotal>1" class="pageNav" small layout="prev, pager, next"
            background :current-page="curPage" :page-count="pageTotal"
            @current-change="bindPageChange">
        </el-pagination>
        <el-button v-if="selectionList.length>0" @click="delLogs" type="text" size="mini"
            class="delbtn">删除
        </el-button>
    </div>
</template>
 
<script lang="ts">
import { computed, defineComponent, Ref, ref } from 'vue'
import { getOperateLogs, delOperateLogs } from '@/api/log'
import { formatDate } from '../../sys/tools/utils'

export default defineComponent({
    name: 'OperateLogs',
    setup() {
        let tableData = ref([])
        let curPage = ref(1)
        let pageTotal = ref(1)
        let loading = ref(false)
        let searchVisible = ref(false)
        let searchVal = ref([])
        let selectionList: Ref<any> = ref([]) //选定列表

        const searchValObj = computed(() => {
            if (searchVal.value.length === 2) {
                return {
                    beginTime: formatDate(searchVal.value[0]),
                    endTime: formatDate(searchVal.value[1]),
                }
            } else {
                return {}
            }
        })

        // 查询列表
        const getList = async (page = 1, beginTime = '', endTime = '') => {
            loading.value = true
            const res = await getOperateLogs({ page, limit: 8, beginTime, endTime })
            // 有登录数据
            if (res && res.ok) {
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
            getList(page, searchValObj.value.beginTime, searchValObj.value.endTime)
        }

        // 搜索
        const doSearch = () => {
            getList(1, searchValObj.value.beginTime, searchValObj.value.endTime)
            searchVisible.value = false
        }

        // 重置
        const reset = () => {
            getList()
            searchVal.value = []
            searchVisible.value = false
        }

        // 多选
        const handleSelectionChange = (e: any[]) => {
            selectionList.value = e
        }

        // 删除
        const delLogs = async () => {
            const res = await delOperateLogs(
                selectionList.value.map((_item: { id: string }) => _item.id).join(',')
            )
            if (res && res.ok) {
                window.toast('删除成功')
                // 刷新列表
                getList()
            }
        }

        return {
            loading,
            tableData,
            curPage,
            pageTotal,
            searchVisible,
            searchVal,
            doSearch,
            reset,
            delLogs,
            selectionList,
            bindPageChange,
            handleSelectionChange,
        }
    },
})
</script>
 
<style scoped lang="scss">
.operateLogs {
    width: 100%;
    height: 100%;
    position: relative;
    .table {
        width: 100%;
    }
    .delbtn {
        position: absolute;
        bottom: 0;
        left: 0;
        background: #f4f4f5;
        padding: 0px 12px;
        line-height: 0;
        min-height: 25px;
        cursor: pointer;
        &:hover {
            background: #854cff;
            color: #fff;
        }
    }
    .pageNav {
        width: 100%;
        text-align: center;
        position: absolute;
        bottom: 0;
        :deep(*) {
            font-weight: 100 !important;
        }
    }
    .searchBtn {
        position: absolute;
        display: inline-block;
        padding: 5px;
        top: 0;
        left: 53px;
        z-index: 1;
        cursor: pointer;
    }
}
</style>