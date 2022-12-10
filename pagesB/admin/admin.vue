<template>
	<view class="app-page">
		<!-- 博主信息 -->
		<view class="blogger bg-white flex flex-center ma-24 mt-30 pa-24 round-3" @click="fnToModifyProfile">
			<image class="avatar" :src="$utils.checkAvatarUrl(bloggerInfo.avatar, true)" mode="aspectFill"></image>
			<view class="info pl-24">
				<view class="name text-weight-b text-grey-darken-5">☔️{{ bloggerInfo.nickname }} 欢迎回来！</view>
				<view class="mt-12 text-size-s text-grey-darken-1">{{ bloggerInfo.description || '这个人真懒，没填写描述~' }}</view>
			</view>
			<view class="modify"><text class="text-grey-darken-1 text-size-m iconfont icon-angle-right"></text></view>
		</view>

		<!-- 工作台导航 -->
		<view class="works bg-white ma-24 mt-36 pt-24 pb-16 flex flex-wrap round-3">
			<view class="works-item pt-24 pb-24 flex flex-col flex-center " v-for="(item, index) in workList" :key="index">
				<view class="icon flex flex-center round-4" :style="{ backgroundColor: item.bgColor }" @click="fnOnNav(item)">
					<text class="haloicon" :class="[item.icon]"></text>
				</view>
				<view class="mt-12 title text-size-s text-grey-darken-1">{{ item.name }}</view>
			</view>
		</view>

		<tm-bottomnavigation
			class="shadow-6"
			position="bottom"
			:bottom="24"
			:safe="false"
			:round="3"
			:offset-left="12"
			border=""
			icon-color="blue"
			icon-color-grey="blue"
			:list="quickBarList"
			@change="fnOnNavBar"
		></tm-bottomnavigation>
	</view>
</template>

<script>
import tmBottomnavigation from '@/tm-vuetify/components/tm-bottomnavigation/tm-bottomnavigation.vue';
export default {
	components: { tmBottomnavigation },
	data() {
		return {
			workList: [
				{
					icon: 'haloicon-shuxie1',
					name: '日记管理',
					bgColor: 'rgba(80,167,255,1)',
					path: '/pagesB/journal/journal',
					todo: false
				},
				{
					icon: 'haloicon-wenzhang1',
					name: '文章管理',
					bgColor: 'rgba(27,187,179,1)',
					path: '/pagesB/articles/articles',
					todo: false
				},
				{
					icon: 'haloicon-fenlei2',
					name: '分类管理',
					bgColor: 'rgba(253,103,132,1)',
					path: '/pagesB/category/category',
					todo: false
				},
				{
					icon: 'haloicon-biaoqian2',
					name: '标签管理',
					bgColor: '#6638B5',
					path: '/pagesB/tags/tags',
					todo: false
				},
				{
					icon: 'haloicon-fujian1',
					name: '附件管理',
					bgColor: 'rgba(253,103,132,1)',
					path: '/pagesB/attachment/attachment',
					todo: false
				},
				{
					icon: 'haloicon-links',
					name: '友链管理',
					bgColor: 'rgba(80,167,255,1)',
					path: '/pagesB/links/links',
					todo: false
				},
				{
					icon: 'haloicon-tukuguanli',
					name: '图库管理',
					bgColor: 'rgba(254,178,0,1) ',
					path: '/pagesB/photos/photos',
					todo: false
				},
				{
					icon: 'haloicon-pinglun1',
					name: '评论管理',
					bgColor: 'rgba(27,187,179,1)',
					path: '/pagesB/comments/comments',
					todo: false
				},
				{
					icon: 'haloicon-xitongrizhi',
					name: '日志管理',
					bgColor: '#6638B5',
					path: '/pagesB/logs/logs',
					todo: false
				},
				{
					icon: 'haloicon-caidan',
					name: '菜单设置',
					bgColor: 'rgba(254,178,0,1)',
					path: '/pagesB/menus/menus',
					todo: true
				},
				{
					icon: 'haloicon-password',
					name: '修改密码',
					bgColor: 'rgba(27,187,179,1)',
					path: '/pagesB/password/password',
					todo: false
				},
				{
					icon: 'haloicon-shezhi',
					name: '系统设置',
					bgColor: '#8698A2',
					path: '/pagesB/settings/settings',
					todo: true
				}
			],
			quickBarList: [
				{ key: 'logout', iconSize: 36, icon: 'icon-poweroff', fontSize: 26, value: '退出登录' },
				{
					key: 'article-edit',
					iconSize: 36,
					icon: 'icon-plus',
					fontSize: 26,
					value: '写文章',
					custom: true,
					customColor: 'blue',
					customFontColor: 'white'
				},
				{ key: 'back-home', iconSize: 36, icon: 'icon-home', fontSize: 26, value: '返回首页' }
			]
		};
	},
	computed: {
		bloggerInfo() {
			return this.$tm.vx.getters().getBlogger;
		}
	},
	created() {
		// this.fnGetData();
		this.fnSetPageTitle('欢迎登录工作台');
	},
	onPullDownRefresh() {
		uni.stopPullDownRefresh();
	},
	methods: {
		fnGetData() {
			this.$httpApi.admin
				.getLinkList()
				.then(res => {
					console.log('getLinkList，success：', res);
				})
				.catch(err => {
					console.log('getLinkList，error：', err);
				});
		},
		fnToModifyProfile() {
			this.$Router.push({
				path: '/pagesB/profile/profile'
			});
		},
		fnOnNav(item) {
			if (item.todo) return uni.$tm.toast('功能开发中...');
			this.$Router.push({
				path: item.path
			});
		},
		fnOnNavBar(e) {
			if (e.item.key == 'logout') {
				uni.$eShowModal({
					title: '提示',
					content: '是否要退出当前后台管理登录？',
					showCancel: true,
					cancelText: '否',
					cancelColor: '#999999',
					confirmText: '是',
					confirmColor: '#03a9f4'
				})
					.then(res => {
						uni.showLoading({
							title: '正在退出登录...'
						});
						uni.$tm.vx.actions('user/adminLogout');
						setTimeout(() => {
							uni.hideLoading();
							uni.switchTab({
								url: '/pages/tabbar/about/about'
							});
						}, 1000);
					})
					.catch(err => {});
			} else if (e.item.key == 'article-edit') {
				uni.$tm.toast(e.item.value);
				this.$Router.push({
					path: '/pagesB/articles/article-edit'
				});
			} else if (e.item.key == 'back-home') {
				uni.$eShowModal({
					title: '提示',
					content: '是否返回首页？',
					showCancel: true,
					cancelText: '否',
					cancelColor: '#999999',
					confirmText: '是',
					confirmColor: '#03a9f4'
				})
					.then(res => {
						uni.switchTab({
							url: '/pages/tabbar/home/home'
						});
					})
					.catch(err => {});
			}
		}
	}
};
</script>

<style scoped lang="scss">
.app-page {
	width: 100vw;

	::v-deep {
		.tm-bottomnavigation {
			box-shadow: 0rpx 4rpx 24rpx rgba(0, 0, 0, 0.05);
		}
	}
}

.blogger {
	box-shadow: 0rpx 0rpx 24rpx rgba(0, 0, 0, 0.05);
	.avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		border: 6rpx solid #ffffff;
		box-shadow: 0rpx 0rpx 24rpx rgba(0, 0, 0, 0.07);
	}
	.info {
		width: 0;
		flex-grow: 1;

		.name {
			font-size: 30rpx;
		}
	}
	.modify {
		width: 40rpx;
	}
}

.works {
	box-shadow: 0rpx 0rpx 24rpx rgba(0, 0, 0, 0.05);
	&-item {
		width: 25%;
		box-sizing: border-box;

		.icon {
			width: 100rpx;
			height: 100rpx;
			box-shadow: 0rpx 4rpx 24rpx rgba(0, 0, 0, 0.1);
			.haloicon {
				color: #ffffff;
				font-size: 66rpx;
			}
		}
		.title {
			color: #55647a;
		}
	}
}
</style>
