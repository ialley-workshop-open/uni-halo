<template>
	<view class="app-page bg-white pa-12">
		<!-- 工具栏区域 -->
		<view class="tool-bar-wrap e-fixed bg-white pt-12 pb-16 border-b-1">
			<view class="tool-bar flex flex-center  text-grey-darken-2">
				<text class="halohtmlicon icon-undo" data-method="undo" @click="fnOnToolBarEdit"></text>
				<text class="halohtmlicon icon-redo" data-method="redo" @click="fnOnToolBarEdit"></text>
				<text class="halohtmlicon icon-img" data-method="insertImg" @click="fnOnToolBarEdit"></text>
				<text class="halohtmlicon icon-video" data-method="insertVideo" @click="fnOnToolBarEdit"></text>
				<text class="halohtmlicon icon-link" data-method="insertLink" @click="fnOnToolBarEdit"></text>
				<text class="halohtmlicon icon-text" data-method="insertText" @click="fnOnToolBarEdit"></text>
				<text class="halohtmlicon icon-line" data-method="insertHtml" data-param="<hr style='margin:10px 0;'/>" @click="fnOnToolBarEdit"></text>
			</view>
			<view class="tool-bar flex flex-center  text-grey-darken-2 mt-16">
				<text class="halohtmlicon icon-heading" @click="fnOnInsertHead"></text>
				<text
					class="halohtmlicon icon-quote"
					data-method="insertHtml"
					data-param="<blockquote style='padding:0 1em;color:#6a737d;border-left:.25em solid #dfe2e5'>引用</blockquote>"
					@click="fnOnToolBarEdit"
				></text>
				<text class="halohtmlicon icon-table" @click="fnOnInsertTable"></text>
				<text class="halohtmlicon icon-code" @click="fnOnInsertCode"></text>
				<text class="halohtmlicon icon-emoji" data-type="emoji" data-title="插入表情" @click="fnOnOpenDialog"></text>
				<text class="halohtmlicon icon-template" data-type="template" data-title="插入模板" @click="fnOnOpenDialog"></text>
				<text v-if="editable" class="flex-1 text-align-center iconfont icon-eye" style="font-size: 44rpx;" @click="fnOnPreview()"></text>
				<text v-else class="halohtmlicon icon-edit" @click="fnOnPreview()"></text>
			</view>
		</view>
		<!-- 编辑区域 -->
		<view class="edit-wrap bg-white round-3">
			<mp-html
				class="evan-markdown"
				lazy-load
				ref="markdown"
				:editable="editable"
				:domain="markdownConfig.domain"
				:loading-img="markdownConfig.loadingGif"
				:scroll-table="true"
				selectable="force"
				:tag-style="markdownConfig.tagStyle"
				:container-style="markdownConfig.containStyle"
				:content="form.content"
				:markdown="true"
				:showLineNumber="true"
				:showLanguageName="true"
				:copyByLongPress="true"
			/>
		</view>
		<view class="fixed-bottom bg-white pa-24 ">
			<view class="btn-wrap flex flex-center">
				<block v-if="queryParams.postsId">
					<tm-button :width="200" :height="75" block theme="light-blue" @click="fnSaveAtPublish()">我要发布</tm-button>
					<tm-button class="ml-24" :width="200" :height="75" block theme="blue-grey" @click="fnRefreshData()">重新加载</tm-button>
					<tm-button class="ml-24" :width="200" :height="75" block theme="red" @click="fnClear()">清空内容</tm-button>
				</block>
				<block v-else>
					<tm-button :width="300" :height="75" block theme="light-blue" @click="fnSaveAtPublish()">我要发布</tm-button>
					<tm-button class="ml-24" theme="red" :width="300" :height="75" block @click="fnClear()">清空内容</tm-button>
				</block>
			</view>
		</view>

		<!-- 附件选择文件 -->
		<attachment-select
			v-if="attachmentsSelect.show"
			:title="attachmentsSelect.title"
			@on-select="fnOnAttachmentsSelect"
			@on-close="attachmentsSelect.show = false"
		></attachment-select>

		<!--  弹窗 -->
		<block v-if="modal">
			<view class="mask" />
			<view class="modal">
				<view class="modal_title">{{ modal.title }}</view>
				<view class="flex flex-col flex-center" v-if="modal.type == 'table'">
					<tm-input required title="输入行数" input-type="number" v-model="modal.rows"></tm-input>
					<tm-input required title="输入列数" input-type="number" v-model="modal.cols"></tm-input>
				</view>
				<block v-else><input class="modal_input" :value="modal.value" maxlength="-1" auto-focus @input="modalInput" /></block>

				<view class="modal_foot">
					<view class="modal_button" @tap="modalCancel">取消</view>
					<view class="modal_button" style="color:#576b95;border-left:1px solid rgba(0,0,0,.1)" @tap="modalConfirm">确定</view>
				</view>
			</view>
		</block>

		<!-- 底部弹窗 -->
		<tm-poup v-model="dialog.show" position="bottom" height="auto" @change="fnOnCloseDialog()">
			<text class="poup-close" @click="fnOnCloseDialog(false)">×</text>
			<view class="poup-head pa-24 pb-0 text-align-center text-weight-b ">{{ dialog.title }}</view>
			<view class="poup-body pa-36">
				<!-- 表情区域 -->
				<block v-if="dialog.type == 'emoji'">
					<view class="flex" v-for="(item, index) in emojis" :key="index">
						<view class="flex-1 mt-6 mb-6 text-size-xl" v-for="(emoji, index) in item" :key="emoji" :data-emoji="emoji" @click="fnOnInsertEmoji">{{ emoji }}</view>
					</view>
				</block>
				<!-- 模板区域 -->
				<block v-else-if="dialog.type == 'template'">
					<block v-for="(template, index) in templates" :key="index">
						<rich-text :nodes="template" data-method="insertHtml" :data-param="template" @click="fnOnToolBarEdit"></rich-text>
					</block>
				</block>
			</view>
		</tm-poup>

		<!-- 发布设置弹窗 -->
	</view>
</template>

<script>
import { getAdminAccessToken } from '@/utils/auth.js';

import MarkdownConfig from '@/common/markdown/markdown.config.js';
import mpHtml from '@/components/mp-html/components/mp-html/mp-html.vue';

import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';
import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
import tmFlotbutton from '@/tm-vuetify/components/tm-flotbutton/tm-flotbutton.vue';
import tmSwitch from '@/tm-vuetify/components/tm-switch/tm-switch.vue';
import tmPoup from '@/tm-vuetify/components/tm-poup/tm-poup.vue';
import tmInput from '@/tm-vuetify/components/tm-input/tm-input.vue';
import attachmentSelect from '@/components/attachment-select/attachment-select.vue';

export default {
	components: {
		mpHtml,
		tmSkeleton,
		tmButton,
		tmEmpty,
		tmTranslate,
		tmFlotbutton,
		tmSwitch,
		tmPoup,
		tmInput,
		attachmentSelect
	},
	data() {
		return {
			loading: 'loading',
			markdownConfig: MarkdownConfig,
			queryParams: {
				postsId: undefined
			},
			status: true,
			form: {
				content: '',
				keepRaw: true,
				originalContent: '',
				formatContent: '',
				type: 'PUBLIC'
			},
			modal: null,
			editable: true,
			attachmentsSelect: {
				title: '选择附件',
				show: false
			},
			dialog: {
				show: false,
				type: ''
			},

			// 用于插入的 emoji 表情
			emojis: [
				['😄', '😷', '😂', '😝', '😳', '😱', '😔', '😒', '😉'],
				['😎', '😭', '😍', '😘', '🤔', '😕', '🙃', '🤑', '😲'],
				['🙄', '😤', '😴', '🤓', '😡', '😑', '😮', '🤒', '🤮']
			],
			// 用于插入的 html 模板
			templates: [
				'<section style="text-align: center; margin: 0px auto;"><section style="border-radius: 4px; border: 1px solid #757576; display: inline-block; padding: 5px 20px;"><span style="font-size: 18px; color: #595959;">标题</span></section></section>',
				'<div style="width: 100%; box-sizing: border-box; border-radius: 5px; background-color: #f6f6f6; padding: 10px; margin: 10px 0"><div>卡片</div><div style="font-size: 12px; color: gray">正文</div></div>',
				'<div style="border: 1px solid gray; box-shadow: 3px 3px 0px #cfcfce; padding: 10px; margin: 10px 0">段落</div>'
			]
		};
	},
	onLoad() {
		const postsId = this.$Route.query.postsId;
		if (postsId == undefined) {
			this.fnSetPageTitle('新增文章');
			this.form.content = uni.getStorageSync('posts-content');
		} else {
			this.fnSetPageTitle('编辑文章');
			this.queryParams.postsId = postsId;
			this.fnGetData();
		}
	},
	onReady() {
		/**
		 * @description 设置获取链接的方法
		 * @param {String} type 链接的类型（img/video/audio/link）
		 * @param {String} value 修改链接时，这里会传入旧值
		 * @returns {Promise} 返回线上地址
		 *   type 为音视频时可以返回一个数组作为源地址
		 *   type 为 audio 时，可以返回一个 object，包含 src、name、author、poster 等字段
		 */
		this.$refs.markdown.getSrc = (type, value) => {
			return new Promise((resolve, reject) => {
				this.checkEditable()
					.then(res => {
						if (type === 'img' || type === 'video') {
							uni.showActionSheet({
								itemList: ['本地选取', '附件选取'],
								success: res => {
									if (res.tapIndex === 0) {
										// 本地选取
										if (type === 'img') {
											uni.chooseImage({
												count: value === undefined ? 9 : 1,
												success: res => {
													// #ifdef MP-WEIXIN
													if (res.tempFilePaths.length == 1 && wx.editImage) {
														// 单张图片时进行编辑
														wx.editImage({
															src: res.tempFilePaths[0],
															complete: res2 => {
																uni.showLoading({
																	title: '上传中'
																});
																this.fnFileUpload(res2.tempFilePath || res.tempFilePaths[0], type).then(res => {
																	uni.hideLoading();
																	resolve(res);
																});
															}
														});
													} else {
														// #endif
														uni.showLoading({
															title: '上传中'
														});
														(async () => {
															const arr = [];
															for (let item of res.tempFilePaths) {
																// 依次上传
																const src = await this.fnFileUpload(item, type);
																arr.push(src);
															}
															return arr;
														})().then(res => {
															uni.hideLoading();
															resolve(res);
														});
														// #ifdef MP-WEIXIN
													}
													// #endif
												},
												fail: reject
											});
										} else {
											uni.chooseVideo({
												success: res => {
													uni.showLoading({
														title: '上传中'
													});
													this.fnFileUpload(res.tempFilePath, type).then(res => {
														uni.hideLoading();
														resolve(res);
													});
												},
												fail: reject
											});
										}
									} else {
										// 远程链接
										this.callback = {
											resolve,
											reject
										};

										this.attachmentsSelect.title = type === 'img' ? '选取图片' : '选取视频';
										this.attachmentsSelect.show = true;
									}
								}
							});
						} else {
							this.callback = {
								resolve,
								reject
							};
							let title;
							if (type === 'audio') {
								title = '音频链接';
							} else if (type === 'link') {
								title = '链接地址';
							}
							this.$set(this, 'modal', {
								title,
								type: 'link',
								value
							});
						}
					})
					.catch(err => {});
			});
		};
	},

	methods: {
		// 加载文章数据
		fnGetData(refresh = false) {
			this.loading = 'loading';
			uni.showLoading({
				mask: true,
				title: '加载中...'
			});
			this.$httpApi.admin
				.getPostsById(this.queryParams.postsId)
				.then(res => {
					if (res.status == 200) {
						this.fnSetPageTitle(`正在编辑 ${res.data.title}`);
						this.$set(this, 'form', res.data);
						if (refresh) {
							this.$nextTick(() => {
								this.$refs.markdown.setContent(res.data.content);
							});
						}
						this.loading = 'success';
						uni.hideLoading();
					} else {
						this.loading = 'error';
						this.fnSetPageTitle(`文章加载失败`);
						uni.$tm.toast('文章加载失败，请点击下方重新加载!');
					}
				})
				.catch(err => {
					console.error(err);
					this.loading = 'error';
					this.fnSetPageTitle(`文章加载失败`);
					uni.$tm.toast('文章加载失败，请点击下方重新加载!');
				});
		},
		fnRefreshData(showConfirm = true) {
			if (showConfirm) {
				uni.$eShowModal({
					title: '提示',
					content: '您当前的编辑可能未保存，确定要重新加载吗？',
					showCancel: true,
					cancelText: '否',
					cancelColor: '#999999',
					confirmText: '是',
					confirmColor: '#03a9f4'
				})
					.then(res => {
						this.fnGetData(true);
					})
					.catch(err => {});
			} else {
				this.fnGetData(true);
			}
		},
		// 检查是否可编辑
		checkEditable() {
			return new Promise((resolve, reject) => {
				if (this.editable) {
					resolve();
				} else {
					uni.showModal({
						title: '提示',
						content: '需要继续编辑吗？',
						success: res => {
							if (res.confirm) {
								this.editable = true;
								resolve();
							} else {
								reject();
							}
						}
					});
				}
			});
		},
		// 调用编辑操作
		fnOnToolBarEdit(e) {
			this.$refs.markdown[e.currentTarget.dataset.method](e.currentTarget.dataset.param);
		},
		// 监听附件选择
		fnOnAttachmentsSelect(file) {
			this.attachmentsSelect.show = false;
			this.callback.resolve(file.path);
		},
		// 处理模态框
		modalInput(e) {
			this.value = e.detail.value;
		},
		modalConfirm() {
			if (this.modal.type == 'table') {
				if (this.modal.rows <= 0) {
					return uni.$tm.toast('行数必须大于0');
				}
				if (this.modal.cols <= 0) {
					return uni.$tm.toast('列数必须大于0');
				}
			}
			this.callback.resolve(this.value || this.modal.value || '');
			this.$set(this, 'modal', null);
		},
		modalCancel() {
			this.callback.reject();
			this.$set(this, 'modal', null);
		},
		// 上传图片方法
		fnFileUpload(src, type) {
			return new Promise((resolve, reject) => {
				uni.uploadFile({
					filePath: src,
					header: {
						'admin-authorization': getAdminAccessToken()
					},
					url: this.$baseApiUrl + '/api/admin/attachments/upload',
					name: 'file',
					success: upladRes => {
						const _uploadRes = JSON.parse(upladRes.data);
						if (_uploadRes.status == 200) {
							resolve(_uploadRes.data.path);
						} else {
							uni.$tm.toast(_uploadRes.message);
							reject();
						}
					},
					fail: err => {
						uni.$tm.toast(err.message);
						reject();
					}
				});
			});
		},

		// 插入 head 系列标签
		fnOnInsertHead() {
			this.checkEditable()
				.then(() => {
					const _hList = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
					wx.showActionSheet({
						itemList: _hList,
						success: res => {
							let tagName = _hList[res.tapIndex];
							this.$refs.markdown.insertHtml(`<${tagName}>标题</${tagName}>`);
						}
					});
				})
				.catch(() => {});
		},
		// 插入表格
		fnOnInsertTable() {
			this.checkEditable()
				.then(() => {
					this.$set(this, 'modal', {
						title: '插入表格',
						type: 'table',
						rows: 1,
						cols: 1,
						value: this.value
					});
					this.callback = {
						resolve: () => {
							this.$refs.markdown.insertTable(this.modal.rows, this.modal.cols);
						},
						reject: () => {}
					};
				})
				.catch(() => {});
		},

		// 保存插入表格
		fnOnSaveInsertTable() {
			this.callback.resolve(this.value || this.modal.value || '');
		},
		// 插入代码
		fnOnInsertCode() {
			this.checkEditable()
				.then(() => {
					uni.showActionSheet({
						itemList: ['html', 'css', 'javascript', 'json'],
						success: res => {
							const lan = ['html', 'css', 'javascript', 'json'][res.tapIndex];
							this.$refs.markdown.insertHtml(`<pre><code class="language-${lan}">${lan} code</code></pre>`);
						}
					});
				})
				.catch(() => {});
		},
		// 插入 emoji
		fnOnInsertEmoji(e) {
			this.$refs.markdown.insertHtml(e.currentTarget.dataset.emoji);
			this.fnOnCloseDialog();
		},

		// 处理底部弹窗
		fnOnOpenDialog(e) {
			this.checkEditable()
				.then(() => {
					this.dialog.type = e.currentTarget.dataset.type;
					this.dialog.title = e.currentTarget.dataset.title;
					this.dialog.show = true;
				})
				.catch(() => {});
		},
		fnOnCloseDialog(e) {
			if (e == false) {
				this.dialog.show = false;
				this.dialog.type = '';
			}
		},
		fnOnPreview() {
			this.editable = !this.editable;
			if (this.editable) {
				uni.$tm.toast('您已进入编辑模式！');
			} else {
				uni.$tm.toast('您已进入预览模式！');
				let _content = this.$refs.markdown.getContent();
				if (_content === '<p></p>') {
					_content = '';
				}
				this.form.content = _content;
				uni.setStorageSync('posts-content', _content);
			}
		},

		// 发布
		fnSaveAtPublish() {
			uni.showLoading({
				mask: true,
				title: '保存中...'
			});
			const _content = this.$refs.markdown.getContent();
			if (!_content.trim()) {
				return uni.$tm.toast('请输入内容!');
			}
			this.form.content = _content;
			this.form.formatContent = _content;
			this.form.originalContent = this.$refs.markdown.getText();
			uni.setStorageSync('posts-content', _content);
			uni.setStorageSync('posts-content-source', this.form.originalContent);
			if (this.form.id) {
				this.$Router.push({
					path: '/pagesB/articles/article-setting',
					query: { postsId: this.form.id, postTitle: this.form.title, isEdit: 1, from: 'edit' }
				});
			} else {
				this.$Router.push({ path: '/pagesB/articles/article-setting', query: { postsId: '', postTitle: '', isEdit: 0, from: 'edit' } });
			}

			return;
			if (this.form) {
				this.$httpApi.admin
					.updatePostsById(this.form.id, this.form)
					.then(res => {
						if (res.status == 200) {
							uni.$tm.toast('保存成功!');
							uni.setStorageSync('posts-content', '');

							setTimeout(() => {
								uni.$emit('refresh-article-list');
							}, 500);
						} else {
							uni.$tm.toast('保存失败，请重试!');
						}
					})
					.catch(err => {
						uni.$tm.toast('保存失败，请重试!');
					});
			} else {
				this.$httpApi.admin
					.createPosts(this.form)
					.then(res => {
						if (res.status == 200) {
							uni.$tm.toast('保存成功!');
							uni.setStorageSync('posts-content', '');
							setTimeout(() => {
								uni.$emit('refresh-article-list');
							}, 500);
						} else {
							uni.$tm.toast('保存失败，请重试!');
						}
					})
					.catch(err => {
						uni.$tm.toast('保存失败，请重试!');
					});
			}
		},

		fnClear() {
			uni.$eShowModal({
				title: '提示',
				content: '确定清空当前内容吗？',
				showCancel: true,
				cancelText: '否',
				cancelColor: '#999999',
				confirmText: '是',
				confirmColor: '#03a9f4'
			})
				.then(res => {
					this.$refs.markdown.clear();
					uni.setStorageSync('posts-content', '');
					uni.setStorageSync('posts-content-source', '');
					this.fnToTopPage();
				})
				.catch(() => {});
		}
	}
};
</script>

<style lang="scss" scoped>
.app-page {
	width: 100vw;
	min-height: 100vh;
	box-sizing: border-box;
	padding-bottom: 236rpx;
}

.fixed-bottom {
	position: fixed;
	left: 0;
	bottom: 0;
	right: 0;
	box-sizing: border-box;
	box-shadow: 0rpx -4rpx 24rpx rgba(0, 0, 0, 0.05);
	border-radius: 24rpx 24rpx 0 0;
}

.edit-wrap {
	box-sizing: border-box;
	padding-top: 150rpx;
}

.modal {
	width: 80vw;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: #fff;
	border-radius: 24rpx;
}

.modal_title {
	padding-top: 42rpx;
	padding-bottom: 32rpx;
	font-size: 34rpx;
	font-weight: 700;
	text-align: center;
}

.modal_input {
	display: block;
	padding: 12rpx 12rpx;
	margin: 24rpx;
	margin-top: 0;
	font-size: 30rpx;
	border: 2rpx solid #dfe2e5;
	border-radius: 6rpx;
}

.modal_foot {
	display: flex;
	line-height: 100rpx;
	font-weight: bold;
	border-top: 2rpx solid rgba(0, 0, 0, 0.1);
}

.modal_button {
	flex: 1;
	text-align: center;
}

/* 蒙版 */
.mask {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: black;
	opacity: 0.5;
}
.poup-close {
	position: absolute;
	right: 30rpx;
	top: 8rpx;
	font-size: 50rpx;
}
</style>
