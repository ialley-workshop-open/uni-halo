<template>
	<view class="app-page">
		<view v-if="loading !== 'success'" class="loading-wrap">
			<tm-skeleton model="card"></tm-skeleton>
			<tm-skeleton model="card"></tm-skeleton>
			<tm-skeleton model="card"></tm-skeleton>
		</view>
		<block v-else>
			<!-- 顶部信息 -->
			<view class="head ma-24">
				<view class="title">{{ result.spec.title }}</view>
				<view class="detail">
					<view class="author">
						<text class="author-name">作者：{{ result.owner.displayName }}</text>
						<text class="author-time">
							时间：{{ {d: result.spec.publishTime, f: 'yyyy年MM月dd日 星期w'} | formatTime }}
						</text>
					</view>

					<view class="cover" v-if="result.spec.cover">
						<image class="cover-img" mode="aspectFill" :src="calcUrl(result.spec.cover)"></image>
					</view>
					<view class="count" :class="{ 'no-thumbnail': !result.spec.cover }">
						<view class="count-item">
							<text class="value">{{ result.stats.visit }}</text>
							<text class="label">阅读</text>
						</view>
						<view class="count-item">
							<text class="value">{{ result.stats.upvote }}</text>
							<text class="label">喜欢</text>
						</view>
						<view v-if="postDetailConfig && postDetailConfig.showComment" class="count-item">
							<text class="value">{{ result.stats.comment }}</text>
							<text class="label">评论</text>
						</view>
						<view class="count-item">
							<text class="value">{{ result.content.raw.length }}</text>
							<text class="label">字数</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 分类 -->
			<view class="category">
				<view class="category-type">
					<text class="text-weight-b">分类：</text>
					<text v-if="result.categories.length === 0" class="category-tag is-empty">未选择分类</text>
					<block v-else>
						<text class="category-tag" v-for="(item, index) in result.categories" :key="index"
							@click="fnToCate(item)">
							{{ item.spec.displayName }}
						</text>
					</block>
				</view>
				<view class="mt-18 category-type">
					<text class="text-weight-b">标签：</text>
					<text v-if="result.tags.length === 0" class="category-tag is-empty">未选择标签</text>
					<block v-else>
						<text class="category-tag" :style="{ backgroundColor: item.color }"
							v-for="(item, index) in result.tags" :key="index" @click="fnToTag(item)">
							{{ item.spec.displayName }}
						</text>
					</block>
				</view>
				<view v-if="originalURL" class="mt-18 category-type original-url">
					<view class="original-url_left text-weight-b">原文：</view>
					<view class="original-url_right text-grey">
						<text class="original-url_right__link" @click.stop="fnToOriginal(originalURL)">{{ originalURL }}
						</text>
						<text class="original-url_right__btn" @click.stop="fnToOriginal(originalURL)">阅读原文
							<text class="iconfont icon-angle-right ml-5 text-size-s"></text>
						</text>
					</view>
				</view>
			</view>
			<!-- 内容区域 -->
			<view class="content ml-24 mr-24">
				<!-- markdown渲染 -->
				<view class="markdown-wrap">
					<mp-html class="evan-markdown" lazy-load :domain="markdownConfig.domain"
						:loading-img="markdownConfig.loadingGif" :scroll-table="true" :selectable="true"
						:tag-style="markdownConfig.tagStyle" :container-style="markdownConfig.containStyle"
						:content="result.content.raw" :markdown="true" :showLineNumber="true" :showLanguageName="true"
						:copyByLongPress="true" />
					<tm-more v-if="showValidVisitMore" :disabled="true" :maxHeight="1" :isRemovBar="true"
						@click="showValidVisitMorePop()">
						<view class="text-size-n pa-24">
							以下内容已隐藏，请验证后查看完整内容……
						</view>
						<template v-slot:more="{ data }">
							<view class="">
								<text class="text-blue text-size-m text-weight-b">文章部分内容已加密点击解锁</text>
								<text class="text-blue iconfont icon-lock-fill text-size-s ml-5"></text>
							</view>
						</template>
					</tm-more>
				</view>

				<!-- 版权声明 -->
				<view v-if="postDetailConfig && postDetailConfig.copyrightEnabled"
					class="copyright-wrap bg-white mt-24 pa-24 round-4">
					<view class="copyright-title text-weight-b">版权声明</view>
					<view
						class="copyright-content mt-12  grey-lighten-5 text-grey-darken-2 round-4 pt-12 pb-12 pl-24 pr-24 ">
						<view v-if="postDetailConfig.copyrightAuthor" class="copyright-text text-size-s ">
							版权归属：{{ postDetailConfig.copyrightAuthor }}
						</view>
						<view v-if="postDetailConfig.copyrightDesc" class="copyright-text text-size-s mt-12">
							版权说明：{{ postDetailConfig.copyrightDesc }}
						</view>
						<view v-if="postDetailConfig.copyrightViolation"
							class="copyright-text text-size-s mt-12 text-red">
							侵权处理：{{ postDetailConfig.copyrightViolation }}
						</view>
					</view>
				</view>

				<!-- 评论展示区域 -->
				<block v-if="postDetailConfig && postDetailConfig.showComment">
					<view v-if="result" class="comment-wrap bg-white mt-24 pa-24 round-4">
						<commentList ref="commentListRef" :disallowComment="!result.spec.allowComment"
							:postName="result.metadata.name" :post="result" @on-comment="fnOnComment"
							@on-comment-detail="fnOnShowCommentDetail" @on-loaded="fnOnCommentLoaded">
						</commentList>
					</view>
				</block>
			</view>

			<!-- 弹幕效果 -->
			<barrage ref="barrage" :maxTop="240" :type="globalAppSettings.barrage.type"></barrage>
			<!-- 返回顶部 -->
			<tm-flotbutton :offset="[16, 80]" icon="icon-angle-up" color="bg-gradient-light-blue-accent"
				@click="fnToTopPage()"></tm-flotbutton>
			<tm-flotbutton :actions="flotButtonActions" actions-pos="left" :show-text="true"
				color="bg-gradient-orange-accent" @change="fnOnFlotButtonChange"></tm-flotbutton>
		</block>

		<!-- 评论详情 -->
		<tm-poup v-model="commentDetail.show" height="auto" :round="6" :over-close="true" position="bottom">
			<view v-if="commentDetail.show && result" class="pa-24">
				<view class="poup-head pb-24">
					<view class="poup-title text-align-center text-size-g text-weight-b mb-32">评论详情</view>
					<comment-item :useContentBg="false" :useActions="false" :isChild="false"
						:comment="commentDetail.comment" :postName="result.metadata.name"></comment-item>
				</view>

				<scroll-view :scroll-y="true" class="poup-body">
					<view v-if="commentDetail.loading !== 'success'" class="poup-loading-wrap flex flex-center">
						<view v-if="commentDetail.loading === 'loading'" class="loading flex flex-center flex-col">
							<text class="e-loading-icon iconfont icon-loading text-blue"></text>
							<view class="text-size-n text-grey-lighten-1 py-12 mt-12">加载中，请稍等...</view>
						</view>
						<view v-else-if="commentDetail.loading === 'error'" class="error">
							<tm-empty icon="icon-wind-cry" label="加载失败">
								<tm-button theme="bg-gradient-light-blue-accent" size="m" @click="fnGetChildComments()">
									刷新试试
								</tm-button>
							</tm-empty>
						</view>
					</view>
					<block v-else>
						<view v-if="commentDetail.list.length === 0" class="poup-empty flex flex-center">
							<tm-empty icon="icon-shiliangzhinengduixiang-" label="没有更多评论啦~"></tm-empty>
						</view>

						<block v-else>
							<comment-item v-for="(comment, index) in commentDetail.list" :useContentBg="false"
								:useSolid="false" :useActions="false" :key="index" :isChild="false" :comment="comment"
								:postName="result.metadata.name"></comment-item>
						</block>
					</block>
				</scroll-view>
			</view>
		</tm-poup>

		<!-- 海报 -->
		<tm-poup v-model="poster.show" width="90vw" height="auto" :round="6" :over-close="true" position="center">
			<view class="poster-content pt-12 bg-white">
				<view v-if="poster.loading" class="poster-loading flex flex-center text-grey-darken-1">
					<text class="e-loading-icon iconfont icon-loading"></text>
					<text class="ml-6">海报正在生成...</text>
				</view>
				<block v-if="poster.showCanvas">
					<r-canvas ref="rCanvas"></r-canvas>
					<view class="poster-save ma-24 mt-0 pt-20 flex flex-center">
						<tm-button theme="bg-gradient-light-blue-accent" size="m" @click="fnSavePoster()">
							保存到相册
						</tm-button>
						<tm-button v-if="false" theme="bg-gradient-orange-accent" size="m" @click="fnShareTo()">
							分享给好友
						</tm-button>
						<tm-button theme="bg-gradient-blue-grey-accent" size="m" @click="fnOnPosterClose()">
							关 闭
						</tm-button>
					</view>
				</block>
			</view>
		</tm-poup>

		<!-- 密码访问解密弹窗 -->
		<tm-dialog :disabled="true" :input-val.sync="validVisitModal.value" title="验证提示" confirmText="立即验证"
			:showCancel="validVisitModal.useCancel" model="confirm" v-model="validVisitModal.show"
			content="博主设置了需要密码才能查看该文章内容,请输入文章密码进行验证" theme="split" confirmColor="blue shadow-blue-0"
			@cancel="closeValidVisitPop" @confirm="fnValidVisitPwd"></tm-dialog>
		<!-- 是否前往获取验证码 -->
		<tm-dialog v-model="showGetPassword" title="免费获取验证码" content="是否前往获取验证码？" @confirm="toAdvertise"
			@cancel="closeAllPop"></tm-dialog>

		<!-- 评论弹窗 -->
		<block v-if="calcIsShowComment">
			<comment-modal :show="commentModal.show" :title="commentModal.title" :postName="commentModal.postName"
				:isComment="commentModal.isComment" @on-close="fnOnCommentModalClose"></comment-modal>
		</block>
	</view>
</template>

<script>
	import MarkdownConfig from '@/common/markdown/markdown.config.js';

	import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
	import tmPoup from '@/tm-vuetify/components/tm-poup/tm-poup.vue';
	import tmFlotbutton from '@/tm-vuetify/components/tm-flotbutton/tm-flotbutton.vue';
	import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
	import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';
	import tmDialog from '@/tm-vuetify/components/tm-dialog/tm-dialog.vue';
	import tmMore from '@/tm-vuetify/components/tm-more/tm-more.vue';

	import mpHtml from '@/components/mp-html/components/mp-html/mp-html.vue';
	import commentList from '@/components/comment-list/comment-list.vue';
	import commentItem from '@/components/comment-item/comment-item.vue';
	import commentModal from '@/components/comment-modal/comment-modal.vue';

	import rCanvas from '@/components/r-canvas/r-canvas.vue';
	import barrage from '@/components/barrage/barrage.vue';
	import {
		getAppConfigs
	} from '@/config/index.js'

	export default {
		components: {
			tmSkeleton,
			tmPoup,
			tmFlotbutton,
			tmButton,
			tmEmpty,
			tmDialog,
			tmMore,
			mpHtml,
			commentList,
			commentItem,
			rCanvas,
			barrage,
			commentModal
		},
		data() {
			return {
				loading: 'loading',
				markdownConfig: MarkdownConfig,

				flotButtonActions: [],
				queryParams: {
					name: null
				},
				result: null,

				commentDetail: {
					loading: 'loading',
					show: false,
					comment: {},
					postName: undefined,
					list: []
				},
				poster: {
					show: false,
					showCanvas: false,
					loading: true,
					res: null
				},

				metas: [], // 自定义元数据
				// 文章加密（弹窗输入密码解密）
				validVisitModal: {
					show: false,
					useCancel: false,
					value: undefined
				},
				visitType: 0, // 0 未加密 1 后端部分隐藏 2 前端部分隐藏 3 全部隐藏
				visitPwd: undefined,
				showValidVisitMore: true,
				showGetPassword: false,
				commentModal: {
					show: false,
					isComment: false,
					postName: "",
					title: ""
				}
			};
		},
		computed: {
			haloConfigs() {
				return this.$tm.vx.getters().getConfigs;
			},
			postDetailConfig() {
				return this.haloConfigs.basicConfig.postDetailConfig;
			},
			calcUrl() {
				return url => {
					if (this.$utils.checkIsUrl(url)) {
						return url;
					}
					return getApp().globalData.baseApiUrl + url;
				};
			},
			// 获取博主信息
			bloggerInfo() {
				const blogger = this.$tm.vx.getters().getConfigs.authorConfig.blogger;
				blogger.avatar = this.$utils.checkAvatarUrl(blogger.avatar, true);
				return blogger;
			},

			// 原文链接：个人资质=可以打开公众号文章；非个人：任意链接地址（需在小程序后台配置）
			originalURL() {
				return this.result?.metadata?.annotations?.unihalo_originalURL || ""
			},

			calcIsShowComment() {
				return this.postDetailConfig.showComment
			}
		},
		watch: {
			haloConfigs: {
				deep: true,
				immediate: true,
				handler: function(newVal) {
					if (!newVal) return;
					this.fnHandleSetFlotButtonItems(newVal);
				}
			}
		},
		onLoad(e) {
			this.fnSetPageTitle('文章加载中...');
			this.queryParams.name = e.name;
			this.fnGetData();
		},

		onPullDownRefresh() {
			this.fnGetData();
		},
		onShareAppMessage() {
			const cover = this.result.spec.cover ? this.calcUrl(this.result.spec.cover) : ""
			return {
				path: '/pagesA/article-detail/article-detail?name=' + this.result.metadata.name,
				title: this.result.spec.title,
				imageUrl: cover
			}
		},
		onShareTimeline() {
			const cover = this.result.spec.cover ? this.calcUrl(this.result.spec.cover) : ""
			return {
				title: this.result.spec.title,
				query: {
					name: this.result.metadata.name
				},
				imageUrl: cover
			}
		},
		methods: {
			fnGetData() {
				this.loading = 'loading';
				this.$httpApi.v2
					.getPostByName(this.queryParams.name)
					.then(res => {
						console.log('详情', res);
						this.result = res;

						const openid = uni.getStorageSync('openid');
						if (openid === '' || openid === null) {
							this.fnGetOpenid();
						}
						const visitFlag = uni.getStorageSync('visit_' + this.result?.metadata?.name);

						const toolsPluginEnabled = getAppConfigs().pluginConfig.toolsPlugin?.enabled;

						if (toolsPluginEnabled && !visitFlag) {
							const annotationsMap = res?.metadata?.annotations;
							if (('restrictReadEnable' in annotationsMap) && annotationsMap.restrictReadEnable ===
								'true') {
								this.visitType = 1;
								this.showValidVisitMorePop();
							} else if ('unihalo_useVisitMorePwd' in annotationsMap) {
								this.visitType = 2;
								this.visitPwd = annotationsMap.unihalo_useVisitMorePwd;
								this.showValidVisitMorePop();
							} else if ('unihalo_useVisitPwd' in annotationsMap) {
								this.visitType = 3;
								this.visitPwd = annotationsMap.unihalo_useVisitPwd;
								this.showValidVisitPop();
							} else if (('restrictReadEnable' in annotationsMap) && annotationsMap
								.restrictReadEnable === 'password') {
								this.visitType = 4;
								this.showValidVisitPop();
							} else {
								this.visitType = 0;
								this.showValidVisitMore = false;
							}
							this.fnHideContent();
						} else {
							this.showValidVisitMore = false;
						}

						this.fnSetPageTitle('文章详情');
						this.loading = 'success';
					})
					.catch(err => {
						console.log("错误", err)
						this.loading = 'error';
					})
					.finally(() => {
						uni.hideLoading();
						uni.stopPullDownRefresh();
					});
			},
			fnHandleSetFlotButtonItems(configs) {
				const actions = [{
						icon: 'icon-share1',
						color: 'bg-gradient-blue-accent',
						use: true,
					},
					{
						icon: 'icon-like',
						color: 'bg-gradient-orange-accent',
						use: false,
					},
					{
						icon: 'icon-commentdots-fill',
						color: 'bg-gradient-green-accent',
						use: configs?.basicConfig?.postDetailConfig?.showComment
					}
				]

				this.flotButtonActions = actions.filter(x => x.use === true)
			},
			// 浮动按钮点击
			fnOnFlotButtonChange(index) {
				switch (index) {
					// case 0:
					// 	this.fnDoLikes();
					// 	break;
					case 0:
						this.fnShowShare();
						break;
					case 1:
						this.fnToComment();
						break;
				}
			},

			fnToComment() {
				if (!this.calcIsShowComment) {
					return;
				}
				if (!this.result.spec.allowComment) {
					return uni.$tm.toast('文章已开启禁止评论！');
				}
				this.commentModal.isComment = true;
				this.commentModal.postName = this.result.metadata.name;
				this.commentModal.title = "新增评论";
				this.commentModal.show = true;
			},
			fnOnComment(data) {
				this.commentModal.isComment = data.isComment;
				this.commentModal.postName = data.postName;
				this.commentModal.title = data.title;
				this.commentModal.show = true;
			},
			fnOnCommentModalClose(refresh) {
				if (refresh && this.$refs.commentListRef) {
					this.$refs.commentListRef.fnGetData()
				}
				this.commentModal.show = false;
				this.commentModal.isComment = false;
				this.commentModal.postName = "";
				this.commentModal.title = "";
			},
			fnDoLikes() {
				this.$httpApi
					.postLikePost(this.result.id)
					.then(res => {
						if (res.status == 200) {
							this.result.likes += 1;
							uni.$tm.toast('\(^o^)/~点赞成功!');
						} else {
							uni.showToast({
								icon: 'none',
								title: res.message
							});
						}
					})
					.catch(err => {
						uni.showToast({
							icon: 'none',
							title: err.message
						});
					});
			},
			fnShowShare() {
				this.poster.show = true;
				setTimeout(() => {
					this.poster.showCanvas = true;
					this.fnCreatePoster(res => {
						this.poster.res = res;
					});
				}, 500);
			},
			// 绘制虚线：https://blog.csdn.net/a460550542/article/details/124821248
			drawDashedLine(ctx, x, y, w, h, pattern, color) {
				ctx.lineWidth = h;
				ctx.strokeStyle = color;
				ctx.beginPath();
				ctx.setLineDash(pattern);
				ctx.moveTo(x, y);
				ctx.lineTo(w, y);
				ctx.stroke();
				y += 20;
			},
			fnCreatePoster(callback) {
				this.$nextTick(async () => {
					const systemInfo = await uni.getSystemInfoSync();
					const _bloggerAvatar = this.$utils.checkAvatarUrl(this.bloggerInfo.avatar, true);
					const _articleCover = this.$utils.checkThumbnailUrl(this.result.spec.cover, true);
					// 初始化
					await this.$refs.rCanvas.init({
						canvas_id: 'rCanvas',
						// canvas_width: systemInfo.windowWidth - uni.upx2px(76),
						canvas_width: 337,
						canvas_height: 460,
						background_color: 'rgba(255,255,255,0)'
					});
					// 画圆角背景
					await this.$refs.rCanvas
						.fillRoundRect({
							x: 0,
							y: 0,
							w: 337,
							h: 460,
							radius: 12,
							fill_color: '#fff'
						})
						.catch(err_msg => {
							uni.showToast({
								title: err_msg,
								icon: 'none'
							});
						});
					// 博主信息
					await this.$refs.rCanvas
						.drawImage({
							url: _bloggerAvatar,
							x: 12,
							y: 12,
							w: 48,
							h: 48,
							border_radius: 24
						})
						.catch(err_msg => {
							uni.showToast({
								title: err_msg,
								icon: 'none'
							});
						});

					await this.$refs.rCanvas
						.drawText({
							text: this.bloggerInfo.nickname,
							max_width: 0,
							x: 70,
							y: 30,
							font_color: '#000',
							font_size: 15
						})
						.catch(err_msg => {
							uni.showToast({
								title: err_msg,
								icon: 'none'
							});
						});
					await this.$refs.rCanvas
						.drawText({
							text: this.bloggerInfo.description,
							max_width: 0,
							x: 70,
							y: 52,
							font_color: '#666',
							font_size: 12
						})
						.catch(err_msg => {
							uni.showToast({
								title: err_msg,
								icon: 'none'
							});
						});
					// 文章封面图
					await this.$refs.rCanvas
						.drawImage({
							url: _articleCover,
							x: 12,
							y: 75,
							w: 312,
							h: 180,
							border_radius: 6
						})
						.catch(err_msg => {
							uni.showToast({
								title: err_msg,
								icon: 'none'
							});
						});

					// 文章标题
					await this.$refs.rCanvas
						.drawText({
							text: this.result.spec.title,
							max_width: 312,
							line_clamp: 1,
							x: 12,
							y: 285,
							font_weight: 'bold',
							font_color: '#333',
							font_size: 14
						})
						.catch(err_msg => {
							uni.showToast({
								title: err_msg,
								icon: 'none'
							});
						});
					await this.$refs.rCanvas
						.drawText({
							text: this.result?.status?.excerpt || "文章暂无摘要信息",
							max_width: 312,
							line_clamp: 2,
							x: 12,
							y: 310,
							font_color: '#333',
							font_size: 13,
							line_height: 20
						})
						.catch(err_msg => {
							uni.showToast({
								title: err_msg,
								icon: 'none'
							});
						});

					this.drawDashedLine(this.$refs.rCanvas.ctx, 14, 356, 332, 0.5, [8, 5, 5, 5], '#999');
					// 小程序信息
					const _qrCodeImageUrl = await this.qrCodeImageUrl();
					await this.$refs.rCanvas
						.drawImage({
							url: this.$utils.checkImageUrl(_qrCodeImageUrl),
							x: 20,
							y: 360,
							w: 80,
							h: 80
						})
						.catch(err_msg => {
							uni.showToast({
								title: err_msg,
								icon: 'none'
							});
						});

					await this.$refs.rCanvas
						.drawText({
							text: '长按识别小程序',
							x: 150,
							y: 390,
							font_color: '#333',
							font_size: 15,
							font_weight: 'bold',
							line_height: 22
						})
						.catch(err_msg => {
							uni.showToast({
								title: err_msg,
								icon: 'none'
							});
						});
					await this.$refs.rCanvas
						.drawText({
							text: '关注我，给你分享更多有趣的知识',
							x: 115,
							y: 425,
							font_color: '#333',
							font_size: 12,
							line_height: 22
						})
						.catch(err_msg => {
							uni.showToast({
								title: err_msg,
								icon: 'none'
							});
						});
					// 生成海报
					await this.$refs.rCanvas.draw(res => {
						//res.tempFilePath：生成成功，返回base64图片
						// 保存图片
						this.poster.loading = false;
						callback(res);
					});
				});
			},
			fnOnPosterClose() {
				this.poster.show = false;
				this.poster.showCanvas = false;
				this.poster.loading = true;
			},
			fnSavePoster() {
				this.$refs.rCanvas.saveImage(this.poster.res.tempFilePath);
				uni.$tm.toast('保存成功');
			},
			fnShareTo() {
				// #ifdef MP-WEIXIN
				uni.$tm.toast('点击右上角分享给好友！');
				// #endif
			},
			fnOnShowCommentDetail(data) {
				const {
					postName,
					comment
				} = data;
				this.commentDetail.comment = comment;
				this.commentDetail.postName = postName;
				this.commentDetail.list = [];
				this.commentDetail.show = true;
				this.fnGetChildComments();
			},
			fnGetChildComments() {
				this.commentDetail.loading = 'loading';
				this.$httpApi.v2
					.getPostCommentReplyList(this.commentDetail.postName, {
						page: 1,
						size: 100
					})
					.then(res => {
						console.log('getPostChildrenCommentList res', res);
						this.commentDetail.loading = 'success';
						this.commentDetail.list = res.items;
					})
					.catch(err => {
						console.log('getPostChildrenCommentList err', err);
						this.commentDetail.loading = 'error';
					});
			},
			fnToCate(category) {
				uni.navigateTo({
					url: `/pagesA/category-detail/category-detail?name=${category.metadata.name}&title=${category.spec.displayName}`
				});
			},
			fnToTag(tag) {
				uni.navigateTo({
					url: `/pagesA/tag-detail/tag-detail?name=${tag.metadata.name}&title=${tag.spec.displayName}`
				});
			},
			async fnOnCommentLoaded(data) {
				const _list = [];
				const _handleData = list => {
					return new Promise(resolve => {
						if (list.length === 0) {
							resolve();
						} else {
							list.forEach(item => {
								_list.push(item);
								if (item.replies && item.replies.length !== 0) {
									_handleData(item.replies.items);
								}
								resolve();
							});
						}
					});
				};
				await _handleData(data);
				// if (this.globalAppSettings.barrage.use) {
				// 	this.$nextTick(() => {
				// 		if (_list.length != 0) {
				// 			_handleAddBarrage();
				// 		}
				// 	});
				// }
				// const _handleRemove = () => {
				// 	this.$refs['barrage'] && this.$refs['barrage'].remove({
				// 		duration: 5000, // 延迟关闭的时间
				// 		speed: 600 // 弹幕消失的速度
				// 	});
				// };
				// let index = 0;
				// const _handleAddBarrage = () => {
				// 	setTimeout(() => {
				// 		this.$refs['barrage'] && this.$refs['barrage'].add(_list[index]);
				// 		index += 1;
				// 		if (index < _list.length - 1) {
				// 			_handleAddBarrage();
				// 		} else {
				// 			_handleRemove();
				// 		}
				// 	}, 1000);
				// };
			},
			fnToWebview(data) {
				uni.navigateTo({
					url: '/pagesC/website/website?data=' +
						JSON.stringify({
							title: data.title,
							url: data.url
						})
				});
			},
			fnToOriginal(originalURL) {
				this.fnToWebview({
					title: this.result.title,
					url: originalURL
				});
			},
			showValidVisitPop() {
				this.showValidVisitMore = true;
				this.validVisitModal.value = undefined;
				this.validVisitModal.show = true;
				this.validVisitModal.useCancel = false;
			},
			showValidVisitMorePop() {
				this.showValidVisitMore = true;
				this.validVisitModal.value = undefined;
				this.validVisitModal.show = true;
				this.validVisitModal.useCancel = true;
			},
			closeValidVisitPop() {
				this.validVisitModal.show = false;
				this.validVisitModal.useCancel = true;
				this.validVisitModal.value = undefined;
				if (this.visitType === 1) {
					// 显示是否前往获取验证弹窗
					this.validVisitModal.show = true;
					this.showGetPassword = true;
				}
			},
			closeAllPop() {
				this.validVisitModal.show = false;
				this.validVisitModal.useCancel = true;
				this.validVisitModal.value = undefined;
				this.showGetPassword = false;
			},
			toAdvertise() {
				this.showGetPassword = false;
				uni.navigateTo({
					url: '/pagesA/advertise/advertise'
				});
			},
			//   获取openid
			fnGetOpenid() {
				// #ifdef MP-WEIXIN
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						try {
							// todo 因为没有获取openid，所以先使用code代替
							uni.setStorageSync('openid', loginRes.code)
						} catch (error) {
							console.log(error)
						}
					}
				})
				// #endif
			},
			//   隐藏内容
			fnHideContent() {
				switch (this.visitType) {
					case 1:
						const restrictReadRaw = this.result?.content?.raw.split('<!-- restrictRead start -->')[0];
						this.result.content.raw = restrictReadRaw;
						return;
					case 2:
					case 3:
						const length = this.result?.content?.raw?.length;
						const first30PercentLength = Math.floor(length * 0.3);
						const first30PercentRaw = this.result?.content?.raw?.substring(0, first30PercentLength);
						this.result.content.raw = first30PercentRaw;
						return;
					case 4:
						this.result.content.raw = "";
						return;
					default:
						return;
				}
			},
			//   校验密码
			fnValidVisitPwd() {
				switch (this.visitType) {
					case 0:
						return;
					case 1:
						this.$httpApi.v2.checkPostVerifyCode(this.validVisitModal.value, this.result?.metadata?.name).then(
							res => {
								if (res.code === 200) {
									uni.setStorageSync('visit_' + this.result?.metadata?.name, true)
									this.closeAllPop();
									this.fnGetData();
								} else {
									uni.showToast({
										title: '密码错误',
										icon: 'none'
									});
								}
							}).catch(err => {
							console.log(err);
						});
						return;
					case 2:
					case 3:
						if (this.visitPwd === this.validVisitModal.value) {
							uni.setStorageSync('visit_' + this.result?.metadata?.name, true)
							this.closeValidVisitPop();
							this.fnGetData();
						} else {
							uni.showToast({
								title: '密码错误',
								icon: 'none'
							});
						}
						return;
					case 4:
						this.$httpApi.v2.checkPostPasswordAccess(this.validVisitModal.value, this.result?.metadata?.name)
							.then(res => {
								if (res.code === 200) {
									uni.setStorageSync('visit_' + this.result?.metadata?.name, true)
									this.closeAllPop();
									this.fnGetData();
								} else {
									uni.showToast({
										title: '密码错误',
										icon: 'none'
									});
								}
							}).catch(err => {
								console.log(err);
							});
						return;
					default:
						return;
				}
			},
			async qrCodeImageUrl() {
				const useDynamicQRCode = this.haloConfigs?.appConfig?.appInfo?.useDynamicQRCode;
				if (useDynamicQRCode) {
					const qrCodeImg = await this.$httpApi.v2.getQRCodeImg(this.result.metadata.name);
					return qrCodeImg;
				} else {
					return this.haloConfigs?.appConfig?.appInfo?.qrCodeImageUrl;
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
		background-color: #fafafd;
		padding-bottom: 24rpx;
	}

	.bg-image {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		width: 100vw;
		height: 100vh;
		z-index: 0;
	}

	.loading-wrap {
		padding: 0 24rpx;
		height: inherit;
		background-color: #fff;
	}

	.head {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 36rpx 24rpx;
		background-color: #ffffff;
		box-shadow: 0rpx 4rpx 24rpx rgba(0, 0, 0, 0.03);
		// box-shadow: 0rpx 6rpx 30rpx rgba(182, 223, 255, 0.3);
		border-radius: 12rpx;

		.title {
			font-size: 36rpx;
			font-weight: 600;
			text-align: center;
		}

		.detail {
			width: 100%;
			margin-top: 24rpx;
			font-size: 26rpx;

			.author {
				text-align: center;
				font-size: 24rpx;
				color: #666;

				&-name {}

				&-time {
					margin-left: 36rpx;
				}
			}

			.cover {
				margin-top: 24rpx;
				width: 100%;
				height: 280rpx;

				&-img {
					width: 100%;
					height: 100%;
					border-radius: 12rpx;
				}
			}

			.count {
				margin-top: 24rpx;
				display: flex;
				justify-content: space-between;

				&.no-thumbnail {
					border-top: 2rpx solid #f2f2f2;
					padding-top: 12rpx;

					.count-item {
						position: relative;
						color: #666;

						&::after {
							content: '';
							position: absolute;
							right: 0;
							background-color: #eee;
							width: 2rpx;
							height: 32rpx;
						}

						&:last-child {
							&::after {
								display: none;
							}
						}
					}
				}

				&-item {
					flex: 1;
					display: flex;
					align-items: flex-end;
					justify-content: center;
					color: #666;

					.label {
						font-size: 24rpx;
						padding-left: 8rpx;
					}

					.value {
						font-size: 32rpx;
					}
				}
			}
		}
	}

	.category {
		margin: 0 24rpx;
		padding: 24rpx;
		background-color: #ffffff;
		border-radius: 12rpx;
		// box-shadow: 0rpx 0rpx 24rpx rgba(182, 223, 255, 0.3);
		box-shadow: 0rpx 4rpx 24rpx rgba(0, 0, 0, 0.03);
		// border: 2rpx solid #f8f8f8;
		font-size: 28rpx;

		&-type {
			line-height: 55rpx;
		}

		&-tag {
			background-color: #5bb8fa;
			color: #fff;
			padding: 6rpx 12rpx;
			border-radius: 6rpx;
			font-size: 24rpx;

			&.is-empty {
				background-color: #607d8b;
			}
		}
	}

	.category-tag+.category-tag {
		margin-left: 12rpx;
	}

	.content {
		margin-top: 24rpx;
	}

	.markdown-wrap,
	.evan-markdown,
	.ad-wrap,
	.copyright-wrap,
	.comment-wrap {
		box-shadow: 0rpx 0rpx 24rpx rgba(0, 0, 0, 0.03);
	}

	.markdown-wrap {
		overflow: hidden;
		border-radius: 12rpx;
	}

	.copyright-title {
		position: relative;
		box-sizing: border-box;
		padding-left: 24rpx;
		font-size: 30rpx;

		&:before {
			content: '';
			position: absolute;
			left: 0rpx;
			top: 8rpx;
			width: 8rpx;
			height: 26rpx;
			background-color: rgb(3, 174, 252);
			border-radius: 6rpx;
		}
	}

	.poup-head {
		border-bottom: 2rpx solid #f5f5f5;
	}

	.poup-body {
		height: 50vh;
	}

	.poup-empty {
		width: 100%;
		height: 40vh;
	}

	.poup-loading-wrap {
		width: 100%;
		height: 40vh;

		.e-loading-icon {
			font-size: 80rpx;
		}
	}

	.poster-content {
		width: 100%;
		min-height: 60vh;
		overflow: hidden;
	}

	.copyright-text {
		line-height: 1.7;
	}

	.poster-loading {
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		// background-color: rgba(0, 0, 0, 0.1);
		z-index: 666;
	}

	.poster-save {
		box-sizing: border-box;
		border-top: 2rpx dashed #eee;
	}

	.original-url {
		display: flex;

		&_left {
			flex-shrink: 0;
			width: 84rpx;
		}

		&_right {
			flex-grow: 1;
			display: inline-flex;
			align-items: center;

			&__link {
				width: 410rpx;
				display: inline-block;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			&__btn {
				flex-grow: 1;
				flex-shrink: 0;
				display: block;
				text-align: right;
			}
		}
	}
</style>