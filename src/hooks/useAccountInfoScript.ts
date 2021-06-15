/*
 * @Description: 账号查看、编辑弹窗公共hook
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-11 18:14:44
 * @LastEditTime: 2021-06-16 00:12:25
 */
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { getAccountById } from '@/api/account'

export default () => {
    const $route = useRoute()
    const $store = useStore()
    const isEdit = ref($route.name == 'Edit')
    const isDetail = $route.name == 'Detail'
    let close = null
    const formdata = reactive({
        name: '',
        account: '',
        password: '',
        email: '',
        phone: '',
        remark: '',
    })

    if (isEdit.value || isDetail) {
        // 取消隐藏动画
        $store.dispatch('showApp')
        // 关闭页面
        close = () => window.close()
        // 获取参数
        const { aid, token } = $route.query
        // 保存token
        sessionStorage.setItem('token', token as string);
        // 请求当前账户数据
        (async () => {
            const res = await getAccountById(aid as string)
            if (res && res.ok === 1) {
                if (isEdit.value) {
                    delete res.data.create_time
                    delete res.data.update_time
                }
                Object.assign(formdata, res.data)
            }
        })()
    }


    return {
        isEdit,
        close,
        formdata
    }
}