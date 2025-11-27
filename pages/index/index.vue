<template>
	<view class="app-page flex flex-center">
		<PluginUnavailable v-if="!uniHaloPluginAvailable" :pluginId="uniHaloPluginId" :error-text="uniHaloPluginAvailableError" :use-border="false" :use-decoration="false" />
	</view>
</template>

<script>
import pluginAvailableMixin from '@/common/mixins/pluginAvailable.js';
import PluginUnavailable from '@/components/plugin-unavailable/plugin-unavailable.vue';

const homePagePath = '/pages/tabbar/home/home';
const startPagePath = '/pagesA/start/start';
const articleDetailPath = '/pagesA/article-detail/article-detail';

const _DEV_ = false;
const _DEV_TO_TYPE_ = 'page';
const _DEV_TO_PATH_ = '/pagesA/data-visual/data-visual';

export default {
	mixins: [pluginAvailableMixin],
	components: {
		PluginUnavailable
	},
	computed: {
		configs() {
			return this.$tm.vx.getters().getConfigs;
		}
	},
	async onLoad(options) {
		// 本地开发，快速跳转页面，发布请设置 _DEV_ = false
		if (_DEV_ && _DEV_TO_PATH_) {
			if (_DEV_TO_TYPE_ == 'tabbar') {
				uni.switchTab({
					url: _DEV_TO_PATH_
				});
			} else if (_DEV_TO_TYPE_ == 'page') {
				uni.navigateTo({
					url: _DEV_TO_PATH_
				});
			}
			return;
		}

		// 检查插件
		this.setPluginId(this.NeedPluginIds.PluginUniHalo);
		this.setPluginError('阿偶，检测到当前插件没有安装或者启用，无法启动 uni-halo 哦，请联系管理员');
		if (!(await this.checkPluginAvailable())) return;

		// 获取配置
		uni.$tm.vx
			.actions('config/fetchConfigs')
			.then(async (res) => {
				if (options.scene) {
					if ('' !== options.scene) {
						const postId = await this.getPostIdByQRCode(options.scene);
						if (postId) {
							uni.redirectTo({
								url: articleDetailPath + `?name=${postId}`,
								animationType: 'slide-in-right'
							});
						}
					}
				}

				// #ifdef MP-WEIXIN
				// uni.$tm.vx.commit('setWxShare', res.shareConfig);
				// #endif

				// 获取mockjson
				if (res.auditConfig.auditModeEnabled) {
					if (res.auditConfig.auditModeData.jsonUrl) {
						await uni.$tm.vx.actions('config/fetchMockJson');
					} else {
						const mockJson = uni.$utils.checkJsonAndParse(res.auditConfig.auditModeData.jsonData);
						if (mockJson.ok) {
							uni.$tm.vx.commit('config/setMockJson', mockJson.jsonData);
						}
					}
				}

				// 进入检查
				this.fnCheckShowStarted();
			})
			.catch((err) => {
				uni.switchTab({
					url: homePagePath
				});
			});
	},
	methods: {
		fnCheckShowStarted() {
			if (!this.configs.appConfig.startConfig.enabled) {
				uni.switchTab({
					url: homePagePath
				});
				return;
			}

			// 是否每次都显示启动页
			if (this.configs.appConfig.startConfig.alwaysShow) {
				uni.removeStorageSync('APP_HAS_STARTED');
				uni.redirectTo({
					url: startPagePath
				});
				return;
			}

			// 只显示一次启动页
			if (uni.getStorageSync('APP_HAS_STARTED')) {
				uni.switchTab({
					url: homePagePath
				});
			} else {
				uni.redirectTo({
					url: startPagePath
				});
			}
		},
		async getPostIdByQRCode(key) {
			const response = await this.$httpApi.v2.getQRCodeInfo(key);
			if (response) {
				if (response && response.postId) {
					return response.postId;
				}
			}
			return null;
		}
	}
};
</script>

<style lang="scss" scoped>
.app-page {
	width: 100vw;
	height: 100vh;
}
</style>
