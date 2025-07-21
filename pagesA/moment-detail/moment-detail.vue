<template>
	<view class="app-page">
		<view v-if="loading !== 'success'" class="loading-wrap">
			<tm-skeleton model="card"></tm-skeleton>
			<tm-skeleton model="card"></tm-skeleton>
			<tm-skeleton model="card"></tm-skeleton>
		</view>
		<block v-else>
			<view class="moment-card">
				<view class="card flex flex-start">
					<view class="avatar" style="flex-shrink: 0;">
						<image style="width: 80rpx;height: 80rpx;border-radius: 50%;" :src="moment.spec.user.avatar" />
					</view>
					<view class="nickname" style="margin-left: 12rpx;">
						<view style="font-size: 30rpx;font-weight: bold;color: #333333;">
							{{ moment.spec.user.displayName }}
						</view>
						<view style="margin-top: 6rpx;font-size: 24rpx;color: #666;">
							{{ {d: moment.spec.releaseTime, f: 'yyyy年MM月dd日 星期w'} | formatTime }}
						</view>
					</view>
				</view>

				<view v-if="moment.spec.tags && moment.spec.tags.length!==0" class="card flex flex-wrap flex-start"
					style="padding-top:12rpx;padding-bottom:12rpx;">
					<text class="text-size-m">标签列表：</text>
					<tm-tags v-for="(tag,tagIndex) in moment.spec.tags" :key="tagIndex" :color="randomTagColor()"
						size="m" model="text">
						{{ tag }}
					</tm-tags>
				</view>

				<view class="card" style="padding:0">
					<mp-html class="evan-markdown" lazy-load :domain="markdownConfig.domain"
						:loading-img="markdownConfig.loadingGif" :scroll-table="true" :selectable="true"
						:tag-style="markdownConfig.tagStyle" :container-style="markdownConfig.containStyle"
						:content="moment.spec.newHtml" :markdown="true" :showLineNumber="true" :showLanguageName="true"
						:copyByLongPress="true" />
				</view>
				<view v-if="moment.images && moment.images.length!==0" class="card">
					<view class="card-head text-size-m">
						图片附件：
					</view>
					<view class="images" :class="['images-'+moment.images.length]">
						<view class="image-item" v-for="(image,mediumIndex) in moment.images" :key="mediumIndex">
							<image mode="aspectFill" style="width: 100%;height: 100%;border-radius: 6rpx;"
								:src="image.url" @click="handlePreview(mediumIndex,moment.images)" />
						</view>
					</view>
				</view>

				<view v-if="moment.audios && moment.audios.length!==0" class="card">
					<view class="card-head text-size-m">
						音频附件：
					</view>
					<view
						style="display: flex; flex-direction: column; gap: 12rpx 0;padding: 0 24rpx;padding-right:28rpx;">
						<audio v-for="(audio,index) in moment.audios" :controls="true" :key="index" :id="audio.url"
							:poster="bloggerInfo.avatar"
							:name="'来自' + (startConfig.title||bloggerInfo.nickname) + '的声音'"
							:author="bloggerInfo.nickname" :src="audio.url"></audio>
					</view>
				</view>
				<view v-if="moment.videos && moment.videos.length!==0" class="card">
					<view class="card-head text-size-m">
						视频附件：
					</view>
					<view style="margin-top:24rpx;width:100%;display: flex; flex-direction: column; gap: 12rpx 0;">
						<video style="width:100%;height: 400rpx;border-radius: 12rpx;"
							v-for="(video,index) in moment.videos" :key="index" :src="video.url"
							:id="'video_' + video.id" :show-mute-btn="true" :controls="true"
							:show-center-play-btn="true" :enable-progress-gesture="true" @play="onVideoPlay(video.id)"
							@pause="onVideoPause(video.id)" @ended="onVideoEnded(video.id)"></video>
					</view>
				</view>

			</view>

			<!-- 返回顶部 -->
			<tm-flotbutton :width="90" :offset="[16, 80]" icon="icon-angle-up" color="bg-gradient-light-blue-accent"
				@click="fnToTopPage()"></tm-flotbutton>
		</block>
	</view>
</template>

<script>
	import MarkdownConfig from '@/common/markdown/markdown.config.js';

	import tmSkeleton from '@/tm-vuetify/components/tm-skeleton/tm-skeleton.vue';
	import tmFlotbutton from '@/tm-vuetify/components/tm-flotbutton/tm-flotbutton.vue';
	import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
	import tmEmpty from '@/tm-vuetify/components/tm-empty/tm-empty.vue';
	import tmTags from '@/tm-vuetify/components/tm-tags/tm-tags.vue';

	import mpHtml from '@/components/mp-html/components/mp-html/mp-html.vue';
	import {
		getAppConfigs
	} from '@/config/index.js'
	import HaloTokenConfig from "@/config/uhalo.config";
	import {
		getRandomNumberByRange
	} from "@/utils/random.js";
	import {
		generateUUID
	} from '@/utils/uuid.js';

	export default {
		components: {
			tmSkeleton,
			tmFlotbutton,
			tmButton,
			tmEmpty,
			mpHtml,
			tmTags
		},
		data() {
			return {
				loading: 'loading',
				markdownConfig: MarkdownConfig,
				queryParams: {
					name: null
				},
				moment: null,
				videoContexts: {},
				currentVideoId: null
			};
		},
		computed: {
			haloConfigs() {
				return this.$tm.vx.getters().getConfigs;
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
			calcUseTagRandomColor() {
				return this.haloConfigs.pageConfig.momentConfig.useTagRandomColor;
			},
		},
		onLoad(e) {
			this.fnSetPageTitle('瞬间加载中...');
			this.queryParams.name = e.name;
			this.fnGetData();
		},
		onPullDownRefresh() {
			this.videoContexts = {};
			this.currentVideoId = null;
			this.fnGetData();
		},
		onShareAppMessage() {
			return {
				path: '/pagesA/moment-detail/moment-detail?name=' + this.moment.metadata.name,
				title: this.moment.spec.title,
			}
		},
		onShareTimeline() {
			return {
				title: this.moment.spec.title,
				query: {
					name: this.moment.metadata.name
				}
			}
		},
		methods: {
			fnGetData() {
				this.loading = 'loading';
				this.$httpApi.v2
					.getMomentByName(this.queryParams.name)
					.then(res => {
						console.log('获取详情', res);
						let _tempResult = res;
						this.fnSetPageTitle('瞬间详情');

						_tempResult.spec.user = {
							displayName: this.bloggerInfo.nickname,
							avatar: this.$utils.checkAvatarUrl(this.bloggerInfo.avatar)
						}
						_tempResult.spec.content.medium.map(medium => {
							medium.url = this.$utils.checkThumbnailUrl(medium.url, true)
						})

						_tempResult.spec.newHtml = this.removeTagLinksCompletely(_tempResult.spec.content.html, '')
						_tempResult['images'] = _tempResult.spec.content.medium
							.filter(x => x.type === 'PHOTO')

						_tempResult['videos'] = _tempResult.spec.content.medium
							.filter(x => x.type === 'VIDEO').map(_tempResult => {
								_tempResult.id = generateUUID()
								return _tempResult;
							})

						_tempResult['audios'] = _tempResult.spec.content.medium
							.filter(x => x.type === 'AUDIO')

						this.moment = _tempResult;
						this.loading = 'success';

						this.$nextTick(() => {
							this.createVideoContexts(_tempResult.videos);
						})
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
			handlePreview(index, list) {
				uni.previewImage({
					current: index,
					urls: list.map(item => item.url)
				})
			},
			removeTagLinksCompletely(htmlString) {
				const regex = /<a\s+(?:[^>]*?\s+)?class=(['"])[^'"]*?\btag\b[^'"]*?\1[^>]*?>.*?<\/a>/gi;
				const newHtml = htmlString.replace(regex, '');
				return newHtml
			},
			randomTagColor() {
				if (!this.calcUseTagRandomColor) return "blue";
				const randomIndex = getRandomNumberByRange(0, this.tagColors.length);
				return this.tagColors[randomIndex];
			},
			createVideoContexts(videos) {
				this.stopAllVideos()
				videos.forEach(item => {
					this.videoContexts[item.id] = uni.createVideoContext(`video_${item.id}`, this);
				})
			},
			onVideoPlay(videoId) {
				this.currentVideoId = videoId;
				this.stopAllVideos(videoId)
			},
			onVideoPause(videoId) {
				if (this.currentVideoId == videoId) {
					this.currentVideoId = null;
				}
			},
			onVideoEnded(videoId) {
				this.currentVideoId = null;
			},
			stopAllVideos(excludesVideoId = null) {
				Object.keys(this.videoContexts).forEach(videoId => {
					if (!excludesVideoId || excludesVideoId != videoId) {
						const videoContext = this.videoContexts[videoId]
						videoContext?.pause();
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
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #fafafd;
		padding-bottom: 24rpx;
	}

	.loading-wrap {
		padding: 0 24rpx;
		height: inherit;
		background-color: #fff;
	}

	.moment-card {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		gap: 24rpx;
		padding: 24rpx;
	}

	.card {
		width: 100%;
		box-sizing: border-box;
		border-radius: 12rpx;
		background-color: #ffff;
		box-shadow: 0rpx 2rpx 24rpx rgba(0, 0, 0, 0.03);
		overflow: hidden;
		padding: 24rpx;

		&-head {
			position: relative;
			// padding-left: 24rpx;
			margin-bottom: 6rpx;

			&:before {
				display: none;
				box-sizing: border-box;
				content: "";
				width: 6rpx;
				height: 24rpx;
				border-radius: 24rpx;
				background: #2196F3;
				position: absolute;
				left: 0;
				top: 6rpx;
				overflow: hidden;
			}
		}
	}


	.images {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		padding: 24rpx;

		.image-item {
			box-sizing: border-box;
			border-radius: 24rpx;
			padding: 6rpx;
			width: 33%;
			height: 200rpx
		}

		&-1 {
			>.image-item {
				width: 100%;
				height: 350rpx
			}
		}

		&-2 {
			>.image-item {
				width: 50%;
				height: 250rpx
			}
		}
	}

	::v-deep .uni-audio-default {
		width: 100%;
		border-radius: 12rpx;
	}
</style>