/**
 *  功能：全局API管理
 *  作者：小莫唐尼
 *  邮箱：studio@925i.cn
 *  时间：2022年07月21日 19:14:44
 *  版本：v0.1.0
 *  修改记录：
 *  修改内容：
 *  修改人员：
 *  修改时间：
 */

import HttpHandler from '@/common/http/request.js'
 
// 2.0接口
import v2 from './v2/all.api.js'

const ApiManager = {
	v2 
};

const install = (Vue) => {
	Vue.prototype.$httpApi = ApiManager
}

export default {
	install
}
