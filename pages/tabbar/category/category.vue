<template>
    <view class="app-page" :style="{
		padding:calcShowType==='list-post'? 0 : '24rpx 0'
	}">
        <view v-if="loading !== 'success'" class="loading-wrap">
            <tm-skeleton model="listAvatr"></tm-skeleton>
            <tm-skeleton model="listAvatr"></tm-skeleton>
            <tm-skeleton model="listAvatr"></tm-skeleton>
        </view>
        <!-- 内容区域 -->
        <view v-else class="app-page-content" :class="[calcShowType==='list-post'?'list-post':'']">
            <view v-if="dataList.length === 0" class="content-empty flex flex-center" style="height: 70vh;">
                <!-- 空布局 -->
                <tm-empty icon="icon-shiliangzhinengduixiang-" label="暂无数据"></tm-empty>
            </view>
            <block v-else>
                <block v-if="calcAuditModeEnabled || calcShowType==='list'">
                    <tm-translate v-for="(item, index) in dataList" :key="index"
                                  style="box-sizing: border-box;width: 50%;padding: 0 8rpx;" animation-name="fadeUp"
                                  :wait="calcAniWait(index)">
                        <view class="catgory-card" :style="{backgroundImage:`url(${item.spec.cover})`}">
                            <view class="content" @click="handleToCategory(item)">
                                <view style="font-size: 32rpx;color: #ffffff;">{{ item.spec.displayName }}</view>
                                <view v-if="!calcAuditModeEnabled"
                                      style="font-size: 24rpx;color: #ffffff;margin-top: 6rpx;">
                                    共 {{ item.postCount }} 篇文章
                                </view>
                            </view>
                        </view>
                    </tm-translate>
                    <view class="load-text">{{ loadMoreText }}</view>
                </block>
                <view v-else-if="calcShowType==='list-post'" class="fulled flex" style="min-height:100vh">
                    <view class="bg-white" :style="{height: '100%'}">
                        <tm-sliderNav :list="categoryList" bg-color="white" color="light-blue" rang-key="displayName"
                                      @change="fnOnCategoryChange"></tm-sliderNav>
                    </view>
                    <scroll-view class="right-content pt-12 pb-12" :scroll-y="true" :scroll-top="scrollTop"
                                 :scroll-with-animation="true" :refresher-enabled="true" :refresher-triggered="triggered"
                                 :refresher-threshold="60" refresher-background="#fafafa"
                                 @refresherrefresh="fnGetPostByCategory(true)" @scrolltolower="fnGetPostByCategory(false)"
                                 @scroll="fnOnScroll" @touchmove.stop @touchstart="fnOnTouchStart" @touchend="fnOnTouchEnd"
                                 @touchcancel="fnOnTouchEnd">
                        <view v-if="postList.length === 0" class="article-empty flex flex-center">
                            <tm-empty :size="120" icon="icon-shiliangzhinengduixiang-" label="该分类下暂无文章~"></tm-empty>
                        </view>
                        <block v-else>
                            <block v-for="(post, index) in postList" :key="post.spec.publishTime">
                                <tm-translate animation-name="fadeUp" :wait="calcAniWait(index)">
                                    <article-min-card :article="post" @on-click="fnToArticleDetail"></article-min-card>
                                </tm-translate>
                            </block>
                            <view class="load-text">{{ loadMoreText }}</view>
                        </block>
                    </scroll-view>
                </view>

                <view class="flot-buttons">
                    <tm-button @click="fnScrollTop" size="m" :fab="true" theme="light-blue"
                               icon="icon-angle-up"></tm-button>
                    <tm-button v-if="!calcAuditModeEnabled" @click="fnChangeShowType" size="m" :fab="true" theme="light-blue"
                               :icon="calcShowType==='list'?'icon-align-left':'icon-all'"></tm-button>
                </view>
            </block>
        </view>

    </view>
</template>

<script>
import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';

import MarkdownConfig from '@/common/markdown/markdown.config.js';
import mpHtml from '@/components/mp-html/components/mp-html/mp-html.vue';
import tmFlowLayout from '@/tm-vuetify/components/tm-flowLayout/tm-flowLayout.vue';
import tmSliderNav from '@/tm-vuetify/components/tm-sliderNav/tm-sliderNav.vue';
import ArticleMinCard from '@/components/article-min-card/article-min-card.vue';


export default {
    components: {
        tmSkeleton,
        tmButton,
        tmTranslate,
        tmEmpty,
        mpHtml,
        tmFlowLayout,
        tmSliderNav,
        ArticleMinCard
    },
    data() {
        return {
            markdownConfig: MarkdownConfig,
            loading: 'loading',
            queryParams: {
                size: 20,
                page: 1,
                fieldSelector: ['spec.hideFromList=false']
            },
            hasNext: false,
            dataList: [],
            categoryList: [],
            isLoadMore: false,
            loadMoreText: '加载中...',
            currentCategoryConfig: {
                type: "list"
            },
            currentCategoryName: "",
            postQueryParams: {
                size: 10,
                page: 0,
            },
            postList: [],
            triggered: false,
            scrollTop: 0,
            tempScrollTop: 0,
            scrollTimeout: null,
        };
    },
    computed: {
        haloConfigs() {
            return this.$tm.vx.getters().getConfigs;
        },
        calcAuditModeEnabled() {
            return this.haloConfigs.auditConfig.auditModeEnabled
        },
        mockJson() {
            return this.$tm.vx.getters().getMockJson;
        },
        categoryConfig() {
            return this.haloConfigs.pageConfig.categoryConfig
        },
        calcShowType() {
            return this.currentCategoryConfig.type
        }
    },
    watch: {
        categoryConfig: {
            deep: true,
            immediate: true,
            handler(newVal) {
                console.log("执行了", newVal)
                if (!newVal) return;
                this.currentCategoryConfig = newVal
                this.handleInitPage()
            },
        }
    },
    onPullDownRefresh() {
        this.isLoadMore = false;
        this.queryParams.page = 0;
        this.fnGetData();
    },
    onReachBottom(e) {
        if (this.calcAuditModeEnabled) {
            uni.showToast({
                icon: 'none',
                title: '没有更多数据了'
            });
            return
        }
        if (this.hasNext) {
            if (this.calcShowType === 'list') {

                this.queryParams.page += 1;
            } else {
                this.postQueryParams.page += 1;
            }
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
        fnChangeShowType() {
            if (this.calcShowType === 'list-post') {
                this.currentCategoryConfig.type = 'list'
            } else {
                this.currentCategoryConfig.type = 'list-post'
            }
            this.handleInitPage();
        },
        handleResetInit() {
            this.postList = []
            this.dataList = []
            this.categoryList = []
            this.queryParams.page = 0;
            this.postQueryParams.page = 0;
            this.hasNext = false
            this.isLoadMore = false
            this.loadMoreText = '加载中...'
            this.currentCategoryName = ""
            this.triggered = false
            this.fnResetSetAniWaitIndex()
        },
        handleInitPage() {
            this.handleResetInit()
            if (this.calcShowType === 'list-post') {
                this.queryParams.size = 99999
            }
            this.fnGetData();
        },
        fnGetData() {
            if (this.calcAuditModeEnabled) {
                this.categoryConfig.type = "list"
                this.dataList = this.mockJson.category.list.map((item) => {
                    return {
                        metadata: {
                            name: Date.now() * Math.random(),
                        },
                        spec: {
                            displayName: item.title,
                            cover: this.$utils.checkImageUrl(item.cover)
                        },
                        postCount: 0
                    }
                });
                this.loading = 'success';
                this.loadMoreText = '呜呜，没有更多数据啦~';
                uni.hideLoading();
                uni.stopPullDownRefresh();
                return;
            }
            uni.showLoading({
                mask: true,
                title: '加载中...'
            });
            // 设置状态为加载中
            if (!this.isLoadMore) {
                this.loading = 'loading';
            }
            this.loadMoreText = '加载中...';
            this.$httpApi.v2
                .getCategoryList(this.queryParams)
                .then(res => {
                    console.log('请求结果：');
                    console.log(res);
                    if (this.calcShowType === 'list') {
                        this.loading = 'success';
                        this.loadMoreText = res.hasNext ? '上拉加载更多' : '呜呜，没有更多数据啦~';
                        // 处理数据
                        this.hasNext = res.hasNext;

                        const tempItems = res.items.map(item => {
                            item.spec.cover = this.$utils.checkThumbnailUrl(item.spec.cover, true)
                            return item;
                        })

                        if (this.isLoadMore) {
                            this.dataList = this.dataList.concat(tempItems);
                        } else {
                            this.dataList = tempItems;
                        }
                    } else {
                        this.dataList = res.items
                        this.categoryList = res.items.map(item => {
                            return {
                                displayName: item.spec.displayName,
                                name: item.metadata.name,
                                ...item,
                            }
                        })
                        this.triggered = false;
                        this.loading = 'success';
                        if (this.dataList.length !== 0) {
                            this.currentCategoryName = this.dataList[0].metadata.name;
                            this.fnGetPostByCategory()
                        }
                    }
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
        handlePreview(index, list) {
            uni.previewImage({
                current: index,
                urls: list.map(item => item.url)
            })
        },
        handleToCategory(data) {
            if (this.calcAuditModeEnabled) {
                return;
            }
            uni.navigateTo({
                url: `/pagesA/category-detail/category-detail?name=${data.metadata.name}&title=${data.spec.displayName}`
            })
        },
        fnGetPostByCategory(isPulldownRefresh = true, triggered = true) {
            if (!isPulldownRefresh) {
                if (this.hasNext) {
                    this.postQueryParams.page += 1;
                } else {
                    return uni.showToast({
                        icon: 'none',
                        title: '没有更多数据了'
                    });
                }
            } else {
                this.postQueryParams.page = 0;
                if (triggered) {
                    this.triggered = true;
                }
            }

            this.$httpApi.v2
                .getCategoryPostList(this.currentCategoryName, this.postQueryParams)
                .then(res => {
                    this.hasNext = res.hasNext;

                    if (!isPulldownRefresh) {
                        this.postList = this.postList.concat(res.items);
                    } else {
                        this.postList = res.items;
                    }
                    this.loadMoreText = res.hasNext ? '上拉加载更多' : '呜呜，没有更多数据啦~';
                })
                .catch(err => {
                    this.loadMoreText = '加载失败！';
                })
                .finally(() => {
                    this.triggered = false;
                });
        },

        fnOnCategoryChange(e) {
            this.fnResetSetAniWaitIndex();
            this.currentCategoryName = this.dataList[e].metadata.name;
            this.fnToTopScroll();
            this.postList = [];
            this.fnGetPostByCategory();
        },

        fnOnScroll(e) {
            this.tempScrollTop = e.detail.scrollTop;
        },
        fnToTopScroll() {
            uni.pageScrollTo({
                scrollTop: 0,
                duration: 500
            });
            this.scrollTop = 0;
            this.tempScrollTop = 0;
        },
        fnOnTouchStart() {
            clearTimeout(this.scrollTimeout);
        },
        fnOnTouchEnd() {
            this.scrollTimeout = setTimeout(() => {
                this.scrollTop = this.tempScrollTop;
            }, 500);
        },
        //跳转文章详情
        fnToArticleDetail(post) {
            uni.navigateTo({
                url: '/pagesA/article-detail/article-detail?name=' + post.metadata.name,
                animationType: 'slide-in-right'
            });
        },
        fnScrollTop() {
            if (this.calcShowType === 'list') {
                this.fnToTopPage()
            } else {
                this.fnToTopScroll()
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.app-page {
    width: 100vw;
    display: flex;
    flex-direction: column;
    padding: 24rpx 0;
}

.auditModeEnabled {
    width: 100%;
    height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.loading-wrap {
    padding: 24rpx;
}

.app-page-content {
    display: flex;
    flex-wrap: wrap;
    padding: 0 12rpx;
    gap: 20rpx 0;

    &.list-post {
        padding: 0;
        gap: 0;
    }
}


.catgory-card {
    width: 100%;
    height: 200rpx;
    position: relative;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    border-radius: 12rpx;
    background-color: #ffff;
    box-shadow: 0rpx 2rpx 24rpx rgba(0, 0, 0, 0.03);
    overflow: hidden;
    background-repeat: no-repeat;
    background-size: cover;

    &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.15);
		backdrop-filter: blur(3rpx);
        z-index: 1;
    }
}

.content {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.load-text {
    width: 100%;
    text-align: center;
}

.flot-buttons {
    position: fixed;
    bottom: 100rpx;
    right: 32rpx;
    flex-direction: column;
    display: flex;
    gap: 6rpx;
    z-index: 999;
}
</style>
