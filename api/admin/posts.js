/**
 * 文章管理
 * @see https://api.halo.run/admin-api.html#tag/post-controller
 */
import HttpHandler from '@/common/http/request.js'

/**
 * 新建和编辑文章字段
 */
const createOrEditModel = {
	"categoryIds": [
		0
	],
	"content": "string",
	"createTime": "2019-08-24T14:15:22Z",
	"disallowComment": true,
	"editorType": "MARKDOWN",
	"keepRaw": true,
	"metaDescription": "string",
	"metaKeywords": "string",
	"metas": [{
		"key": "string",
		"postId": 0,
		"value": "string"
	}],
	"originalContent": "string",
	"formatContent": "",
	"password": "string",
	"slug": "string",
	"status": "DRAFT",
	"summary": "string",
	"tagIds": [
		0
	],
	"template": "string",
	"thumbnail": "string",
	"title": "string",
	"topPriority": 0
}


export default {
	/**
	 * 查询文章列表
	 *  @param {Object} params {
	 * 		categoryId,keyword,page,size,sort,
	 * 		status:"DRAFT" "INTIMATE" "PUBLISHED" "RECYCLE",statuses,more
	 * }
	 */
	getPostsByPage: (params) => {
		return HttpHandler.Get('/api/admin/posts', params)
	},

	/**
	 * 查询最近的文章列表
	 * @param {Object} params {top:Number}
	 */
	getLatestPosts: (params) => {
		return HttpHandler.Get('/api/admin/posts/latest', params)
	},
	/**
	 * 根据状态查询文章列表
	 * @param {String} status:"DRAFT" "INTIMATE" "PUBLISHED" "RECYCLE"
	 * @param {Object} params:{ page,size,sort,more }
	 */
	getPostsPageByStatus: (status, params) => {
		return HttpHandler.Get(`/api/admin/posts/status/${status}`, params)
	},

	/**
	 * 根据文章id获取文章
	 * @param {Number} postsId 文章id 
	 */
	getPostsById: (postsId) => {
		return HttpHandler.Get(`/api/admin/posts/${postsId}`)
	},

	/**
	 * 新增文章 
	 * @param {Object} data 同新增  
	 * @param {Boolean} isAutoSave 是否来源于自动保存  
	 */
	createPosts: (data, isAutoSave = false) => {
		return HttpHandler.Post(`/api/admin/posts?autoSave=${isAutoSave}`, data)
	},

	/**
	 * 修改文章
	 * @param {Number} postsId id
	 * @param {Object} data 同新增  
	 * @param {Boolean} isAutoSave 是否来源于自动保存  
	 */
	updatePostsById: (postsId, data, isAutoSave = false) => {
		return HttpHandler.Put(`/api/admin/posts/${postsId}?autoSave=${isAutoSave}`, data)
	},

	/**
	 * 修改文章（草稿）
	 * @param {Number} postsId id
	 * @param {Object} data { content,keepRaw,originalContent }  
	 */
	updatePostsDraftById: (postsId, data) => {
		return HttpHandler.Put(`/api/admin/posts/${postsId}/status/draft/content`, data)
	},

	/**
	 * 修改文章状态
	 * @param {Number} postsId id
	 * @param {String} status  "DRAFT" "INTIMATE" "PUBLISHED" "RECYCLE"  
	 */
	updatePostsDraftById: (postsId, status) => {
		return HttpHandler.Put(`/api/admin/posts/${postsId}/status/${status}`)
	},

	/**
	 * 删除文章(批量)
	 * @param {Array} postsIds  ids
	 */
	deletePostsByIds: (postsIds) => {
		return HttpHandler.Delete(`/api/admin/posts`, postsIds)
	},
}
