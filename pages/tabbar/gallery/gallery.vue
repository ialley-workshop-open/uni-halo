<template>
    <view class="app-page">
        <!-- 顶部切换 -->
        <view class="e-fixed" v-if="category.list.length > 0">
            <tm-tabs color="light-blue" v-model="category.activeIndex" range-key="displayName" :list="category.list"
                     align="left" @change="fnOnCategoryChange"></tm-tabs>
        </view>
        <!-- 占位区域 -->
        <view v-if="category.list.length > 0" style="width: 100vw;height: 90rpx;"></view>
        <!-- 加载区域 -->
        <view v-if="loading !== 'success'" class="loading-wrap">
            <tm-skeleton model="card"></tm-skeleton>
            <tm-skeleton model="card"></tm-skeleton>
            <tm-skeleton model="card"></tm-skeleton>
            <tm-skeleton model="card"></tm-skeleton>
        </view>
        <!-- 内容区域 -->
        <view class="content" v-else>
            <view v-if="dataList.length === 0" class="content-empty">
                <!-- 空布局 -->
                <tm-empty icon="icon-shiliangzhinengduixiang-" label="博主还没有分享图片~"></tm-empty>
            </view>
            <block v-else>
                <tm-flowLayout ref="wafll" model="desc" style="width: 100%;">
                    <template v-slot:left="{ hdata }">
                        <tm-translate animation-name="fadeUp">
                            <view class="card round-3 overflow white">
                                <tm-images :previmage="false" :src="hdata.item.spec.cover"
                                           @click="fnPreview(hdata.item)"></tm-images>
                            </view>
                        </tm-translate>
                    </template>
                    <template v-slot:right="{ hdata }">
                        <tm-translate animation-name="fadeUp">
                            <view class="card round-3  overflow white">
                                <tm-images :previmage="false" :src="hdata.item.spec.cover"
                                           @click="fnPreview(hdata.item)"></tm-images>
                            </view>
                        </tm-translate>
                    </template>
                </tm-flowLayout>

                <!-- 瀑布流 -->
                <!-- <block v-for="(item, index) in dataList" :key="index">
                    <tm-translate style="box-sizing: border-box;padding: 6rpx;width: 50%;height: 250rpx;"
                                  animation-name="fadeUp" :wait="calcAniWait(index)">
                        <view style="border-radius: 12rpx;overflow: hidden;width: 100%;height: 250rpx;">
                            <image style="width: 100%;height: 100%;" mode="aspectFill" :src="item.spec.cover"
                                   @click="fnPreview(index)"/>
                        </view>
                    </tm-translate>
                </block> -->

                <tm-flotbutton @click="fnToTopPage" color="light-blue" size="m" icon="icon-angle-up"></tm-flotbutton>
                <view class="load-text">{{ loadMoreText }}</view>
            </block>

        </view>
    </view>
</template>

<script>
import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
import tmFlotbutton from '@/tm-vuetify/components/tm-flotbutton/tm-flotbutton.vue';
import tmTags from '@/tm-vuetify/components/tm-tags/tm-tags.vue';
import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';
import tmIcons from '@/tm-vuetify/components/tm-icons/tm-icons.vue';
import tmImages from '@/tm-vuetify/components/tm-images/tm-images.vue';
import tmFlowLayout from '@/tm-vuetify/components/tm-flowLayout/tm-flowLayout.vue';
import tmTabs from '@/tm-vuetify/components/tm-tabs/tm-tabs.vue';

export default {
    components: {
        tmSkeleton,
        tmTranslate,
        tmFlotbutton,
        tmTags,
        tmEmpty,
        tmIcons,
        tmImages,
        tmFlowLayout,
        tmTabs
    },
    data() {
        return {
            isBlackTheme: false,
            loading: 'loading',
            category: {
                activeIndex: 0,
                activeValue: '',
                list: []
            },
            queryParams: {
                size: 10,
                page: 1,
                group: ""
            },
            cache: {
                dataList: [],
                total: 0
            },
            isLoadMore: false,
            loadMoreText: '',
            hasNext: false,
            dataList: []
        };
    },
    filters: {
        filterTakeTime(val) {
            return uni.$tm.dayjs(val).format('DD/MM/YYYY');
        }
    },
    onLoad() {
        this.fnSetPageTitle('个人图库');
        this.fnGetCategory();
    },
    onPullDownRefresh() {
        this.dataList = []
        this.isLoadMore = false;
        this.queryParams.page = 1;
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
        fnOnCategoryChange(index) {
            this.fnResetSetAniWaitIndex();
            this.cache.dataList = []
            this.dataList = [];
            this.queryParams.group = this.category.list[index].name;
            this.queryParams.page = 1;
            this.fnToTopPage();
            this.$nextTick(() => {
                this.$refs.wafll.clear();
                this.fnGetData();
            })
        },
        fnGetCategory() {
            this.$httpApi.v2.getPhotoGroupList({
                page: 1,
                size: 9999
            }).then(res => {
                this.category.list = res.items.map(item => {
                    return {
                        name: item.metadata.name,
                        displayName: item.spec.displayName
                    }
                });
                if (this.category.list.length !== 0) {
                    this.queryParams.group = this.category.list[0].name;
                    this.fnGetData();
                }
            });
        },
        fnGetData() {
            // 设置状态为加载中
            if (!this.isLoadMore) {
                this.loading = 'loading';
            }
            this.loadMoreText = '';
            this.$httpApi.v2
                .getPhotoListByGroupName(this.queryParams)
                .then(res => {
                    this.hasNext = res.hasNext;
                    this.loading = 'success';
                    if (res.items.length !== 0) {
                        const _list = res.items.map((item, index) => {
                            item.spec.cover = this.$utils.checkImageUrl(item.spec.cover);
                            return item;
                        });
                        this.fnCacheDataList(_list);
                        if (this.isLoadMore) {
                            this.dataList = this.dataList.concat(_list);
                        } else {
                            this.dataList = _list;
                        }
                        this.$nextTick(() => {
                            this.$refs.wafll.pushData(_list)
                        })
                    }
                    this.loadMoreText = res.hasNext ? '上拉加载更多' : '呜呜，没有更多数据啦~';

                })
                .catch(err => {
                    console.error(err);
                    this.loading = 'error';
                    this.waterfall.loading = 'finish';
                    this.loadMoreText = '加载失败，请下拉刷新！';
                })
                .finally(() => {
                    setTimeout(() => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                    }, 500);
                });
        },
        // 缓存数据
        fnCacheDataList(dataList) {
            if (this.queryParams.page == 1) {
                this.cache.dataList = dataList;
            } else {
                this.cache.dataList = [...this.cache.dataList, ...dataList];
            }
        },
        // 预览
        fnPreview(data) {
            uni.previewImage({
                current: this.dataList.findIndex(x => x.metadata.name === data.metadata.name),
                urls: this.dataList.map(x => x.spec.cover),
                indicator: 'number',
                loop: true
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
    background-color: #fafafa;

    &.is-balck {
        background-color: #212121;
    }
}

.content {
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding: 0 24rpx;
    padding-top: 24rpx;
    gap: 12rpx 0;

    .content-empty {
        width: 100%;
        height: 70vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

.loading-wrap {
    box-sizing: border-box;
    padding: 24rpx;
}

.card {
    box-shadow: 0rpx 4rpx 24rpx rgba(0, 0, 0, 0.03);
}

.load-text {
    width: 100%;
    text-align: center;
}
</style>
