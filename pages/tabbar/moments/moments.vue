<template>
    <view class="app-page">
        <view v-if="loading !== 'success'" class="loading-wrap">
            <tm-skeleton model="listAvatr"></tm-skeleton>
            <tm-skeleton model="listAvatr"></tm-skeleton>
            <tm-skeleton model="listAvatr"></tm-skeleton>
        </view>
        <!-- 内容区域 -->
        <view v-else class="app-page-content">
            <view v-if="dataList.length === 0" class="content-empty flex flex-center" style="min-height: 70vh;">
                <!-- 空布局 -->
                <tm-empty icon="icon-shiliangzhinengduixiang-" label="暂无数据"></tm-empty>
            </view>
            <block v-else>
                <block v-for="(moment, index) in dataList" :key="index">
                    <!--  卡片 -->
                    <tm-translate v-if="moment.spec.visible==='PUBLIC'" animation-name="fadeUp" :wait="calcAniWait()">
                        <view class="moment-card">
                            <view class="head" style="display: flex;align-items: center;">
                                <view class="avatar" style="flex-shrink: 0;">
                                    <image style="width: 66rpx;height: 66rpx;border-radius: 50%;"
                                           :src="moment.spec.user.avatar"/>
                                </view>
                                <view class="nickname" style="margin-left: 12rpx;">
                                    <view style="font-size: 30rpx;font-weight: bold;color: #333333;">
                                        {{ moment.spec.user.displayName }}
                                    </view>
                                    <view style="margin-top: 6rpx;font-size: 24rpx;color: #666;">
                                        {{ {d: moment.spec.releaseTime, f: 'yyyy年MM月dd日 星期w'} | formatTime }}
                                    </view>
                                </view>
                            </view>
                            <view class="content">
                                <mp-html class="evan-markdown" lazy-load :domain="markdownConfig.domain"
                                         :loading-img="markdownConfig.loadingGif" :scroll-table="true" :selectable="true"
                                         :tag-style="markdownConfig.tagStyle" :container-style="markdownConfig.containStyle"
                                         :content="moment.spec.content.html" :markdown="true" :showLineNumber="true"
                                         :showLanguageName="true" :copyByLongPress="true"/>
                            </view>
                            <view class="mb-12 mt--12" v-if="moment.videos.length!==0"
                                  style="display: flex; flex-direction: column; gap: 12rpx 0;padding: 0 24rpx; ">
                                <video
                                    style="width:100%;height: 400rpx;border-radius: 12rpx;"
                                    v-for="(video,index) in moment.videos"
                                    :key="index" :src="video.url"></video>
                            </view>
                            <view v-if="moment.images.length!==0" class="images"
                                  :class="['images-'+moment.images.length]">
                                <view class="image-item"
                                      v-for="(image,mediumIndex) in moment.images"
                                      :key="mediumIndex">
                                    <image mode="aspectFill" style="width: 100%;height: 100%;border-radius: 6rpx;"
                                           :src="image.url"
                                           @click="handlePreview(mediumIndex,moment.images)"/>
                                </view>
                            </view>
                        </view>
                    </tm-translate>
                </block>
                <tm-flotbutton @click="fnToTopPage" size="m" color="light-blue" icon="icon-angle-up"></tm-flotbutton>
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
                size: 10,
                page: 1
            },
            hasNext: false,
            dataList: [],
            isLoadMore: false,
            loadMoreText: '加载中...'
        };
    },

    computed: {
        bloggerInfo() {
            let blogger = this.$tm.vx.getters().getConfigs.authorConfig.blogger;
            blogger.avatar = this.$utils.checkAvatarUrl(blogger.avatar, true);
            return blogger;
        },
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
                this.dataList = this.mockJson.moments.list.map((item) => {
                    return {
                        metadata: {
                            name: Date.now() * Math.random(),
                        },
                        spec: {
                            user: {
                                displayName: this.bloggerInfo.nickname,
                                avatar: this.$utils.checkAvatarUrl(this.bloggerInfo.avatar),
                            },
                            content: {
                                html: item.content
                            },
                            releaseTime: item.time,
                            visible: "PUBLIC"
                        },
                        images: item.images.map((img) => {
                            return {
                                type: "PHOTO",
                                url: this.$utils.checkThumbnailUrl(img),
                            }
                        }),
                        videos: []
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
                .getMomentList(this.queryParams)
                .then(res => {
                    this.loading = 'success';
                    this.loadMoreText = res.hasNext ? '上拉加载更多' : '呜呜，没有更多数据啦~';
                    this.hasNext = res.hasNext;

                    const tempItems = res.items.map(item => {
                        item.spec.user = {
                            displayName: this.bloggerInfo.nickname,
                            avatar: this.$utils.checkAvatarUrl(this.bloggerInfo.avatar)
                        }
                        item.spec.content.medium.map(medium => {
                            medium.url = this.$utils.checkThumbnailUrl(medium.url, true)
                        })

                        item['images'] = item.spec.content.medium
                            .filter(x => x.type === 'PHOTO')

                        item['videos'] = item.spec.content.medium
                            .filter(x => x.type === 'VIDEO')
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

.loading-wrap {
    padding: 24rpx;
}

.moment-card {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    margin: 0 24rpx;
    border-radius: 12rpx;
    background-color: #ffff;
    box-shadow: 0rpx 2rpx 24rpx rgba(0, 0, 0, 0.03);
    overflow: hidden;
    margin-bottom: 24rpx;
}

.head {
    padding: 24rpx;
    padding-bottom: 0;
}

.images {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    padding: 24rpx;
    padding-top: 0;

    .image-item {
        box-sizing: border-box;
        border-radius: 24rpx;
        padding: 6rpx;
        width: 33%;
        height: 200rpx
    }

    &-1 {
        > .image-item {
            width: 100%;
            height: 350rpx
        }
    }

    &-2 {
        > .image-item {
            width: 50%;
            height: 250rpx
        }
    }
}
</style>
