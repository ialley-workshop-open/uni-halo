import {getAppConfigs} from "@/config/index";

/** 应用配置 */
const UniHaloConfig = Object.freeze({

	/** 基础请求域名：你的Halo博客基础域名 */
	BASE_API: "",
	// 比如：
	// BASE_API: "https://blog.xiaoxiaomo.cn",

	// token
	systemToken: getAppConfigs()?.basicConfig?.tokenConfig?.personalToken,
})

export default UniHaloConfig;
