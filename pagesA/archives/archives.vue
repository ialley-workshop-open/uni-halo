<template>
    <view class="app-page">

        <view class="e-fixed">
            <tm-tabs color="light-blue" v-model="tab.activeIndex" :list="tab.list" align="center"
                     @change="fnOnTabChange"></tm-tabs>
        </view>
        <!-- 占位区域 -->
        <view style="width: 100vw;height: 90rpx;"></view>

        <!-- 骨架屏：加载区域 -->
        <view v-if="loading !== 'success'" class="loading-wrap">
            <tm-skeleton model="listAvatr"></tm-skeleton>
            <tm-skeleton model="listAvatr"></tm-skeleton>
            <tm-skeleton model="listAvatr"></tm-skeleton>
        </view>

        <!-- 加载完成区域 -->
        <block v-else>
            <view v-if="dataList.length === 0" class="list-empty flex flex-center">
                <tm-empty v-if="haloConfigs.basicConfig.auditModeEnabled" icon="icon-shiliangzhinengduixiang-" label="暂无归档的内容"></tm-empty>
                <tm-empty v-else icon="icon-shiliangzhinengduixiang-" label="暂无归档的文章"></tm-empty>
            </view>
            <view v-else class="e-timeline tm-timeline mt-24">
                <block v-for="(item, index) in dataList" :key="index">
                    <view class="tm-timeline-item tm-timeline-item--leftDir">
                        <view style="width: 160rpx;">
                            <view :style="{ width: '24rpx', height: '24rpx' }" :class="[black_tmeme ? 'bk' : '']"
                                  class="flex-center rounded tm-timeline-jidian border-white-a-2 grey-lighten-2 light-blue shadow-primary-4">
                            </view>
                            <view :style="{ marginTop: '-24rpx' }"
                                  :class="[index !== dataList.length - 1 ? 'tm-timeline-item-boder' : '', black_tmeme ? 'bk' : '']"
                                  class="grey-lighten-2"></view>
                        </view>
                        <view class="tm-timeline-item-content relative">
                            <view class="tm-timeline-item-left">
                                <view class="flex time text-weight-b mb-24">
                                    <text>{{ item.year }}年</text>
                                    <text v-if="tab.activeIndex === 0">{{ item.month }}月</text>
                                    <view v-if="haloConfigs.basicConfig.auditModeEnabled" class="text-size-s text-grey-darken-1 ml-12">
                                        （共 {{ item.posts.length }} 篇内容）
                                    </view>
                                    <view v-else class="text-size-s text-grey-darken-1 ml-12">
                                        （共 {{ item.posts.length }} 篇文章）
                                    </view>
                                </view>
                                <block v-if="item.posts.length !== 0">
                                    <block v-for="(post, postIndex) in item.posts" :key="post.metadata.name">
                                        <view class="flex post shadow-3 pa-24 mb-24"
                                              :class="[globalAppSettings.layout.cardType]"
                                              @click="fnToArticleDetail(post)">
                                            <image class="post-thumbnail"
                                                   :src="$utils.checkThumbnailUrl(post.spec.cover)" mode="aspectFill">
                                            </image>
                                            <view class="post-info pl-20">
                                                <view class="post-info_title text-overflow">{{ post.spec.title }}
                                                </view>
                                                <view
                                                    class="post-info_summary text-overflow-2 mt-12 text-size-s text-grey-darken-1">
                                                    {{ post.status.excerpt }}
                                                </view>
                                                <view class="post-info_time mt-12  text-size-s text-grey-darken-1">
                                                    <text class="iconfont icon-clock text-size-s mr-6"></text>
                                                    <text class="time-label">发布时间：</text>
                                                    {{ {d: post.spec.publishTime, f: 'yyyy年MM月dd日 星期w'} | formatTime }}
                                                </view>
                                            </view>
                                        </view>
                                    </block>
                                </block>
                                <view v-else class="post-empty text-size-m text-grey-darken-1">该日期下暂无归档文章！</view>
                            </view>
                        </view>
                    </view>
                </block>
            </view>
            <view class="load-text mt-12">{{ loadMoreText }}</view>
            <!-- 返回顶部 -->
            <tm-flotbutton @click="fnToTopPage" size="m" color="bg-gradient-light-blue-accent"
                           icon="icon-angle-up"></tm-flotbutton>
        </block>
    </view>
</template>

<script>
import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
import tmFlotbutton from '@/tm-vuetify/components/tm-flotbutton/tm-flotbutton.vue';
import tmTabs from '@/tm-vuetify/components/tm-tabs/tm-tabs.vue';
import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';
import qs from 'qs'

export default {
    components: {
        tmSkeleton,
        tmTranslate,
        tmFlotbutton,
        tmTabs,
        tmEmpty
    },
    data() {
        return {
            loading: 'loading',
            tab: {
                activeIndex: 0,
                list: ['按月份查看', '按年份查看']
            },
            queryParams: {
                size: 10,
                page: 1
            },
            result: {},
            cacheDataList: [], // 所有请求的缓存数据
            dataList: [], // 显示的数据
            isLoadMore: false,
            loadMoreText: "加载中..."
        };
    },
    computed: {
        black_tmeme: function () {
            return this.$tm.vx.state().tmVuetify.black;
        },
        color_tmeme: function () {
            return this.$tm.vx.state().tmVuetify.color;
        },
        haloConfigs() {
            return this.$tm.vx.getters().getConfigs;
        },
        mockJson() {
            return this.$tm.vx.getters().getMockJson;
        }
    },
    created() {
        this.fnGetData();
    },
    onPullDownRefresh() {
        this.isLoadMore = false;
        this.queryParams.page = 1;
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
        if (this.result.hasNext) {
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
        fnOnTabChange(index) {
            this.fnResetSetAniWaitIndex();
            this.queryParams.page = 0;
            this.dataList = this.handleGetShowDataList(this.handleGetPosts(this.cacheDataList))
            this.fnToTopPage();
        },
        fnGetData() {
            if (this.haloConfigs.basicConfig.auditModeEnabled) {
                const dataList = this.mockJson.archives.list.map(item => {
                    const date = new Date(item.time)
                    const year = date.getFullYear()
                    const month = date.getMonth() + 1
                    return {
                        metadata: {
                            name: Date.now() * Math.random(),
                            labels: {
                                "content.halo.run/archive-year": year,
                                "content.halo.run/archive-month": month
                            }
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
                const posts = this.handleGetPosts(dataList)
                this.dataList = []
                this.cacheDataList = dataList;
                this.dataList = this.handleGetShowDataList(posts)
                this.loading = 'success';
                this.loadMoreText = '呜呜，没有更多数据啦~';
                uni.hideLoading();
                uni.stopPullDownRefresh();
                return;
            }
            if (this.isLoadMore) {
                uni.showLoading({
                    title: "加载中..."
                })
            } else {
                this.loading = 'loading';
            }
            this.loadMoreText = "加载中...";
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
                    this.result = data;
                    const posts = this.handleGetPosts(data.items)
                    const showDataList = this.handleGetShowDataList(posts)
                    if (this.isLoadMore) {
                        this.cacheDataList = this.handleUniqueCacheDatalist([
                            ...this.cacheDataList, ...data.items
                        ]);
                        this.handleMergeDataList2(showDataList)
                    } else {
                        this.dataList = []
                        this.cacheDataList = data.items;
                        this.dataList = showDataList
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
                    uni.hideLoading();
                    uni.stopPullDownRefresh();
                }
            })
        },
        // 处理数据分类
        handleGetPosts(dataList) {
            const posts = {}
            const postLabelYearKey = "content.halo.run/archive-year"
            const postLabelMonthKey = "content.halo.run/archive-month"
            dataList.forEach(item => {
                let postItemKey = ""
                if (this.tab.activeIndex === 0) {
                    postItemKey =
                        `${item.metadata.labels[postLabelYearKey]}-${item.metadata.labels[postLabelMonthKey]}`
                } else {
                    postItemKey = `${item.metadata.labels[postLabelYearKey]}`
                }
                if (posts[postItemKey]) {
                    posts[postItemKey].push(item)
                } else {
                    posts[postItemKey] = [item]
                }
            })
            return posts;
        },
        // 根据分类的数据，处理成显示的数据
        handleGetShowDataList(posts) {
            const dataListResult = []
            Object.keys(posts).forEach((key) => {
                const postData = {
                    sort: 0,
                    key: key,
                    year: key,
                    month: "",
                    posts: posts[key]
                }
                if (this.tab.activeIndex == 0) {
                    const splitDate = key.split("-")
                    postData.year = splitDate[0]
                    postData.month = splitDate[1]
                    postData.sort = Number(key.replace("-", ""))
                } else {
                    postData.sort = Number(key)
                }
                dataListResult.push(postData)
            })

            dataListResult.sort((a, b) => {
                return Number(b.sort) - Number(a.sort)
            })

            return dataListResult;
        },
        handleMergeDataList(list1, list2) {
            // 将list1转换为以key为键的对象
            let merged = list1.reduce((acc, item) => {
                acc[item.key] = {
                    ...item
                };
                return acc;
            }, {});

            // 遍历list2，合并posts数组或添加新对象
            list2.forEach(item => {
                if (merged[item.key]) {
                    // 如果key已存在，合并posts数组
                    merged[item.key].posts = [...merged[item.key].posts, ...item.posts];
                } else {
                    // 如果key不存在，添加新对象
                    merged[item.key] = {
                        ...item
                    };
                }
            });

            // 将对象转换回数组
            return Object.values(merged);
        },
        handleMergeDataList2(list) {
            list.forEach((item, index) => {
                const find = this.dataList.find(x => x.key == item.key)
                if (find) {
                    item.posts.forEach(post => {
                        if (!find.posts.find(x => x.metadata.name == post.metadata.name)) {
                            find.posts.push(post)
                        }
                    })
                }
            })
            list.forEach(post => {
                if (!this.dataList.find(x => x.key === post.key)) {
                    this.dataList.push(post)
                }
            })

            this.dataList.sort((a, b) => {
                return Number(b.sort) - Number(a.sort)
            })
        },
        handleUniqueCacheDatalist(dataList) {
            const seen = new Set();
            return dataList.filter(item => {
                return seen.has(item.metadata.name) ? false : seen.add(item.metadata.name);
            });
        },
        fnToArticleDetail(article) {
            if (this.haloConfigs.basicConfig.auditModeEnabled) {
                return;
            }
            uni.navigateTo({
                url: '/pagesA/article-detail/article-detail?name=' + article.metadata.name,
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
    background-color: #fafafd;
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

.list-empty {
    width: 100vw;
    height: 100vh;
}

.statistics {
    background-color: #ffffff;
}

.e-timeline {
    ::v-deep {
        .tm-timeline-item > view:first-child {
            width: 110rpx !important;
        }

        .tm-timeline-item-left {
            max-width: 580rpx !important;
            width: 100% !important;
        }
    }
}

.tm-timeline {
    .tm-timeline-item {

        .tm-timeline-item-left,
        .tm-timeline-item-right {
            width: 200rpx;
            flex-shrink: 0;
        }

        .tm-timeline-item-content {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            align-content: flex-start;
        }

        .tm-timeline-jidian {
            margin: auto;
        }

        &.tm-timeline-item--leftDir {
            display: flex;
            flex-flow: row;

            &.endright {
                justify-content: flex-end;
            }

            .tm-timeline-item-left,
            .tm-timeline-item-right {
                width: auto;
                max-width: 400rpx;
            }

            .tm-timeline-item-boder {
                height: 100%;
                width: 1px;
                margin: auto;
            }

            .tm-timeline-jidian {
                position: relative;
                margin: auto;
                z-index: 2;
            }

            .tm-timeline-item-content {
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;
                align-content: flex-start;
            }
        }
    }
}

.post {
    width: 560rpx;
    border-radius: 12rpx;
    background-color: #fff;

    &.lr_image_text {
    }

    &.lr_text_image {
        .post-thumbnail {
            order: 2;
        }

        .post-info {
            order: 1;
            padding-left: 0;
            padding-right: 24rpx;
        }
    }

    &.tb_image_text {
        flex-direction: column;

        .post-thumbnail {
            width: 100%;
            height: 220rpx;
        }

        .post-info {
            width: 100%;
            padding-left: 0;

            &_title {
                margin-top: 12rpx;
            }

            &_time {
                .iconfont {
                    display: none;
                }

                .time-label {
                    display: inline-block;
                }
            }
        }
    }

    &.tb_text_image {
        flex-direction: column;

        .post-thumbnail {
            order: 2;
            width: 100%;
            height: 220rpx;
            margin-top: 12rpx;
        }

        .post-info {
            order: 1;
            width: 100%;
            padding-left: 0;

            &_time {
                .iconfont {
                    display: none;
                }

                .time-label {
                    display: inline-block;
                }
            }
        }
    }

    &.only_text {
        .post-info {
            padding: 6rpx;

            &_time {
                margin-top: 20rpx;

                .iconfont {
                    display: none;
                }

                .time-label {
                    display: inline-block;
                }
            }
        }

        .post-thumbnail {
            display: none;
        }
    }
}

.post-thumbnail {
    border-radius: 6rpx;
    width: 200rpx;
    height: 170rpx;
}

.post-info {
    width: 0;
    flex-grow: 1;

    &_title {
        color: #303133;
        font-size: 28rpx;
        font-weight: bold;
    }

    &_summary {
        display: -webkit-box;
        line-height: 1.6;
    }

    &_time {
        .time-label {
            display: none;
        }
    }
}

.time {
    align-items: center;
}
</style>
