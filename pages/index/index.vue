<template>
    <view class="app-page"></view>
</template>

<script>
const homePagePath = '/pages/tabbar/home/home'
const startPagePath = '/pagesA/start/start'
export default {
    computed: {
        configs() {
            return this.$tm.vx.getters().getConfigs;
        }
    },
    onLoad() {
        uni.$tm.vx.actions('config/fetchConfigs').then((res) => {
            // #ifdef MP-WEIXIN
            uni.$tm.vx.commit('setWxShare', res.shareConfig);
            // #endif
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
        }
    }
};
</script>
