/*
 * @Description: 主线程API调用
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-02 16:03:20
 * @LastEditTime: 2021-06-05 01:03:11
 */
declare const window: Window & { sys: any }

import { ElLoading as Loading, ElMessage as Message } from 'element-plus'

export default async (something: string, ...parames: any[]): Promise<any> => {

    // loading
    const loading = Loading.service({
        text: 'Loading',
        background: 'rgba(255, 255, 255, 0.6)',
    })

    try {

        const res = await window.sys.do(something, ...parames)

        // 关闭loading
        loading.close()

        return Promise.resolve(res)

    } catch (err) {

        // 关闭loading
        loading.close()

        // 错误提示
        Message.error(err.msg || err.toString())
    }
}