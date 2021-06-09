/*
 * @Description: 主线程API调用
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-02 16:03:20
 * @LastEditTime: 2021-06-09 18:06:39
 */
import { ElLoading as Loading } from 'element-plus'
import Api from '@/api'

const noLoadings = ["getAccountList"]

export default async (something: string, ...parames: any[]): Promise<any> => {

    // loading
    let loading: any;
    if (!noLoadings.includes(something)) {
        loading = Loading.service({
            text: 'Loading...',
            background: 'rgba(255, 255, 255, 0.6)',
            target: "#app" // 在app元素内loading，避免遮罩覆盖透明区
        })
    }


    try {

        const res = await (<any>window).sys.do(something, ...parames)

        // 关闭loading
        loading && loading.close()

        return Promise.resolve(res)

    } catch (err) {

        // 关闭loading
        loading && loading.close();

        // 错误提示
        if (err.ok === 401) {
            (<any>window).alert(err.msg || err.toString(), '错误信息', '确认', () => {
                // 打开登录窗口
                Api('openLoginWindow')
            })
        } else {
            (<any>window).alert(err.msg || err.toString(), '错误信息', '确认')
        }
    }
}