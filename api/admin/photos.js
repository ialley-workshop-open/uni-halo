/**
 * 图库管理
 * @see https://api.halo.run/admin-api.html#tag/photo-controller
 */
import HttpHandler from '@/common/http/request.js'

export default {
	/**
	 * 查询图片列表
	 * {
	 *	"sort": ["",""], // 排序
	 *	"more": "Boolean" ,// 更多参数（回调）
	 * }
	 */
	getPhotos: (params) => {
		return HttpHandler.Get('/api/admin/photos', params)
	},

	/**
	 * 查询最近的图库列表(树形数据)
	 * {
	 *	"sort": ["",""], // 排序
	 * }
	 */
	getLatestPhotos: (params) => {
		return HttpHandler.Get('/api/admin/photos/latest', params)
	},

	/**
	 * 查询所有的图片分组 
	 */
	getPhotosTeams: () => {
		return HttpHandler.Get('/api/admin/photos/teams')
	},

	/**
	 * 查询图片详情 
	 * @param {Number} photoId id
	 */
	getPhotosDetail: (photoId) => {
		return HttpHandler.Get(`/api/admin/photos/${photoId}`)
	},

	/**
	 * 新增图片（单图）
	 *{
	 *  "description": "string",
	 *  "id": 0,
	 *  "location": "string",
	 *  "name": "string",
	 *  "takeTime": "2019-08-24T14:15:22Z",
	 *  "team": "string",
	 *  "thumbnail": "string",
	 *  "url": "string"
	 *}
	 */
	createPhotos: (data) => {
		return HttpHandler.Post(`/api/admin/photos`, data)
	},

	/**
	 * 新增图片（批量）
	 *	{
	 *	  "description": "string",
	 *	  "id": 0,
	 *	  "location": "string",
	 *	  "name": "string",
	 *	  "takeTime": "2019-08-24T14:15:22Z",
	 *	  "team": "string",
	 *	  "thumbnail": "string",
	 *	  "url": "string"
	 *	}
	 */
	createPhotosBatch: (data) => {
		return HttpHandler.Post(`/api/admin/photos/batch`, data)
	},

	/**
	 * 修改图片信息
	 * @param {Number} photoId id
	 * @param {Object} data 同新增  
	 */
	updatePhotosById: (photoId, data) => {
		return HttpHandler.Put(`/api/admin/photos/${photoId}`, data)
	},

	/**
	 * 删除单张图片
	 * @param {Number} photoId id
	 */
	deletePhotosById: (photoId) => {
		return HttpHandler.Delete(`/api/admin/photos/${photoId}`)
	},
	/**
	 * 批量删除图片
	 * @param {Number} photoIds id数组
	 */
	deletePhotosBatchById: (photoIds) => {
		return HttpHandler.Delete(`/api/admin/photos/batch`, photoIds)
	},
}
