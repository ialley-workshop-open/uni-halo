<template>
    <view class="app-page card-shadow">
        <view v-if="loading != 'success'" class="loading-wrap">
            <tm-skeleton model="listAvatr"></tm-skeleton>
            <tm-skeleton model="listAvatr"></tm-skeleton>
            <tm-skeleton model="listAvatr"></tm-skeleton>
            <tm-skeleton model="listAvatr"></tm-skeleton>
            <tm-skeleton model="listAvatr"></tm-skeleton>
        </view>
        <view v-else class="content" :class="{ 'bg-white': dataList.length !== 0 }">
            <!-- 空数据 -->
            <view v-if="dataList.length == 0" class="content-empty flex flex-center">
                <tm-empty icon="icon-shiliangzhinengduixiang-" label="啊偶,博主还没有朋友呢~"></tm-empty>
            </view>

            <!-- 如果只有一个分组：使用列表的形式 dataList.length == 1 -->
            <view v-else class="flex flex-col pb-24">
                <block v-for="(link, index) in dataList" :key="index">
                    <tm-translate animation-name="fadeUp" :wait="calcAniWait(index)">
                        <!-- 色彩版本 -->
                        <view v-if="!globalAppSettings.links.useSimple" class="info flex pt-24 pb-24 pl-12 pr-12"
                              :class="{ 'border-b-1': index !== dataList.length - 1 }" @click="fnOnLinkEvent(link)">
                            <view class="link-logo">
                                <cache-image class="link-logo_img" radius="12rpx" :url="link.spec.logo"
                                             :fileMd5="link.spec.logo" mode="aspectFill"></cache-image>
                            </view>
                            <view class="flex flex-col pl-30 info-detail">
                                <view class="link-card_name text-size-l text-weight-b text-red">
                                    <tm-tags style="margin-right: 12rpx;margin-left: -2rpx;"
                                             color="bg-gradient-light-blue-lighten" :shadow="0" size="s" model="fill">
                                        {{ link.spec.groupName || '暂未分组' }}
                                    </tm-tags>
                                    {{ link.spec.displayName }}
                                </view>
                                <view class="poup-tag mt-6" style="font-size: 28rpx;">
                                    站点地址：{{ link.spec.url }}
                                    <!-- <tm-tags color="bg-gradient-amber-accent" :shadow="0" size="s" model="fill">
                                        URL：{{ link.spec.url }}
                                    </tm-tags>
                                    <tm-tags color=" bg-gradient-light-blue-lighten" :shadow="0" size="s" model="fill">
                                        {{ link.spec.groupName || '暂未分组' }}
                                    </tm-tags> -->
                                </view>
                                <view class="link-card_desc text-overflow mt-4" style="font-size: 28rpx;">
                                    博客简介：{{ link.spec.description || '这个博主很懒，没写简介~' }}
                                </view>
                            </view>
                        </view>
                        <!-- 简洁版本 -->
                        <view v-else class="link-card flex ml-24 mr-24 pt-24 pb-24" @click="fnOnLinkEvent(link)">
                            <image class="logo shadow-6" :src="link.spec.logo" mode="aspectFill"></image>
                            <view class="info pl-24">
                                <view class="name text-size-g">{{ link.spec.displayName }}</view>
                                <view class="desc mt-12 text-size-s text-grey-darken-1">{{ link.spec.description }}
                                </view>
                                <view v-if="false" class="link mt-12 text-size-m text-grey-darken-1">
                                    <text class="iconfont icon-link mr-6 text-size-s"></text>
                                    {{ link.spec.url }}
                                </view>
                            </view>
                        </view>
                    </tm-translate>
                </block>
            </view>

            <!-- 返回顶部 -->
            <tm-flotbutton color="light-blue" @click="fnToTopPage" size="m" icon="icon-angle-up"></tm-flotbutton>
            <tm-flotbutton v-if="haloPluginConfigs.submitLink.enabled" :offset="[16,80]" label="申请"
                           actions-pos="left" :show-text="true" color="bg-gradient-orange-accent"
                           @click="toSubmitLinkPage"></tm-flotbutton>
            <!-- 详情弹窗 -->
            <tm-poup v-model="detail.show" :width="640" height="auto" position="center" :round="6">
                <view class="poup pa-36" v-if="detail.data">
                    <view class="info flex">
                        <view class="poup-logo bg-gradient-amber-accent pa-4 shadow-24">
                            <image class="poup-logo_img" :src="$utils.checkImageUrl(detail.data.spec.logo)" mode="aspectFill"></image>
                        </view>
                        <view class="pl-24 info-detail">
                            <view class="poup-name text-size-lg text-weight-b">{{ detail.data.spec.displayName }}</view>
                            <view class="poup-tag ml--10">
                                <tm-tags color="bg-gradient-light-blue-lighten" size="n" model="fill">
                                    {{ detail.data.spec.groupName }}
                                </tm-tags>
                            </view>
                            <view class="poup-link text-size-m" @click="fnCopyLink(detail.data)">
                                <text class="text-orange">{{ detail.data.spec.url }}</text>
                                <text class="iconfont icon-copy text-size-s ml-6 text-grey"></text>
                            </view>
                        </view>
                    </view>

                    <view class="poup-desc mt-20">
                        博客简介：{{ detail.data.spec.description || '这个博主很懒，没写简介~' }}
                    </view>

                    <!-- 博客预览图 -->
                    <view class="mt-24">
                        <tm-images :width="568" :round="2" :src="calcSiteThumbnail(detail.data.spec.url)"
                                   mode="aspectFill"></tm-images>
                    </view>
                </view>
            </tm-poup>

            <view class="load-text">{{ loadMoreText }}</view>
        </view>
    </view>
</template>

<script>
import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
import tmFlotbutton from '@/tm-vuetify/components/tm-flotbutton/tm-flotbutton.vue';
import tmTags from '@/tm-vuetify/components/tm-tags/tm-tags.vue';
import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';
import tmImages from '@/tm-vuetify/components/tm-images/tm-images.vue';
import tmPoup from '@/tm-vuetify/components/tm-poup/tm-poup.vue';

export default {
    components: {
        tmSkeleton,
        tmTranslate,
        tmFlotbutton,
        tmTags,
        tmEmpty,
        tmImages,
        tmPoup
    },
    data() {
        return {
            loading: 'loading',
            queryParams: {
                size: 10,
                page: 1
            },
            detail: {
                show: false,
                data: null
            },
            hasNext: false,
            isLoadMore: false,
            loadMoreText: '',
            linkGroupList: [],
            dataList: [],
            colors: [
                '#39B449',
                '#E44C41',
                '#8698A2',
                '#0080FE',
                '#1CBCB4',
                '#6638B5'
            ]
        };
    },
    computed: {
        haloConfigs() {
            return this.$tm.vx.getters().getConfigs;
        },
        haloPluginConfigs() {
            return this.$tm.vx.getters().getConfigs.pluginConfig;
        },
        calcSiteThumbnail(val) {
            return val => {
                if (!val) return '';
                if (val.charAt(val.length - 1) !== '/') {
                    val = val + '/';
                }
                return 'https://image.thum.io/get/width/1000/crop/800/' + val;
            };
        }
    },
    onLoad() {
        this.fnSetPageTitle('友情链接');
        this.fnGetLinkGroupData();
    },
    onPullDownRefresh() {
        this.isLoadMore = false;
        this.queryParams.page = 1;
        this.dataList = []
        this.fnGetData();
    },
    onReachBottom(e) {
        if (this.hasNext) {
            this.queryParams.page += 1;
            this.isLoadMore = true;
            this.fnGetData();
        } else {
            uni.showToast({
                icon: 'none',
                title: '没有更多数据了'
            });
        }
    },
    methods: {
        fnGetLinkGroupData() {
            this.$httpApi.v2
                .getFriendLinkGroupList({
                    page: 1,
                    size: 0
                })
                .then(res => {
                    this.linkGroupList = res.items;
                    this.fnGetData()
                })
                .catch(err => {
                    console.error(err);
                });
        },
        findLinkGroupDisplayNameByGroupMetadataName(groupName) {
            if (this.linkGroupList.length === 0) return groupName || "未分组"
            return this.linkGroupList.find(item => item.metadata.name === groupName)?.spec?.displayName || groupName || "未分组"
        },
        fnGetData() {
            if (this.haloConfigs.basicConfig.auditModeEnabled) {
              return;
            }
            if (!this.isLoadMore) {
                this.loading = 'loading';
            }
            this.loadMoreText = '';
            this.$httpApi.v2
                .getFriendLinkList(this.queryParams)
                .then(res => {
                    console.log('请求结果：');
                    console.log(res);
                    this.hasNext = res.hasNext;
                    const list = res.items.map(item => {
                        item.spec.logo = this.$utils.checkAvatarUrl(item.spec?.logo)
                        item.spec.groupName = this.findLinkGroupDisplayNameByGroupMetadataName(item.spec?.groupName)
                        return item;
                    })
                    this.dataList = this.dataList.concat(list);
                    setTimeout(() => {
                        this.loading = 'success';
                        this.loadMoreText = res.hasNext ? '上拉加载更多' : '呜呜，没有更多数据啦~';
                    }, 500);

                })
                .catch(err => {
                    console.error(err);
                    this.loading = 'error';
                    this.loadMoreText = '加载失败，请下拉刷新！';
                })
                .finally(() => {
                    setTimeout(() => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                    }, 500);
                });
        },

        handleGroup(list) {
            const group = {}
            list.forEach(item => {
                if (group[item.spec.groupName]) {
                    group[item.spec.groupName].children.push(item)
                } else {
                    group[item.spec.groupName] = {
                        title: item.spec.groupName,
                        children: [item]
                    }
                }
            })

            return Object.keys(group).map(key => {
                const {
                    title,
                    children = []
                } = group[key]
                return {
                    title,
                    children
                }
            })
        },
        fnOnLinkEvent(link) {
            this.detail.data = link;
            this.detail.show = true;
        },

        fnCopyLink(link) {
            uni.setClipboardData({
                data: `${link.spec.displayName}:${link.spec.url}`,
                showToast: false,
                success: () => {
                    uni.showToast({
                        icon: 'none',
                        title: '链接复制成功！'
                    });
                },
                fail: () => {
                    uni.showToast({
                        icon: 'none',
                        title: '复制失败！'
                    });
                }
            });
        },
        toSubmitLinkPage() {
            uni.navigateTo({
                url: '/pagesA/submit-link/submit-link'
            })
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
    background-color: #fafafd;
}

.loading-wrap {
    padding: 24rpx;
    min-height: 100vh;
}

.content {
    padding: 0 24rpx;
    padding-top: 24rpx;

    .content-empty {
        height: 60vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

.link-card {
    border-bottom: 2rpx solid #f5f5f5;
    background-color: #ffffff;

    &.one {
        border: 0;
        box-shadow: 0rpx 2rpx 24rpx 0rpx rgba(0, 0, 0, 0.03);

        .logo {
            box-shadow: 0rpx 2rpx 12rpx rgba(0, 0, 0, 0.1);
        }
    }

    .logo {
        // width: 126rpx;
        // height: 126rpx;
        width: 80rpx;
        height: 80rpx;
        border-radius: 12rpx;
        border: 6rpx solid #ffffff;
        box-shadow: none;
    }

    .info {
        width: 0;
        flex-grow: 1;

        .name {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #303133;
            font-size: 30rpx;
            font-weight: bold;
        }

        .desc {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #303133;
            font-size: 28rpx;
        }
    }
}

.link-card_name {
    // color: #303133;
    // color: #0080fe;
}

.link-card_desc {
    font-size: 24rpx;
    line-height: 1.6;
    color: #303133;
}

.link-logo {
    width: 140rpx;
    height: 140rpx;

    &_img {
        width: 100%;
        height: 100%;
    }
}

.poup-logo {
    width: 140rpx;
    height: 140rpx;
    border-radius: 50%;

    &_img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
}

.info-detail {
    width: 0;
    flex-grow: 1;
    justify-content: center;
}

.poup-desc {
    font-size: 28rpx;
    line-height: 1.6;
    color: #555 !important;
}

.preview-site {
    width: 100%;
    height: 300rpx;
}
</style>
