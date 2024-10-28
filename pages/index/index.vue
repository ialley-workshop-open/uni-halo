<template>
    <view class="app-page"></view>
</template>

<script>
const homePagePath = '/pages/tabbar/home/home'
const startPagePath = '/pagesA/start/start'
const articleDetailPath = '/pagesA/article-detail/article-detail';
export default {
    computed: {
        configs() {
            return this.$tm.vx.getters().getConfigs;
        }
    },
    onLoad: function (options) {
        uni.$tm.vx.actions('config/fetchConfigs').then(async (res) => {
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
            if (res.basicConfig.auditModeEnabled) {
                await uni.$tm.vx.actions('config/fetchMockJson')
            }

            // 进入检查
            this.fnCheckShowStarted();
        }).catch((err) => {
            uni.switchTab({
                url: homePagePath
            });
        })
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
                uni.removeStorageSync('APP_HAS_STARTED')
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
