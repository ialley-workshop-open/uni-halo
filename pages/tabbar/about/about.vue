<template>
    <view class="app-page pb-24">
        <!-- 博主信息 -->
        <view class="blogger-info" :style="[calcProfileStyle]">
            <image class="avatar" :src="$utils.checkAvatarUrl(bloggerInfo.avatar)" mode="aspectFill"></image>
            <view class="profile">
                <view class="author mt-24 text-size-g text-weight-b">{{ bloggerInfo.nickname }}</view>
                <view class="desc mt-24 text-size-m">
                    {{ bloggerInfo.description || '这个博主很懒，竟然没写介绍~' }}
                </view>
            </view>
            <image v-if="calcWaveUrl" :src="calcWaveUrl" mode="scaleToFill" class="gif-wave"></image>
        </view>

        <!-- 统计信息 -->
        <view class="statistics-wrap bg-white">
            <tm-more iconColor="light-blue" :open.sync="statisticsShowMore" :maxHeight="62" label=" " open-label=" ">
                <template>
                    <view class="statistics flex pt-24 pb-24" :class="{ 'has-solid': statisticsShowMore }">
                        <view class="item flex-1 text-align-center">
                            <view class="number text-size-xl text-bg-gradient-orange-accent">
                                <tm-flop :startVal="0" :decimals="0" :endVal="statistics.post"
                                         :duration="3000"></tm-flop>
                            </view>
                            <view class="mt-6 text-align-center text-size-s text-grey-darken-1">内容数量</view>
                        </view>
                        <view class="item flex-1 text-align-center">
                            <view class="number text-size-xl text-bg-gradient-green-accent">
                                <tm-flop :startVal="0" :decimals="0" :endVal="statistics.visit"
                                         :duration="3000"></tm-flop>
                            </view>
                            <view class="mt-6 text-size-s text-grey-darken-1">访客数量</view>
                        </view>
                        <view class="item flex-1 text-align-center">
                            <view class="number text-size-xl text-bg-gradient-blue-accent">
                                <tm-flop :startVal="0" :decimals="0" :endVal="statistics.category"
                                         :duration="3000"></tm-flop>
                            </view>
                            <view class="mt-6 text-align-center text-size-s text-grey-darken-1">分类总数</view>
                        </view>
                    </view>
                    <view class="statistics solid-top has-solid flex pt-24 pb-24">
                        <view class="item flex-1 text-align-center">
                            <view class="number text-size-xl text-bg-gradient-orange-accent">
                                <tm-flop :startVal="0" :decimals="0" :endVal="statistics.comment"
                                         :duration="3000"></tm-flop>
                            </view>
                            <view class="mt-6 text-align-center text-size-s text-grey-darken-1">评论数量</view>
                        </view>

                        <view class="item flex-1 text-align-center">
                            <view class="number text-size-xl text-bg-gradient-blue-accent">
                                <tm-flop :startVal="0" :decimals="0" :endVal="statistics.upvote"
                                         :duration="3000"></tm-flop>
                            </view>
                            <view class="mt-6 text-size-s text-grey-darken-1">点赞数量</view>
                        </view>
                    </view>
                </template>
            </tm-more>
        </view>

        <!-- 功能导航 -->
        <view class="nav-wrap ma-24 round-3">
            <tm-grouplist :shadow="0" :round="3" :margin="[0, 0]">
                <block v-for="(nav, index) in navList" :key="index">
                    <tm-listitem v-if="nav.show" :title="nav.title" :left-icon="nav.leftIcon" show-left-icon
                                 :left-icon-color="nav.leftIconColor" :value="nav.rightText" @click="fnOnNav(nav)">
                        <template slot="rightValue">
                            <button class="right-value-btn" v-if="nav.openType" :open-type="nav.openType">
                                {{ nav.rightText }}
                            </button>
                            <text v-else>{{ nav.rightText }}</text>
                        </template>
                    </tm-listitem>
                </block>
            </tm-grouplist>
        </view>
        <!-- 版权 -->
        <view v-if="copyrightConfig.enabled" class="copyright mt-40 text-size-xs text-align-center">
            <view class="">{{ copyrightConfig.content }}</view>
        </view>
    </view>
</template>

<script>
import {checkHasAdminLogin} from '@/utils/auth.js';
import CheckAppUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update';
import {CheckWxUpdate} from '@/utils/update.js';

import tmGrouplist from '@/tm-vuetify/components/tm-grouplist/tm-grouplist.vue';
import tmListitem from '@/tm-vuetify/components/tm-listitem/tm-listitem.vue';
import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
import tmPoup from '@/tm-vuetify/components/tm-poup/tm-poup.vue';
import tmMore from '@/tm-vuetify/components/tm-more/tm-more.vue';
import tmFlop from '@/tm-vuetify/components/tm-flop/tm-flop.vue';
import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
import tmIcons from '@/tm-vuetify/components/tm-icons/tm-icons.vue';
import wave from '@/components/wave/wave.vue';

export default {
    components: {
        tmGrouplist,
        tmListitem,
        tmTranslate,
        tmPoup,
        tmMore,
        tmFlop,
        tmButton,
        tmIcons,
        wave
    },
    data() {
        return {
            statisticsShowMore: false,
            // 统计信息
            statistics: {
                post: 0, // 文章数量
                comment: 0, // 评论数量
                category: 0, // 分类数量
                visit: 0, // 访客数量
                upvote: 0 // 点赞数量
            },
            // 导航信息
            navList: [],
            miniProfileCard: {
                show: false
            }
        };
    },
    computed: {
        haloConfigs() {
            return this.$tm.vx.getters().getConfigs
        },
        pageConfig() {
            return this.haloConfigs.pageConfig.aboutConfig;
        },
        postDetailConfig() {
            return this.haloConfigs.basicConfig.postDetailConfig;
        },
        bloggerInfo() {
            return this.haloConfigs.authorConfig.blogger;
        },
        calcProfileStyle() {
            const _imgUrlOr = this.pageConfig.bgImageUrl;
            return {
                backgroundImage: `url(${this.$utils.checkImageUrl(_imgUrlOr)})`
            }
        },
        calcWaveUrl() {
            return this.$utils.checkImageUrl(this.pageConfig.waveImageUrl);
        },
        copyrightConfig() {
            return this.haloConfigs.basicConfig.copyrightConfig;
        }
    },
    watch: {
        haloConfigs: {
            handler(val) {
                if (!val) return;
                this.fnGetNavList();
            },
            deep: true,
            immediate: true,
        }
    },
    created() {
        this.fnGetData();
    },
    onPullDownRefresh() {
        this.fnGetData();
    },
    methods: {
        fnGetNavList() {
            const systemInfo = uni.getSystemInfoSync();
            let _isWx = false;
            // #ifdef MP-WEIXIN
            _isWx = true;
            // #endif
            this.navList = [
                {
                    key: 'archives',
                    title: this.haloConfigs.basicConfig.auditModeEnabled ? '内容归档' : '文章归档',
                    leftIcon: 'halocoloricon-classify',
                    leftIconColor: 'red',
                    rightText: this.haloConfigs.basicConfig.auditModeEnabled ? '已归档的内容' : '已归档的文章',
                    path: '/pagesA/archives/archives',
                    isAdmin: false,
                    type: 'page',
                    show: true
                }, {
                    key: 'love',
                    title: '恋爱日记',
                    leftIcon: 'halocoloricon-attent',
                    leftIconColor: 'red',
                    rightText: '博主的恋爱日记',
                    path: '/pagesA/love/love',
                    isAdmin: false,
                    type: 'page',
                    show: this.haloConfigs.loveConfig.loveEnabled
                }, {
                    key: 'disclaimers',
                    title: '友情链接',
                    leftIcon: 'icon-lianjie',
                    leftIconColor: 'blue',
                    rightText: '看看博主朋友们吧',
                    path: '/pagesA/friend-links/friend-links',
                    isAdmin: false,
                    type: 'page',
                    show: true
                },
                {
                    key: 'disclaimers',
                    title: '免责声明',
                    leftIcon: 'icon-map',
                    leftIconColor: 'red',
                    rightText: '博客内容免责声明',
                    path: '/pagesA/disclaimers/disclaimers',
                    isAdmin: false,
                    type: 'page',
                    show: this.haloConfigs.basicConfig.disclaimers.enabled
                },
                {
                    key: 'contact-blogger',
                    title: '联系博主',
                    leftIcon: 'icon-paper-plane',
                    leftIconColor: 'orange',
                    rightText: '博主常用联系方式',
                    path: '/pagesA/contact/contact',
                    isAdmin: false,
                    type: 'page',
                    show: this.haloConfigs.authorConfig.social.enabled
                },
                {
                    key: 'session',
                    title: '在线客服',
                    leftIcon: 'icon-headset-fill',
                    leftIconColor: 'cyan',
                    rightText: '在线客服为您答疑',
                    path: null,
                    isAdmin: false,
                    type: 'page',
                    openType: 'contact',
                    show: _isWx
                },
                {
                    key: 'feedback',
                    title: '意见反馈',
                    leftIcon: 'icon-comment-dots',
                    leftIconColor: 'light-blue',
                    rightText: '提交系统使用反馈',
                    path: null,
                    isAdmin: false,
                    type: 'page',
                    openType: 'feedback',
                    show: _isWx
                },
                {
                    key: 'about',
                    title: '关于项目',
                    leftIcon: 'icon-exclamation-circle',
                    leftIconColor: 'blue',
                    rightText: '小莫唐尼开源项目',
                    path: '/pagesA/about/about',
                    isAdmin: false,
                    type: 'page',
                    show: this.haloConfigs.basicConfig.showAboutSystem
                },
                // {
                // 	key: 'cache',
                // 	title: '清除缓存',
                // 	leftIcon: 'icon-delete',
                // 	leftIconColor: 'gray',
                // 	rightText: uni.getStorageInfoSync().currentSize + 'KB',
                // 	path: 'clear',
                // 	isAdmin: false,
                // 	type: 'poup',
                // 	show: true
                // },
                // {
                // 	key: 'update',
                // 	title: '版本更新',
                // 	leftIcon: 'icon-clouddownload',
                // 	leftIconColor: 'pink',
                // 	rightText: `当前版本 v${systemInfo.appVersion}`,
                // 	path: 'update',
                // 	isAdmin: false,
                // 	type: 'poup',
                // 	show: true
                // },

            ];
        },
        fnGetData() {
            this.$httpApi.v2
                .getBlogStatistics()
                .then(res => {
                    this.statistics = res;
                })
                .catch(err => {
                    this.$tm.toast('数据加载失败，请重试！');
                })
                .finally(() => {
                    uni.stopPullDownRefresh();
                });
        },

        fnOnNav(data) {
            const {
                type,
                path,
                isAdmin,
                openType
            } = data;
            if (openType) {
                // #ifndef MP-WEIXIN
                return uni.$tm.toast('仅支持微信小程序打开！');
                // #endif
                // #ifdef MP-WEIXIN
                return;
                // #endif
            }
            if (!path) return;

            // 拦截后台管理页面（插件拦截不友好，无法阻断）
            if (isAdmin && !checkHasAdminLogin()) {
                uni.$eShowModal({
                    title: '提示',
                    content: '未登录超管账号或登录状态已过期，是否立即登录？',
                    showCancel: true,
                    cancelText: '否',
                    cancelColor: '#999999',
                    confirmText: '是',
                    confirmColor: '#03a9f4'
                })
                    .then(res => {
                        uni.navigateTo({
                            url: '/pagesB/login/login'
                        });
                    })
                    .catch(err => {
                    });
                return;
            }

            if (type == 'poup') {
                switch (path) {
                    case 'clear':
                        uni.$eShowModal({
                            title: '提示',
                            content: '清除后可能退出您当前的登录或已授权状态，是否确定清除缓存吗？',
                            showCancel: true,
                            cancelText: '否',
                            cancelColor: '#999999',
                            confirmText: '是',
                            confirmColor: '#03a9f4'
                        })
                            .then(res => {
                                uni.clearStorageSync();
                                this.navList.find(x => x.key == 'cache').rightText =
                                    uni.getStorageInfoSync().currentSize + 'KB';
                            })
                            .catch(err => {
                            });
                        break;
                    case 'update':
                        // #ifdef APP-PLUS
                        CheckAppUpdate();
                        // #endif

                        // #ifdef MP-WEIXIN
                        CheckWxUpdate(true);
                        // #endif

                        // #ifndef APP-PLUS|| MP-WEIXIN
                        uni.showToast({
                            icon: 'none',
                            title: '版本无需更新！'
                        });
                        // #endif

                        break;
                }
            } else if (type == 'page') {
                uni.navigateTo({
                    url: path
                })
            }
        },

        // 快捷导航页面跳转
        fnToNavPage(item) {
            // 判断是内置页面还是网页
            if (this.$utils.checkIsUrl(item.path)) {
                uni.navigateTo({
                    url: '/pagesC/website/website?data=' +
                        JSON.stringify({
                            title: item.text || this.$haloConfig.title,
                            url: item.path
                        })
                });
                return;
            }
            switch (item.type) {
                case 'tabbar':
                    uni.switchTab({
                        url: item.path
                    });
                    break;
                case 'page':
                    uni.navigateTo({
                        url: item.path
                    });
                    break;
            }
        },
        fnOnToAdTest(path) {
            uni.navigateTo({
                url: path
            });
        }
    }
};
</script>

<style scoped lang="scss">
.app-page {
    width: 100vw;
    min-height: 100vh;
}

.blogger-info {
    position: relative;
    width: 100%;
    height: 600rpx;
    background-size: cover;
    background-repeat: no-repeat;

    &:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        background-color: rgba(0, 0, 0, 0.3);
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAKUlEQVQImU3IMREAIAgAwJfNkQCEsH8cijjpMf6vnXlQaIiJFx+omEBfmqIEZLe2jzcAAAAASUVORK5CYII=);
        z-index: 0;
    }

    .avatar {
        position: absolute;
        top: 200rpx;
        left: 50%;
        transform: translateX(-50%);
        width: 130rpx;
        height: 130rpx;
        border-radius: 50%;
        border: 6rpx solid #ffffff;
    }

    .profile {
        width: 100%;
        position: absolute;
        top: 340rpx;
        left: 0;
        z-index: 6;
        color: #fff;
        text-align: center;
    }

    .gif-wave {
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
        z-index: 99;
        mix-blend-mode: screen;
        height: 100rpx;
    }
}

.profile-card {
    position: relative;
    background-color: #fff;
    overflow: hidden;

    &_label {
        width: 120rpx;
        position: absolute;
        top: 8rpx;
        left: -36rpx;
        transform: rotateZ(-45deg);
        text-align: center;
        color: #ffffff;
    }

    .left {
        width: 260rpx;

        .avatar {
            width: 130rpx;
            height: 130rpx;
            border-radius: 50%;
        }
    }

    .right {
        width: 0;
        flex-grow: 1;

        .photos {
            &-img {
                width: 130rpx;
                height: 130rpx;
            }
        }

        .photos-img + .photos-img {
            margin-left: 12rpx;
        }
    }
}

.statistics-wrap {
    box-shadow: 0rpx 2rpx 24rpx rgba(0, 0, 0, 0.03);
    border-radius: 0rpx 0rpx 24rpx 24rpx;
    overflow: hidden;

    .statistics {
        &.has-solid {
            .item + .item {
                border-left: 2rpx solid #fafafa;
            }
        }

        &.solid-top {
            position: relative;

            &:before {
                content: '';
                position: absolute;
                top: 0;
                left: 36rpx;
                right: 36rpx;
                height: 2rpx;
                background-color: #fafafa;
            }
        }
    }
}

.quick-nav {
    background-color: #fff;
    box-sizing: border-box;
    box-shadow: 0rpx 2rpx 24rpx rgba(0, 0, 0, 0.03);

    .name {
        color: var(--main-text-color);
    }

    .icon {
        border-radius: 50%;
        font-size: 80rpx;
    }
}

.nav-wrap {
    box-shadow: 0rpx 2rpx 24rpx rgba(0, 0, 0, 0.03);
    background-color: #fff;
}

.copyright {
    color: #c0c4c7;
}

.right-value-btn {
    background-color: transparent;
    border: none;
    padding: 0;
    margin: 0;
    font-size: 24rpx;
    color: #c0c4c7;
    border-radius: 0;
    line-height: initial;

    &::after {
        border: none;
        border-radius: 0;
        transform: initial;
    }
}
</style>
