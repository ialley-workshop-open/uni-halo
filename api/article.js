/**
 *   文章接口
 */

import HttpHandler from '@/common/http/request.js'
export default {
	/**
	 * 获取文章列表
	 * @param {Object} params  查询参数
	 */
	getArticleList: (params) => {
		return HttpHandler.Get('/api/content/posts', params)
	},

	/**
	 * 获取文章详情
	 * @param {String} name  文章 name
	 */
	getArticleDetail: (name) => {
		return HttpHandler.Get(`/apis/api.content.halo.run/v1alpha1/posts/${name}`, {})
	},
}