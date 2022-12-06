/**
 * 图库接口
 * @see https://api.halo.run/content-api.html#tag/photo-controller
 */

import HttpHandler from '@/common/http/request.js'

export default {
	/**
	 * 获取图库列表（分页查询）
	 * @param {Object} params 参数
	 */
	getPhotoListByPage: (params) => {
		return HttpHandler.Get(`/api/content/photos`, params)
	},

	/**
	 * 获取图库列表（最新）
	 * @param {Object} params 参数
	 */
	getPhotoList: (params) => {
		return HttpHandler.Get(`/api/content/photos/latest`, params)
	},

	/**
	 * 获取图库分组
	 */
	getPhotoTeams: () => {
		return HttpHandler.Get(`/api/content/photos/teams`)
	},
}
