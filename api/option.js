/**
 * 配置接口
 * @see https://api.halo.run/content-api.html#tag/option-controller
 */

import HttpHandler from '@/common/http/request.js'

export default {
	/**
	 * 根据key获取配置
	 * @param {String} key 配置的key
	 */
	getOptionByKey: (key) => {
		return HttpHandler.Get(`/api/content/options/keys/${key}`)
	},

	/**
	 * 获取配置列表（列表）
	 */
	getOptionList: () => {
		return HttpHandler.Get(`/api/content/options/list_view`)
	},

	/**
	 * 获取配置列表（键值对）
	 */
	getOptionMap: () => {
		return HttpHandler.Get(`/api/content/options/map_view`)
	},
}
