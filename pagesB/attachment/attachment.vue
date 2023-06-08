<template>
	<view class="app-page flex flex-col">
		<!-- 搜索区域 -->
		<view class="filter-wrap bg-white shadow-3">
			<tm-search v-model="queryParams.keyword" :round="24" :shadow="0" color="light-blue" insert-color="light-blue" :clear="true" @confirm="fnOnSearch"></tm-search>
			<tm-dropDownMenu :shadow="0" color="light-blue" @confirm="fnOnConfirm" :list="filterList"></tm-dropDownMenu>
		</view>

		<!-- 占位区域 -->
		<view style="width: 100vw;height: 184rpx;"></view>

		<view v-if="loading != 'success'" class="loading-wrap">
			<tm-skeleton model="listAvatr"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
			<tm-skeleton model="listAvatr"></tm-skeleton>
		</view>

		<view class="page-content pa-24 flex flex-col" v-else>
			<view v-if="dataList.length == 0" class="content-empty flex flex-center">
				<!-- 空布局 -->
				<tm-empty icon="icon-shiliangzhinengduixiang-" label="暂无任何附件"></tm-empty>
			</view>

			<block v-else>
				<!-- 内容区域 -->
				<block v-for="(item, index) in dataList" :key="index">
					<tm-translate animation-name="fadeUp" :wait="calcAniWait(index)">
						<view class="attachment-card mb-24 flex bg-white pa-24 round-3" @click="fnShowDetail(item)">
							<view class="cover round-3 flex flex-center" :class="[fnGetIconClass(item.mediaType)]">
								<text class="icon iconfont">{{ item.suffix }}</text>
							</view>
							<!-- 内容区域 -->
							<view class="info pl-36">
								<view class="file-name text-size-m text-weight-b">{{ item.name }}</view>
								<view class="file-media mt-12 text-size-s text-grey-darken-1">附件类型：{{ item.mediaType }}</view>
								<view class="file-media mt-8 text-size-s text-grey-darken-1">附件大小：{{ item.sizeText }}</view>
								<view class="file-path mt-8 text-size-s text-grey-darken-1">上传日期：{{ { d: item.createTime, f: 'yyyy年MM月dd日 星期w' } | formatTime }}</view>
							</view>
						</view>
					</tm-translate>
				</block>

				<tm-flotbutton @click="fnToTopPage" :offset="[16, 80]" color="bg-gradient-light-blue-accent" size="m" icon="icon-angle-up"></tm-flotbutton>
				<view class="load-text ">{{ loadMoreText }}</view>
			</block>

			<!-- 弹窗详情 -->
			<tm-poup v-model="detail.show" position="bottom" height="80vh">
				<view class="poup-content">
					<view class="poup-head text-align-center text-weight-b text-size-g ma-24 ">附件详情</view>
					<scroll-view class="poup-body pa-24 pt-0" :scroll-y="true" @touchmove.stop>
						<view class="preview-file pl-24 pr-24">
							<!-- 图片预览 -->
							<tm-images v-if="$utils.fnCheckIsFileType('image', detail.form)" :width="700" :height="350" :round="3" :src="$utils.checkThumbnailUrl(detail.form.path)" model="aspectFill"></tm-images>
							<!-- 视频 -->
							<video v-else-if="$utils.fnCheckIsFileType('video', detail.form)" class="round-3" style="width: 100%;height: 350rpx;" :src="$utils.checkUrl(detail.form.path)" controls></video>
							<view v-else class="flex flex-center border-a-1 round-3 text-align-center text-grey-darken-1" style="height: 280rpx;background-color: #f2f2f2;">
								该文件暂不支持预览
							</view>
						</view>

						<tm-input title="附件名称" v-model="detail.form.name" :clear="true" placeholder="请输入附件名称..."></tm-input>
						<tm-input :disabled="true" color="grey" title="附件类型" v-model="detail.form.mediaType"></tm-input>
						<tm-input :disabled="true" color="grey" title="附件位置" v-model="detail.form.type"></tm-input>
						<tm-input :disabled="true" color="grey" title="附件大小" v-model="detail.form.sizeText"></tm-input>
						<tm-input :disabled="true" color="grey" title="上传日期" v-model="detail.form.createTime"></tm-input>
						<tm-input :disabled="true" :vertical="true" :borderBottom="false" input-type="textarea" title="文件地址" color="grey" bg-color="grey-lighten-5" :height="120" v-model="detail.form.path">
							<template v-slot:default="{ title }">
								{{ title }}
								<tm-button text theme="light-blue" size="xs" @click="$utils.copyText(detail.form.path, '复制成功！')">复制</tm-button>
							</template>
						</tm-input>
					</scroll-view>
					<view class="btn-wrap flex flex-center">
						<tm-button size="m" navtie-type="form" theme="bg-gradient-blue-accent" @click="fnOnUpdate()">保存</tm-button>
						<tm-button size="m" theme="bg-gradient-red-accent" @click="fnOnDelete()">删除</tm-button>
						<tm-button size="m" theme="bg-gradient-blue-grey-accent" @click="detail.show = false">关闭</tm-button>
					</view>
				</view>
			</tm-poup>
		</view>

		<tm-flotbutton :show-text="true" color="bg-gradient-orange-accent" @click="fnOnFlotButton"></tm-flotbutton>

		<tm-actionSheetMenu title="文件上传操作" @change="fnOnFileSelectActionChange" v-model="fileSelectAction.show" :actions="fileSelectAction.list"></tm-actionSheetMenu>
	</view>
</template>

<script>
	// #ifdef APP-PLUS
	const AfDocument = uni.requireNativePlugin('Aq-ChooseFile'); // 临时替代
	// #endif
	import { getAdminAccessToken } from '@/utils/auth.js';

	import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
	import tmSearch from '@/tm-vuetify/components/tm-search/tm-search.vue';
	import tmDropDownMenu from '@/tm-vuetify/components/tm-dropDownMenu/tm-dropDownMenu.vue';
	import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';
	import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
	import tmCheckbox from '@/tm-vuetify/components/tm-checkbox/tm-checkbox.vue';
	import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
	import tmPoup from '@/tm-vuetify/components/tm-poup/tm-poup.vue';
	import tmForm from '@/tm-vuetify/components/tm-form/tm-form.vue';
	import tmUpload from '@/tm-vuetify/components/tm-upload/tm-upload.vue';
	import tmInput from '@/tm-vuetify/components/tm-input/tm-input.vue';
	import tmImages from '@/tm-vuetify/components/tm-images/tm-images.vue';
	import tmFlotbutton from '@/tm-vuetify/components/tm-flotbutton/tm-flotbutton.vue';
	import tmActionSheetMenu from '@/tm-vuetify/components/tm-actionSheetMenu/tm-actionSheetMenu.vue';

	export default {
		components: {
			tmSkeleton,
			tmSearch,
			tmDropDownMenu,
			tmEmpty,
			tmButton,
			tmCheckbox,
			tmPoup,
			tmForm,
			tmUpload,
			tmInput,
			tmImages,
			tmFlotbutton,
			tmTranslate,
			tmActionSheetMenu
		},
		data() {
			return {
				loading: 'loading',
				filterLoading: 'loading',
				btnOption: {
					actions: [{
							icon: 'icon-like',
							color: 'bg-gradient-orange-accent'
						},
						{
							icon: 'icon-commentdots-fill',
							color: 'bg-gradient-green-accent'
						},
						{
							icon: 'icon-share1',
							color: 'bg-gradient-blue-accent'
						}
					]
				},
				filterList: [{
						title: '存储位置',
						children: [{
							title: '',
							name: 'attachmentType',
							model: 'radio',
							children: []
						}]
					},
					{
						title: '文件类型',
						children: [{
							title: '',
							name: 'mediaType',
							model: 'radio',
							children: []
						}]
					}
				],
				queryParams: {
					size: 8,
					page: 0,
					attachmentType: undefined,
					keyword: undefined,
					mediaType: undefined,
					sort: undefined
				},
				result: {},
				dataList: [],
				total: 0,
				detail: {
					params: {},
					form: {},
					show: false
				},
				isLoadMore: false,
				loadMoreText: '加载中...',

				fileSelectAction: {
					show: false,
					list: []
				}
			};
		},

		onLoad() {
			this.fnSetPageTitle('附件管理');
		},
		created() {
			this.fnGetData();
			this.fnGetFilters();
		},
		onPullDownRefresh() {
			this.queryParams.page = 0;
			this.dataList = [];
			this.fnGetData();
			if (this.filterLoading != 'success') {
				this.fnGetFilters();
			}
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
			/**
			 * 文件大小 字节转换单位
			 * @param size
			 * @returns {string|*}
			 */
			fnTransFileSize(size) {
				if (!size) return '';
				if (size < this.fnPow1024(1)) return size + ' B';
				if (size < this.fnPow1024(2)) return (size / this.fnPow1024(1)).toFixed(2) + ' KB';
				if (size < this.fnPow1024(3)) return (size / this.fnPow1024(2)).toFixed(2) + ' MB';
				if (size < this.fnPow1024(4)) return (size / this.fnPow1024(3)).toFixed(2) + ' GB';
				return (size / this.fnPow1024(4)).toFixed(2) + ' TB';
			},

			// 求次幂
			fnPow1024(num) {
				return Math.pow(1024, num);
			},

			fnGetIconClass(mediaType) {
				let _class = '';
				if (mediaType.indexOf('video/') != -1) {
					_class = 'is-video';
				} else if (mediaType.indexOf('image/') != -1) {
					_class = 'is-image';
				}
				return _class;
			},
			fnCheckIsFileType(type, attachment) {
				if (type == 'video') return attachment.mediaType.indexOf('video/') != -1;
				else if (type == 'image') return attachment.mediaType.indexOf('image/') != -1;
				else return false;
			},
			fnGetFilters() {
				this.filterLoading = 'loading';
				Promise.all([this.$httpApi.admin.getAttachmentsTypes(), this.$httpApi.admin.getAttachmentsMediaTypes()])
					.then(res => {
						const res1 = res[0];
						this.filterList[0].children[0].children = res1.data.map(item => {
							return {
								title: item,
								id: item
							};
						});
						const res2 = res[1];
						this.filterList[1].children[0].children = res2.data.map(item => {
							return {
								title: item,
								id: item
							};
						});
						this.filterLoading = 'success';
					})
					.catch(err => {
						this.filterLoading = 'error';
						uni.$tm.toast('搜索条件数据加载失败！');
					});
			},

			// 搜索区域确定
			fnOnConfirm(e) {
				this.fnResetSetAniWaitIndex();
				this.queryParams.attachmentType = e[0].children.map(x => x.id).join('') || undefined;
				this.queryParams.mediaType = e[1].children.map(x => x.id).join('') || undefined;
				this.fnOnSearch();
			},
			fnOnSearch() {
				this.fnResetSetAniWaitIndex();
				this.queryParams.page = 0;
				this.dataList = [];
				this.fnGetData();
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
				this.loadMoreText = '加载中...';
				this.$httpApi.admin
					.getAttachmentsByPage(this.queryParams)
					.then(res => {
						if (res.status == 200) {
							this.loadMoreText = res.data.hasNext ? '上拉加载更多' : '呜呜，没有更多数据啦~';
							this.result = res.data;
							this.total = res.data.total;
							if (this.isLoadMore) {
								let _list = this.dataList.concat(res.data.content);
								this.dataList = _list.map(item => {
									item['sizeText'] = this.fnTransFileSize(item.size);
									return item;
								});
							} else {
								this.dataList = res.data.content.map(item => {
									item['sizeText'] = this.fnTransFileSize(item.size);
									return item;
								});
							}
							this.loading = 'success';
						} else {
							uni.$tm.toast('加载失败，请重试！');
							thi.loading = 'error';
						}
					})
					.catch(err => {
						console.error(err);
						uni.$tm.toast('加载失败，请重试！');
						this.loading = 'error';
						this.loadMoreText = '加载失败，请下拉刷新！';
					})
					.finally(() => {
						setTimeout(() => {
							uni.hideLoading();
							uni.stopPullDownRefresh();
						}, 300);
					});
			},

			// 详情
			fnShowDetail(item) {
				this.detail.params = { ...item };
				this.detail.form = { ...item };
				this.detail.show = true;
			},
			// 删除
			fnOnDelete() {
				uni.$eShowModal({
						title: '提示',
						content: `您确定要删除该附件吗？`,
						showCancel: true,
						cancelText: '否',
						cancelColor: '#999999',
						confirmText: '是',
						confirmColor: '#03a9f4'
					})
					.then(res => {
						uni.showLoading({
							mask: true,
							title: '正在删除...'
						});
						this.$httpApi.admin
							.deleteAttachmentById(this.detail.params.id)
							.then(res => {
								if (res.status == 200) {
									uni.$tm.toast('删除成功！');
									setTimeout(() => {
										this.detail.show = false;
										this.detail.params = {};
										this.detail.form = {};
										this.fnGetData();
									}, 1000);
								} else {
									uni.$tm.toast('删除失败，请重试！');
								}
							})
							.catch(err => {
								console.error(err);
								uni.$tm.toast('删除失败，请重试！');
							});
					})
					.catch(err => {});
			},
			fnOnUpdate() {
				if (this.detail.form.name == '') {
					return uni.$tm.toast('附件名称不能为空！');
				}
				uni.showLoading({
					mask: true,
					title: '正在保存...'
				});
				this.$httpApi.admin
					.updateAttachmentById(this.detail.params.id, this.detail.form.name)
					.then(res => {
						if (res.status == 200) {
							uni.$tm.toast('保存成功！');

							// setTimeout(() => {
							// 	this.detail.show = false;
							// 	this.detail.params = {};
							// 	this.detail.form = {};
							// 	this.fnGetData();
							// }, 1000);
						} else {
							uni.$tm.toast('保存失败，请重试！');
						}
					})
					.catch(err => {
						uni.$tm.toast('保存失败，请重试！');
					});
			},
			// 浮动按钮点击
			fnOnFlotButton() {
				// 微信小程序：提供从消息列表和媒体选择
				// #ifdef MP-WEIXIN
				this.fileSelectAction.list = ['上传照片', '上传视频', '上传文件'];
				// #endif

				// 安卓app：使用第三方上传
				// #ifdef APP-PLUS
				this.fileSelectAction.list = ['上传照片', '上传视频', '上传文件'];
				// #endif

				// h5
				// #ifdef H5
				this.fileSelectAction.list = ['上传照片', '上传视频', '上传文件'];
				// #endif

				// #ifndef H5||MP-WEIXIN||APP-PLUS
				this.fileSelectAction.list = ['上传照片', '上传视频'];
				// #endif

				this.fileSelectAction.show = true;
			},
			fnOnFileSelectActionChange(e) {
				// 微信小程序：提供从消息列表和媒体选择
				// #ifdef MP-WEIXIN
				switch (e.index) {
					case 0:
						// 上传照片
						uni.chooseImage({
							count: 1,
							success: res => {
								console.log(res);
								this.fnOnUploadFileByPath(res.tempFilePaths[0]);
							}
						});
						break;
					case 1:
						// 上传视频
						uni.chooseVideo({
							count: 1,
							success: res => {
								console.log(res);
								this.fnOnUploadFileByPath(res.tempFilePath);
							}
						});
						break;
					case 2:
						// 会话选择
						uni.chooseMessageFile({
							count: 1,
							success: res => {
								this.fnOnUploadFileByPath(res.tempFiles[0].path);
							}
						});
						break;
				}

				// #endif

				// 安卓app
				// #ifdef APP-PLUS
				switch (e.index) {
					case 0:
						// 上传照片
						uni.chooseImage({
							count: 1,
							success: res => {
								console.log(res);
								this.fnOnUploadFileByPath(res.tempFilePaths[0]);
							}
						});
						break;
					case 1:
						// 上传视频
						uni.chooseVideo({
							count: 1,
							success: res => {
								console.log(res);
								this.fnOnUploadFileByPath(res.tempFilePath);
							}
						});
						break;
					case 2:
						// 上传文件：
						// todo:使用第三方控件
						AfDocument.openMode({
								size: 1,
								isDown: true,
								types: [{
										name: '文档',
										value: ['doc', 'wps', 'docx', 'xls', 'xlsx', 'pdf']
									},
									{
										name: '视频',
										value: ['mp4']
									},
									{
										name: '音乐',
										value: ['mp3', 'flac']
									},
									{
										name: '图片',
										value: ['jpg', 'png']
									}
								]
							},
							res => {
								// this.data = JSON.stringify(res);
								this.fnOnUploadFileByFile(res[0].path);
							}
						);
						break;
				}
				// #endif

				// h5
				// #ifdef H5
				switch (e.index) {
					case 0:
						// 上传照片
						uni.chooseImage({
							count: 1,
							success: res => {
								console.log(res);
								this.fnOnUploadFileByPath(res.tempFilePaths[0]);
							}
						});
						break;
					case 1:
						// 上传视频
						uni.chooseVideo({
							count: 1,
							success: res => {
								console.log(res);
								this.fnOnUploadFileByPath(res.tempFilePath);
							}
						});
						break;
					case 2:
						// 上传文件
						uni.chooseFile({
							count: 1,
							success: res => {
								console.log(res);
								this.fnOnUploadFileByPath(res.tempFilePaths[0]);
							}
						});
						break;
				}
				// #endif

				// #ifndef H5||MP-WEIXIN||APP-PLUS
				switch (e.index) {
					case 0:
						// 上传照片
						uni.chooseImage({
							count: 1,
							success: res => {
								this.fnOnUploadFileByFile(res.tempFiles[0]);
							}
						});
						break;
					case 1:
						// 上传视频
						uni.chooseVideo({
							count: 1,
							success: res => {
								this.fnOnUploadFileByFile(res.tempFile);
							}
						});
						break;
				}
				// #endif
			},

			// 使用文件路径上传文件
			fnOnUploadFileByPath(path) {
				uni.showLoading({
					title: '文件上传中...',
					mask: true
				});
				uni.uploadFile({
					filePath: path,
					header: {
						'admin-authorization': getAdminAccessToken()
					},
					url: this.$baseApiUrl + '/api/admin/attachments/upload',
					name: 'file',
					success: upladRes => {
						const _uploadRes = JSON.parse(upladRes.data);
						if (_uploadRes.status == 200) {
							uni.$tm.toast('文件上传成功！');
							setTimeout(() => {
								this.fnGetData();
							}, 1000);
						} else {
							uni.$tm.toast(_uploadRes.message);
						}
					},
					fail: err => {
						uni.$tm.toast(err.message);
					}
				});
			},
			// 使用文件对象上传文件
			fnOnUploadFileByFile(file) {
				uni.showLoading({
					title: '文件上传中...',
					mask: true
				});

				uni.uploadFile({
					// #ifdef H5
					file: file,
					// #endif
					// #ifndef H5
					files: [file],
					// #endif
					header: {
						'admin-authorization': getAdminAccessToken()
					},
					url: this.$baseApiUrl + '/api/admin/attachments/upload',
					name: 'file',
					success: upladRes => {
						const _uploadRes = JSON.parse(upladRes.data);
						if (_uploadRes.status == 200) {
							uni.$tm.toast('文件上传成功！');
							setTimeout(() => {
								this.fnGetData();
							}, 1000);
						} else {
							uni.$tm.toast(_uploadRes.message);
						}
					},
					fail: err => {
						uni.$tm.toast(err.message);
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
	}

	.loading-wrap {
		padding: 24rpx;
	}

	.filter-wrap {
		position: fixed;
		left: 0;
		right: 0;
		/* #ifdef H5 */
		top: 88rpx;
		/* #endif */
		/* #ifndef H5 */
		top: 0;
		/* #endif */
		width: 100vw;
		z-index: 6;
	}

	.page-content {}

	.content-empty {
		width: 100vw;
		height: 65vh;
	}

	.attachment-card {
		box-shadow: 0rpx 2rpx 24rpx rgba(0, 0, 0, 0.05);

		.cover {
			width: 170rpx;
			height: 160rpx;
			background-color: rgb(104, 136, 151);

			// box-shadow: 0 6rpx 10rpx rgba(51, 154, 204, 0.2);
			&.is-video {
				background-color: rgb(3, 174, 252);
			}

			&.is-image {
				background-color: #1cbcb4;
			}

			.icon {
				font-size: 40rpx;
				color: #fff;
			}

			.thumbnai {
				width: 100%;
				height: 100%;
				box-sizing: border-box;
				box-shadow: 0rpx 4rpx 24rpx rgba(0, 0, 0, 0.03);
				border: 6rpx solid #fff;
			}
		}

		.info {
			width: 0;
			flex-grow: 1;

			.time-icon {
				font-size: 24rpx;
			}
		}
	}

	.poup-body {
		box-sizing: border-box;
		height: 66vh;
	}

	.poup-content {
		width: 100%;
		overflow: hidden;
	}

	.btn-wrap {
		width: 100%;
	}

	.file-name {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		word-wrap: break-word;
		word-break: break-all;
	}
</style>