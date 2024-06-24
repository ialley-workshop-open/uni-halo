<template>
    <view class="app-page">
        <view class="page-title">我们的故事</view>
        <view class="html-typed" v-html="html">内容渲染</view>

        <scroll-btn bottom="160rpx" :scrollTop.sync="scrollTop"></scroll-btn>
    </view>
</template>

<script>
import ScrollBtn from '@/components/scroll-btn/scroll-btn.vue';

export default {
    components: {
        ScrollBtn
    },
    data() {
        return {
            scrollTop: 0,
            html: '',
            timer: null
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
                if (!newVal) return;
                this.fnInit();
            }
        }
    },
    onPageScroll(e) {
        this.scrollTop = e.scrollTop;
    },
    onBackPress() {
        clearTimeout(this.timer);
    },
    methods: {
        fnInit() {
            clearTimeout(this.timer);
            const _html = this.loveConfig.ourStory.content;
            let _index = 0;
            const _typing = () => {
                this.timer = setTimeout(() => {
                    if (_index >= _html.length) {
                        clearTimeout(this.timer);
                    } else {
                        this.html += _html.substring(_index, _index + 1);
                        _index += 1;
                        _typing();
                    }
                }, 100);
            };
            _typing();
        }
    }
};
</script>

<style scoped lang="scss">
.app-page {
    width: 100vw;
    min-height: 100vh;
    box-sizing: border-box;
    padding: 36rpx;
    /* #ifdef APP-PLUS */
    padding-top: 100rpx;
    /* #endif */
    /* #ifdef H5 */
    padding-top: 80rpx;
    /* #endif */
    /* #ifdef MP-WEIXIN */
    padding-top: 120rpx;
    /* #endif */
    background: linear-gradient(-45deg,
        rgba(247, 149, 51, 0.1),
        rgba(243, 112, 85, 0.1) 15%,
        rgba(239, 78, 123, 0.1) 30%,
        rgba(161, 102, 171, 0.1) 44%,
        rgba(80, 115, 184, 0.1) 58%,
        rgba(16, 152, 173, 0.1) 72%,
        rgba(7, 179, 155, 0.1) 86%,
        rgba(109, 186, 130, 0.1));
    color: rgba(26, 26, 26, 1);
}

.page-title {
    font-size: 42rpx;
    font-weight: bold;
    text-align: center;
    text-shadow: 0rpx 4rpx 24rpx #bfe9ef;
}

.html-typed {
    margin-top: 52rpx;
    line-height: 1.8;
    font-size: 30rpx;
}
</style>
