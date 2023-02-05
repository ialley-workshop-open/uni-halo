<template>
	<view class="app-page pb-24">
		<!-- 博主信息 -->
		<view class="blogger-info" :style="[calcProfileStyle]">
			<image class="avatar" :src="$utils.checkAvatarUrl(bloggerInfo.avatar)" mode="aspectFill"></image>
			<view class="profile">
				<view class="author mt-24 text-size-g text-weight-b">{{ bloggerInfo.nickname }}</view>
				<view class="desc mt-24 text-size-m">
					{{ bloggerInfo.description || '这个博主很懒，竟然没写介绍~' }}
				</view>
			</view>
			<image v-if="calcWaveUrl" :src="calcWaveUrl" mode="scaleToFill" class="gif-wave"></image>
		</view>

		<!-- 统计信息 -->
		<view class="statistics-wrap bg-white">
			<tm-more iconColor="light-blue" :open.sync="statisticsShowMore" :maxHeight="62" label=" " open-label=" ">
				<template>
					<view class="statistics flex pt-24 pb-24" :class="{ 'has-solid': statisticsShowMore }">
						<view class="item flex-1 text-align-center">
							<view class="number text-size-xl text-bg-gradient-orange-accent">
								<tm-flop
									:startVal="0"
									:decimals="0"
									:endVal="statistics.postCount"
									:duration="3000"
								></tm-flop>
							</view>
							<view class="mt-6 text-align-center text-size-s text-grey-darken-1">文章总数</view>
						</view>
						<view class="item flex-1 text-align-center">
							<view class="number text-size-xl text-bg-gradient-blue-accent">
								<tm-flop
									:startVal="0"
									:decimals="0"
									:endVal="statistics.categoryCount"
									:duration="3000"
								></tm-flop>
							</view>
							<view class="mt-6 text-align-center text-size-s text-grey-darken-1">分类总数</view>
						</view>
						<view class="item flex-1 text-align-center">
							<view class="number text-size-xl text-bg-gradient-green-accent">
								<tm-flop
									:startVal="0"
									:decimals="0"
									:endVal="statistics.tagCount"
									:duration="3000"
								></tm-flop>
							</view>
							<view class="mt-6 text-size-s text-grey-darken-1">标签总数</view>
						</view>
					</view>
					<view class="statistics solid-top has-solid flex pt-24 pb-24">
						<view class="item flex-1 text-align-center">
							<view class="number text-size-xl text-bg-gradient-orange-accent">
								<tm-flop
									:startVal="0"
									:decimals="0"
									:endVal="statistics.commentCount"
									:duration="3000"
								></tm-flop>
							</view>
							<view class="mt-6 text-align-center text-size-s text-grey-darken-1">评论数量</view>
						</view>
						<view class="item flex-1 text-align-center">
							<view class="number text-size-xl text-bg-gradient-blue-accent">
								<tm-flop
									:startVal="0"
									:decimals="0"
									:endVal="statistics.linkCount"
									:duration="3000"
								></tm-flop>
							</view>
							<view class="mt-6 text-align-center text-size-s text-grey-darken-1">点赞数量</view>
						</view>
						<view class="item flex-1 text-align-center">
							<view class="number text-size-xl text-bg-gradient-green-accent">
								<tm-flop
									:startVal="0"
									:decimals="0"
									:endVal="statistics.visitCount"
									:duration="3000"
								></tm-flop>
							</view>
							<view class="mt-6 text-size-s text-grey-darken-1">访客数量</view>
						</view>
					</view>
				</template>
			</tm-more>
		</view>

		<!-- 快捷导航 -->
		<view v-if="useQuickNav" class="quick-nav flex flex-between round-3  ma-24 pa-24 pl-40 pr-40">
			<view
				class="quick-nav-item flex flex-col flex-center"
				v-for="(nav, index) in quickNavList"
				:key="index"
				@click="fnToNavPage(nav)"
			>
				<view class="icon round-24 halocoloricon" :class="[nav.icon]"></view>
				<view class="name text-size-s mt-8">{{ nav.text }}</view>
			</view>
		</view>

		<!-- 功能导航 -->
		<view class="nav-wrap ma-24 round-3">
			<tm-grouplist :shadow="0" :round="3" :margin="[0, 0]">
				<block v-for="(nav, index) in navList" :key="index">
					<tm-listitem
						v-if="nav.show"
						:title="nav.title"
						:left-icon="nav.leftIcon"
						show-left-icon
						:left-icon-color="nav.leftIconColor"
						:value="nav.rightText"
						@click="fnOnNav(nav)"
					>
						<template slot="rightValue">
							<button class="right-value-btn" v-if="nav.openType" :open-type="nav.openType">
								{{ nav.rightText }}
							</button>
							<text v-else>{{ nav.rightText }}</text>
						</template>
					</tm-listitem>
				</block>
			</tm-grouplist>
		</view>
		<!-- 版权 -->
		<view v-if="showCopyright" class="copyright mt-40 text-size-xs text-align-center">
			<view class="">「 2022 uni-halo 丨 开源项目@小莫唐尼 」</view>
		</view>

		<!-- 名片 -->
		<tm-poup v-model="miniProfileCard.show" width="94vw" height="auto" :round="3" position="center">
			<view class="profile-card round-3 flex pa-24 pt-36 pb-36">
				<view class="profile-card_label bg-gradient-light-blue-accent text-size-xs pt-1 pb-1">名片</view>
				<view class="left flex flex-col flex-center">
					<image class="avatar" :src="$utils.checkAvatarUrl(bloggerInfo.avatar)" mode="aspectFill"></image>
					<view class="name mt-10 text-size-m text-weight-b">{{ bloggerInfo.nickname }}</view>
					<view class="mt-10 round-a-1 pa-2 pl-12 pr-12 text-size-s bg-gradient-light-blue-accent">
						前端摸鱼大师
					</view>
					<view class="mt-6 text-size-xs text-align-center text-grey-darken-2">
						一个爱凑热闹的、喜欢捣鼓前端的博主。
					</view>
				</view>
				<view class="right flex flex-col pl-12">
					<view class="label text-size-s text-weight-b">爱好：摸鱼、打游戏、听音乐、逛B站</view>
					<view class="motto mt-12 text-size-s text-grey-darken-1">
						如果不是在空闲着的时候就能挣到钱，那就不算摸鱼！
					</view>
					<view class="mt-12 text-size-m text-weight-b text-grey-darken-2">精选图片</view>
					<view class="photos mt-6 flex ">
						<image
							class="photos-img round-2"
							:src="$utils.checkAvatarUrl(bloggerInfo.avatar)"
							mode="aspectFill"
						></image>
						<image
							class="photos-img round-2"
							:src="$utils.checkAvatarUrl(bloggerInfo.avatar)"
							mode="aspectFill"
						></image>
						<image
							class="photos-img round-2"
							:src="$utils.checkAvatarUrl(bloggerInfo.avatar)"
							mode="aspectFill"
						></image>
					</view>
				</view>
			</view>
		</tm-poup>
	</view>
</template>

<script>
import { checkHasAdminLogin } from '@/utils/auth.js';
import CheckAppUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update';
import { CheckWxUpdate } from '@/utils/update.js';

import tmGrouplist from '@/tm-vuetify/components/tm-grouplist/tm-grouplist.vue';
import tmListitem from '@/tm-vuetify/components/tm-listitem/tm-listitem.vue';
import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
import tmPoup from '@/tm-vuetify/components/tm-poup/tm-poup.vue';
import tmMore from '@/tm-vuetify/components/tm-more/tm-more.vue';
import tmFlop from '@/tm-vuetify/components/tm-flop/tm-flop.vue';
import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
import tmIcons from '@/tm-vuetify/components/tm-icons/tm-icons.vue';
import wave from '@/components/wave/wave.vue';

export default {
	components: {
		tmGrouplist,
		tmListitem,
		tmTranslate,
		tmPoup,
		tmMore,
		tmFlop,
		tmButton,
		tmIcons,
		wave
	},
	data() {
		return {
			statisticsShowMore: false,
			// 统计信息
			statistics: {
				postCount: 0, // 文章数量
				commentCount: 0, // 评论数量
				categoryCount: 0, // 分类数量
				tagCount: 0, // 标签数量
				journalCount: 0, // 日记数量
				establishDays: 0, // 博客创建天数
				linkCount: 0, // 外链数量
				visitCount: 0, // 访客数量
				likeCount: 0 // 点赞数量
			},
			// 导航信息
			navList: [],
			useQuickNav: false,
			quickNavList: [],
			miniProfileCard: {
				show: false
			}
		};
	},
	computed: {
		bloggerInfo() {
			return this.$tm.vx.getters().getBlogger;
		},
		calcProfileStyle() {
			let _imgUrlOr = getApp().globalData.aboutProfileImageUrl;
			if (this.$utils.checkIsUrl(_imgUrlOr)) {
				return {
					backgroundImage: `url(${_imgUrlOr})`
				};
			} else {
				return {
					background: _imgUrlOr
				};
			}
		},
		calcWaveUrl() {
			return getApp().globalData.waveImageUrl;
		},
		showCopyright() {
			return getApp().globalData.showCopyright;
		}
	},
	watch: {
		globalAppSettings: {
			deep: true,
			handler(val) {
				this.statisticsShowMore = val.about.showAllCount;
				this.fnGetNavList();
			}
		}
	},
	created() {
		this.statisticsShowMore = this.globalAppSettings.about.showAllCount;
		this.fnGetQuickNavList();
		this.fnGetNavList();
		this.fnGetData();
	},
	onPullDownRefresh() {
		this.fnGetData();
	},
	methods: {
		fnGetQuickNavList() {
			this.useQuickNav = this.$haloConfig.quickNav.use;
			if (!this.$haloConfig.quickNav.use) return;
			const _quickNavList = this.$haloConfig.quickNav.list;
			this.quickNavList = _quickNavList.map(item => {
				return item;
			});
		},
		fnGetNavList() {
			const systemInfo = uni.getSystemInfoSync();
			this.navList = [
				{
					key: 'disclaimers',
					title: '免责声明',
					leftIcon: 'icon-map',
					leftIconColor: 'red',
					rightText: '博客内容免责声明',
					path: '/pagesA/disclaimers/disclaimers',
					isAdmin: false,
					type: 'page',
					show: true
				},
				{
					key: 'contact-blogger',
					title: '联系博主',
					leftIcon: 'icon-paper-plane',
					leftIconColor: 'orange',
					rightText: '博主常用联系方式',
					path: '/pagesA/contact/contact',
					isAdmin: false,
					type: 'page',
					show: true
				},
				{
					key: 'session',
					title: '在线客服',
					leftIcon: 'icon-headset-fill',
					leftIconColor: 'cyan',
					rightText: '在线客服为您答疑',
					path: null,
					isAdmin: false,
					type: 'page',
					openType: 'contact',
					show: true
				},
				{
					key: 'feedback',
					title: '意见反馈',
					leftIcon: 'icon-comment-dots',
					leftIconColor: 'light-blue',
					rightText: '提交系统使用反馈',
					path: null,
					isAdmin: false,
					type: 'page',
					openType: 'feedback',
					show: true
				},
				{
					key: 'about',
					title: '关于项目',
					leftIcon: 'icon-exclamation-circle',
					leftIconColor: 'gray',
					rightText: '小莫唐尼开源项目',
					path: '/pagesA/about/about',
					isAdmin: false,
					type: 'page',
					show: getApp().globalData.showAbout
				},
				{
					key: 'cache',
					title: '清除缓存',
					leftIcon: 'icon-delete',
					leftIconColor: 'gray',
					rightText: uni.getStorageInfoSync().currentSize + 'KB',
					path: 'clear',
					isAdmin: false,
					type: 'poup',
					show: true
				},
				{
					key: 'update',
					title: '版本更新',
					leftIcon: 'icon-clouddownload',
					leftIconColor: 'gray',
					rightText: `当前版本 v${systemInfo.appVersion}`,
					path: 'update',
					isAdmin: false,
					type: 'poup',
					show: true
				},
				{
					key: 'setting',
					title: '应用设置',
					leftIcon: 'icon-cog',
					leftIconColor: 'gray',
					rightText: `进入系统常用设置`,
					path: '/pagesA/setting/setting',
					isAdmin: false,
					type: 'page',
					show: true
				},
				{
					key: 'admin',
					title: '后台管理',
					leftIcon: 'icon-lock',
					leftIconColor: 'gray',
					rightText: '博客后台系统入口',
					path: '/pagesB/admin/admin',
					isAdmin: true,
					type: 'page',
					show: this.globalAppSettings.about.showAdmin
				}
			];
		},
		fnGetData() {
			this.$httpApi
				.getBlogStatistics()
				.then(res => {
					if (res.status == 200) {
						this.statistics = res.data;
					} else {
						this.$tm.toast('数据加载失败，请重试！');
					}
				})
				.catch(err => {
					this.$tm.toast('数据加载失败，请重试！');
				})
				.finally(() => {
					uni.stopPullDownRefresh();
				});
		},

		fnOnNav(data) {
			const { type, path, isAdmin, openType } = data;
			if (openType) {
				// #ifndef MP-WEIXIN
				return uni.$tm.toast('仅支持微信小程序打开！');
				// #endif
				// #ifdef MP-WEIXIN
				return;
				// #endif
			}
			if (!path) return;

			// 拦截后台管理页面（插件拦截不友好，无法阻断）
			if (isAdmin && !checkHasAdminLogin()) {
				uni.$eShowModal({
					title: '提示',
					content: '未登录超管账号或登录状态已过期，是否立即登录？',
					showCancel: true,
					cancelText: '否',
					cancelColor: '#999999',
					confirmText: '是',
					confirmColor: '#03a9f4'
				})
					.then(res => {
						uni.navigateTo({
							url: '/pagesB/login/login'
						});
					})
					.catch(err => {});
				return;
			}

			if (type == 'poup') {
				switch (path) {
					case 'clear':
						uni.$eShowModal({
							title: '提示',
							content: '清除后可能退出您当前的登录或已授权状态，是否确定清除缓存吗？',
							showCancel: true,
							cancelText: '否',
							cancelColor: '#999999',
							confirmText: '是',
							confirmColor: '#03a9f4'
						})
							.then(res => {
								uni.clearStorageSync();
								this.navList.find(x => x.key == 'cache').rightText =
									uni.getStorageInfoSync().currentSize + 'KB';
							})
							.catch(err => {});
						break;
					case 'update':
						// #ifdef APP-PLUS
						CheckAppUpdate();
						// #endif

						// #ifdef MP-WEIXIN
						CheckWxUpdate(true);
						// #endif

						// #ifndef APP-PLUS|| MP-WEIXIN
						uni.showToast({
							icon: 'none',
							title: '版本无需更新！'
						});
						// #endif

						break;
				}
			} else if (type == 'page') {
				this.$Router.push({
					path: path
				});
			}
		},

		// 快捷导航页面跳转
		fnToNavPage(item) {
			// 判断是内置页面还是网页
			if (this.$utils.checkIsUrl(item.path)) {
				uni.navigateTo({
					url:
						'/pagesC/website/website?data=' +
						JSON.stringify({
							title: item.text || this.$haloConfig.title,
							url: item.path
						})
				});
				return;
			}
			switch (item.type) {
				case 'tabbar':
					uni.switchTab({
						url: item.path
					});
					break;
				case 'page':
					uni.navigateTo({
						url: item.path
					});
					break;
			}
		},
		fnOnToAdTest(path) {
			uni.navigateTo({
				url: path
			});
		}
	}
};
</script>

<style scoped lang="scss">
.app-page {
	width: 100vw;
	min-height: 100vh;
}

.blogger-info {
	position: relative;
	width: 100%;
	height: 600rpx;
	background-size: cover;
	background-repeat: no-repeat;
	&:before {
		content: '';
		width: 100%;
		height: 100%;
		position: absolute;
		background-color: rgba(0, 0, 0, 0.3);
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAKUlEQVQImU3IMREAIAgAwJfNkQCEsH8cijjpMf6vnXlQaIiJFx+omEBfmqIEZLe2jzcAAAAASUVORK5CYII=);
		z-index: 0;
	}
	.avatar {
		position: absolute;
		top: 200rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 130rpx;
		height: 130rpx;
		border-radius: 50%;
		border: 6rpx solid #ffffff;
	}
	.profile {
		width: 100%;
		position: absolute;
		top: 340rpx;
		left: 0;
		z-index: 6;
		color: #fff;
		text-align: center;
	}
	.gif-wave {
		position: absolute;
		width: 100%;
		bottom: 0;
		left: 0;
		z-index: 99;
		mix-blend-mode: screen;
		height: 100rpx;
	}
}

.profile-card {
	position: relative;
	background-color: #fff;
	overflow: hidden;
	&_label {
		width: 120rpx;
		position: absolute;
		top: 8rpx;
		left: -36rpx;
		transform: rotateZ(-45deg);
		text-align: center;
		color: #ffffff;
	}
	.left {
		width: 260rpx;
		.avatar {
			width: 130rpx;
			height: 130rpx;
			border-radius: 50%;
		}
	}
	.right {
		width: 0;
		flex-grow: 1;

		.photos {
			&-img {
				width: 130rpx;
				height: 130rpx;
			}
		}
		.photos-img + .photos-img {
			margin-left: 12rpx;
		}
	}
}
.statistics-wrap {
	box-shadow: 0rpx 2rpx 24rpx rgba(0, 0, 0, 0.03);
	border-radius: 0rpx 0rpx 24rpx 24rpx;
	overflow: hidden;
	.statistics {
		&.has-solid {
			.item + .item {
				border-left: 2rpx solid #fafafa;
			}
		}
		&.solid-top {
			position: relative;
			&:before {
				content: '';
				position: absolute;
				top: 0;
				left: 36rpx;
				right: 36rpx;
				height: 2rpx;
				background-color: #fafafa;
			}
		}
	}
}
.quick-nav {
	background-color: #fff;
	box-sizing: border-box;
	box-shadow: 0rpx 2rpx 24rpx rgba(0, 0, 0, 0.03);
	.name {
		color: var(--main-text-color);
	}
	.icon {
		border-radius: 50%;
		font-size: 80rpx;
	}
}
.nav-wrap {
	box-shadow: 0rpx 2rpx 24rpx rgba(0, 0, 0, 0.03);
	background-color: #fff;
}
.copyright {
	color: #c0c4c7;
}
.right-value-btn {
	background-color: transparent;
	border: none;
	padding: 0;
	margin: 0;
	font-size: 24rpx;
	color: #c0c4c7;
	border-radius: 0;
	line-height: initial;
	&::after {
		border: none;
		border-radius: 0;
		transform: initial;
	}
}
</style>
