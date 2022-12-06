<template>
	<view class="app-page bg-white flex flex-col flex-center">
		<view class="content pt-36 pb-36 pl-12 pr-12  bg-white round-6">
			<tm-form @submit="submit">
				<tm-sheet :shadow="0" :margin="[0, 0]" :padding="[0, 0]">
					<view class="text-weight-b text-size-xl ma-24 mb-36 text-align-center text-bg-gradient-light-blue-accent">登录后台管理</view>
					<image v-if="false" class="avatar " :src="$utils.checkAvatarUrl(bloggerInfo.avatar)" mode="aspectFill" @click="miniProfileCard.show = true"></image>
					<tm-input
						:round="12"
						color="grey"
						bg-color="grey-lighten-5"
						:border-bottom="false"
						required
						prefixp-icon="icon-account"
						:vertical="true"
						:clear="true"
						name="username"
						v-model="form.username"
						placeholder="请输入用户名"
						:focus="true"
						:verify="verifyUsername"
					></tm-input>
					<tm-input
						:round="12"
						color="grey"
						bg-color="grey-lighten-5"
						:border-bottom="false"
						required
						prefixp-icon="icon-lock"
						:vertical="true"
						:clear="true"
						name="password"
						input-type="password"
						v-model="form.password"
						placeholder="请输入登录密码"
						:verify="verifyPassword"
					></tm-input>

					<view class="pa-24 mt-12 pl-30 pr-30">
						<tm-button :round="25" navtie-type="form" theme="bg-gradient-blue-accent" block :loading="loading">立即登录</tm-button>
						<view v-if="false" class="mt-36 text-size-m text-grey-darken-1 text-align-center" @click="fnFindPassword()">忘记密码？立即重置</view>
					</view>
				</tm-sheet>
			</tm-form>
		</view>
		<view v-if="showCopyright" class="copyright text-size-s text-grey text-align-center">「 2022 uni-halo 丨 开源项目@小莫唐尼 」</view>
		<image class="top" src="@/static/login/login_top2.jpg" mode="aspectFill"></image>
		<image class="bottom" src="@/static/login/login_bottom_bg.jpg" mode="aspectFill"></image>
	</view>
</template>

<script>
import tmForm from '@/tm-vuetify/components/tm-form/tm-form.vue';
import tmInput from '@/tm-vuetify/components/tm-input/tm-input.vue';
import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
import tmSheet from '@/tm-vuetify/components/tm-sheet/tm-sheet.vue';

export default {
	components: { tmSheet, tmForm, tmInput, tmButton },
	data() {
		return {
			loading: false,
			form: {
				// authcode: '', // 二次验证
				username: undefined,
				password: undefined
			},
			verifyUsername: () => {
				return val => {
					return {
						check: val != ''
						// text: '错误提示：请输入用户名！'
					};
				};
			},
			verifyPassword: () => {
				return val => {
					return {
						check: val != ''
						// text: '错误提示：请输入登录密码！'
					};
				};
			}
		};
	},
	computed: {
		bloggerInfo() {
			return this.$tm.vx.getters().blogger.getBlogger;
		},
		showCopyright() {
			return getApp().globalData.showCopyright;
		}
	},
	onBackPress() {
		uni.switchTab({
			url: '/pages/tabbar/about/about'
		});
	},
	methods: {
		submit(e) {
			if (e === false) return uni.$tm.toast('请检查用户名和密码！');
			uni.showLoading({
				title: '登录中...',
				mask: true
			});
			this.loading = true;
			uni.$tm.vx
				.actions('user/adminLogin', this.form)
				.then(res => {
					if (res.status == 200) {
						uni.showToast({
							mask: true,
							icon: 'none',
							title: '登录成功，正在跳转...'
						});
						setTimeout(() => {
							uni.redirectTo({
								url: '/pagesB/admin/admin'
							});
						}, 1200);
					} else {
						uni.$tm.toast('登录失败：' + res.message);
						this.loading = false;
					}
				})
				.catch(err => {
					uni.$tm.toast('登录失败：' + err.message);
					this.loading = false;
				});
		},
		fnFindPassword() {
			uni.$tm.toast('找回密码功能');
		}
	}
};
</script>

<style scoped lang="scss">
.app-page {
	position: relative;
	width: 100vw;
	min-height: 100vh;
	.top {
		position: absolute;
		left: 0;
		top: 0;
		width: 100vw;
		height: 45vh;
		z-index: 0;
	}
	.bottom {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100vw;
	}
	.content {
		position: relative;
		box-sizing: border-box;
		box-shadow: 0rpx 2rpx 24rpx rgba(0, 0, 0, 0.07);
		z-index: 2;
		width: 82vw;
		.avatar {
			position: absolute;
			left: 50%;
			top: -75rpx;
			transform: translateX(-50%);
			width: 150rpx;
			height: 150rpx;
			box-sizing: border-box;
			border: 6rpx solid #fff;
			box-shadow: 0rpx 4rpx 48rpx rgba(13, 179, 242, 0.07);
			border-radius: 50%;
		}
	}

	.copyright {
		position: absolute;
		bottom: 24rpx;
		left: 0;
		width: 100vw;
		z-index: 2;
	}
}
</style>
