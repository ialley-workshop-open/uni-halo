/**
 * 封装各种请求方式
 */
import {
	http
} from '@/common/http/index.js'

export default {
	Get: (url, params, config = {}) => {
		return http.get(url, {
			params,
			...config 
		})
	},
	Post: (url, data, config = {}) => {
		return http.post(url, data, config)
	},
	Put: (url, data, config = {}) => {
		return http.put(url, data, config)
	},
	Upload: (url, config = {}) => {
		return http.upload(url, config)
	},
	Delete: (url, data, config = {}) => {
		return http.delete(url, data, config)
	}
}