/**
 * 评论接口
 *  @see https://api.halo.run/content-api.html#tag/post-controller
 */
import HttpHandler from '@/common/http/request.js'

export default {
	/**
	 * 获取评论列表接口（树形数据）
	 * @param {String} postId  文章id 
	 * @param {Object} params  查询参数
	 */
	getPostCommentTree: (postId, params) => {
		return HttpHandler.Get(`/api/content/posts/${postId}/comments/tree_view`, params)
	},

	/**
	 * 获取评论列表接口（列表数据）
	 * @param {String} name  文章id 
	 * @param {Object} params  查询参数
	 */
	getPostCommentList: (name, params) => {
		return HttpHandler.Get(`/apis/content.halo.run/v1alpha1/comments${name}`, params)
	},

	/**
	 * 获取置顶评论
	 * @param {String} postId  文章id 
	 * @param {Object} params  查询参数
	 */
	getPostTopCommentList: (postId, params) => {
		return HttpHandler.Get(`/api/content/posts/${postId}/comments/top_view`, params)
	},


	/**
	 * 获取评论的子评论列表
	 * @param {String} postId  文章id 
	 * @param {String} commentParentId  要获取的评论id
	 * @param {Object} params  查询参数
	 */
	getPostChildrenCommentList: (postId, commentParentId, params) => {
		return HttpHandler.Get(`/api/content/posts/${postId}/comments/${commentParentId}/children`, params)
	},
}