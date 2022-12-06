<template>
	<view class="app-page  pa-24 bg-white">
		<view class="app-page-content round-12 bg-white pa-46  pl-0 pr-0">
			<view v-if="false" class="mb-24 text-align-center text-weight-b text-size-g text-grey-darken-3">修改登录密码</view>
			<tm-form @submit="fnSubmit">
				<tm-sheet :shadow="0" :margin="[0, 0]" :padding="[0, 0]">
					<tm-input
						:password="true"
						name="oldPassword"
						input-type="password"
						required
						title="旧密码"
						placeholder="请输入旧密码"
						bg-color="grey-lighten-5"
						:border-bottom="false"
						:vertical="true"
						v-model="form.oldPassword"
						:verify="verifyOldPassword"
					></tm-input>
					<tm-input
						:password="true"
						name="newPassword"
						input-type="password"
						required
						title="新密码"
						placeholder="请输入新密码"
						bg-color="grey-lighten-5"
						:border-bottom="false"
						:vertical="true"
						v-model="form.newPassword"
						:verify="verifyNewPassword"
					></tm-input>
					<tm-input
						:password="true"
						name="confirmPassword"
						input-type="password"
						required
						title="确认密码"
						placeholder="请再次确认新密码"
						bg-color="grey-lighten-5"
						:border-bottom="false"
						:vertical="true"
						v-model="form.confirmPassword"
						:verify="verifyConfirmPassword"
					></tm-input>
					<view class="pa-30"><tm-button navtie-type="form" theme="bg-gradient-blue-accent" block>确认修改</tm-button></view>
				</tm-sheet>
			</tm-form>
		</view>
	</view>
</template>

<script>
import tmForm from '@/tm-vuetify/components/tm-form/tm-form.vue';
import tmSheet from '@/tm-vuetify/components/tm-sheet/tm-sheet.vue';
import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
import tmInput from '@/tm-vuetify/components/tm-input/tm-input.vue';
import tmCountdown from '@/tm-vuetify/components/tm-countdown/tm-countdown.vue';

export default {
	components: {
		tmForm,
		tmSheet,
		tmButton,
		tmInput,
		tmCountdown
	},
	data() {
		return {
			loading: 'loading',
			form: {
				oldPassword: undefined,
				newPassword: undefined,
				confirmPassword: undefined
			},
			verifyOldPassword: () => {
				return val => {
					return {
						check: val != '',
						text: '请输入旧密码！'
					};
				};
			},
			verifyNewPassword: () => {
				return val => {
					return {
						check: val != '',
						text: '请输入新密码！'
					};
				};
			},
			verifyConfirmPassword: () => {
				return val => {
					return {
						check: this.form.newPassword == this.form.confirmPassword,
						text: '两次新密码不一致！'
					};
				};
			}
		};
	},

	onLoad() {
		this.fnSetPageTitle('修改密码');
	},

	methods: {
		fnSubmit(e) {
			if (e === false) return uni.$tm.toast('请填写必填项。');
			uni.showLoading({
				title: '保存中...'
			});
			this.$httpApi.admin
				.modifyAdminPassword(this.form)
				.then(res => {
					if (res.status == 200) {
						uni.$tm.toast('密码修改成功！');
						this.form = {
							oldPassword: undefined,
							newPassword: undefined,
							confirmPassword: undefined
						};
					} else {
						uni.$tm.toast('密码修改失败:' + res.message);
					}
				})
				.catch(err => {
					uni.$tm.toast('密码修改失败:' + err.message);
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.app-page {
	width: 100vw;
	min-height: 100vh;
	box-sizing: border-box;
}
.app-page-content {
	width: 100%;
	box-sizing: border-box;
	// box-shadow: 0rpx 6rpx 24rpx rgba(0, 0, 0, 0.03);
}
</style>
