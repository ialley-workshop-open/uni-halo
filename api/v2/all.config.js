import HttpHandler from '@/common/http/request.js'

export default {
    /**
     * 获取应用基本配置
     */
    getAppConfigs: () => {
        return HttpHandler.Get(`/apis/api.uni.uhalo.pro/v1alpha1/plugins/plugin-uni-halo/getConfigs`, {})
    },
}
