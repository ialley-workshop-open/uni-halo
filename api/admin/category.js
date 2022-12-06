/**
 * 文章分类管理
 * @see https://api.halo.run/admin-api.html#tag/category-controller
 */
import HttpHandler from '@/common/http/request.js'

export default {
	/**
	 * 查询所有的文章分类
	 * {
	 *	"sort": ["",""], // 排序
	 *	"more": "Boolean" ,// 更多参数（回调）
	 * }
	 */
	getCategoryList: (params) => {
		return HttpHandler.Get('/api/admin/categories', params)
	},

	/**
	 * 查询所有的文章分类(树形数据)
	 * {
	 *	"sort": ["",""], // 排序
	 * }
	 */
	getCategoryListTree: (params) => {
		return HttpHandler.Get('/api/admin/categories/tree_view', params)
	},

	/**
	 * 查询文章分类详情 
	 * @param {Number} categoryId 分类ID
	 */
	getCategoryDetail: (categoryId) => {
		return HttpHandler.Get(`/api/admin/categories/${categoryId}`)
	},

	/**
	 * 新增文章分类
	 * {
	 *	  "description": "string",
	 *	  "id": 0,
	 *	  "name": "string",
	 *	  "parentId": 0,
	 *	  "password": "string",
	 *	  "priority": 0,
	 *	  "slug": "string",
	 *	  "thumbnail": "string"
	 * }
	 */
	createCategory: (data) => {
		return HttpHandler.Post(`/api/admin/categories`, data)
	},

	/**
	 * 修改文章分类信息
	 * @param {Number} categoryId 分类id
	 * @param {Object} data 同新增  
	 */
	updateCategoryById: (categoryId, data) => {
		return HttpHandler.Put(`/api/admin/categories/${categoryId}`, data)
	},

	/**
	 * 删除单个文章分类
	 * @param {Number} categoryId 文章分类id
	 */
	deleteCategoryById: (categoryId) => {
		return HttpHandler.Delete(`/api/admin/categories/${categoryId}`)
	},
}
