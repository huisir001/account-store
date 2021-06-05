/*
 * @Description: 主线程API调用
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-02 16:03:20
 * @LastEditTime: 2021-06-06 00:41:46
 */
declare const window: Window & { sys: any, alert: (a: string, b: string, c: string) => void }

import { ElLoading as Loading } from 'element-plus'

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
        // loading.close()

        // 错误提示
        window.alert(err.msg || err.toString(), '错误信息', '确认')
    }
}