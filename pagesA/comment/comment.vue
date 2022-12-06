<template>
	<view class="app-page pa-6">
		<view class="content pt-24 pb-24 round-4">
			<!-- 表单区域 -->
			<tm-form @submit="fnOnSubmit">
				<tm-input
					:auto-focus="true"
					name="content"
					:vertical="true"
					required
					:height="220"
					input-type="textarea"
					bg-color="grey-lighten-5"
					:maxlength="200"
					:borderBottom="false"
					placeholder="请输入内容,不超过200字符..."
					v-model="form.content"
				></tm-input>
				<tm-input name="author" align="right" required title="我的昵称" placeholder="请输入您的昵称..." v-model="form.author"></tm-input>
				<tm-input name="email" align="right" title="邮箱地址" placeholder="请输入您的邮箱..." v-model="form.email"></tm-input>
				<tm-input name="authorUrl" align="right" title="我的网站" placeholder="请输入您的网址..." v-model="form.authorUrl"></tm-input>
				<view class="mx-32 my-24 border-b-1  pb-24 flex-between">
					<text class="text-size-n ">接收提醒</text>
					<view><tm-switch :text="['是', '否']" v-model="form.allowNotification" color="bg-gradient-blue-accent"></tm-switch></view>
				</view>
				<view class="pa-24 pl-30 pr-30"><tm-button navtie-type="form" theme="bg-gradient-blue-accent" block>提交</tm-button></view>
			</tm-form>
		</view>
	</view>
</template>

<script>
import tmForm from '@/tm-vuetify/components/tm-form/tm-form.vue';
import tmInput from '@/tm-vuetify/components/tm-input/tm-input.vue';
import tmSwitch from '@/tm-vuetify/components/tm-switch/tm-switch.vue';
import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';

export default {
	components: {
		tmForm,
		tmInput,
		tmSwitch,
		tmButton
	},
	data() {
		return {
			params: {
				postId: '',
				parentId: '',
				title: '', // 被回复的标题 type=user =用户名  否则为文章标题
				form: '',
				formPage: '', // 来自哪个页面
				type: 'post' // 来源文章/页面 还是用户  user=用户
			},
			form: {
				allowNotification: true,
				author: '', // 作者
				avatar: '',
				authorUrl: '', // 作者主页
				content: '', // 评论内容
				email: '', // 邮件
				parentId: 0,
				postId: 0
			}
		};
	},
	computed: {
		// 评论游客信息
		wxLoginVisitorUser() {
			return uni.$tm.vx.getters().user.getWxLoginInfo;
		}
	},
	onLoad() {
		this.params = this.$Route.query;
		this.form.postId = this.params.id;
		if (this.params.type == 'user') {
			this.form.parentId = this.params.parentId;
			this.fnSetPageTitle('回复用户：' + this.params.title);
		} else {
			this.form.parentId = 0;
			this.fnSetPageTitle(this.params.title);
		}
		this.form.author = this.wxLoginVisitorUser.nickName;
		this.form.avatar = this.wxLoginVisitorUser.avatarUrl;
		this.form.email = this.wxLoginVisitorUser.email;
		this.form.authorUrl = this.wxLoginVisitorUser.url;
	},
	methods: {
		fnOnSubmit(e) {
			if (e === false) {
				return uni.$tm.toast('请检查所有的必填项是否填写完整！');
			}
			if (this.form.allowNotification && !this.form.email) {
				return uni.$tm.toast('未填写邮箱地址，将无法接收提醒！');
			}
			if (this.form.email && !uni.$tm.test.email(this.form.email)) {
				return uni.$tm.toast('请填写正确的邮箱地址！');
			}
			if (this.form.authorUrl && !uni.$tm.test.url(this.form.authorUrl)) {
				return uni.$tm.toast('请输入正确的Url地址！');
			}
			this.fnHandle();
		},

		fnHandle() {
			uni.showLoading({
				title: '正在提交...'
			});
			const _api = {
				sheets: this.$httpApi.postSheetsComments,
				posts: this.$httpApi.postCommentPost
			};
			_api[this.params.from](this.form)
				.then(res => {
					if (res.status == 200) {
						uni.$tm.toast('提交成功，待博主审核通过后即可展示！');
						// 更新评论者信息
						uni.$tm.vx.commit('user/setWxLoginInfo', {
							avatarUrl: this.wxLoginVisitorUser.avatarUrl,
							nickName: this.form.author,
							email: this.form.email,
							url: this.form.authorUrl
						});
						// 清空评论内容
						this.form.content = '';
						// 触发刷新评论（可能需要评论审核不会有改变）
						// uni.$emit(this.params.formPage + '_refresh');
					} else {
						uni.$tm.toast('操作失败，请重试！');
					}
				})
				.catch(err => {
					uni.$tm.toast(err.message);
				});
		}
	}
};
</script>

<style scoped lang="scss">
.app-page {
	width: 100vw;
	min-height: 100vh;
	box-sizing: border-box;
	// background-color: #fafafd;
	background-color: #ffffff;

	.content {
		overflow: hidden;
		background-color: #fff;
		// box-shadow: 0rpx 4rpx 24rpx rgba(0, 0, 0, 0.05);
	}
}
.poup-content {
	width: 500rpx;

	::v-deep {
		.slider_id {
			width: 100% !important;
		}
	}
}
</style>
