<template>
    <view class="app-page">
        <view v-if="loading != 'success'" class="loading-wrap">
            <tm-skeleton model="listAvatr"></tm-skeleton>
            <tm-skeleton model="listAvatr"></tm-skeleton>
            <tm-skeleton model="listAvatr"></tm-skeleton>
            <tm-skeleton model="listAvatr"></tm-skeleton>
        </view>
        <block v-else>
            <view class="empty" v-if="dataList.length == 0">
                <tm-empty icon="icon-shiliangzhinengduixiang-"
                          label="该标签下暂无文章"></tm-empty>
            </view>
            <block v-else>
                <block v-for="(article, index) in dataList" :key="article.metadata.name">
                    <!-- 文章卡片 -->
                    <tm-translate animation-name="fadeUp" :wait="calcAniWait(index)">
                        <article-card :article="article" @on-click="fnToArticleDetail"></article-card>
                    </tm-translate>
                </block>
                <view class="load-text">{{ loadMoreText }}</view>
            </block>

            <tm-flotbutton @click="fnToTopPage" color="light-blue" size="m" icon="icon-angle-up"></tm-flotbutton>
        </block>
    </view>
</template>

<script>
import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
import tmFlotbutton from '@/tm-vuetify/components/tm-flotbutton/tm-flotbutton.vue';
import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';
import ArticleCard from '@/components/article-card/article-card.vue';

export default {
    components: {
        tmSkeleton,
        tmTranslate,
        tmFlotbutton,
        tmEmpty,
        ArticleCard
    },
    data() {
        return {
            loading: 'loading',
            queryParams: {
                name: "",
                size: 10,
                page: 0
            },
            name: '',
            pageTitle: '加载中...',

            dataList: [],
            hasNext: false,
            isLoadMore: false,
            loadMoreText: ''
        };
    },

    onLoad(e) {
        this.name = e.name;
        this.queryParams.name = this.name;
        this.pageTitle = e.title;
        this.fnGetData();
    },
    onPullDownRefresh() {
        this.isLoadMore = false;
        this.queryParams.page = 0;
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
        fnGetData() {
            // uni.showLoading({
            // 	mask: true,
            // 	title: '加载中...'
            // });
            // 设置状态为加载中
            if (!this.isLoadMore) {
                this.loading = 'loading';
            }
            this.loadMoreText = '加载中...';
            this.$httpApi.v2
                .getPostByTagName(this.name, this.queryParams)
                .then(res => {
                    this.fnSetPageTitle(`${this.pageTitle} （共${res.total}篇）`);
                    this.hasNext = res.hasNext;
                    if (this.isLoadMore) {
                        this.dataList = this.dataList.concat(res.items);
                    } else {
                        this.dataList = res.items;
                    }
                    this.loadMoreText = res.hasNext ? '上拉加载更多' : '呜呜，没有更多数据啦~';
                    setTimeout(() => {
                        this.loading = 'success';
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
        //跳转文章详情
        fnToArticleDetail(article) {
            uni.navigateTo({
                url: '/pagesA/article-detail/article-detail?name=' + article.metadata.name,
                animationType: 'slide-in-right'
            });
        }
    }
};
</script>

<style lang="scss">
.app-page {
    width: 100vw;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 24rpx 0;
    background-color: #fafafd;
}

.loading-wrap {
    padding: 0 24rpx;
    min-height: 100vh;
}

.empty {
    height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
