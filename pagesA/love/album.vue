<template>
	<view class="app-page">
		<view v-if="loading != 'success'" class="loading-wrap">
			<tm-skeleton model="card"></tm-skeleton>
			<tm-skeleton model="card"></tm-skeleton>
			<tm-skeleton model="card"></tm-skeleton>
			<tm-skeleton model="card"></tm-skeleton>
		</view>
		<!-- 内容区域 -->
		<view v-else class="app-page-content">
			<view v-if="dataList.length == 0" class="content-empty flex flex-center"><tm-empty icon="icon-shiliangzhinengduixiang-" label="相册暂时还没有数据~"></tm-empty></view>
			<block v-else>
				<swiper
					class="swiper-album"
					:current="swiperIndex"
					:acceleration="true"
					:circular="true"
					:vertical="false"
					:indicator-dots="false"
					:autoplay="false"
					@change="fnOnChange"
				>
					<block v-for="(item, index) in dataList" :key="index">
						<swiper-item class="swiper-album-item">
							<view class="scroll-wrap">
								<view class="card">
									<cache-image
										class="card-image"
										width="100%"
										height="46vh"
										radius="12rpx"
										:url="item.image"
										:fileMd5="item.image"
										mode="aspectFill"
										@on-click="fnOnPreview(item)"
									></cache-image>
									<view v-if="item.description" class="card-desc">{{ item.description }}</view>
									<view v-else class="card-desc is-empty flex flex-col">
										<view class="text-grey-darken-1">该照片没有记录任何信息</view>
										<view class="text-size-m mt-24 text-grey-darken-1">记录一下拍照的瞬间，会更精彩哟</view>
									</view>
								</view>
							</view>
						</swiper-item>
					</block>
				</swiper>
				<view class="tabbar">
					<view class="pre" @click="fnChange(false)">
						<text class="icon"><text class="iconfont icon-arrow-left"></text></text>
						<text class="text">上一张</text>
					</view>
					<view class="refresh" @click="fnRefresh()">刷新</view>
					<view class="next" @click="fnChange(true)">
						<text class="text">下一张</text>
						<text class="icon"><text class="iconfont icon-arrow-right"></text></text>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
import LoveConfig from '@/config/love.config.js';
import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
import tmFlotbutton from '@/tm-vuetify/components/tm-flotbutton/tm-flotbutton.vue';
import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';

export default {
	components: {
		tmSkeleton,
		tmFlotbutton,
		tmTranslate,
		tmEmpty
	},
	data() {
		return {
			loading: 'loading',
			loveConfig: LoveConfig,
			queryParams: {
				size: 99,
				page: 0,
				sort: 'takeTime',
				team: LoveConfig.photoKeyName
			},
			result: {},
			dataList: [],
			cache: {
				dataList: [],
				total: 0
			},
			swiperIndex: 0,
			tabbar: {
				list: []
			}
		};
	},

	onLoad() {
		this.fnSetPageTitle('恋爱相册');
	},
	created() {
		this.fnGetData();
	},
	onPullDownRefresh() {
		this.fnRefresh();
	},

	methods: {
		fnRefresh() {
			this.queryParams.page = 0;
			this.fnGetData();
		},
		fnGetData() {
			uni.showLoading({
				mask: true,
				title: '加载中...'
			});

			this.loading = 'loading';
			this.$httpApi
				.getPhotoListByPage(this.queryParams)
				.then(res => {
					if (res.status == 200) {
						this.loading = 'success';
						if (res.data.content.length != 0) {
							const _list = res.data.content.map((item, index) => {
								item['image'] = this.$utils.checkImageUrl(item.thumbnail);
								item['takeTime'] = this.$tm.dayjs(item['takeTime']).format('DD/MM/YYYY');
								return item;
							});
							this.dataList = _list;
							// this.fnCacheDataList(_list);
							// this.dataList = this.dataList.concat(_list);

							this.swiperIndex = 0;
							uni.hideLoading();
						}
					} else {
						this.loading = 'error';
						uni.$tm.toast('加载失败，请下拉刷新重试！');
					}
				})
				.catch(err => {
					console.error(err);
					this.loading = 'error';
					uni.$tm.toast('加载失败，请下拉刷新重试！');
				})
				.finally(() => {
					setTimeout(() => {
						uni.stopPullDownRefresh();
					}, 200);
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
		fnOnPreview(item) {
			uni.previewImage({
				current: item.image,
				urls: this.dataList.map(x => x.image)
			});
		},
		fnOnChange(e) {
			console.log('e', e);
			this.swiperIndex = e.detail.current;
		},
		fnChange(isNext) {
			if (isNext) {
				if (this.swiperIndex == this.dataList.length - 1) {
					this.swiperIndex = 0;
				} else {
					this.swiperIndex += 1;
				}
			} else {
				if (this.swiperIndex == 0) {
					this.swiperIndex = this.dataList.length - 1;
				} else {
					this.swiperIndex -= 1;
				}
			}
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
	box-sizing: border-box;
	padding: 24rpx 0;
	padding-bottom: 144rpx;
	background: linear-gradient(
		-135deg,
		rgba(247, 149, 51, 0.1),
		rgba(243, 112, 85, 0.1) 15%,
		rgba(239, 78, 123, 0.1) 30%,
		rgba(161, 102, 171, 0.1) 44%,
		rgba(80, 115, 184, 0.1) 58%,
		rgba(16, 152, 173, 0.1) 72%,
		rgba(7, 179, 155, 0.1) 86%,
		rgba(109, 186, 130, 0.1)
	);
	color: #55423b;
}
.app-page-content {
}
.content-empty {
	width: 100%;
	height: 60vh;
}
.loading-wrap {
	box-sizing: border-box;
	padding: 0 24rpx;
}
.swiper-album {
	width: 100vw;
	height: calc(100vh - 24rpx - 144rpx);
}
.swiper-album-item {
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	padding: 36rpx;
	/* #ifdef H5 */
	padding-bottom: 110rpx;
	/* #endif */
	/* #ifndef H5 */
	padding-bottom: 60rpx;
	/* #endif */
}
.scroll-wrap {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	padding: 36rpx;
	background-color: #ffffff;
	border-radius: 12rpx;
	box-shadow: 0rpx 4rpx 24rpx rgba(0, 0, 0, 0.03);
}
.card {
	display: flex;
	flex-direction: column;
	width: 100%;
	// height: 65vh;
	height: 100%;
	max-height: 100%;
	border-radius: 12rpx;
	background-color: #ffffff;
	box-sizing: border-box;
	// box-shadow: 0rpx 4rpx 24rpx rgba(0, 0, 0, 0.03);
	overflow: hidden;
	overflow-y: auto;
	::v-deep {
		.cache-image {
			height: initial !important;
		}
	}
	&-image {
		width: 100%;
		height: initial !important;
		border-radius: 12rpx;
	}
	&-desc {
		margin-top: 24rpx;
		line-height: 1.6;
		font-size: 28rpx;
		&.is-empty {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-grow: 1;
			font-size: 32rpx;
		}
	}
}
.tabbar {
	width: 80vw;
	position: fixed;
	left: 50%;
	bottom: 40rpx;
	transform: translateX(-50%);
	border-radius: 25rpx;
	box-sizing: border-box;
	padding: 24rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	// background-color: rgba(0, 0, 0, 0.5);
	background-color: #ffffff;
	color: #333;
	box-shadow: 0rpx 4rpx 24rpx rgba(0, 0, 0, 0.07);
	.pre {
		color: #56bbf9;
		.text {
			padding-left: 12rpx;
		}
	}
	.next {
		color: #f88ca2;
		.text {
			padding-right: 12rpx;
		}
	}
}
</style>
