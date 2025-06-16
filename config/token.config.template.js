import {getAppConfigs} from "@/config/index";

/** 配置博客的内容 */
const UniHaloConfig = Object.freeze({

	/** 基础请求域名：你的Halo博客基础域名 */
	BASE_API: "",
	// BASE_API: "https://blog.xiaoxiaomo.cn",

	systemToken: getAppConfigs()?.basicConfig?.tokenConfig?.personalToken,
})

export default UniHaloConfig;
