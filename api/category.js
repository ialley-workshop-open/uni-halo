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
		return HttpHandler.Get('/apis/api.content.halo.run/v1alpha1/categories', params)
	},

	/**
	 * 根据分类名称查询一个分类
	 * @param {String} name  分类名称
	 * @param {Object} params  查询参数 
	 */
	getCategoryPostList: (name, params) => {
		return HttpHandler.Get(`/apis/api.content.halo.run/v1alpha1/categories/${name}`, params)
	},

	/**
	 * 查询分类下的文章
	 * @param {String} name  分类名称
	 * @param {Object} params  查询参数 
	 */
	getCategoryPostList: (name, params) => {
		return HttpHandler.Get(`/apis/api.content.halo.run/v1alpha1/categories/${name}/posts`, params)
	},


}