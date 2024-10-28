<template>
    <view class="app-page">
        <tm-menubars iconColor="white" color="white" :flat="true" :showback="false">
            <view slot="left">
                <image @click="fnOnLogoToPage" class="logo ml-24 round-24" :src="appInfo.logo" mode="scaleToFill"/>
            </view>
            <view class="search-input round-12 pt-12 pb-12 flex pl-24" @click="fnToSearch">
                <text class="search-input_icon iconfont text-size-m icon-search text-grey"></text>
                <view class="search-input_text pl-12 text-size-m text-grey">搜索内容...</view>
            </view>
            <!-- #ifdef APP-PLUS || H5 -->
            <view slot="right" class="mr-24 text-size-m text-grey text-overflow">{{ appInfo.name }}</view>
            <!-- #endif -->
        </tm-menubars>
        <view v-if="loading !== 'success' && articleList.length===0" class="loading-wrap">
            <tm-skeleton model="card"></tm-skeleton>
            <tm-skeleton model="cardActions"></tm-skeleton>
            <tm-skeleton model="list"></tm-skeleton>
            <tm-skeleton model="listAvatr"></tm-skeleton>
            <tm-skeleton model="listAvatr"></tm-skeleton>
            <tm-skeleton model="listAvatr"></tm-skeleton>
        </view>
        <block v-else>
            <view class="bg-white pb-24">
                <view class="banner bg-white ml-24 mr-24 mt-12 round-3" v-if="bannerList.length !== 0">
                    <e-swiper :dotPosition="globalAppSettings.banner.dotPosition" :autoplay="true"
                              :useDot="globalAppSettings.banner.useDot" :list="bannerList"
                              @on-click="fnOnBannerClick"></e-swiper>
                </view>
            </view>
            <!-- 精品分类 -->
            <block v-if="calcIsShowCategory">
                <view class="flex flex-between mt-16 mb-24 pl-24 pr-24">
                    <view class="page-item_title text-weight-b ">精品分类</view>
                    <view class="show-more flex flex-center bg-white round-3" @click="fnToCategoryPage">
                        <text class="iconfont icon-angle-right text-size-s text-grey-darken-1"></text>
                    </view>
                    <view v-if="false" class="flex flex-center text-size-s text-grey-darken-1"
                          @click="fnToCategoryPage">
                        <text class=" text-size-m">查看更多</text>
                        <text class="iconfont icon-angle-right  text-size-s "></text>
                    </view>
                </view>
                <scroll-view class="category" scroll-x="true">
                    <view v-if="categoryList.length === 0" class="cate-empty round-3 mr-5 flex flex-center text-grey">
                        还没有任何分类~
                    </view>
                    <block v-else>
                        <view class="content" v-for="(category, index) in categoryList" :key="category.metadata.name"
                              @click="fnToCategoryBy(category)">
                            <category-mini-card :category="category"></category-mini-card>
                        </view>
                    </block>
                </scroll-view>
            </block>

            <!-- 最新文章 -->
            <view class="flex flex-between mt-24 mb-24 pl-24 pr-24">
                <view class="page-item_title text-weight-b">最新列表</view>
                <view class="show-more flex flex-center bg-white round-3" @click="fnToArticlesPage">
                    <text class="iconfont icon-angle-right text-size-s text-grey-darken-1"></text>
                </view>
                <view v-if="false" class="flex flex-center text-size-s text-grey-darken-1" @click="fnToArticlesPage">
                    <text class=" text-size-m ">查看更多</text>
                    <text class="iconfont icon-angle-right text-size-s "></text>
                </view>
            </view>
            <view v-if="articleList.length === 0" class="article-empty">
                <tm-empty icon="icon-shiliangzhinengduixiang-" label="博主还没有发表任何内容~"></tm-empty>
            </view>
            <block v-else>
                <view :class="globalAppSettings.layout.home">
                    <tm-translate v-for="(article, index) in articleList" :key="index" class="ani-item"
                                  animation-name="fadeUp" :wait="calcAniWait(index)">
                        <article-card from="home" :article="article" :post="article"
                                      @on-click="fnToArticleDetail"></article-card>
                    </tm-translate>
                </view>
                <view class="load-text mt-12">{{ loadMoreText }}</view>
                <tm-flotbutton v-if="articleList.length > 10" color="light-blue" @click="fnToTopPage" size="m"
                               icon="icon-angle-up"></tm-flotbutton>
            </block>
        </block>
    </view>
</template>

<script>
import tmMenubars from '@/tm-vuetify/components/tm-menubars/tm-menubars.vue';
import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
import tmFlotbutton from '@/tm-vuetify/components/tm-flotbutton/tm-flotbutton.vue';
import tmIcons from '@/tm-vuetify/components/tm-icons/tm-icons.vue';
import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';

import eSwiper from '@/components/e-swiper/e-swiper.vue';
import qs from 'qs'

export default {
    components: {
        tmMenubars,
        tmSkeleton,
        tmTranslate,
        tmFlotbutton,
        tmIcons,
        tmEmpty,
        eSwiper
    },
    data() {
        return {
            loading: 'loading',
            queryParams: {
                size: 5,
                page: 1,
                sort: ['spec.pinned,desc', 'spec.publishTime,desc']
            },
            result: {},
            isLoadMore: false,
            loadMoreText: '加载中...',
            bannerCurrent: 0,
            bannerList: [],
            noticeList: [],
            articleList: [],
            categoryList: [],
        };
    },
    computed: {
        haloConfigs() {
            return this.$tm.vx.getters().getConfigs;
        },
        bloggerInfo() {
            const blogger = this.$tm.vx.getters().getConfigs.authorConfig.blogger;
            blogger.avatar = this.$utils.checkAvatarUrl(blogger.avatar, true);
            return blogger;
        },
        appInfo() {
            const appInfo = this.haloConfigs.appConfig.appInfo;
            appInfo.logo = this.$utils.checkImageUrl(appInfo.logo)
            return appInfo;
        },
        mockJson() {
            return this.$tm.vx.getters().getMockJson;
        },
        calcIsShowCategory() {
            if (this.haloConfigs.basicConfig.auditModeEnabled && this.categoryList.length !== 0) {
                return false
            }
            if (this.haloConfigs.basicConfig.auditModeEnabled) {
                return false
            }
            return this.haloConfigs.pageConfig.homeConfig.useCategory
        }
    },
    onLoad() {
        this.fnSetPageTitle();
    },
    created() {
        this.fnQuery();
    },
    onPullDownRefresh() {
        this.isLoadMore = false;
        this.queryParams.page = 1;
        this.fnQuery();
    },
    onReachBottom(e) {
        if (this.haloConfigs.basicConfig.auditModeEnabled) {
            uni.showToast({
                icon: 'none',
                title: '没有更多数据了'
            });
            return
        }
        if (this.result.hasNext) {
            this.queryParams.page += 1;
            this.isLoadMore = true;
            this.fnGetArticleList();
        } else {
            uni.showToast({
                icon: 'none',
                title: '没有更多数据了'
            });
        }
    },
    methods: {
        fnQuery() {
            console.log('this.mockJson', this.mockJson)
            this.fnGetBanner();
            this.fnGetArticleList();
            this.fnGetCategoryList();
        },
        fnGetCategoryList() {
            if (this.haloConfigs.basicConfig.auditModeEnabled) {
                this.categoryList = this.mockJson.home.categoryList.map((item) => {
                    return {
                        metadata: {
                            name: Date.now() * Math.random(),
                        },
                        spec: {
                            displayName: item.title,
                            cover: item.cover
                        },
                        postCount: 0
                    }
                });
                return;
            }

            if (!this.calcIsShowCategory) {
                return;
            }

            this.$httpApi.v2
                .getCategoryList({})
                .then(res => {
                    this.categoryList = res.items.sort((a, b) => {
                        return b.postCount - a.postCount;
                    });

                    setTimeout(() => {
                        this.loading = 'success';
                    }, 500);
                })
                .catch(err => {
                    console.error(err);
                    this.loading = 'error';
                })
                .finally(() => {
                    setTimeout(() => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                    }, 500);
                });
        },
        // 获取轮播图
        fnGetBanner() {
            if (this.haloConfigs.basicConfig.auditModeEnabled) {
                this.bannerList = this.mockJson.home.bannerList.map((item) => {
                    return {
                        mp4: '',
                        id: Date.now() * Math.random(),
                        nickname: this.haloConfigs.authorConfig.blogger.nickname,
                        avatar: this.$utils.checkAvatarUrl(this.haloConfigs.authorConfig.blogger.avatar),
                        address: '',
                        createTime: item.time,
                        title: item.title,
                        src: this.$utils.checkThumbnailUrl(item.cover),
                        image: this.$utils.checkThumbnailUrl(item.cover)
                    }
                });
                return;
            }
            const _this = this;
            const _format = function (list) {
                return list.map((item, index) => {
                    return {
                        mp4: '',
                        id: item.metadata.name,
                        nickname: item.owner.displayName,
                        avatar: _this.$utils.checkAvatarUrl(item.owner.avatar),
                        address: '',
                        createTime: uni.$tm.dayjs(item.spec.publishTime).fromNow(),
                        title: item.spec.title,
                        src: _this.$utils.checkThumbnailUrl(item.spec.cover),
                        image: _this.$utils.checkThumbnailUrl(item.spec.cover)
                    };
                });
            };

            const paramsStr = qs.stringify(this.queryParams, {
                allowDots: true,
                encodeValuesOnly: true,
                skipNulls: true,
                encode: true,
                arrayFormat: 'repeat'
            })
            uni.request({
                url: this.$baseApiUrl + '/apis/api.content.halo.run/v1alpha1/posts?' + paramsStr,
                method: 'GET',
                success: (res) => {
                    this.bannerList = _format(res.data.items);
                },
                fail: (err) => {
                }
            })

        },
        fnOnBannerChange(e) {
            this.bannerCurrent = e.current;
        },
        fnOnBannerClick(item) {
            if (this.haloConfigs.basicConfig.auditModeEnabled) {
                return;
            }
            if (item.id === '') return;
            this.fnToArticleDetail({
                metadata: {
                    name: item.id
                }
            });
        },
        // 文章列表
        fnGetArticleList() {
            if (this.haloConfigs.basicConfig.auditModeEnabled) {
                this.articleList = this.mockJson.home.postList.map((item) => {
                    return {
                        metadata: {
                            name: Date.now() * Math.random(),
                        },
                        spec: {
                            pinned: false,
                            cover: item.cover,
                            title: item.title,
                            publishTime: item.time
                        },
                        status: {
                            excerpt: item.desc
                        },
                        stats: {
                            visit: 0
                        }
                    }
                });
                this.loading = 'success';
                this.loadMoreText = '呜呜，没有更多数据啦~';
                uni.hideLoading();
                uni.stopPullDownRefresh();
                return;
            }
            // 设置状态为加载中
            if (!this.isLoadMore) {
                this.loading = 'loading';
            }
            this.loadMoreText = '加载中...';

            const paramsStr = qs.stringify(this.queryParams, {
                allowDots: true,
                encodeValuesOnly: true,
                skipNulls: true,
                encode: true,
                arrayFormat: 'repeat'
            })
            uni.request({
                url: this.$baseApiUrl + '/apis/api.content.halo.run/v1alpha1/posts?' + paramsStr,
                method: 'GET',
                success: (res) => {
                    const data = res.data;
                    this.result.hasNext = data.hasNext;
                    if (this.isLoadMore) {
                        this.articleList = this.articleList.concat(data.items);
                    } else {
                        this.articleList = data.items;
                    }
                    this.loading = 'success';
                    this.loadMoreText = data.hasNext ? '上拉加载更多' : '呜呜，没有更多数据啦~';
                    uni.hideLoading();
                    uni.stopPullDownRefresh();
                },
                fail: (err) => {
                    this.loading = 'error';
                    this.loadMoreText = '加载失败，请下拉刷新！';
                    uni.$tm.toast(err.message || '数据加载失败！');
                    uni.stopPullDownRefresh();
                }
            })
        },
        //跳转文章详情
        fnToArticleDetail(article) {
            if (this.haloConfigs.basicConfig.auditModeEnabled) {
                return;
            }
            uni.navigateTo({
                url: '/pagesA/article-detail/article-detail?name=' + article.metadata.name,
                animationType: 'slide-in-right'
            });
        },
        // 快捷导航页面跳转
        fnToNavPage(item) {
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
        // 分类页面
        fnToCategoryPage() {
            uni.switchTab({
                url: '/pages/tabbar/category/category'
            });
        },
        // 所有的文章列表页面
        fnToArticlesPage() {
            uni.navigateTo({
                url: '/pagesA/articles/articles'
            });
        },

        // 根据slug查询分类下的文章
        fnToCategoryBy(category) {
            if (this.haloConfigs.basicConfig.auditModeEnabled) {
                return;
            }
            uni.navigateTo({
                url: `/pagesA/category-detail/category-detail?name=${category.metadata.name}&title=${category.spec.displayName}`
            });
        },

        fnChangeMode() {
            const isBlackTheme = this.$tm.vx.state().tmVuetify.black;
            this.$tm.theme.setBlack(!isBlackTheme);
            uni.setNavigationBarColor({
                backgroundColor: !isBlackTheme ? '#0a0a0a' : '#ffffff',
                frontColor: !isBlackTheme ? '#ffffff' : '#0a0a0a'
            });
        },

        fnToSearch() {
            uni.navigateTo({
                url: '/pagesA/articles/articles'
            });
        },
        fnOnLogoToPage() {
            uni.switchTab({
                url: '/pages/tabbar/about/about'
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
    // background-color: #ffffff;

    .logo {
        width: 60rpx;
        height: 60rpx;
        box-sizing: border-box;
    }

    ::v-deep {
        .tm-menubars .body .body_wk .left {
            min-width: initial;
        }
    }
}

.loading-wrap {
    padding: 24rpx;
}

.search-input {
    background-color: #f5f5f5;
    align-items: center;
    /* #ifdef MP-WEIXIN */
    margin-right: 24rpx;

    /* #endif */
    &_icon {
    }

    &_text {
    }
}

.show-more {
    width: 42rpx;
    height: 42rpx;
    box-sizing: border-box;
    box-shadow: 0rpx 0rpx 24rpx rgba(0, 0, 0, 0.03);
}

.banner {
    overflow: hidden;
}

.quick-nav {
    background-color: #fff;
    box-sizing: border-box;

    // box-shadow: 0rpx 2rpx 24rpx rgba(0, 0, 0, 0.03);
    .name {
        color: var(--main-text-color);
    }
}

.category {
    width: 94vw;
    display: flex;
    height: 200rpx;
    white-space: nowrap;
    margin: 0 24rpx;

    .content {
        display: inline-block;
        padding-left: 24rpx;

        &:first-child {
            padding-left: 0;
        }
    }

    .cate-empty {
        height: inherit;
    }
}

.page-item {
    &_title {
        position: relative;
        padding-left: 24rpx;
        font-size: 32rpx;
        z-index: 1;
        color: var(--main-text-color);

        &:before {
            content: '';
            position: absolute;
            left: 0rpx;
            top: 8rpx;
            width: 8rpx;
            height: 30rpx;
            background-color: rgba(33, 150, 243, 1);
            border-radius: 6rpx;
            z-index: 0;
        }
    }
}

.h_row_col2 {
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding: 0 12rpx;

    .ani-item {
        width: 50%;
    }
}
</style>
