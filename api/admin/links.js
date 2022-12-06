/**
 * 友链管理
 * @see https://api.halo.run/admin-api.html#tag/link-controller
 */
import HttpHandler from '@/common/http/request.js'

export default {
	// 获取友链列表
	getLinkList: () => {
		return HttpHandler.Get('/api/admin/links')
	},
	/**
	 * 获取友链详情
	 * @params { Number } linkId 友链Id
	 */
	getLinkDetail: (linkId) => {
		return HttpHandler.Get(`/api/admin/links/${linkId}`)
	},
	/**
	 * 新增友链
	 * {
	 *	"description": "string",
	 *	"logo": "string",
	 *	"name": "string",
	 *	"priority": 0,
	 *	"team": "string",
	 *	"url": "string"
	 * }
	 */
	addLink: (data) => {
		return HttpHandler.Post('/api/admin/links', data, {})
	},
	/**
	 * 修改友链
	 * {
	 *	"description": "string",
	 *	"logo": "string",
	 *	"name": "string",
	 *	"priority": 0,
	 *	"team": "string",
	 *	"url": "string"
	 * }
	 */
	updateLink: (linkId, data) => {
		return HttpHandler.Put(`/api/admin/links/${linkId}`, data, {})
	},
	/**
	 * 删除友链
	 * @params { Number } linkId 友链Id
	 */
	deleteLink: (linkId) => {
		return HttpHandler.Delete(`/api/admin/links/${linkId}`)
	},

	// 获取友链分组
	getLinkTeamList: (data) => {
		return HttpHandler.Get('/api/admin/links/teams')
	},
}
