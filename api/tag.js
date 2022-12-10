/**
 * 标签接口
 * @see https://api.halo.run/content-api.html#tag/tag-controller
 */

import HttpHandler from '@/common/http/request.js'
export default {
	/**
	 * 查询标签列表
	 * @param {Object} params  查询参数 
	 */
	getTagList: (params) => {
		return HttpHandler.Get('/api/content/tags', params)
	},

	/**
	 * 查询标签下的文章
	 * @param {String} slug  别名
	 * @param {Object} params  查询参数 
	 */
	getTagPostsList: (slug, params) => {
		return HttpHandler.Get(`/api/content/tags/${slug}/posts`, params)
	},
}
