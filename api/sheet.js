/**
 * 自定义页面模板
 * @see https://api.halo.run/content-api.html#tag/sheet-controller
 */

import HttpHandler from '@/common/http/request.js'

export default {
	/**
	 * 获取页面列表
	 * {
	 *	 page:
	 *	 size:
	 *	 sort:
	 * }
	 */
	getSheetsList: (params) => {
		return HttpHandler.Get(`/api/content/sheets`, params)
	},

	/**
	 * 根据分类获取页面数据
	 */
	getSheetsListBySlug: (params) => {
		return HttpHandler.Get(`/api/content/sheets/slug`, params)
	},

	/**
	 * 获取页面评论（列表）
	 */
	getSheetsCommentsListBySheetId: (sheetId, params) => {
		return HttpHandler.Get(`/api/content/sheets/${sheetId}/comments/list_view`, params)
	},
	/**
	 * 获取页面评论（树形）
	 */
	getSheetsCommentsTreeBySheetId: (sheetId, params) => {
		return HttpHandler.Get(`/api/content/sheets/${sheetId}/comments/tree_view`, params)
	},


	/**
	 * 获取评论的子评论列表
	 * @param {String} sheetId  页面id 
	 * @param {String} commentParentId  要获取的评论id
	 * @param {Object} params  查询参数
	 */
	getSheetsChildrenCommentList: (sheetId, commentParentId, params) => {
		return HttpHandler.Get(`/api/content/sheets/${sheetId}/comments/${commentParentId}/children`, params)
	},

	/**
	 * 给页面添加一个评论 
	 * {
	 *	  "allowNotification": true,
	 *	  "author": "string",
	 *	  "authorUrl": "string",
	 *	  "content": "string",
	 *	  "email": "string",
	 *	  "parentId": 0,
	 *	  "postId": 0
	 *	}
	 */
	postSheetsComments: (data) => {
		return HttpHandler.Post(`/api/content/sheets/comments`, data)
	},
}
