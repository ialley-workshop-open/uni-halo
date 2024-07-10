<template>
    <view class="app-page">
        <view v-if="loading !== 'success'" class="loading-wrap">
            <view v-if="loading === 'loading'" class="loading">
                <view class="loading-icon flex flex-center">
                    <text class="e-loading-icon iconfont icon-loading"></text>
                </view>
                <view class="loadig-text ">相册正在努力加载中啦~</view>
            </view>
            <tm-empty v-else icon="icon-shiliangzhinengduixiang-" color="red" label="啊偶,加载失败了呢~">
                <tm-button theme="red" :shadow="0" size="m" @click="fnRefresh()">刷新试试</tm-button>
            </tm-empty>
        </view>
        <!-- 内容区域 -->
        <view v-else class="app-page-content">
            <view v-if="dataList.length === 0" color="light-blue" class="content-empty flex flex-center">
                <tm-empty icon="icon-shiliangzhinengduixiang-" label="相册暂时还没有数据~">
                    <tm-button :shadow="0" size="m" theme="light-blue" @click="fnRefresh()">刷新试试</tm-button>
                </tm-empty>
            </view>
            <block v-else>
                <swiper class="swiper-album" :current="swiperIndex" :acceleration="true" :circular="true"
                        :vertical="false" :indicator-dots="false" :autoplay="false" @change="fnOnChange">
                    <block v-for="(item, index) in dataList" :key="index">
                        <swiper-item class="swiper-album-item">
                            <view class="scroll-wrap">
                                <view class="card">
                                    <cache-image class="card-image" width="100%" height="46vh" radius="12rpx"
                                                 :url="item.image" :fileMd5="item.image" mode="aspectFill"
                                                 @on-click="fnOnPreview(item)"></cache-image>
                                    <view v-if="item.spec.description" class="card-desc">{{ item.spec.description }}
                                    </view>
                                    <view v-else class="card-desc is-empty flex flex-col">
                                        <view class="text-grey-darken-1">该照片没有记录任何信息</view>
                                        <view class="text-size-m mt-24 text-grey-darken-1">记录一下拍照的瞬间，会更精彩哟</view>
                                    </view>
                                </view>
                            </view>
                        </swiper-item>
                    </block>
                </swiper>
                <view class="tabbar">
                    <view class="pre" @click="fnChange(false)">
                        <text class="icon">
                            <text class="iconfont icon-arrow-left"></text>
                        </text>
                        <text class="text">上一张</text>
                    </view>
                    <view class="refresh" @click="fnRefresh()">
                        <text class="refresh-text">点击</text>
                        <text class="refresh-heart iconfont icon-diagnose"></text>
                        <text class="refresh-text">刷新</text>
                    </view>
                    <view class="next" @click="fnChange(true)">
                        <text class="text">下一张</text>
                        <text class="icon">
                            <text class="iconfont icon-arrow-right"></text>
                        </text>
                    </view>
                </view>
            </block>
        </view>
    </view>
</template>

<script>
import throttle from '@/utils/throttle.js';
import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
import tmFlotbutton from '@/tm-vuetify/components/tm-flotbutton/tm-flotbutton.vue';
import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';

export default {
    components: {
        tmButton,
        tmFlotbutton,
        tmTranslate,
        tmEmpty
    },
    data() {
        return {
            loading: 'loading',
            queryParams: {
                size: 100,
                page: 1,
                group: ""
            },
            result: {},
            dataList: [],
            swiperIndex: 0,
            tabbar: {
                list: []
            }
        };
    },
    computed: {
        loveConfig() {
            return this.$tm.vx.getters().getConfigs.loveConfig;
        }
    },
    watch: {
        loveConfig: {
            deep: true,
            immediate: true,
            handler(newVal, oldVal) {
                this.fnGetData()
            }
        }
    },
    onLoad() {
        this.fnSetPageTitle('恋爱相册');
    },

    onPullDownRefresh() {
        this.fnRefresh();
    },

    methods: {
        fnRefresh() {
            this.queryParams.page = 0;
            this.fnGetData();
        },
        fnGetData() {
            this.loading = 'loading';
            this.queryParams.group = this.loveConfig.lovePhoto.groupName
            this.$httpApi.v2
                .getPhotoListByGroupName(this.queryParams)
                .then(res => {
                    console.log("相册 res", res)
                    this.loading = 'success';
                    this.dataList = res.items.map((item, index) => {
                        item['image'] = this.$utils.checkImageUrl(item.spec.cover || item.spec.url);
                        item['takeTime'] = this.$tm.dayjs(item.metadata.creationTimestamp).format(
                            'DD/MM/YYYY');
                        return item;
                    });
                    this.swiperIndex = 0;
                })
                .catch(err => {
                    console.error(err);
                    this.loading = 'error';
                    uni.$tm.toast('加载失败，请下拉刷新重试！');
                })
                .finally(() => {
                    setTimeout(() => {
                        uni.stopPullDownRefresh();
                    }, 200);
                });
        },

        fnOnPreview(item) {
            uni.previewImage({
                current: item.image,
                urls: this.dataList.map(x => x.image)
            });
        },
        fnOnChange(e) {
            this.swiperIndex = e.detail.current;
        },
        fnChange(isNext) {
            throttle(() => {
                if (isNext) {
                    if (this.swiperIndex === this.dataList.length - 1) {
                        this.swiperIndex = 0;
                    } else {
                        this.swiperIndex += 1;
                    }
                } else {
                    if (this.swiperIndex === 0) {
                        this.swiperIndex = this.dataList.length - 1;
                    } else {
                        this.swiperIndex -= 1;
                    }
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.app-page {
    width: 100vw;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 24rpx 0;
    padding-bottom: 144rpx;
    background: linear-gradient(-135deg,
        rgba(247, 149, 51, 0.1),
        rgba(243, 112, 85, 0.1) 15%,
        rgba(239, 78, 123, 0.1) 30%,
        rgba(161, 102, 171, 0.1) 44%,
        rgba(80, 115, 184, 0.1) 58%,
        rgba(16, 152, 173, 0.1) 72%,
        rgba(7, 179, 155, 0.1) 86%,
        rgba(109, 186, 130, 0.1));
}

.app-page-content {
}

.loading-wrap {
    width: 100vw;
    height: 60vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 36rpx;

    ::v-deep {
        .tm-icons {
            margin-right: -20rpx;
        }
    }
}

.e-loading-icon {
    font-size: 120rpx;
    // color: #f88ca2;
    color: #56bbf9;
}

.loadig-text {
    margin-top: 28rpx;
    font-size: 28rpx;
    // color: #f88ca2;
    color: #56bbf9;
}

.content-empty {
    width: 100%;
    height: 60vh;
}

.swiper-album {
    width: 100vw;
    height: calc(100vh - 24rpx - 144rpx);
}

.swiper-album-item {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 36rpx;
    /* #ifdef H5 */
    padding-bottom: 110rpx;
    /* #endif */
    /* #ifndef H5 */
    padding-bottom: 60rpx;
    /* #endif */
}

.scroll-wrap {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 36rpx;
    background-color: #ffffff;
    border-radius: 12rpx;
    box-shadow: 0rpx 4rpx 24rpx rgba(0, 0, 0, 0.03);
}

.card {
    display: flex;
    flex-direction: column;
    width: 100%;
    // height: 65vh;
    height: 100%;
    max-height: 100%;
    border-radius: 12rpx;
    background-color: #ffffff;
    box-sizing: border-box;
    // box-shadow: 0rpx 4rpx 24rpx rgba(0, 0, 0, 0.03);
    overflow: hidden;
    overflow-y: auto;

    ::v-deep {
        .cache-image {
            height: initial !important;
        }
    }

    &-image {
        width: 100%;
        height: initial !important;
        border-radius: 12rpx;
    }

    &-desc {
        margin-top: 24rpx;
        line-height: 1.6;
        font-size: 30rpx;
        color: rgba(26, 26, 26, 0.9);

        &.is-empty {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-grow: 1;
            font-size: 32rpx;
        }
    }
}

.tabbar {
    width: 90vw;
    position: fixed;
    left: 50%;
    bottom: 40rpx;
    transform: translateX(-50%);
    border-radius: 25rpx;
    box-sizing: border-box;
    padding: 24rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // background-color: rgba(0, 0, 0, 0.5);
    background-color: #ffffff;
    color: #333;
    box-shadow: 0rpx 4rpx 24rpx rgba(0, 0, 0, 0.05);

    .refresh {
        animation: refreshAni 6s ease-in-out infinite;
        color: #56bbf9;

        &-heart {
            font-size: 42rpx;
            color: inherit;
            margin: 0 6rpx;
        }

        &-text {
            font-size: 24rpx;
        }
    }

    .pre {
        color: #56bbf9;
        transition: transform 0.1s ease-in-out;

        &:hover {
            transform: scale(1.05);
        }

        .text {
            padding-left: 12rpx;
        }
    }

    .next {
        color: #f88ca2;
        transition: transform 0.1s ease-in-out;

        &:hover {
            transform: scale(1.03);
        }

        .text {
            padding-right: 12rpx;
        }
    }
}

@keyframes refreshAni {
    0% {
        color: #f88ca2;
    }

    50% {
        color: #56bbf9;
    }

    100% {
        color: #f88ca2;
    }
}
</style>
