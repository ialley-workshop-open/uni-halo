<template>
	<view class="app-page card-shadow">
		<view v-if="loading != 'success'" class="loading-wrap">
			<tm-skeleton model="listAvatr"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
		</view>
		<view v-else class="content" :class="{ 'bg-white': result.length !== 0 }">
			<!-- 空数据 -->
			<view v-if="result.length == 0" class="content-empty flex flex-center">
				<tm-empty icon="icon-shiliangzhinengduixiang-" label="啊偶,博主还没有朋友呢~"></tm-empty>
			</view>

			<!-- 如果只有一个分组：使用列表的形式 result.length == 1 -->
			<view v-else-if="result.length == 1" class="flex flex-col pb-24">
				<block v-for="(link, index) in result[0].children" :key="index">
					<tm-translate animation-name="fadeUp" :wait="(index + 1) * 50">
						<!-- 色彩版本 -->
						<view
							v-if="!globalAppSettings.links.useSimple"
							class="info flex pt-24 pb-24 pl-12 pr-12"
							:class="{ 'border-b-1': index != result[0].children.length - 1 }"
							@click="fnOnLinkEvent(link)"
						>
							<view class="link-logo">
								<cache-image
									class="link-logo_img"
									radius="12rpx"
									:url="link.logo"
									:fileMd5="link.logo"
									mode="aspectFill"
								></cache-image>
							</view>
							<view class="flex flex-col pl-30 info-detail">
								<view class="link-card_name text-size-l text-weight-b text-red">{{ link.name }}</view>
								<view class="poup-tag ml--10 mt-6">
									<tm-tags color="bg-gradient-amber-accent" :shadow="0" size="s" model="fill">
										ID：{{ link.id }}
									</tm-tags>
									<tm-tags color=" bg-gradient-light-blue-lighten" :shadow="0" size="s" model="fill">
										{{ link.team || '暂未分组' }}
									</tm-tags>
								</view>
								<view class="link-card_desc text-overflow text-size-s mt-4">
									博客简介：{{ link.description || '这个博主很懒，没写简介~' }}
								</view>
							</view>
						</view>
						<!-- 简洁版本 -->
						<view v-else class="link-card flex ml-24 mr-24 pt-24 pb-24" @click="fnOnLinkEvent(link)">
							<image class="logo shadow-6" :src="link.logo" mode="aspectFill"></image>
							<view class="info pl-24">
								<view class="name text-size-g">{{ link.name }}</view>
								<view class="desc mt-12 text-size-s text-grey-darken-1">{{ link.description }}</view>
								<view v-if="false" class="link mt-12 text-size-m text-grey-darken-1">
									<text class="iconfont icon-link mr-6 text-size-s"></text>
									{{ link.url }}
								</view>
							</view>
						</view>
					</tm-translate>
				</block>
			</view>

			<!-- 如果大于一个分组：使用联系人的索引形式 result.length > 1 -->
			<block v-else>
				<block v-for="(team, index) in result" :key="index">
					<tm-translate animation-name="fadeUp" :wait="(index + 1) * 50">
						<view class="grey-lighten-4 text  text-size-s text-weight-b px-32 py-12">{{ team.title }}</view>
						<block v-for="(link, linkIndex) in team.children" :key="link.id">
							<tm-translate animation-name="fadeUp" :wait="(linkIndex + 1) * 50">
								<!-- 色彩版本 -->
								<view
									v-if="!globalAppSettings.links.useSimple"
									class="info flex pt-24 pb-24 pl-12 pr-12"
									:class="{
										'border-b-1':
											linkIndex != team.children.length - 1 || index == result.length - 1
									}"
									@click="fnOnLinkEvent(link)"
								>
									<view class="link-logo">
										<cache-image
											class="link-logo_img"
											radius="12rpx"
											:url="link.logo"
											:fileMd5="link.logo"
											mode="aspectFill"
										></cache-image>
									</view>
									<view class="flex flex-col pl-30 info-detail">
										<view class="link-card_name text-size-l text-weight-b text-red">
											{{ link.name }}
										</view>
										<view class="poup-tag ml--10 mt-6">
											<tm-tags color="bg-gradient-amber-accent" :shadow="0" size="s" model="fill">
												ID：{{ link.id }}
											</tm-tags>
											<tm-tags
												color=" bg-gradient-light-blue-lighten"
												:shadow="0"
												size="s"
												model="fill"
											>
												{{ link.team || '暂未分组' }}
											</tm-tags>
										</view>
										<view class="link-card_desc text-overflow text-size-s mt-4">
											博客简介：{{ link.description || '这个博主很懒，没写简介~' }}
										</view>
									</view>
								</view>
								<!-- 简洁版本 -->
								<view
									v-else
									class="link-card flex ml-24 mr-24 pt-24 pb-24"
									@click="fnOnLinkEvent(link)"
								>
									<image class="logo shadow-6" :src="link.logo" mode="aspectFill"></image>
									<view class="info pl-24">
										<view class="name text-size-g">{{ link.name }}</view>
										<view class="desc mt-12 text-size-s text-grey-darken-1">
											{{ link.description }}
										</view>
										<view v-if="false" class="link mt-12 text-size-m text-grey-darken-1">
											<text class="iconfont icon-link mr-6 text-size-s"></text>
											{{ link.url }}
										</view>
									</view>
								</view>
							</tm-translate>
						</block>
					</tm-translate>
				</block>
			</block>

			<!-- 返回顶部 -->
			<tm-flotbutton
				v-if="linkTotal > 10"
				color="light-blue"
				@click="fnToTopPage"
				size="m"
				icon="icon-angle-up"
			></tm-flotbutton>

			<!-- 详情弹窗 -->
			<tm-poup v-model="detail.show" :width="640" height="auto" position="center" :round="6">
				<view class="poup pa-36">
					<view class="info flex">
						<view class="poup-logo bg-gradient-amber-accent pa-4 shadow-24">
							<image class="poup-logo_img" :src="detail.data.logo" mode="aspectFill"></image>
						</view>
						<view class="pl-24 info-detail">
							<view class="poup-name text-size-lg text-weight-b">{{ detail.data.name }}</view>
							<view class="poup-tag ml--10">
								<tm-tags color="bg-gradient-amber-accent" size="n" model="fill">
									ID：{{ detail.data.id }}
								</tm-tags>
								<tm-tags color="bg-gradient-light-blue-lighten" size="n" model="fill">
									{{ detail.data.team || '暂未分组' }}
								</tm-tags>
							</view>
							<view class="poup-link text-size-m" @click="fnCopyLink(detail.data)">
								<text class="text-orange">{{ detail.data.url }}</text>
								<text class="iconfont icon-copy text-size-s ml-6 text-grey"></text>
							</view>
						</view>
					</view>

					<view class="poup-desc mt-20">
						博客简介：{{ detail.data.description || '这个博主很懒，没写简介~' }}
					</view>

					<!-- 博客预览图 -->
					<view class="mt-24">
						<tm-images
							:width="568"
							:round="2"
							:src="caclSiteThumbnail(detail.data.url)"
							mode="aspectFill"
						></tm-images>
					</view>
				</view>
			</tm-poup>
		</view>
	</view>
</template>

<script>
import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
import tmFlotbutton from '@/tm-vuetify/components/tm-flotbutton/tm-flotbutton.vue';
import tmTags from '@/tm-vuetify/components/tm-tags/tm-tags.vue';
import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';
import tmImages from '@/tm-vuetify/components/tm-images/tm-images.vue';
import tmPoup from '@/tm-vuetify/components/tm-poup/tm-poup.vue';

import { GetRandomNumberByRange } from '@/utils/random.js';
export default {
	components: {
		tmSkeleton,
		tmTranslate,
		tmFlotbutton,
		tmTags,
		tmEmpty,
		tmImages,
		tmPoup
	},
	data() {
		return {
			loading: 'loading',
			queryParams: {
				size: 10,
				page: 0,
				sort: ''
			},
			result: [],
			detail: {
				show: false,
				data: {}
			},
			linkTotal: 0
		};
	},
	computed: {
		caclSiteThumbnail(val) {
			return val => {
				if (!val) return '';
				if (val.charAt(val.length - 1) != '/') {
					val = val + '/';
				}
				return 'https://image.thum.io/get/width/1000/crop/800/' + val;
			};
		}
	},
	onLoad() {
		this.fnSetPageTitle('朋友圈');
	},
	created() {
		this.fnGetData();
	},
	onPullDownRefresh() {
		this.fnGetData();
	},
	methods: {
		fnRandomColor() {
			const _r = GetRandomNumberByRange(0, this.$haloConfig.colors.length - 1);
			return this.$haloConfig.colors[_r];
		},
		fnGetData() {
			this.linkTotal = 0;
			this.loading = 'loading';
			uni.showLoading({
				mask: true,
				title: '加载中...'
			});
			this.$httpApi
				.getLinkListByTeam()
				.then(res => {
					if (res.status == 200) {
						console.log('请求结果：');
						console.log(res);
						// 处理数据
						const _result = res.data.map(item => {
							const _team = item.team || '未分组';
							const _links = item.links.map(link => {
								this.linkTotal += 1;
								link.logo = this.$utils.checkAvatarUrl(link.logo);
								return link;
							});
							return {
								title: _team,
								children: _links
							};
						});

						this.result = _result.reverse();
						setTimeout(() => {
							this.loading = 'success';
						}, 500);
					} else {
						this.loading = 'error';
					}
				})
				.catch(err => {
					console.error(err);
					this.loading = 'error';
				})
				.finally(() => {
					setTimeout(() => {
						uni.hideLoading();
						uni.stopPullDownRefresh();
					}, 500);
				});
		},

		fnOnLinkEvent(link) {
			this.detail.data = link;
			this.detail.show = true;
		},

		fnCopyLink(link) {
			uni.setClipboardData({
				data: `${link.name}:${link.url}`,
				showToast: false,
				success: () => {
					uni.showToast({
						icon: 'none',
						title: '链接复制成功！'
					});
				},
				fail: () => {
					uni.showToast({
						icon: 'none',
						title: '复制失败！'
					});
				}
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
.loading-wrap {
	padding: 24rpx;
	min-height: 100vh;
}

.content {
	padding: 0 24rpx;
	padding-top: 24rpx;

	.content-empty {
		height: 60vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
.link-card {
	border-bottom: 2rpx solid #f5f5f5;
	background-color: #ffffff;
	&.one {
		border: 0;
		box-shadow: 0rpx 2rpx 24rpx 0rpx rgba(0, 0, 0, 0.03);
		.logo {
			box-shadow: 0rpx 2rpx 12rpx rgba(0, 0, 0, 0.1);
		}
	}
	.logo {
		// width: 126rpx;
		// height: 126rpx;
		width: 80rpx;
		height: 80rpx;
		border-radius: 12rpx;
		border: 6rpx solid #ffffff;
		box-shadow: none;
	}

	.info {
		width: 0;
		flex-grow: 1;
		.name {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			color: #303133;
			font-size: 30rpx;
			font-weight: bold;
		}
		.desc {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			color: #303133;
			font-size: 28rpx;
		}
	}
}
.link-card_name {
	// color: #303133;
	// color: #0080fe;
}
.link-card_desc {
	font-size: 24rpx;
	line-height: 1.6;
	color: #303133;
}
.link-logo {
	width: 140rpx;
	height: 140rpx;
	&_img {
		width: 100%;
		height: 100%;
	}
}
.poup-logo {
	width: 140rpx;
	height: 140rpx;
	border-radius: 50%;
	&_img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
}
.info-detail {
	width: 0;
	flex-grow: 1;
	justify-content: center;
}
.poup-desc {
	font-size: 28rpx;
	line-height: 1.6;
	color: #555 !important;
}
.preview-site {
	width: 100%;
	height: 300rpx;
}
</style>
