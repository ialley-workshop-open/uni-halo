/**
 * 日志管理
 * @see https://api.halo.run/admin-api.html#tag/link-controller
 */
import HttpHandler from '@/common/http/request.js'

export default {
	/**
	 * 获取日志列表列表
	 * params:{ top: Number}
	 */
	getLogsLatestList: (params) => {
		return HttpHandler.Get('/api/admin/logs/latest', params)
	},
	/**
	 * 获取日志列表列表
	 * params:{ page:Number,size:Number, sort:String }
	 */
	getLogsListByPage: (params) => {
		return HttpHandler.Get('/api/admin/logs', params)
	},
	/**
	 * 清空日志
	 */
	deleteAllLogs: () => {
		return HttpHandler.Get(`/api/admin/logs/clear`)
	},
}
