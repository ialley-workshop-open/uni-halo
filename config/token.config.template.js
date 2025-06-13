import {getAppConfigs} from "@/config/index";

/** 配置后台管理员token */
const HaloTokenConfig = Object.freeze({

	/** 基础请求域名：你的Halo博客基础域名 */
	BASE_API: "",
	// BASE_API: "https://blog.xiaoxiaomo.cn",


	/** 管理员token */
	systemToken: getAppConfigs()?.basicConfig?.tokenConfig?.personalToken,
	/** 匿名用户token */
	anonymousToken: ``
})


export default HaloTokenConfig;
