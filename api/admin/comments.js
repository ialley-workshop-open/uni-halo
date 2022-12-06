/**
 * 文章评论管理
 * @see https://api.halo.run/admin-api.html#tag/journal-controller
 */
import HttpHandler from '@/common/http/request.js'

export default {
	/**
	 * 查询文章评论
	 * {
	 *	"keyword":"",    // 关键字
	 *	"page": 0,       // 分页索引
	 *	"size": 10,      // 分页大小
	 *	"sort": ["",""], // 排序
	 *	"status": "" ,    // 类型  "AUDITING" "PUBLISHED" "RECYCLE"
	 * }
	 */
	getPostsComments: (params) => {
		return HttpHandler.Get('/api/admin/posts/comments', params)
	},

	/**
	 * 回复文章评论
	 * {
	 *  "allowNotification": true,
	 *  "author": "string",
	 *  "authorUrl": "string",
	 *  "content": "string",
	 *  "email": "string",
	 *  "parentId": 0,
	 *  "postId": 0
	 * }
	 */
	postPostsComments: (data) => {
		return HttpHandler.Post('/api/admin/posts/comments', data)
	},
	/**
	 * 更新文章评论状态
	 * @param {Number} commentId  id
	 * @param {String} status   "AUDITING" "PUBLISHED" "RECYCLE"
	 */
	updatePostsCommentsStatus: (commentId, status) => {
		return HttpHandler.Put(`/api/admin/posts/comments/${commentId}/status/${status}`)
	},
	/**
	 * 删除文章评论
	 * @param {Number} commentId  id
	 */
	deletePostsCommentsById: (commentId) => {
		return HttpHandler.Delete(`/api/admin/posts/comments/${commentId}`)
	},

	/**
	 * 查询页面评论
	 * {
	 *	"keyword":"",    // 关键字
	 *	"page": 0,       // 分页索引
	 *	"size": 10,      // 分页大小
	 *	"sort": ["",""], // 排序
	 *	"status": "" ,    // 类型  "AUDITING" "PUBLISHED" "RECYCLE"
	 * }
	 */
	getSheetsComments: (params) => {
		return HttpHandler.Get('/api/admin/sheets/comments', params)
	},

	/**
	 * 回复页面评论
	 * {
	 *  "allowNotification": true,
	 *  "author": "string",
	 *  "authorUrl": "string",
	 *  "content": "string",
	 *  "email": "string",
	 *  "parentId": 0,
	 *  "postId": 0
	 * }
	 */
	postSheetsComments: (data) => {
		return HttpHandler.Post('/api/admin/sheets/comments', data)
	},
	/**
	 * 更新页面评论状态
	 * @param {Number} commentId  id
	 * @param {String} status   "AUDITING" "PUBLISHED" "RECYCLE"
	 */
	updateSheetsCommentsStatus: (commentId, status) => {
		return HttpHandler.Put(`/api/admin/sheets/comments/${commentId}/status/${status}`)
	},
	/**
	 * 删除页面评论
	 * @param {Number} commentId  id
	 */
	deleteSheetsCommentsById: (commentId) => {
		return HttpHandler.Delete(`/api/admin/sheets/comments/${commentId}`)
	},

	/**
	 * 查询日记评论
	 * {
	 *	"keyword":"",    // 关键字
	 *	"page": 0,       // 分页索引
	 *	"size": 10,      // 分页大小
	 *	"sort": ["",""], // 排序
	 *	"status": "" ,    // 类型  "AUDITING" "PUBLISHED" "RECYCLE"
	 * }
	 */
	getJournalsComments: (params) => {
		return HttpHandler.Get('/api/admin/journals/comments', params)
	},

	/**
	 * 回复日记评论
	 * {
	 *  "allowNotification": true,
	 *  "author": "string",
	 *  "authorUrl": "string",
	 *  "content": "string",
	 *  "email": "string",
	 *  "parentId": 0,
	 *  "postId": 0
	 * }
	 */
	postJournalsComments: (data) => {
		return HttpHandler.Post('/api/admin/journals/comments', data)
	},
	/**
	 * 更新日记评论状态
	 * @param {Number} commentId  id
	 * @param {String} status   "AUDITING" "PUBLISHED" "RECYCLE"
	 */
	updateJournalsCommentsStatus: (commentId, status) => {
		return HttpHandler.Put(`/api/admin/journals/comments/${commentId}/status/${status}`)
	},
	/**
	 * 删除日记评论
	 * @param {Number} commentId  id
	 */
	deleteJournalsCommentsById: (commentId) => {
		return HttpHandler.Delete(`/api/admin/journals/comments/${commentId}`)
	},
}
