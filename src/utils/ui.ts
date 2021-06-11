/*
 * @Description: element UI 按需引入
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-03 14:26:05
 * @LastEditTime: 2021-06-11 18:08:43
 */
import { App } from '@vue/runtime-core'

import {
    ElButton,
    ElForm,
    ElFormItem,
    ElInput,
    ElTable,
    ElTableColumn,
    ElLoading,
    ElDivider,
    ElPagination,
    ElDescriptions,
    ElDescriptionsItem
} from 'element-plus'

const components = [
    ElButton,
    ElForm,
    ElFormItem,
    ElInput,
    ElTable,
    ElTableColumn,
    ElDivider,
    ElPagination,
    ElDescriptions,
    ElDescriptionsItem
]

const plugins = [
    ElLoading,
]

export default (app: App<any>) => {
    // 全局组件注册
    components.forEach((component) => {
        app.component(component.name, component)
    })

    // 全局插件注册
    plugins.forEach((plugin) => {
        app.use(plugin)
    })

    return app
}
