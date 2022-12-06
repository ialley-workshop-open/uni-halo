/**
 * 分类接口
 * @see https://api.halo.run/content-api.html#tag/category-controller
 */

import HttpHandler from '@/common/http/request.js'
export default {
	/**
	 * 查询分类列表
	 * @param {Object} params  查询参数 
	 */
	getCategoryList: (params) => {
		return HttpHandler.Get('/api/content/categories', params)
	},

	/**
	 * 查询分类下的文章
	 * @param {String} slug  分类名称
	 * @param {Object} params  查询参数 
	 */
	getCategoryPostList: (slug, params) => {
		return HttpHandler.Get(`/api/content/categories/${slug}/posts`, params)
	},
}
