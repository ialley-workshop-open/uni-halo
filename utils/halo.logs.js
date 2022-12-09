/**
 * 日志工具
 */
const LOG_NAME = 'APP_CONFIG_LOG'

export const logTypes = {
	config: 'BASE_CONFIG'
}
export const logTypesMap = {
	BASE_CONFIG: '基础配置'
}
export const logUtils = {
	/**
	 * 保存日志信息
	 * @param {Object} type 日志类型
	 * @param {Object} msg 日志信息
	 */
	saveLog(type, data) {
		const {
			msg,
			page,
			path
		} = data;
		let _logs = this.getLogs()
		const logMsgObj = {
			time: new Date().getTime(),
			type: type,
			typeText: logTypesMap[type],
			page: page || '',
			path: path || '',
			msg: msg
		}
		_logs.push(logMsgObj)
		uni.setStorageSync(LOG_NAME, JSON.stringify(_logs))
	},

	/**
	 * 获取所有的日志
	 */
	getLogs() {
		let _logs = uni.getStorageSync(LOG_NAME)
		return _logs ? JSON.parse(_logs) : [];
	},

	/**
	 * 删除所有日志
	 */
	removeLogs() {
		uni.removeStorageSync(LOG_NAME)
	},
}
