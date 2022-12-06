/**
 * 标签管理
 * @see https://api.halo.run/admin-api.html#tag/tag-controller
 */
import HttpHandler from '@/common/http/request.js'

export default {
	/**
	 * 查询文章标签列表
	 * {
	 *	"sort": ["",""], // 排序
	 *	"more": "Boolean" ,// 更多参数（回调）
	 * }
	 */
	getTagsList: (params) => {
		return HttpHandler.Get('/api/admin/tags', params)
	},

	/**
	 * 查询文章标签详情 
	 * @param {Number} tagId id
	 */
	getTagsDetail: (tagId) => {
		return HttpHandler.Get(`/api/admin/tags/${tagId}`)
	},

	/**
	 * 新增文章标签
	 *  {
	 *    "color": "#e23d66", // 颜色选择器
	 *    "name": "string",
	 *    "slug": "string",
	 *    "thumbnail": "string"
	 *  }
	 */
	createTags: (data) => {
		return HttpHandler.Post(`/api/admin/tags`, data)
	},

	/**
	 * 修改文章标签信息
	 * @param {Number} tagId id
	 * @param {Object} data 同新增  
	 */
	updateTagsById: (tagId, data) => {
		return HttpHandler.Put(`/api/admin/tags/${tagId}`, data)
	},

	/**
	 * 删除文章标签
	 * @param {Number} tagId id
	 */
	deleteTagsById: (tagId) => {
		return HttpHandler.Delete(`/api/admin/tags/${tagId}`)
	},
}
