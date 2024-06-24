/**
 *  功能：请求工具
 *  作者：小莫唐尼
 *  邮箱：studio@925i.cn
 *  时间：2022年07月21日 18:58:03
 *  版本：v0.1.0
 *  修改记录：
 *  修改内容：
 *  修改人员：
 *  修改时间：
 */

import HaloTokenConfig from '@/config/token.config.js'
import {
	setInterceptors
} from "./interceptors.js";
import Request from "@/js_sdk/luch-request/luch-request";

const http = new Request()
/* 设置全局配置 */
http.setConfig((config) => {

	// 如果是在外部浏览器调试或者编译为h5，请注释该行代码
	config.baseURL = HaloTokenConfig.BASE_API;

	config.header = {
		...config.header,
		ContentType: 'application/json',
		dataType: 'json'
	}
	return config
})

setInterceptors(http)

export {
	http
}
