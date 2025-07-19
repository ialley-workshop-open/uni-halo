<template>
    <view class="app-page">
        <!-- 顶部切换 -->
        <view class="e-fixed" v-if="category.list.length > 0">
            <tm-tabs color="light-blue" :shadow="0" v-model="category.activeIndex" range-key="displayName" :list="category.list"
                     align="left" @change="fnOnCategoryChange($event, false)"></tm-tabs>
        </view>
        <!-- 占位区域 -->
        <view v-if="category.list.length > 0" style="width: 100vw;height: 90rpx;"></view>
        <!-- 加载区域 -->
        <view v-if="loading == 'loading'" class="loading-wrap">
            <tm-skeleton model="card"></tm-skeleton>
            <tm-skeleton model="card"></tm-skeleton>
            <tm-skeleton model="card"></tm-skeleton>
            <tm-skeleton model="card"></tm-skeleton>
        </view>
		<view v-else-if="loading == 'error'" class="flex flex-col flex-center" style="width:100%;height:60vh;">
			<tm-empty icon="icon-wind-cry" label="阿偶，似乎获取数据失败了~">
				<tm-button theme="light-blue" size="m" :shadow="0" @click="fnGetData(true)">刷新试试</tm-button>
			</tm-empty>
		</view>	
        <!-- 内容区域 -->
        <view v-else class="content">
			<k-touch-listen @touchLeft="touchLeft" @touchRight="touchRight">
				<view v-if="dataList.length === 0" class="content-empty">
					<!-- 空布局 -->
					<tm-empty icon="icon-shiliangzhinengduixiang-" label="博主还没有分享图片~"></tm-empty>
				</view>
				<block v-else>
					<block v-if="galleryConfig.useWaterfall">
						<!--瀑布流-->
						<tm-flowLayout-custom ref="wafll" style="width: 100%;" @click="fnOnFlowClick"></tm-flowLayout-custom>
					</block>
					<!--   列表   -->
					<block v-else>
						<tm-translate v-for="(item, index) in dataList" :key="index"
									  style="box-sizing: border-box;padding: 6rpx;width: 50%;height: 250rpx;"
									  animation-name="fadeUp" :wait="calcAniWait(index)">
							<view style="border-radius: 12rpx;overflow: hidden;width: 100%;height: 250rpx;">
								<image style="width: 100%;height: 100%;" mode="aspectFill" :src="item.spec.url"
									   @click="fnPreview(item)"/>
							</view>
						</tm-translate>
					</block>

					<view class="load-text">{{ loadMoreText }}</view>
				</block>
			</k-touch-listen>
        </view>
    
		<view v-if="!calcAuditModeEnabled" class="flot-buttons">
			<tm-button v-if="loading == 'error'" @click="fnGetCategory" size="m" :fab="true" theme="light-blue"
			           icon="icon-sync-alt"></tm-button>
		    <tm-button @click="fnToTopPage" size="m" :fab="true" theme="light-blue"
		               icon="icon-angle-up"></tm-button>
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
import tmFlowLayoutCustom from '@/tm-vuetify/components/tm-flowLayout-custom/tm-flowLayout-custom.vue';
import tmTabs from '@/tm-vuetify/components/tm-tabs/tm-tabs.vue';
import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';

export default {
    options: {
        multipleSlots: true
    },
    components: {
        tmSkeleton,
        tmTranslate,
        tmFlotbutton,
        tmTags,
        tmEmpty,
        tmIcons,
        tmImages,
        tmFlowLayoutCustom,
        tmTabs,
		tmButton
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
            isLoadMore: false,
            loadMoreText: '',
            hasNext: false,
            dataList: [],
			lock:false
        };
    },
    computed: {
        galleryConfig() {
            return this.$tm.vx.getters().getConfigs.pageConfig.galleryConfig;
        },
        haloConfigs() {
            return this.$tm.vx.getters().getConfigs;
        },
        mockJson() {
            return this.$tm.vx.getters().getMockJson;
        },
        calcAuditModeEnabled(){
            return this.haloConfigs.auditConfig.auditModeEnabled
        },
    },
    watch: {
        galleryConfig: {
            handler(newValue, oldValue) {
                if (!newValue) return;
                this.fnSetPageTitle(newValue.pageTitle);
                this.fnGetCategory();
            },
            deep: true,
            immediate: true
        }
    },
    onPullDownRefresh() {
        this.dataList = []
        this.isLoadMore = false;
        this.queryParams.page = 1;
        this.fnGetData(true);
    },
    onReachBottom(e) {
        if (this.calcAuditModeEnabled) {
            uni.showToast({
                icon: 'none',
                title: '没有更多数据了'
            });
            return;
        }
        if (this.hasNext) {
            this.queryParams.page += 1;
            this.isLoadMore = true;
            this.fnGetData(false);
        } else {
            uni.showToast({
                icon: 'none',
                title: '没有更多数据了'
            });
        }
    },
    methods: {
		fnGetDataByCategory(index){
			this.fnResetSetAniWaitIndex();
			this.queryParams.group = this.category.list[index].name;
			this.queryParams.page = 1;
			this.fnToTopPage();
			this.dataList = [];
			this.fnGetData(true);
		},
        fnOnCategoryChange(index) {
			if(this.lock) {
				// uni.showToast({
				// 	title: "上一个请求进行中...",
				// 	icon: "none"
				// })
				return;
			}
			this.fnGetDataByCategory(index)
        },
        fnGetCategory() {
            if (this.calcAuditModeEnabled) {
                this.fnGetData(true);
                return
            }
            this.$httpApi.v2.getPhotoGroupList({
                page: 1,
                size: 0
            }).then(res => {
                this.category.list = res.items.map(item => {
                    return {
                        name: item.metadata.name,
                        displayName: item.spec.displayName,
						priority: item.spec.priority
                    }
                }).sort((a,b) => a.priority - b.priority);
				
                if (this.category.list.length !== 0) {
                    this.queryParams.group = this.category.list[0].name;
                    this.fnGetData(true);
                }
            }).catch(e=>{
				this.loading = 'error'
				this.category.list = []
				this.category.activeIndex = 0
				this.category.activeValue = ""
			});
        },
        fnGetData(isClearWaterfall = false) {
            if (this.calcAuditModeEnabled) {
                this.dataList = this.mockJson.gallery.list.map(item => {
                    return {
                        metadata: {
                            name: Date.now() * Math.random(),
                        },
                        spec: {
                            url: this.$utils.checkImageUrl(item)
                        }
                    }
                })

                this.loading = 'success';

                if (this.galleryConfig.useWaterfall) {
                    this.$nextTick(() => {
                        if (isClearWaterfall) {
                            this.$refs.wafll.clear()
                        }
                        setTimeout(() => {
                            this.$refs.wafll.pushData(this.dataList)
                        }, 50)
                    })
                }
                this.loadMoreText = '呜呜，没有更多数据啦~';
                uni.hideLoading();
                uni.stopPullDownRefresh();
				this.lock = false;
                return;
            }

            // 设置状态为加载中
            if (!this.isLoadMore) {
                this.loading = 'loading';
            }
            this.loadMoreText = '';
            this.$httpApi.v2
                .getPhotoListByGroupName(this.queryParams)
                .then(res => {
                    this.hasNext = res.hasNext;
                    this.loading = 'error';
                    if (res.items.length !== 0) {
                        const _list = res.items.map((item, index) => {
                            item.spec.url = this.$utils.checkImageUrl(item.spec.url || item.spec.cover);
                            return item;
                        });
                        if (this.isLoadMore) {
                            this.dataList = this.dataList.concat(_list);
                        } else {
                            this.dataList = _list;
                        }
                        if (this.galleryConfig.useWaterfall) {
                            this.$nextTick(() => {
                                if (isClearWaterfall) {
                                    this.$refs.wafll.clear()
                                }
                                this.$refs.wafll.pushData(_list)
                            })
                        }
                    }
                    this.loadMoreText = res.hasNext ? '上拉加载更多' : '呜呜，没有更多数据啦~';
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
						this.lock = false;
                    }, 500);
                });
        },
        fnOnFlowClick({item}) {
            this.fnPreview(item)
        },
        // 预览
        fnPreview(data) {
            uni.previewImage({
                current: this.dataList.findIndex(x => x.metadata.name === data.metadata.name),
                urls: this.dataList.map(x => x.spec.url),
                indicator: 'number',
                loop: true
            });
        },
		touchLeft(){
			if(this.loading != "success") return; 
			this.category.activeIndex += 1
			if(this.category.activeIndex >= this.category.list.length){
				this.category.activeIndex = 0
			}
			this.lock = true
			this.fnGetDataByCategory(this.category.activeIndex)
		},
		touchRight(){
			if(this.loading != "success") return;
			this.category.activeIndex -= 1
			if(this.category.activeIndex < 0){
				this.category.activeIndex = 0
			}
			this.lock = true
			this.fnGetDataByCategory(this.category.activeIndex)
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
}

.content {
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding: 24rpx 24rpx 0;
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
