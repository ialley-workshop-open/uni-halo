<template>
    <view class="app-page flex flex-col felx-center bg-white">
        <!-- 信息 -->
        <view class="profile flex flex-col flex-center pa-36">
            <view class="avatar">
                <image class="avatar-img" :src="bloggerInfo.avatar" mode="aspectFill"></image>
            </view>
            <view class="nickname mt-24 text-weight-b text-size-g">{{ bloggerInfo.nickname }}</view>
            <view class="desc mt-24 text-size-m text-grey-darken-3">
                {{ bloggerInfo.description || '这个博主很懒，竟然没写介绍~' }}
            </view>
            <!-- 联系图标 -->
            <view class="mt-24 contact-icons">
                <!-- 放全部：似乎显得有点拥挤 -->
                <!-- <block v-for="(item, index) in result" :key="index"><text v-if="item.value" class="halocoloricon" :class="[item.icon, { 'ml-12': index != 0 }]"></text></block> -->
                <!-- 考虑放几个常用的就行 -->
                <text class="halocoloricon halocoloricon-qq"></text>
                <!-- #ifndef MP-QQ -->
                <text class="ml-12 halocoloricon halocoloricon-wechat"></text>
                <!-- #endif -->
                <text class="ml-12 halocoloricon halocoloricon-GitHub"></text>
                <text class="ml-12 halocoloricon halocoloricon-gitee"></text>
                <text class="ml-12 halocoloricon halocoloricon-ic_email_round"></text>
            </view>
        </view>
        <!-- 社交联系方式列表 -->
        <view class="contact ma-50 mt-0 pt-12">
            <block v-if="calcIsNotEmpty">
                <block v-for="(item, index) in result" :key="index">
                    <view v-if="item.value" class="item mt-24 flex" @click="fnOnClick(item)">
                        <view class="left">
                            <text class="icon halocoloricon" :class="[item.icon]"></text>
                            <text class="name">{{ item.name }}</text>
                        </view>
                        <view class="right flex-1">{{ item.value }}</view>
                    </view>
                </block>
            </block>
            <view v-else class="mt-12 pt-12">
                <tm-empty icon="icon-shiliangzhinengduixiang-" label="暂无联系方式"/>
            </view>
        </view>
    </view>
</template>

<script>
import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';

export default {
    components: {
        tmSkeleton,
        tmButton,
        tmEmpty
    },
    data() {
        return {
            loading: 'loading',
            queryParams: {
                size: 10,
                page: 0
            },
            result: [
                {
                    key: 'qq',
                    icon: 'halocoloricon-qq',
                    name: '企鹅号',
                    value: ''
                },
                {
                    key: 'wechat',
                    icon: 'halocoloricon-wechat',
                    name: '微信号',
                    value: ''
                },
                {
                    key: 'github',
                    icon: 'halocoloricon-GitHub',
                    name: 'Github',
                    value: ''
                },
                {
                    key: 'gitee',
                    icon: 'halocoloricon-gitee',
                    name: 'Gitee',
                    value: ''
                },
                {
                    key: 'bilibili',
                    icon: 'halocoloricon-bilibili',
                    name: 'Bilibili',
                    value: ''
                },
                {
                    key: 'csdn',
                    icon: 'halocoloricon-csdn1',
                    name: 'CSDN',
                    value: ''
                },
                {
                    key: 'blog',
                    icon: 'halocoloricon-url-monitor',
                    name: '博客地址',
                    value: ''
                },
                {
                    key: 'juejin',
                    icon: 'halocoloricon-juejin',
                    name: '掘金地址',
                    value: ''
                },

                {
                    key: 'weibo',
                    icon: 'halocoloricon-social-weibo',
                    name: '微博地址',
                    value: ''
                },
                {
                    key: 'email',
                    icon: 'halocoloricon-ic_email_round',
                    name: '邮箱地址',
                    value: ''
                }
            ]
        };
    },
    computed: {
        authorConfig() {
            return this.$tm.vx.getters().getConfigs.authorConfig;
        },
        bloggerInfo() {
            let blogger = this.authorConfig.blogger;
            blogger.avatar = this.$utils.checkAvatarUrl(blogger.avatar, true);
            return blogger;
        },
        socialConfig() {
            return this.authorConfig.social;
        },
        calcIsNotEmpty() {
            return this.result.some((item) => item.value !== "");
        }
    },
    watch: {
        socialConfig: {
            handler(newVal) {
                if (!newVal) return;
                this.fnGetData();
            },
            deep: true,
            immediate: true
        }
    },
    onLoad() {
        this.fnSetPageTitle('联系博主');
    },
    methods: {
        fnGetData() {
            for (let key in this.socialConfig) {
                if (key === 'enabled') {
                    continue;
                }
                this.result.find(x => x.key === key).value = this.socialConfig[key];
            }
        },
        fnOnClick(item) {
            this.$utils.copyText(item.value, item.name + ' 已复制！');
            // if (this.globalAppSettings.contact.isLinkCopy && this.$utils.checkIsUrl(item.value)) {
            //     uni.navigateTo({
            //         url: '/pagesC/website/website?data=' +
            //             JSON.stringify({
            //                 title: item.name,
            //                 url: item.value
            //             })
            //     });
            // } else {
            //     this.$utils.copyText(item.value, item.name + ' 已复制！');
            // }
        }
    }
};
</script>

<style lang="scss" scoped>
.app-page {
    width: 100vw;
    min-height: 100vh;
    box-sizing: border-box;
    padding-top: 160rpx;
}

.profile {
    .avatar {
        width: 170rpx;
        height: 170rpx;
        position: relative;
        box-sizing: border-box;
        border-radius: 50%;
        border: 6rpx solid #fff;
        box-shadow: 0rpx 2rpx 24rpx rgba(0, 0, 0, 0.07);
        overflow: hidden;

        &-img {
            width: 100%;
            height: 100%;
        }
    }

    .nickname {
        font-size: 38rpx;
    }
}

.contact-icons {
    .halocoloricon {
        font-size: 42rpx;
    }
}

.contact {
    box-sizing: border-box;
    border-top: 2rpx solid #f2f2f2;

    .item {
        box-sizing: border-box;
        border-radius: 12rpx;
        background-color: #fafafa;
        // background-color: rgba(0, 0, 0, 0.05);
        // padding-bottom: 12rpx;
        // border-bottom: 2rpx solid #eee;
        padding: 16rpx;

        .left {
            position: relative;
            width: 140rpx;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            // background-color: rgba(0, 0, 0, 0.03);
            border-radius: 12rpx 0 0 12rpx;

            &::after {
                display: none;
                content: ':';
                position: absolute;
                right: 18rpx;
                top: 50%;
                transform: translateY(-50%);
                font-size: 24rpx;
                color: #666;
            }

            .icon {
                font-size: 24rpx;
            }

            .name {
                margin-left: 10rpx;
                color: #555;
                font-size: 24rpx;
            }
        }

        .right {
            width: 0;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            box-sizing: border-box;
            word-wrap: break-word;
            word-break: break-all;
            font-size: 24rpx;
            box-sizing: border-box;
            padding-left: 12rpx;
        }
    }
}
</style>
