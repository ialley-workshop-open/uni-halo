<template>
	<view class="app-page" :class="{ 'is-balck grey-darken-6': isBlackTheme }">
		<!-- 顶部切换 -->
		<view class="e-fixed" v-if="category.list.length > 2">
			<tm-tabs color="light-blue" v-model="category.activeIndex" :list="category.list" align="left" @change="fnOnCategoryChange"></tm-tabs>
		</view>
		<!-- 占位区域 -->
		<view style="width: 100vw;height: 90rpx;"></view>
		<!-- 加载区域 -->
		<view v-if="loading != 'success'" class="loading-wrap">
			<tm-skeleton model="card"></tm-skeleton>
			<tm-skeleton model="cardActions"></tm-skeleton>
			<tm-skeleton model="list"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
		</view>
		<!-- 内容区域 -->
		<view class="content" v-else :class="{ 'bg-white': dataList.length !== 0 }">
			<view v-if="dataList.length == 0" class="content-empty">
				<!-- 空布局 -->
				<tm-empty icon="icon-shiliangzhinengduixiang-" label="博主还没有分享图片~"></tm-empty>
			</view>
			<block v-else>
				<tm-flowLayout v-if="globalAppSettings.gallery.useWaterfull" @click="fnOnClick" ref="wafll">
					<template v-slot:left="{ hdata }">
						<tm-translate animation-name="fadeUp">
							<view class="round-3 shadow-2 overflow white">
								<tm-images :previmage="false" :src="hdata.item.image" @click="fnPreview(hdata.item)"></tm-images>
								<view class="pa-10 text-size-s">
									<view class="text-overflow-2">
										<tm-tags color="bg-gradient-amber-accent" :shadow="0" :dense="true" size="s" model="fill">{{ hdata.item.team }}</tm-tags>
										<text class="pl-6">{{ hdata.item.name }}</text>
									</view>
									<view v-if="hdata.item.description" class="ma-10">{{ hdata.item.description }}</view>
									<view v-if="hdata.item.location" class="mt-10 text-grey-lighten-1">
										<tm-icons name="icon-position-fill"></tm-icons>
										<text class="pl-5">{{ hdata.item.location }}</text>
									</view>
									<view class="flex-between mt-12 flex-center">
										<view>
											<text class="text-size-xs text-red ml-5">{{ hdata.item.likes }}</text>
											<text class="text-size-xs text-red ml-5">喜欢</text>
										</view>
										<view class="pl-10 text-size-xs text-grey-lighten-1">{{ hdata.item.takeTime }}</view>
									</view>
								</view>
							</view>
						</tm-translate>
					</template>
					<template v-slot:right="{ hdata }">
						<tm-translate animation-name="fadeUp">
							<view class="round-3 shadow-2 overflow white">
								<tm-images :previmage="false" :src="hdata.item.image" @click="fnPreview(hdata.item)"></tm-images>
								<view class="pa-10 text-size-s">
									<view class="text-overflow-2">
										<tm-tags :shadow="0" :dense="true" color="bg-gradient-amber-accent" size="s" model="fill">{{ hdata.item.team }}</tm-tags>
										<text class="pl-6">{{ hdata.item.name }}</text>
									</view>
									<view v-if="hdata.item.description" class="ma-10">{{ hdata.item.description }}</view>
									<view v-if="hdata.item.location" class="mt-10 text-grey-lighten-1">
										<tm-icons name="icon-position-fill"></tm-icons>
										<text class="pl-5">{{ hdata.item.location }}</text>
									</view>
									<view class="flex-between mt-12 flex-center">
										<view>
											<text class="text-size-xs text-red ml-5">{{ hdata.item.likes }}</text>
											<text class="text-size-xs text-red ml-5">喜欢</text>
										</view>
										<view class="pl-10 text-size-xs text-grey-lighten-1">{{ hdata.item.takeTime }}</view>
									</view>
								</view>
							</view>
						</tm-translate>
					</template>
				</tm-flowLayout>
				<block v-else>
					<block v-for="(item, index) in dataList" :key="index">
						<tm-translate animation-name="fadeUp" :wait="(index + 1) * 50">
							<view class="round-3 shadow-2 overflow white mb-24">
								<tm-images :previmage="false" :src="item.image" @click="fnPreview(item)"></tm-images>
								<view class="pa-24 text-size-m">
									<view class="text-overflow-2">
										<tm-tags :shadow="0" :dense="true" color="bg-gradient-amber-accent" size="s" model="fill">{{ item.team }}</tm-tags>
										<text class="pl-6">{{ item.name }}</text>
									</view>
									<view v-if="item.description" class="ma-10">{{ item.description }}</view>
									<view v-if="item.location" class="mt-10 text-grey-lighten-1">
										<tm-icons name="icon-position-fill"></tm-icons>
										<text class="pl-5">{{ item.location }}</text>
									</view>
									<view class="flex-between mt-12 flex-center">
										<view>
											<text class="text-size-m text-red ml-5">{{ item.likes }}</text>
											<text class="text-size-m text-red ml-5">喜欢</text>
										</view>
										<view class="pl-10 text-size-m text-grey-lighten-1">{{ item.takeTime }}</view>
									</view>
								</view>
							</view>
						</tm-translate>
					</block>
				</block>
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
				page: 0,
				team: null,
				keyword: ''
			},
			cache: {
				dataList: [],
				total: 0
			},
			isLoadMore: false,
			loadMoreText: '',
			result: {},
			dataList: []
		};
	},
	filters: {
		filterTakeTime(val) {
			return uni.$tm.dayjs(val).format('DD/MM/YYYY');
		}
	},
	watch: {
		globalAppSettings: {
			deep: true,
			handler() {
				// this.isLoadMore = false;
				// this.queryParams.page = 0;
				// this.dataList = [];
				// this.cache.list = [];
				// this.cache.total = 0;
			}
		}
	},
	onLoad() {
		this.fnSetPageTitle('个人图库');
		this.fnGetCategory();
	},
	created() {
		this.fnGetData();
	},
	onPullDownRefresh() {
		this.isLoadMore = false;
		this.queryParams.page = 0;
		this.fnGetData();
	},
	onReachBottom(e) {
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
		fnOnCategoryChange(index) {
			this.dataList = [];
			if (index == 0) {
				this.queryParams.team = null;
			} else {
				this.queryParams.team = this.category.list[index];
			}
			this.queryParams.page = 0;
			this.fnToTopPage();
			this.fnGetData();
		},
		fnGetCategory() {
			this.$httpApi.getPhotoTeams().then(res => {
				this.category.list = ['全部', ...res.data];
			});
		},
		fnGetData() {
			uni.showLoading({
				mask: true,
				title: '加载中...'
			});
			// 设置状态为加载中
			if (!this.isLoadMore) {
				this.loading = 'loading';
			}
			this.loadMoreText = '';
			this.$httpApi
				.getPhotoListByPage(this.queryParams)
				.then(res => {
					if (res.status == 200) {
						this.loading = 'success';
						this.result = res.data;
						if (res.data.content.length != 0) {
							const _list = res.data.content.map((item, index) => {
								item['image'] = this.$utils.checkImageUrl(item.thumbnail);
								item['model'] = 'text';
								item['takeTime'] = this.$tm.dayjs(item['takeTime']).format('DD/MM/YYYY');
								return item;
							});
							this.fnCacheDataList(_list);
							if (this.globalAppSettings.gallery.useWaterfull) {
								this.dataList = _list;
								this.$nextTick(() => {
									this.$refs.wafll.pushData(_list);
								});
							} else {
								this.dataList = this.dataList.concat(_list);
							}
						}
						this.loadMoreText = res.data.hasNext ? '上拉加载更多' : '呜呜，没有更多数据啦~';
					} else {
						this.loading = 'error';
						this.waterfall.loading = 'finish';
						this.loadMoreText = '';
					}
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
			if (this.queryParams.page == 0) {
				this.cache.dataList = dataList;
			} else {
				this.cache.dataList = [...this.cache.dataList, ...dataList];
			}
		},

		// 瀑布流组件点击事件
		fnOnClick(data) {
			console.log('点击数据', data);
		},
		// 预览
		fnPreview(item) {
			const index = this.cache.dataList.findIndex(x => x.id == item.id);
			uni.previewImage({
				current: index,
				urls: this.cache.dataList.map(x => x.image),
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
	background-color: #fafafd;

	&.is-balck {
		background-color: #212121;
	}
}
.content {
	box-sizing: border-box;
	padding: 0 24rpx;
	padding-top: 24rpx;

	.content-empty {
		height: 60vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
.loading-wrap {
	box-sizing: border-box;
	padding: 24rpx;
}
</style>
