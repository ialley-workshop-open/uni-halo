/**
 * 附件管理
 * @see https://api.halo.run/admin-api.html#tag/attachment-controller
 */
import HttpHandler from '@/common/http/request.js'

export default {
	/**
	 * 分页获取附件列表
	 * {
	 *	"attachmentType": "ALIOSS" "BAIDUBOS" "HUAWEIOBS" "LOCAL" "MINIO" "QINIUOSS" "SMMS" "TENCENTCOS" "UPOSS",
	 *	"keyword": "string"
	 *	"mediaType": "string"
	 *	"page": "string"
	 *	"size": "string"
	 *	"sort": "string"
	 * }
	 */
	getAttachmentsByPage: (params) => {
		return HttpHandler.Get('/api/admin/attachments', params, {})
	},

	/**
	 * 获取所有的附件类型
	 */
	getAttachmentsMediaTypes: () => {
		return HttpHandler.Get('/api/admin/attachments/media_types')
	},

	/**
	 * 根据附件类型获取所有的附件列表
	 */
	getAttachmentsTypes: () => {
		return HttpHandler.Get('/api/admin/attachments/types')
	},

	/**
	 * 根据附件Id获取附件详情
	 */
	getAttachmentsById: (attachmentId) => {
		return HttpHandler.Get(`/api/admin/attachments/${attachmentId}`)
	},

	/**
	 * 上传附件-单文件(file)
	 * {
	 *	 file:文件对象
	 * }
	 */
	uploadAttachment: (data) => {
		return HttpHandler.Upload(`/api/admin/attachments/upload`, data)
	},

	/**
	 * 上传附件-多文件(files)
	 * {
	 *	 files:文件对象集合
	 * }
	 */
	uploadAttachments: (data) => {
		return HttpHandler.Upload(`/api/admin/attachments/uploads`, data)
	},

	/**
	 * 修改一个附件信息
	 */
	updateAttachmentById: (attachmentId, name) => {
		return HttpHandler.Put(`/api/admin/attachments/${attachmentId}`, {
			name: name
		})
	},

	/**
	 * 批量删除附件（id集合）
	 */
	deleteAttachmentByIds: (attachmentIds = []) => {
		return HttpHandler.Delete(`/api/admin/attachments`, attachmentIds)
	},

	/**
	 *  删除单个附件 
	 */
	deleteAttachmentById: (attachmentId) => {
		return HttpHandler.Delete(`/api/admin/attachments/${attachmentId}`)
	},
}
