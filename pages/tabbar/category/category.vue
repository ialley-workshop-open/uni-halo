<template>
    <view class="app-page">

        <view v-if="loading !== 'success'" class="loading-wrap">
            <tm-skeleton model="listAvatr"></tm-skeleton>
            <tm-skeleton model="listAvatr"></tm-skeleton>
            <tm-skeleton model="listAvatr"></tm-skeleton>
        </view>
        <!-- 内容区域 -->
        <view v-else class="app-page-content">
            <view v-if="dataList.length === 0" class="content-empty flex flex-center" style="height: 70vh;">
                <!-- 空布局 -->
                <tm-empty icon="icon-shiliangzhinengduixiang-" label="暂无数据"></tm-empty>
            </view>
            <block v-else>
                <tm-translate v-for="(item, index) in dataList" :key="index"
                              style="box-sizing: border-box;width: 50%;padding: 0 8rpx;" animation-name="fadeUp"
                              :wait="calcAniWait(index)">
                    <view class="catgory-card" :style="{backgroundImage:`url(${item.spec.cover})`}">
                        <view class="content" @click="handleToCategory(item)">
                            <view style="font-size: 32rpx;color: #ffffff;">{{ item.spec.displayName }}</view>
                            <view v-if="!haloConfigs.basicConfig.auditModeEnabled" style="font-size: 24rpx;color: #ffffff;margin-top: 6rpx;">
                                共 {{ item.postCount }} 篇文章
                            </view>
                            <view v-else style="font-size: 24rpx;color: #ffffff;margin-top: 6rpx;">
                                共 {{ item.postCount }} 篇内容
                            </view>
                        </view>
                    </view>
                </tm-translate>
                <tm-flotbutton @click="fnToTopPage" size="m" color="light-blue"
                               icon="icon-angle-up"></tm-flotbutton>
                <view class="load-text">{{ loadMoreText }}</view>
            </block>
        </view>

    </view>
</template>

<script>
import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
import tmFlotbutton from '@/tm-vuetify/components/tm-flotbutton/tm-flotbutton.vue';
import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';

import MarkdownConfig from '@/common/markdown/markdown.config.js';
import mpHtml from '@/components/mp-html/components/mp-html/mp-html.vue';

export default {
    components: {
        tmSkeleton,
        tmFlotbutton,
        tmTranslate,
        tmEmpty,
        mpHtml
    },
    data() {
        return {
            markdownConfig: MarkdownConfig,
            loading: 'loading',
            queryParams: {
                size: 20,
                page: 1
            },
            hasNext: false,
            dataList: [],
            isLoadMore: false,
            loadMoreText: '加载中...'
        };
    },
    computed: {
        haloConfigs() {
            return this.$tm.vx.getters().getConfigs;
        },
        mockJson() {
            return this.$tm.vx.getters().getMockJson;
        }
    },
    onLoad() {
        this.fnGetData();
    },
    onPullDownRefresh() {
        this.isLoadMore = false;
        this.queryParams.page = 0;
        this.fnGetData();
    },

    onReachBottom(e) {
        if (this.haloConfigs.basicConfig.auditModeEnabled) {
            uni.showToast({
                icon: 'none',
                title: '没有更多数据了'
            });
            return
        }
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
            if (this.haloConfigs.basicConfig.auditModeEnabled) {
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
            if (this.haloConfigs.basicConfig.auditModeEnabled) {
                return;
            }
            uni.navigateTo({
                url: `/pagesA/category-detail/category-detail?name=${data.metadata.name}&title=${data.spec.displayName}`
            })
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
</style>
