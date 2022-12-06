/**
 *  功能：路由权限和拦截
 *  作者：小莫唐尼
 *  邮箱：studio@925i.cn
 *  时间：2022年07月21日 18:05:24
 *  版本：v0.1.0
 *  修改记录：
 *  修改内容：
 *  修改人员：
 *  修改时间：
 */

/**
 * @description 自定义路由拦截
 */

import {
	checkHasAdminLogin
} from "./auth.js";
// 白名单
const whiteList = [
	"/", // 注意入口页必须直接写 '/'
	{
		pattern: /^\/pages\/list.*/
	}, // 支持正则表达式
	{
		pattern: /^\/pages\/guidePage.*/
	}, // 支持正则表达式
	{
		pattern: /^\/pages\/login\/*/
	},
];

export default async function() {
	const list = ["navigateTo", "redirectTo", "reLaunch", "switchTab"];
	// 用遍历的方式分别为,uni.navigateTo,uni.redirectTo,uni.reLaunch,uni.switchTab这4个路由方法添加拦截器
	list.forEach((item) => {
		uni.addInterceptor(item, {
			invoke(e) {
				// 获取要跳转的页面路径（url去掉"?"和"?"后的参数）
				const url = e.url.split("?")[0];
				// 判断当前窗口是白名单，如果是则不重定向路由
				let pass;
				if (whiteList) {
					pass = whiteList.some((item) => {
						if (typeof item === "object" && item.pattern) {
							return item.pattern.test(url);
						}
						return url === item;
					});
				}

				// 不是白名单并且没有token
				if (!pass && !checkHasAdminLogin()) {
					uni.showModal({
						title: "未登录",
						content: "当前未登录，是否前往登录？",
						showCancel: true,
						success: ({
							confirm,
							cancel
						}) => {
							if (confirm) {
								uni.navigateTo({
									url: "/pages/login/login",
								});
							}
						},
					});
					return false;
				}
				return e;
			},
			fail(err) {
				// 失败回调拦截
				console.log(err);
			},
		});
	});
}
