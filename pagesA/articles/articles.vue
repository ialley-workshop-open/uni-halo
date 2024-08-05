<template>
    <view class="app-page" :class="{ 'is-balck grey-darken-6': isBlackTheme }">
        <!-- 顶部切换 -->
        <view class="e-fixed shadow-2">
            <tm-search v-model="queryParams.keyword" :round="24" :shadow="0" color="light-blue"
                       insert-color="light-blue" :clear="true" @input="fnOnSearch" @confirm="fnOnSearch"></tm-search>
            <tm-tabs v-if="false" color="light-blue" :shadow="0" v-model="tab.activeIndex" :list="tab.list"
                     align="center" @change="fnOnTabChange"></tm-tabs>
        </view>
        <!-- 占位区域 -->
        <view style="width: 100vw;height: 100rpx;"></view>
        <!-- 加载区域 -->
        <view v-if="loading != 'success'" class="loading-wrap pa-24">
            <tm-skeleton model="listAvatr"></tm-skeleton>
            <tm-skeleton model="listAvatr"></tm-skeleton>
            <tm-skeleton model="listAvatr"></tm-skeleton>
            <tm-skeleton model="listAvatr"></tm-skeleton>
        </view>
        <!-- 内容区域 -->
        <view v-else class="content">
            <view v-if="dataList.length == 0" class="content-empty flex flex-center">
                <!-- 空布局 -->
                <tm-empty v-if="!queryParams.keyword" icon="icon-shiliangzhinengduixiang-" label="请输入关键词搜索"></tm-empty>
                <tm-empty v-else icon="icon-shiliangzhinengduixiang-"
                          :label="`未搜到 ${queryParams.keyword} 相关内容`"></tm-empty>
            </view>
            <block v-else>
                <!-- 文章卡片 -->
                <tm-translate v-for="(article, index) in dataList" :key="article.metadataName" animation-name="fadeUp"
                              :wait="calcAniWait(index)">
                    <view class="article-card" @click="fnToArticleDetail(article)">
                        <rich-text style="font-size: 32rpx;font-weight: bold;color: #333;"
                                   :nodes="article.title"></rich-text>
                        <rich-text style="font-size: 28rpx;margin-top: 16rpx;color: #555;"
                                   :nodes="article.content"></rich-text>
                        <text style="font-size: 24rpx;margin-top: 24rpx;color:#888">
                            最近更新：{{ {d: article.updateTimestamp, f: 'yyyy年MM月dd日 HH点mm分ss秒'} | formatTime }}
                        </text>
                    </view>
                </tm-translate>

                <tm-flotbutton @click="fnToTopPage" size="m" color="light-blue" icon="icon-angle-up"></tm-flotbutton>

            </block>
        </view>
    </view>
</template>

<script>
import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
import tmSearch from '@/tm-vuetify/components/tm-search/tm-search.vue';
import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
import tmTabs from '@/tm-vuetify/components/tm-tabs/tm-tabs.vue';
import tmFlotbutton from '@/tm-vuetify/components/tm-flotbutton/tm-flotbutton.vue';
import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';

export default {
    components: {
        tmSkeleton,
        tmSearch,
        tmTranslate,
        tmTabs,
        tmFlotbutton,
        tmEmpty
    },
    data() {
        return {
            isBlackTheme: false,
            loading: 'loading',
            tab: {
                activeIndex: 0,
                list: ['全部', '最新文章', '热门文章', '最近更新', '最多点赞']
            },
            queryParams: {
                keyword: "",
                limit: 5,
                highlightPreTag: "<text>",
                highlightPostTag: "</text>"
            },
            cache: {
                dataList: [],
                total: 0
            },
            dataList: []
        };
    },
    computed: {
      haloConfigs() {
        return this.$tm.vx.getters().getConfigs;
      },
    },
    onLoad() {
        this.fnSetPageTitle('内容搜索');
    },
    created() {
        if (!this.queryParams.keyword) {
            this.loading = 'success'
        } else {
            this.fnGetData();
        }
    },
    onPullDownRefresh() {
        this.fnResetSetAniWaitIndex();
        this.fnGetData();
    },

    methods: {
        fnOnTabChange(index) {
            this.fnResetSetAniWaitIndex();
            this.dataList = [];
            const _sorts = {
                0: '',
                1: 'topPriority,createTime,desc',
                2: 'topPriority,visits,desc',
                3: 'topPriority,updateTime,desc',
                4: 'topPriority,likes,desc'
            };
            this.queryParams.sort = _sorts[index];
            this.dataList = [];
            this.fnToTopPage();
            this.fnGetData();
        },
        fnOnSearch() {
            this.fnResetSetAniWaitIndex();

            if (!this.queryParams.keyword) {
                this.dataList = []
            } else {
                this.fnGetData();
            }
        },
        fnGetData() {
            if (this.haloConfigs.basicConfig.auditModeEnabled) {
              return;
            }
            // 设置状态为加载中
			      this.loading = 'loading';
            this.$httpApi.v2
                .getPostListByKeyword(this.queryParams)
                .then(res => {
                    this.loading = 'success';
                    this.dataList = res.hits;
                })
                .catch(err => {
                    console.error(err);
                    this.loading = 'error';
                })
                .finally(() => {
                    setTimeout(() => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                    }, 800);
                });
        },

        //跳转文章详情
        fnToArticleDetail(article) {
            uni.navigateTo({
                url: '/pagesA/article-detail/article-detail?name=' + article.metadataName,
                animationType: 'slide-in-right'
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
    padding-bottom: 24rpx;
    background-color: #fafafd;

    &.is-balck {
        background-color: #212121;
    }
}

.content {
    padding-top: 24rpx;

    .content-empty {
        height: 60vh;
    }
}

.article-card {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    margin: 0 24rpx;
    padding: 24rpx;
    border-radius: 12rpx;
    background-color: #ffff;
    box-shadow: 0rpx 2rpx 24rpx rgba(0, 0, 0, 0.03);
    overflow: hidden;
    margin-bottom: 24rpx;
}
</style>
