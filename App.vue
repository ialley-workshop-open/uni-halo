<script>
	import HaloTokenConfig from '@/config/token.config.js';
	import HaloConfig from '@/config/halo.config.js';
	import HaloAdConfig from '@/config/ad.config.js';

	// app升级检测（搭配：https://ext.dcloud.net.cn/plugin?id=4470 升级中心）
	import CheckAppUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update';
	import {
		CheckWxUpdate
	} from '@/utils/update.js';
	export default {
		globalData: {
			baseApiUrl: HaloTokenConfig.BASE_API,
			...HaloConfig,
			haloAdConfig: HaloAdConfig
		},
		onLaunch: function() {
			console.log('App Launch');

			// #ifdef APP-PLUS
			CheckAppUpdate();
			// #endif

			// #ifdef MP-WEIXIN
			CheckWxUpdate();
			uni.$tm.vx.commit('setWxShare', HaloConfig.wxShareConfig);
			// #endif

			// 监听中间按钮(暂时没有使用)
			uni.onTabBarMidButtonTap(() => {
				console.log('点击中间按钮');
			});

			// 初始化博主信息
			uni.$tm.vx.actions('blogger/fnGetBlogger');

			// 临时：检查是否有用户，没有的话添加一个默认的用户
			uni.$tm.vx.actions('user/checkAndSetDefaultUser');

			// 启动检查app的配置是否已经就绪，若未就绪则设置默认的
			uni.$tm.vx.actions('setting/checkAndSetDefaultAppSettings');
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		}
	};
</script>

<style lang="scss">
	// 基础样式
	@import './common/styles/app.theme.scss';
	@import './common/styles/app.base.scss';

	// 引入tmUI2.x样式
	@import './tm-vuetify/mian.min.css';
	// 引入tmUI2.x主题包
	@import './tm-vuetify/scss/theme.css';
	// 引入tmUI2.x预置图标
	@import './tm-vuetify/scss/fonts/fontawesome_base64.css';

	// 自定义图标
	@import './common/icons/halocoloriconfont.css';
	@import './common/icons/haloiconfont.css';
	@import './common/icons/mphtmliconfont.css';

	/* #ifndef MP-WEIXIN */
	@import './common/markdown/markdown.scss';
	/* #endif */

	page {
		background-color: #fafafa;
	}
</style>