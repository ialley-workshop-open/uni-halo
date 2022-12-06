/**
 * 个人日记管理
 * @see https://api.halo.run/admin-api.html#tag/journal-controller
 */
import HttpHandler from '@/common/http/request.js'

export default {
	/**
	 * 查询所有的日记列表
	 * {
	 *	"keyword":"",    // 关键字
	 *	"page": 0,       // 分页索引
	 *	"size": 10,      // 分页大小
	 *	"sort": ["",""], // 排序
	 *	"type": "" ,     // 类型 "INTIMATE" "PUBLIC"
	 * }
	 */
	getJournals: (params) => {
		return HttpHandler.Get('/api/admin/journals', params)
	},

	/**
	 * 查询最近的所有的日记列表
	 * {
	 *	"top":number, // 数量
	 * }
	 */
	getLatestJournals: (params) => {
		return HttpHandler.Get('/api/admin/journals/latest', params)
	},

	/**
	 * 新增个人日记
	 * {
	 *	  "content": "string",
	 *	  "keepRaw": true,
	 *	  "sourceContent": "string",
	 *	  "type": "INTIMATE", 
	 * }
	 */
	createJournals: (data) => {
		return HttpHandler.Post(`/api/admin/journals`, data)
	},

	/**
	 * 修改个人日记信息
	 * @param {Number} journalsId id
	 * @param {Object} data 同新增  
	 */
	updateJournalsById: (journalsId, data) => {
		return HttpHandler.Put(`/api/admin/journals/${journalsId}`, data)
	},

	/**
	 * 删除个人日记
	 * @param {Number} journalsId  id
	 */
	deleteJournalsById: (journalsId) => {
		return HttpHandler.Delete(`/api/admin/journals/${journalsId}`)
	},
}
