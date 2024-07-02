<template>
    <tm-fullView>
        <tm-sheet :shadow="24">
            <tm-alerts label="观看视频即可获取注册码" close></tm-alerts>
            <tm-divider color="red" model="dashed" :text="codeDataShow?'请复制下方注册码':'请点击“获取注册码”'"></tm-divider>
            <view class="ma-20" v-show="!codeDataShow">
                <tm-button theme="bg-gradient-orange-accent" :round="24" block @click="openVideoAd">获取注册码</tm-button>
            </view>
            <view class="ma-20" v-show="codeDataShow">
                <tm-coupon :hdata="codeData" color="orange" @click="fnCopyCode"></tm-coupon>
            </view>
        </tm-sheet>
        <!-- 		<tm-sheet :shadow="24">
            <tm-images @load="loadimg" src="https://picsum.photos/300?id=7"></tm-images>
        </tm-sheet> -->
    </tm-fullView>

</template>

<script>
let videoAd = null;
import tmFullView from "@/tm-vuetify/components/tm-fullView/tm-fullView.vue"
import tmMenubars from "@/tm-vuetify/components/tm-menubars/tm-menubars.vue"
import tmSheet from "@/tm-vuetify/components/tm-sheet/tm-sheet.vue"
import tmAlerts from "@/tm-vuetify/components/tm-alerts/tm-alerts.vue"
import tmDivider from "@/tm-vuetify/components/tm-divider/tm-divider.vue"
import tmCoupon from '@/tm-vuetify/components/tm-coupon/tm-coupon.vue'
import tmButton from "@/tm-vuetify/components/tm-button/tm-button.vue"
import tmImages from "@/tm-vuetify/components/tm-images/tm-images.vue"

export default {
    components: {
        tmFullView,
        tmMenubars,
        tmSheet,
        tmAlerts,
        tmDivider,
        tmCoupon,
        tmButton,
        tmImages
    },
    data() {
        return {
            adUnitId: '',
            codeDataShow: false,
            codeData: {
                // img: 'https://lywq.muyin.site/logo.png',
                title: "请获取",
                btnText: '复制',
                time: '有效期5分钟',
                sale: '',
                saleLable: '注册码',
                saleSplit: ''
            }
        }
    },
    computed: {
        toolsPluginConfigs() {
            return this.$tm.vx.getters().getConfigs?.pluginConfig?.toolsPlugin || {};
        }
    },
    onLoad(options) {
        // #ifdef MP-WEIXIN
        wx.hideShareMenu();
        this.adLoad();
        // #endif
        uni.onCopyUrl((result) => {
            setTimeout(() => {
                uni.setClipboardData({
                    data: "禁止复制哦",
                })
            }, 1000);
        })
    },
    methods: {
        adLoad() {
            if (wx.createRewardedVideoAd) {
                videoAd = wx.createRewardedVideoAd({
                    adUnitId: this.toolsPluginConfigs.rewardedVideoAdId //你的广告key
                })
                videoAd.onError(err => {
                })
                videoAd.onClose((status) => {
                    if (status && status.isEnded || status === undefined) {
                        //这里写广告播放完成后的事件
                        this.getRegistrationCode();
                    } else {
                        // 广告播放未完成
                    }
                })
            }
        },
        openVideoAd: function () {
            if (videoAd && this.toolsPluginConfigs.rewardedVideoAdId !== '') {
                videoAd.show().catch(err => {
                    // 失败重试
                    console.log("广告拉取失败")
                    videoAd.load().then(() => videoAd.show())
                })
            } else {
                this.getRegistrationCode();
            }
        },
        getRegistrationCode() {
            uni.showLoading({
                title: '正在获取...'
            });
            this.$httpApi.v2.getPostVerifyCode()
                .then(res => {
                    if (res.code === 200) {
                        uni.$tm.toast('获取成功！');
                        this.codeData.title = res.data;
                        this.codeDataShow = true;
                    } else {
                        uni.$tm.toast('操作失败，请重试！');
                    }
                })
                .catch(err => {
                    uni.$tm.toast(err.message);
                });
        },
        fnCopyCode() {
            uni.setClipboardData({
                data: this.codeData.title,
                showToast: false,
                success: () => {
                    uni.showToast({
                        icon: 'none',
                        title: '复制成功！'
                    });
                    setTimeout(() => {
                        uni.navigateBack()
                    }, 500);
                },
                fail: () => {
                    uni.showToast({
                        icon: 'none',
                        title: '复制失败！'
                    });
                }
            });
        }
    }
}
</script>
