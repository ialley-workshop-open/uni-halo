<template>
    <view class="cache-image-wrap">
        <view v-if="loadStatus == 'loading'" class="img-loading" :style="[imgStyle, loadStyle]">
            <!-- <text class="img-load-icon iconfont icon-loading"></text>
            <text class="img-load-text">{{ loadText }}</text> -->
            <image :src="loadingImgSrc" :style="[loadingImgStyle]" mode="aspectFit"></image>
        </view>
        <view v-if="loadStatus == 'error'" class="img-error" :style="[imgStyle, loadErrStyle]">
            <!-- <text class="img-err-icon iconfont icon-exclamation-circle"></text>
            <text class="img-load-text">{{ loadErrText }}</text> -->
            <image class="img-error-img" :src="loadingErrorImageSrc" mode="scaleToFill"></image>
        </view>
        <image v-show="loadStatus == 'success'" :src="src" @load="fnOnLoad" @error="fnOnError" :lazy-load="lazyLoad"
               :style="[imgStyle]" :mode="mode" @click="$emit('on-click', url)"></image>
    </view>
</template>

<script>
import imageCache from '@/utils/imageCache.js';

export default {
    name: 'cache-image',
    props: {
        url: {
            type: String,
            default: ''
        },
        lazyLoad: {
            type: Boolean,
            default: true
        },
        loadStyle: {
            type: Object,
            default() {
                return {
                    backgroundColor: '#ffffff',
                    color: '#333'
                };
            }
        },
        loadErrStyle: {
            type: Object,
            default() {
                return {
                    color: 'rgba(244, 67, 54,1)'
                    // backgroundColor: 'rgba(244, 67, 54,0.2)'
                };
            }
        },
        mode: {
            type: String,
            default: 'aspectFill'
        },
        loadText: {
            type: String,
            default: '加载中...'
        },
        loadErrText: {
            type: String,
            default: '加载失败'
        },
        fileMd5: {
            type: String,
            default: ''
        },
        styles: {
            type: Object,
            default() {
                return {};
            }
        },
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '100%'
        },
        radius: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            imgStyle: {},
            loadingImgStyle: {
                width: '120rpx',
            },
            src: '', // 图片地址
            loadStatus: 'loading'
        };
    },
    computed: {
        imagesConfig() {
            return this.$tm.vx.getters().getConfigs.imagesConfig
        },
        loadingImgSrc() {
            return this.$utils.checkImageUrl(this.imagesConfig.loadingGifUrl);
        },
        loadingErrorImageSrc() {
            return this.$utils.checkImageUrl(this.imagesConfig.loadingErrUrl)
        }
    },
    watch: {
        // 监听图片md5值的变化
        fileMd5(val) {
            // 查找获取图片缓存
            this.fnGetImageCache();
        }
    },
    created() {
        this.imgStyle = {
            width: this.width,
            height: this.height,
            borderRadius: this.radius,
            ...this.styles
        };

        // 查找获取图片缓存
        this.fnGetImageCache();
    },
    methods: {
        // 查找获取图片缓存
        async fnGetImageCache() {
            // #ifdef APP-PLUS
            var result = await imageCache.getImageCache(this.url, this.fileMd5);
            if (result) {
                this.src = result;
            } else {
                this.src = this.url;
            }
            // #endif
            // #ifndef APP-PLUS
            this.src = this.url;
            // #endif
        },
        fnOnLoad() {
            this.loadStatus = 'success';
        },
        fnOnError(e) {
            this.loadStatus = 'error';
        }
    }
};
</script>

<style scoped lang="scss">
.cache-image-wrap {
    width: 100%;
    height: 100%;
}

.img-loading,
.img-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    background-color: #f2f2f2;
}

.img-load-icon {
    font-size: 36rpx;
    animation: xhRote 0.8s infinite linear;
}

.img-load-text {
    font-size: 28rpx;
    margin-top: 8rpx;
    color: inherit;
}

.img-error {
    font-size: 28rpx;

    &-img {
        width: 100%;
        border-radius: 12rpx;
    }
}

.img-err-icon {
    font-size: 36rpx;
}

@keyframes xhRote {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
