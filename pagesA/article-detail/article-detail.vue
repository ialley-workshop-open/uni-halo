<template>
	<view class="app-page">
		<view v-if="loading != 'success'" class="loading-wrap">
			<tm-skeleton model="card"></tm-skeleton>
			<tm-skeleton model="card"></tm-skeleton>
			<tm-skeleton model="card"></tm-skeleton>
		</view>
		<block v-else>
			<!-- 顶部信息 -->
			<view class="head ma-24">
				<view class="title">{{ result.title }}</view>
				<view class="detail">
					<view class="author">
						<text class="author-name">博主：{{ author.nickname }}</text>
						<text class="author-time">
							时间：{{ { d: result.createTime, f: 'yyyy年MM月dd日 星期w' } | formatTime }}
						</text>
					</view>

					<view class="cover" v-if="result.thumbnail">
						<image class="cover-img" mode="aspectFill" :src="calcUrl(result.thumbnail)"></image>
					</view>
					<view class="count" :class="{ 'no-thumbnail': !result.thumbnail }">
						<view class="count-item">
							<text class="value">{{ result.visits }}</text>
							<text class="label">阅读</text>
						</view>
						<view class="count-item">
							<text class="value">{{ result.likes }}</text>
							<text class="label">喜欢</text>
						</view>
						<view class="count-item">
							<text class="value">{{ result.commentCount }}</text>
							<text class="label">评论</text>
						</view>
						<view class="count-item">
							<text class="value">{{ result.wordCount }}</text>
							<text class="label">字数</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 分类 -->
			<view class="category">
				<view class="category-type">
					<text class="text-weight-b">分类：</text>
					<text v-if="result.categories.length == 0" class="category-tag is-empty">未选择分类</text>
					<block v-else>
						<text class="category-tag" v-for="(item, index) in result.categories" :key="index" @click="fnToCate(item)">
							{{ item.name }}
						</text>
					</block>
				</view>
				<view class="mt-18 category-type">
					<text class="text-weight-b">标签：</text>
					<text v-if="result.tags.length == 0" class="category-tag is-empty">未选择标签</text>
					<block v-else>
						<text class="category-tag" :style="{ backgroundColor: item.color }" v-for="(item, index) in result.tags" :key="index" @click="fnToTag(item)">
							{{ item.name }}
						</text>
					</block>
				</view>
				<view v-if="originalURL" class="mt-18 category-type original-url">
					<view class="original-url_left text-weight-b">原文：</view>
					<view class="original-url_right text-grey">
						<text class="original-url_right__link" @click.stop="fnToOriginal(originalURL)">{{ originalURL }}</text>
						<text class="original-url_right__btn" @click.stop="fnToOriginal(originalURL)">阅读原文<text class="iconfont icon-angle-right ml-5 text-size-s"></text> </text>
					</view>
				</view>
			</view>
			<!-- 广告区域 -->
			<view v-if="haloAdConfig.articleDetail.use && (haloAdConfig.unitId || haloAdConfig.adpid)" class="ad-wrap ma-24 mb-0">
				<!-- #ifdef MP-WEIXIN -->
				<ad v-if="haloAdConfig.unitId" :unit-id="haloAdConfig.unitId"></ad>
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<ad v-if="haloAdConfig.adpid" :adpid="haloAdConfig.adpid"></ad>
				<!-- #endif -->
			</view>
			<!-- 内容区域 -->
			<view class="content ml-24 mr-24">
				<!-- markdown渲染 -->
				<view class="markdown-wrap">
					<tm-more :disabled="true" :maxHeight="1500" :isRemovBar="true" :open="showValidVisitMore" @click="fnOnShowValidVisitMore">
						<mp-html class="evan-markdown" lazy-load :domain="markdownConfig.domain" :loading-img="markdownConfig.loadingGif" :scroll-table="true" :selectable="true" :tag-style="markdownConfig.tagStyle" :container-style="markdownConfig.containStyle" :content="result.content || result.formatContent" :markdown="true" :showLineNumber="true" :showLanguageName="true" :copyByLongPress="true" />
						<template v-slot:more="{ data }">
							<view class="">
								<text class="text-blue text-size-m text-weight-b">文章部分内容已加密点击解锁</text>
								<text class="text-blue iconfont icon-lock-fill text-size-s ml-5"></text>
							</view>
						</template>
					</tm-more>
				</view>
				<!-- 广告区域：微信/decloud申请 -->
				<view v-if="haloAdConfig.articleDetail.use && (haloAdConfig.unitId || haloAdConfig.adpid)" class="ad-wrap mt-24 mb-24 ">
					<!-- #ifdef MP-WEIXIN -->
					<ad v-if="haloAdConfig.unitId" :unit-id="haloAdConfig.unitId"></ad>
					<!-- #endif -->
					<!-- #ifndef MP-WEIXIN -->
					<ad v-if="haloAdConfig.adpid" :adpid="haloAdConfig.adpid"></ad>
					<!-- #endif -->
				</view>

				<!-- 广告区域：自定义广告位 -->
				<view class="ad-card mt-24" v-if="haloAdConfig.articleDetail.custom.use">
					<text class="ad-card_tip">广告</text>
					<image class="ad-card_cover" :src="haloAdConfig.articleDetail.custom.cover" mode="scaleToFill"></image>
					<view class="ad-card_info">
						<view class="ad-card_info-title">{{ haloAdConfig.articleDetail.custom.title }}</view>
						<view class="ad-card_info-desc">{{ haloAdConfig.articleDetail.custom.content }}</view>
						<view v-if="haloAdConfig.articleDetail.custom.url" class="ad-card_info-link" @click="fnToWebview(haloAdConfig.articleDetail.custom)">
							立即查看
						</view>
					</view>
				</view>

				<!-- 版权声明 -->
				<view v-if="copyright.use" class="copyright-wrap bg-white mt-24 pa-24 round-4">
					<view class="copyright-title text-weight-b">版权声明</view>
					<view class="copyright-content mt-12  grey-lighten-5 text-grey-darken-2 round-4 pt-12 pb-12 pl-24 pr-24 ">
						<view v-if="copyright.author" class="copyright-text text-size-s ">
							版权归属：{{ copyright.author }}
						</view>
						<view v-if="copyright.description" class="copyright-text text-size-s mt-12">
							版权说明：{{ copyright.description }}
						</view>
						<view v-if="copyright.violation" class="copyright-text text-size-s mt-12 text-red">
							侵权处理：{{ copyright.violation }}
						</view>
					</view>
				</view>

				<!-- 评论展示区域 -->
				<view class="comment-wrap bg-white mt-24 pa-24 round-4">
					<commentList :disallowComment="result.disallowComment" :postId="result.id" :post="result" @on-comment-detail="fnOnShowCommentDetail" @on-loaded="fnOnCommentLoaded"></commentList>
				</view>
			</view>

			<!-- 弹幕效果 -->
			<barrage ref="barrage" :maxTop="240" :type="globalAppSettings.barrage.type"></barrage>
			<!-- 返回顶部 -->
			<tm-flotbutton :offset="[16, 80]" icon="icon-angle-up" color="bg-gradient-light-blue-accent" @click="fnToTopPage()"></tm-flotbutton>
			<tm-flotbutton :actions="btnOption.actions" actions-pos="left" :show-text="true" color="bg-gradient-orange-accent" @change="fnOnFlotButtonChange"></tm-flotbutton>
		</block>

		<!-- 评论详情 -->
		<tm-poup v-model="commentDetail.show" height="auto" :round="6" :over-close="true" position="bottom">
			<view class="pa-24">
				<view class="poup-head pb-24">
					<view class="poup-title text-align-center text-size-g text-weight-b mb-32">评论详情</view>
					<comment-item :useContentBg="false" :useActions="false" :isChild="false" :comment="commentDetail.comment" :postId="result.id"></comment-item>
				</view>

				<scroll-view :scroll-y="true" class="poup-body">
					<view v-if="commentDetail.loading != 'success'" class="poup-loading-wrap flex flex-center">
						<view v-if="commentDetail.loading == 'loading'" class="loading flex flex-center flex-col">
							<text class="e-loading-icon iconfont icon-loading text-blue"></text>
							<view class="text-size-n text-grey-lighten-1 py-12 mt-12">加载中，请稍等...</view>
						</view>
						<view v-else-if="commentDetail.loading == 'error'" class="error">
							<tm-empty icon="icon-wind-cry" label="加载失败">
								<tm-button theme="bg-gradient-light-blue-accent" size="m" v-if="!disallowComment" @click="fnGetChildComments()">
									刷新试试
								</tm-button>
							</tm-empty>
						</view>
					</view>
					<block v-else>
						<view v-if="commentDetail.list.length == 0" class="poup-empty flex flex-center">
							<tm-empty icon="icon-shiliangzhinengduixiang-" label="没有更多评论啦~"></tm-empty>
						</view>

						<block v-else>
							<comment-item v-for="(comment, index) in commentDetail.list" :useContentBg="false" :useSolid="false" :useActions="false" :key="index" :isChild="false" :comment="comment" :postId="result.id"></comment-item>
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
		<tm-dialog :disabled="true" :input-val.sync="validVisitModal.value" title="验证提示" confirmText="立即验证" :showCancel="validVisitModal.useCancel" model="confirm" v-model="validVisitModal.show" content="博主设置了需要密码才能查看该文章内容,请输入文章密码进行验证" theme="split" confirmColor="blue shadow-blue-0" @cancel="fnOnValidVisitCancel" @confirm="fnOnValidVisitConfirm"></tm-dialog>

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

	import rCanvas from '@/components/r-canvas/r-canvas.vue';
	import barrage from '@/components/barrage/barrage.vue';

	import { haloWxShareMixin } from '@/common/mixins/wxshare.mixin.js';
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
			barrage
		},
		mixins: [haloWxShareMixin],
		data() {
			return {
				loading: 'loading',
				markdownConfig: MarkdownConfig,
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
				queryParams: {
					articleId: null
				},
				result: {},

				commentDetail: {
					loading: 'loading',
					show: false,
					comment: {},
					postId: undefined,
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
				showValidVisitMore: true,
			};
		},
		computed: {
			copyright() {
				return getApp().globalData.copyright;
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
				let blogger = this.$tm.vx.getters().getBlogger;
				blogger.avatar = this.$utils.checkAvatarUrl(blogger.avatar, true);
				return blogger;
			},
			// 原文链接：个人资质=可以打开公众号文章；非个人：任意链接地址（需在小程序后台配置）
			originalURL() {
				const target = this.metas.find(x => x.key == 'unihalo_originalURL');
				if (!target) return '';
				return target.value || '';
			},
			// 是否使用文章密码功能，如果值不为空，则优先于 useVisitMore：unihalo_useVisitPwd
			useVisitPwd() {
				const target = this.metas.find(x => x.key == 'unihalo_useVisitPwd');
				if (!target) return false;
				return target.value || false;
			},
			// 是否启用查看完整文章的功能的密码：unihalo_useVisitMorePwd
			useVisitMorePwd() {
				const target = this.metas.find(x => x.key == 'unihalo_useVisitMorePwd');
				if (!target) return false;
				return target.value || false;
			},
			// 当前是使用哪一种类型的密码验证 0=不使用任何 1=默认弹窗密码 2=查看部分内容 
			useVisitMode() {
				if (this.useVisitPwd != false) {
					return 1
				}
				if (this.useVisitMorePwd != false) {
					return 2
				}
				return 0
			}
		},
		watch: {
			useVisitPwd(val) {
				if (val) {
					this.validVisitModal.show = true
				}
			},
			useVisitMode(val) {
				if (val != 2) {
					this.showValidVisitMore = true
				} else {
					this.showValidVisitMore = false
				}
			}
		},
		onLoad(e) {
			this.fnSetPageTitle('文章加载中...');
			this.queryParams.articleId = e.articleId;
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
				this.$httpApi
					.getArticleDetail(this.queryParams.articleId)
					.then(res => {
						if (res.status == 200) {
							this.result = res.data;
							this.metas = res.data.metas;
							this.fnSetPageTitle('文章详情');
							this.loading = 'success';
							this.fnSetWxShareConfig({
								title: this.result.title,
								desc: this.result.summary,
								imageUrl: this.$utils.checkThumbnailUrl(this.result.thumbnail),
								path: `/pagesA/article-detail/article-detail?articleId=${this.queryParams.articleId}`,
								copyLink: this.$haloConfig.apiUrl,
								query: {}
							});
						} else {
							this.loading = 'error';
						}
					})
					.catch(err => {
						this.loading = 'error';
					})
					.finally(() => {
						uni.hideLoading();
						uni.stopPullDownRefresh();
					});
			},

			// 浮动按钮点击
			fnOnFlotButtonChange(index) {
				switch (index) {
					case 0:
						this.fnDoLikes();
						break;
					case 1:
						this.fnToComment();
						break;
					case 2:
						this.fnShowShare();
						break;
				}
			},

			fnToComment() {
				if (this.result.disallowComment) {
					return uni.$tm.toast('文章已开启禁止评论！');
				}
				this.$Router.push({
					path: '/pagesA/comment/comment',
					query: {
						id: this.result.id,
						parentId: 0,
						title: this.result.title,
						from: 'posts',
						formPage: 'comment_list',
						type: 'post'
					}
				});
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
					const _articleCover = this.$utils.checkThumbnailUrl(this.result.thumbnail, true);
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
							text: this.result.title,
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
							text: this.result.summary,
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
					await this.$refs.rCanvas
						.drawImage({
							url: this.$haloConfig.miniCodeImageUrl,
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
				// #ifdef APP-PLUS
				uni.share({
					provider: 'weixin',
					scene: 'WXSceneSession',
					type: 0,
					href: this.$haloConfig.apiUrl,
					title: this.result.title,
					summary: this.result.summary,
					imageUrl: this.poster.res.tempFilePath,
					success: function(res) {
						console.log('success:' + JSON.stringify(res));
					},
					fail: function(err) {
						console.log('fail:' + JSON.stringify(err));
					}
				});
				// #endif
			},
			fnOnShowCommentDetail(data) {
				const { postId, comment } = data;
				this.commentDetail.comment = comment;
				this.commentDetail.postId = postId;
				this.commentDetail.list = [];
				this.commentDetail.show = true;
				this.fnGetChildComments();
			},
			fnGetChildComments() {
				this.commentDetail.loading = 'loading';
				this.$httpApi
					.getPostChildrenCommentList(this.commentDetail.postId, this.commentDetail.comment.id, {})
					.then(res => {
						if (res.status == 200) {
							this.commentDetail.loading = 'success';
							this.commentDetail.list = res.data;
						} else {
							this.commentDetail.loading = 'error';
						}
						console.log('getPostChildrenCommentList', res);
					})
					.catch(err => {
						this.commentDetail.loading = 'error';
					});
			},
			fnToCate(category) {
				uni.navigateTo({
					url: `/pagesA/category-detail/category-detail?slug=${category.slug}&name=${category.name}`
				});
			},
			fnToTag(tag) {
				uni.navigateTo({
					url: `/pagesA/tag-detail/tag-detail?id=${tag.id}&slug=${tag.slug}&name=${tag.name}`
				});
			},
			async fnOnCommentLoaded(data) {
				const _list = [];
				const _handleData = list => {
					return new Promise(resolve => {
						if (list.length == 0) {
							resolve();
						} else {
							list.forEach(item => {
								_list.push(item);
								if (item.children && item.children.length != 0) {
									_handleData(item.children);
								}
								resolve();
							});
						}
					});
				};
				await _handleData(data);
				if (this.globalAppSettings.barrage.use) {
					this.$nextTick(() => {
						if (_list.length != 0) {
							_handleAddBarrage();
						}
					});
				}
				const _handleRemove = () => {
					this.$refs['barrage'] && this.$refs['barrage'].remove({
						duration: 5000, // 延迟关闭的时间
						speed: 600 // 弹幕消失的速度
					});
				};
				let index = 0;
				const _handleAddBarrage = () => {
					setTimeout(() => {
						this.$refs['barrage'] && this.$refs['barrage'].add(_list[index]);
						index += 1;
						if (index < _list.length - 1) {
							_handleAddBarrage();
						} else {
							_handleRemove();
						}
					}, 1000);
				};
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
				this.fnToWebview({ title: this.result.title, url: originalURL });
			},
			// 查看密码验证确认
			fnOnValidVisitConfirm() {
				if (this.useVisitMode == 1) {
					if (this.validVisitModal.value === this.useVisitPwd) {
						this.validVisitModal.show = false;
						return;
					}
				} else if (this.useVisitMode == 2) {
					if (this.validVisitModal.value === this.useVisitMorePwd) {
						this.showValidVisitMore = true;
						this.validVisitModal.show = false;
						return;
					}
				}
				uni.$tm.toast("验证密码不正确！")
			},
			fnOnValidVisitCancel() {
				this.validVisitModal.show = false;
				this.validVisitModal.useCancel = true;
				this.validVisitModal.value = undefined;
			},
			// 点击解锁弹出密码输入框
			fnOnShowValidVisitMore() {
				this.validVisitModal.useCancel = true;
				this.validVisitModal.value = undefined;
				this.validVisitModal.show = true;
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