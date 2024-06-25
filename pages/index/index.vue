<template>
    <view class="app-page"></view>
</template>

<script>
export default {
    computed: {
        configs() {
            return this.$tm.vx.getters().getConfigs;
        }
    },
    onLoad() {
        uni.$tm.vx.actions('config/fetchConfigs').then((res) => {
            console.log('正常：', res)
            // #ifdef MP-WEIXIN
            uni.$tm.vx.commit('setWxShare', res.shareConfig);
            // #endif
            this.fnCheckShowStarted();
        }).catch((err) => {
            console.log('异常：', err)
            uni.switchTab({
                url: '/pages/tabbar/home/home'
            });
        })
    },
    methods: {
        fnCheckShowStarted() {
            if (!this.configs.startConfig.enabled) {
                uni.switchTab({
                    url: '/pages/tabbar/home/home'
                });
                return;
            }
            if (uni.getStorageSync('APP_HAS_STARTED')) {
                uni.switchTab({
                    url: '/pages/tabbar/home/home'
                });
            } else {
                uni.redirectTo({
                    url: '/pagesA/start/start'
                });
            }
        }
    }
};
</script>
