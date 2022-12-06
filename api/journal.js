/**
 * 日记接口
 * @see https://api.halo.run/content-api.html#tag/journal-controller
 */

import HttpHandler from '@/common/http/request.js'

export default {
	/**
	 * 获取日记列表
	 * @param {String} journalId 日记id  
	 */
	getJournals: () => {
		return HttpHandler.Get(`/api/content/journals`)
	},

	/**
	 * 获取日记详情
	 * @param {String} journalId 日记id  
	 */
	getJournalDetail: (journalId) => {
		return HttpHandler.Get(`/api/content/journals/${journalId}`)
	},

	/**
	 * 获取日记置顶评论列表
	 * @param {String} journalId 日记id  
	 */
	getJournalTopComments: (journalId) => {
		return HttpHandler.Get(`/api/content/journals/${journalId}/comments/top_view`)
	},

	/**
	 * 获取日记评论列表（列表形式）
	 * @param {String} journalId 日记id  
	 */
	getJournalCommentList: (journalId) => {
		return HttpHandler.Get(`/api/content/journals/${journalId}/comments/list_view`)
	},

	/**
	 * 获取日记评论列表（树形式）
	 * @param {String} journalId 日记id  
	 */
	getJournalCommentTree: (journalId) => {
		return HttpHandler.Get(`/api/content/journals/${journalId}/comments/tree_view`)
	},

	/**
	 * 获取日记评论列表（树形式）
	 * @param {String} journalId 日记id  
	 * @param {String} commentParentId 评论id  
	 */
	getJournalCommentChildren: (journalId, commentParentId) => {
		return HttpHandler.Get(
			`/api/content/journals/${journalId}/comments/${commentParentId}/children`)
	},

	/**
	 * 发表日记评论
	 * @param {Object} data 评论数据  
	 */
	postJournalComments: (data) => {
		return HttpHandler.Post(`/api/content/journals/comments`, data)
	},

	/**
	 * 给日记点赞
	 * @param {String} journalId 日记id  
	 */
	postJournalLikes: (journalId) => {
		return HttpHandler.Post(`/api/content/journals/${journalId}/likes`)
	},
}
