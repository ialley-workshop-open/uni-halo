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
	 * @param {String} articleId  文章id
	 */
	getArticleDetail: (articleId) => {
		return HttpHandler.Get(`/api/content/posts/${articleId}`, {
			formatDisabled: false,
			sourceDisabled: true
		})
	},
}
