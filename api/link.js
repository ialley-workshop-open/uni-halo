/**
 * 友链接口
 * @see https://api.halo.run/content-api.html#tag/link-controller
 */

import HttpHandler from '@/common/http/request.js'

export default {
	/**
	 * 获取友链列表
	 * @param {Object} params 参数
	 */
	getLinkList: (params) => {
		return HttpHandler.Get(`/api/content/links`, params)
	},

	/**
	 * 获取分组的友链列表
	 * @param {Object} params 参数
	 */
	getLinkListByTeam: (params) => {
		return HttpHandler.Get(`/api/content/links/team_view`, params)
	},
}
