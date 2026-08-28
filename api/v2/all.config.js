import HttpHandler from '@/common/http/request.js'

export default {
    /**
     * 获取应用基本配置
     */
    getAppConfigs: () => {
        return HttpHandler.Get(`/apis/api.uni.uhalo.pro/v1alpha1/plugins/plugin-uni-halo/getConfigs`, {})
    },
	
	/** 获取全局配置信息 */
	getHaloGlobalInfo: () => {
		return HttpHandler.Get(`/actuator/globalinfo`, {})
	},
	
	/** 获取评论组件配置 */
	getCommentWidgetConfig: () => {
		return HttpHandler.Get(`/apis/api.commentwidget.halo.run/v1alpha1/config`, {})
	},
}
