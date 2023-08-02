/**
 * 分类接口
 * @see https://api.halo.run/content-api.html#tag/category-controller
 */

import HttpHandler from '@/common/http/request.js'
import { getCache } from '@/utils/storage.js'
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
		// 从缓存中根据分类获取密码，如果获取到了说明本分类需要密码，避免多个分类需要密码在输入密码后刷新页面点错了分类
		params.password = getCache('APP_CATEGORY_PWD_' + slug)
		return HttpHandler.Get(`/api/content/categories/${slug}/posts`, params)
	},
}
