/** 插件相关配置 */
const PluginsConfig = Object.freeze({
    // 友链提交配置
    autoSubmitLink: {
        // 可以考虑配置一个插件id，检测是否开启了友链提交插件
        pluginId:"",
        // 是否开启（可能不启用插件）
        enabled: false,
        // 我的友链信息
        blogDetail: {
            // 博客名称
            name: "uni-halo 博客",
            // 博客地址
            url: "https://uni-halo.925i.cn/",
            // 博客logo
            logo: "https://uni-halo.925i.cn/logo.png",
            // 博客简介
            description: "一个基于Halo2.0 API 的博客小程序开源项目。",
        }
    }
})


export default PluginsConfig;
