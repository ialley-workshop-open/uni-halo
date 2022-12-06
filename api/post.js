/**
 * 文章接口
 * @see https://api.halo.run/content-api.html#tag/post-controller
 */

import HttpHandler from '@/common/http/request.js'

export default {
	/**
	 * 获取文章列表
	 * @param {Object} params 参数 
	 */
	getPostList: (params) => {
		return HttpHandler.Get(`/api/content/posts`, params)
	},

	/**
	 * 评论文章
	 * @param {Object} data 数据 
	 * {
	 *		  "allowNotification": true,
	 *		  "author": "string",
	 *		  "authorUrl": "string",
	 *		  "content": "string",
	 *		  "email": "string",
	 *		  "parentId": 0,
	 *		  "postId": 0
	 * }
	 */
	postCommentPost: (data) => {
		return HttpHandler.Post(`/api/content/posts/comments`, data)
	},

	/**
	 * 搜索文章
	 * @param {Object} data 数据 
	 */
	getPostListByKeyword: (data) => {
		return HttpHandler.Post(`/api/content/posts/search`, data)
	},

	/**
	 * 根据分类获取文章
	 * @param {Object} params 参数 
	 */
	getPostDetailBySlug: (params) => {
		return HttpHandler.Get(`/api/content/posts/slug`, params)
	},

	/**
	 * 根据文章id获取文章
	 * @param {Object} params 参数 
	 */
	getPostDetailByPostId: (postId, params) => {
		return HttpHandler.Get(`/api/content/posts/${postId}`, params)
	},

	/**
	 * 给文章点赞
	 * @param {Object} postId 文章id 
	 */
	postLikePost: (postId) => {
		return HttpHandler.Post(`/api/content/posts/${postId}/likes`)
	},

	/**
	 * 根据当前文章id获取前一篇文章
	 * @param {Object} postId 文章id 
	 */
	getPrevByCurrentPostId: (postId) => {
		return HttpHandler.Get(`/api/content/posts/${postId}/prev`)
	},

	/**
	 * 根据当前文章id获取下一篇文章
	 * @param {Object} postId 文章id 
	 */
	getNextByCurrentPostId: (postId) => {
		return HttpHandler.Get(`/api/content/posts/${postId}/next`)
	},

}
