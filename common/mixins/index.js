/**
 *  功能：全局混入函数
 *  作者：小莫唐尼
 *  邮箱：studio@925i.cn
 *  时间：2022年07月21日 17:39:32
 *  版本：v0.1.0
 *  修改记录：
 *  修改内容：
 *  修改人员：
 *  修改时间：
 */

export default {
    install(Vue) {
        Vue.mixin({
            data() {
                return {
                    _isWechat: true,
                    _aniWaitIndex: 0
                };
            },
            computed: {
                haloConfig() {
                    return this.$tm.vx.getters().getConfigs;
                },
                haloPluginsConfig() {
                    return this.$tm.vx.getters().getConfigs?.pluginConfig;
                },
                // 获取全局应用设置
                globalAppSettings() {
                    return uni.$tm.vx.getters().getSettings;
                },
                // 计算动画索引
                calcAniWait() {
                    return (index) => {
                        if ((index + 1) % 10 === 0) {
                            this._aniWaitIndex = 1;
                        } else {
                            this._aniWaitIndex += 1;
                        }
                        return this._aniWaitIndex * 50
                    }
                }
            },
            onLoad() {
                this.fnResetSetAniWaitIndex()
            },
            created() {
                // #ifdef MP-WEIXIN
                this._isWechat = true;
                // #endif
                // #ifndef MP-WEIXIN
                this._isWechat = false;
                // #endif
            },
            onShow() {
                this.fnResetSetAniWaitIndex()
            },
            methods: {
                // 设置页面标题
                fnSetPageTitle(title) {
                    uni.setNavigationBarTitle({
                        title: title || this.haloConfig?.appConfig?.startConfig?.title || "uni-halo",
                    })
                },

                // 页面返回顶部
                fnToTopPage(duration = 500) {
                    duration = isNaN(duration) ? 500 : duration
                    uni.pageScrollTo({
                        scrollTop: 0,
                        duration: duration,
                        fail: (err) => {
                            console.log('err：', err);
                        },
                    });
                },
                // 初始化动画索引值（需要在每个页面调用）
                fnResetSetAniWaitIndex() {
                    this._aniWaitIndex = 0
                }
            },
        });
    },
};
