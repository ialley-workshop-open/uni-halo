<template>
	<view class="app-page">
		<view v-if="loading != 'success'" class="loading-wrap pa-24">
			<block v-if="loading == 'loading'"></block>
			<view v-else-if="loading == 'error'" class="loading-error flex flex-col flex-center">
				<tm-empty icon="icon-wind-cry" label="加载失败"><tm-button theme="light-blue" size="m" @click="fnGetData()">重新加载</tm-button></tm-empty>
			</view>
		</view>
		<view class="app-page-content round-3 bg-white pa-46 pl-10 pr-10" v-else>
			<tm-form @submit="fnSubmit">
				<tm-sheet :shadow="0" :margin="[0, 0]" :padding="[0, 0]">
					<view class="avatar flex flex-center pa-12 bg-white">
						<text class="edit-icon flex flex-center"><text class=" iconfont icon-cloudupload"></text></text>
						<image class="avatar-img" :src="result.showAvatar" @click="fnShowUploadAvatarSelect()"></image>
					</view>

					<tm-input name="username" required title="用户名" align="right" v-model="result.username"></tm-input>
					<tm-input name="nickname" required title="昵称" align="right" v-model="result.nickname"></tm-input>
					<tm-input name="email" required title="电子邮箱" align="right" v-model="result.email"></tm-input>
					<tm-input
						name="description"
						:vertical="true"
						required
						:height="150"
						input-type="textarea"
						bg-color="grey-lighten-5"
						:maxlength="200"
						title="个人说明"
						placeholder="请输入个人说明,不超过200字符"
						v-model="result.description"
						:borderBottom="false"
						:adjustPosition="true"
					></tm-input>

					<view class="pa-30"><tm-button navtie-type="form" theme="bg-gradient-blue-accent" block>保存修改</tm-button></view>
				</tm-sheet>
			</tm-form>

			<tm-actionSheetMenu @change="fnOnUploadAvatarChange" v-model="uploadAvatarShow" title="请选择头像" :actions="['本地上传', '附件选择']"></tm-actionSheetMenu>
			<!-- 附件选择文件 -->
			<attachment-select selectType="image" v-if="attachmentsSelectShow" @on-select="fnOnAttachmentsSelect" @on-close="attachmentsSelectShow = false"></attachment-select>
		</view>
	</view>
</template>

<script>
import { getAdminAccessToken } from '@/utils/auth.js';

import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';
import tmForm from '@/tm-vuetify/components/tm-form/tm-form.vue';
import tmInput from '@/tm-vuetify/components/tm-input/tm-input.vue';
import tmImages from '@/tm-vuetify/components/tm-images/tm-images.vue';
import tmActionSheetMenu from '@/tm-vuetify/components/tm-actionSheetMenu/tm-actionSheetMenu.vue';
import tmSheet from '@/tm-vuetify/components/tm-sheet/tm-sheet.vue';
import AttachmentSelect from '@/components/attachment-select/attachment-select.vue';

export default {
	components: {
		tmSkeleton,
		tmButton,
		tmEmpty,
		tmForm,
		tmInput,
		tmImages,
		tmActionSheetMenu,
		tmSheet,
		AttachmentSelect
	},
	data() {
		return {
			loading: 'loading',
			queryParams: {
				size: 10,
				page: 0
			},
			result: {
				username: undefined,
				nickname: undefined,
				email: undefined,
				avatar: undefined,
				showAvatar: undefined,
				description: undefined
			},
			uploadAvatarShow: false,
			attachmentsSelectShow: false,
			verifyEmail: () => {
				return val => {
					return {
						check: uni.$tm.u.email(val),
						text: '请输入正确的邮箱'
					};
				};
			}
		};
	},

	onLoad() {
		this.fnSetPageTitle('我的个人信息');
	},
	created() {
		this.fnGetData();
	},
	onPullDownRefresh() {
		this.fnGetData();
	},
	methods: {
		fnGetData() {
			this.loading = 'loading';
			uni.showLoading({
				mask: true,
				title: '加载中...'
			});
			this.$httpApi.admin
				.getAdminProfile()
				.then(res => {
					if (res.status == 200) {
						let { avatar } = res.data;
						this.result = res.data;
						this.result.showAvatar = this.$utils.checkAvatarUrl(avatar);
						this.loading = 'success';
					} else {
						this.loading = 'error';
					}
				})
				.catch(err => {
					console.error(err);
					this.loading = 'error';
				})
				.finally(() => {
					uni.hideLoading();
					uni.stopPullDownRefresh();
				});
		},
		fnShowUploadAvatarSelect() {
			this.uploadAvatarShow = true;
		},
		fnOnUploadAvatarChange(e) {
			switch (e.index) {
				case 0:
					// 本地上传
					uni.chooseImage({
						count: 1,
						success: res => {
							uni.uploadFile({
								filePath: res.tempFilePaths[0],
								header: {
									'admin-authorization': getAdminAccessToken()
								},
								url: this.$baseApiUrl + '/api/admin/attachments/upload',
								name: 'file',
								success: upladRes => {
									const _uploadRes = JSON.parse(upladRes.data);
									if (_uploadRes.status == 200) {
										this.result.avatar = _uploadRes.data.path;
										this.result.showAvatar = this.$utils.checkAvatarUrl(_uploadRes.data.path);
										this.$focusUpdate();
									} else {
										uni.$tm.toast(_uploadRes.message);
									}
								},
								fail: err => {
									uni.$tm.toast(err.message);
								}
							});
						}
					});
					break;
				case 1:
					// 从附件库选择
					this.attachmentsSelectShow = true;
					break;
			}
		},
		// 监听附件选择
		fnOnAttachmentsSelect(file) {
			this.result.avatar = file.path;
			this.result.showAvatar = this.$utils.checkAvatarUrl(file.path);
			this.attachmentsSelectShow = false;
		},
		fnSubmit(e) {
			if (e === false) return uni.$tm.toast('请填写必填项。');
			uni.showLoading({
				title: '保存中...'
			});
			this.$httpApi.admin
				.updateAdminProfile(this.result)
				.then(res => {
					if (res.status == 200) {
						uni.$tm.toast('保存成功');
						this.$tm.vx.commit('blogger/setBlogger', this.result);
					} else {
						uni.$tm.toast('保存失败，请重试！');
					}
				})
				.catch(err => {
					uni.$tm.toast('保存失败，请重试！');
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
	height: 100vh;
	box-sizing: border-box;
	// box-shadow: 0rpx 6rpx 24rpx rgba(0, 0, 0, 0.03);
}
.loading-wrap {
	padding: 24rpx;
	.loading-error {
		height: 65vh;
	}
}

.avatar {
	position: relative;
	&-img {
		width: 170rpx;
		height: 170rpx;
		box-sizing: border-box;
		border: 6rpx solid #fff;
		border-radius: 50%;
		box-shadow: 0rpx 6rpx 24rpx rgba(0, 0, 0, 0.03);
	}
	.edit-icon {
		width: 46rpx;
		height: 46rpx;
		position: absolute;
		left: 390rpx;
		bottom: 15rpx;
		z-index: 6;
		color: #0dadf2;
		box-sizing: border-box;
		border: 4rpx solid #ffffff;
		font-size: 24rpx;
		border-radius: 50%;
		background-color: #e4e4e4;
	}
}
</style>
