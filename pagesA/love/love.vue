<template>
    <view class="app-page bg-white">
        <!-- 情侣信息 -->
        <view class="lover-wrap" :style="[loveWrapStyle]">
            <view class="lover-card">
                <view class="boy">
                    <image class="avatar" :src="$utils.checkAvatarUrl(loveConfig.loveInfo.boyAvatar)" mode="aspectFit"></image>
                    <view class="name">{{ loveConfig.loveInfo.boyNickname }}</view>
                </view>
                <image class="like" :src="$utils.checkImageUrl(loveConfig.pageImages.heartImageUrl)" mode="scaleToFill"></image>
                <view class="girl">
                    <image class="avatar" :src="$utils.checkAvatarUrl(loveConfig.loveInfo.girlAvatar)" mode="aspectFit"></image>
                    <view class="name">{{ loveConfig.loveInfo.girlNickname }}</view>
                </view>
            </view>
            <image class="wave-image" :src="$utils.checkImageUrl(loveConfig.pageImages.waveImageUrl)" mode="scaleToFill"></image>
        </view>
        <!-- 恋爱记时 -->
        <view class="love-time-wrap">
            <view class="title">{{ loveConfig.loveDateTitle }}</view>
            <view class="content">
                <text class="text">
                    第
                    <text class="number">{{ loveDayCount.d }}</text>
                    天
                </text>
                <text class="text">
                    <text class="number">{{ loveDayCount.h }}</text>
                    小时
                </text>
                <text class="text">
                    <text class="number">{{ loveDayCount.m }}</text>
                    分钟
                </text>
                <text class="text">
                    <text class="number">{{ loveDayCount.s }}</text>
                    秒
                </text>
            </view>
        </view>
        <!-- 功能导航 -->
        <view class="list-wrap">
            <block v-for="(nav, index) in navList" :key="index">
                <view v-if="nav.use" class="list-item" @click="fnToPage(nav.key)">
                    <view class="left">
                        <image class="icon" :src="$utils.checkImageUrl(nav.iconImageUrl)" mode="aspectFit"></image>
                    </view>
                    <view class="right">
                        <view class="name">{{ nav.title }}</view>
                        <view class="desc">{{ nav.desc }}</view>
                    </view>
                </view>
            </block>
        </view>
    </view>
</template>

<script>

export default {
    data() {
        return {
            loveDayTimer: null,
            loveDayCount: {
                d: 0,
                h: 0,
                m: 0,
                s: 0
            },
            navList: []
        };
    },
    computed: {
        loveConfig() {
            return this.$tm.vx.getters().getConfigs.loveConfig;
        },
        loveWrapStyle() {
            return {
                backgroundImage: `url(${this.$utils.checkImageUrl(this.loveConfig.pageImages.bgImageUrl)})`
            };
        }
    },
    watch: {
        loveConfig: {
            deep: true,
            immediate: true,
            handler(newVal, oldVal) {
                if (!newVal) return;
                this.initList(newVal)
                this.fnInitLoveDayCount();
            }
        }
    },
    onLoad() {
        this.fnSetPageTitle('恋爱日记');
    },
    methods: {
        initList(configs) {
            this.navList = [
                {
                    key: 'journey',
                    use: configs.ourStory.enabled,
                    iconImageUrl: configs.ourStory.iconUrl,
                    title: '关于我们',
                    desc: '我们一起度过的那些经历'
                },
                {
                    key: 'album',
                    use: configs.lovePhoto.enabled,
                    iconImageUrl: configs.lovePhoto.iconUrl,
                    title: '恋爱相册',
                    desc: '定格了我们的那些小美好'
                },
                {
                    key: 'list',
                    use: configs.loveDaily.enabled,
                    iconImageUrl: configs.loveDaily.iconUrl,
                    title: '恋爱清单',
                    desc: '你我之间的约定我们都在努力实现'
                },
            ]
        },
        fnInitLoveDayCount() {
            clearTimeout(this.loveDayTimer);
            const _countDownFn = () => {
                this.loveDayTimer = setTimeout(_countDownFn, 1000);
                const formatStartDate = this.loveConfig.loveDate.replace(/-/g, '/');
                const start = new Date(formatStartDate),
                    now = new Date();
                const T = now.getTime() - start.getTime();
                const i = 24 * 60 * 60 * 1000;
                const d = T / i;
                const D = Math.floor(d);
                const h = (d - D) * 24;
                const H = Math.floor(h);
                const m = (h - H) * 60;
                const M = Math.floor(m);
                const s = (m - M) * 60;
                const S = Math.floor(s);
                this.loveDayCount = {
                    d: D,
                    h: H,
                    m: M,
                    s: S
                };
            };
            _countDownFn();
        },
        fnToPage(pageName) {
            uni.navigateTo({
                url: `/pagesA/love/${pageName}`
            });
        }
    }
};
</script>

<style scoped lang="scss">
.app-page {
    width: 100vw;
    min-height: 100vh;
    background: linear-gradient(
            -45deg,
            rgba(247, 149, 51, 0.1),
            rgba(243, 112, 85, 0.1) 15%,
            rgba(239, 78, 123, 0.1) 30%,
            rgba(161, 102, 171, 0.1) 44%,
            rgba(80, 115, 184, 0.1) 58%,
            rgba(16, 152, 173, 0.1) 72%,
            rgba(7, 179, 155, 0.1) 86%,
            rgba(109, 186, 130, 0.1)
    );
}

.lover-wrap {
    position: relative;
    width: 100vw;
    height: 50vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;

    &::before {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        content: '';
        background-color: rgba(255, 255, 255, 0.1);
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAKUlEQVQImU3IMREAIAgAwJfNkQCEsH8cijjpMf6vnXlQaIiJFx+omEBfmqIEZLe2jzcAAAAASUVORK5CYII=);
        z-index: 0;
        backdrop-filter: blur(4rpx);
        overflow: hidden;
    }

    &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -60rpx;
        width: 100vw;
        height: 60rpx;
        background-image: linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
    }

    .lover-card {
        position: absolute;
        left: 50%;
        top: 58%;
        transform: translate(-50%, -50%);
        width: 90vw;
        display: flex;
        align-items: center;
        justify-content: space-around;
        border-radius: 12rpx;
        z-index: 2;

        .avatar {
            width: 180rpx;
            height: 180rpx;
            border-radius: 50%;
            box-sizing: border-box;
            // border: 8rpx solid transparent;
            // border: 8rpx solid rgba(255, 255, 255, 0.7) !important;
            border: 8rpx solid rgba(255, 255, 255, 1) !important;
        }

        .name {
            font-size: 32rpx;
            font-weight: bold;
            color: #ffffff;
            text-align: center;
            letter-spacing: 2rpx;
        }

        .boy {
            color: #3ab8e4;

            .avatar {
                border-color: rgba(58, 184, 228, 0.7);
            }
        }

        .girl {
            color: #f57ab3;

            .avatar {
                border-color: rgba(245, 122, 179, 0.7);
            }
        }

        .like {
            width: 120rpx;
            height: 120rpx;
            animation: likeani 1s ease-in-out infinite;
        }
    }

    .wave-image {
        width: 100%;
        height: 120rpx;
        position: absolute;
        left: 0;
        bottom: 0;
        mix-blend-mode: screen;
    }
}

.love-time-wrap {
    margin-top: 80rpx;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .title {
        font-size: 46rpx;
        letter-spacing: 4rpx;
        // background-image: linear-gradient(270deg, #ff4500, #ffa500, #ffd700, #90ee90, #00ffff, #1e90ff, #9370db, #ff69b4, #ff4500);
        // -webkit-background-clip: text;
        // color: #000;
        color: #333;
        font-size: 42rpx;
        font-weight: bold;
        // animation: loveTimeTitleAni 80s linear infinite;
    }

    .content {
        margin-top: 24rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        .text {
            font-size: 28rpx;
        }

        .number {
            margin: 0 8rpx;
            font-size: 46rpx;
            // color: #ff69b4;
            color: #f83856;
            font-weight: bold;
        }
    }
}

.list-wrap {
    margin-top: 75rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 0 36rpx;

    .list-item {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        box-sizing: border-box;
        padding: 28rpx 32rpx;
        background-color: #ffffff;
        border-radius: 50rpx;
        margin-bottom: 32rpx;
        box-shadow: 0rpx 4rpx 24rpx rgba(0, 0, 0, 0.03);

        &:nth-child(1) {
            animation: listItemAni1 3s ease-in-out infinite;
        }

        &:nth-child(2) {
            animation: listItemAni1 3s ease-in-out infinite;
            animation-delay: 1.5s;
        }

        &:nth-child(3) {
            animation: listItemAni1 3s ease-in-out infinite;
            animation-delay: 2s;
        }

        .left {
            width: 120rpx;
            height: 120rpx;

            .icon {
                width: 100%;
                height: 100%;
            }
        }

        .right {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            box-sizing: border-box;
            padding-left: 40rpx;

            .name {
                font-size: 32rpx;
                font-weight: bold;
                color: #333333;
            }

            .desc {
                margin-top: 8px;
                font-size: 26rpx;
                color: #777777;
            }
        }
    }
}

@keyframes likeani {
    0% {
        transform: scale(1);
    }
    25% {
        transform: scale(1.2);
    }
    50% {
        transform: scale(1.1);
    }
    75% {
        transform: scale(1.3);
    }
    100% {
        transform: scale(1);
    }
}

@keyframes loveTimeTitleAni {
    to {
        background-position: -200rem;
    }
}

@keyframes listItemAni1 {
    0% {
        transform: translateY(0rpx);
    }

    50% {
        transform: translateY(-10rpx);
    }

    100% {
        transform: translateY(0rpx);
    }
}
</style>
