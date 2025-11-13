<template>
	<view class="card" :class="[loading]">
		<view v-if="loading !== 'success'" class="card-error" @click="fnGetData()">
			{{ loadingText }}
		</view>
		<template v-else>
			<view class="tag">豆瓣</view>
			<view class="flex w-full">
				<view v-if="posterEmpty" class="poster round-2">无封面</view>
				<image v-else class="poster round-2" :src="poster" mode="aspectFill" @error="onPosterError"></image>
				<view class="box">
					<view class="title text-overflow">{{ detail.spec.name }}</view>
					<view class="flex" style="align-items: center; margin-top: 12rpx">
						<text class="text-size-s">评分：</text>
						<tm-rate v-model="detail.spec.score / 2" color="orange" size="24" :margin="2" :num="5"></tm-rate>
						<text class="text-size-s" style="margin-left: 4rpx">{{ detail.spec.score }}</text>
					</view>

					<view class="content text-overflow-2">{{ detail.spec.cardSubtitle }}</view>
					<view class="flex flex-wrap" style="margin-left: -10rpx">
						<tm-tags color="orange" :shadow="0" size="s" model="fill">{{ types[detail.spec.type] }}</tm-tags>
						<tm-tags v-for="(gen, genIndex) in detail.spec.genres" :key="genIndex" color="light-blue" :shadow="0" size="s" model="fill">{{ gen }}</tm-tags>
					</view>
				</view>
			</view>
			<!-- 扩展内容 -->
			<view class="btn-group">
				<tm-button theme="bg-gradient-orange-accent" icon="icon-copy" :shadow="0" :dense="true" size="m" @click="copy('post')">原文地址</tm-button>
				<tm-button theme="bg-gradient-light-blue-accent" icon="icon-copy" :shadow="0" :dense="true" size="m" @click="copy('douban')">豆瓣地址</tm-button>
				<tm-button theme="bg-gradient-light-blue-accent" icon="icon-copy" :shadow="0" :dense="true" size="m" @click="copy('info')">资源信息</tm-button>
			</view>
		</template>
	</view>
</template>

<script>
import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
import tmTags from '@/tm-vuetify/components/tm-tags/tm-tags.vue';
import tmRate from '@/tm-vuetify/components/tm-rate/tm-rate.vue';

export default {
	name: 'ArticleDouban',
	components: {
		tmButton,
		tmTags,
		tmRate
	},
	props: {
		url: {
			type: String,
			default: ''
		},
		index: {
			type: Number,
			default: 0
		},
		article: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		return {
			loading: 'loading',
			loadingText: '加载中，请稍等...',
			detail: null,
			types: {
				movie: '电影',
				book: '图书',
				music: '音乐',
				game: '游戏',
				drama: '舞台剧'
			},
			poster: '',
			posterEmpty: false
		};
	},
	created() {
		this.fnGetData();
	},
	methods: {
		onPosterError() {
			if (!this.article.spec.cover) {
				this.poster = '';
				this.posterEmpty = true;
			} else {
				this.poster = this.$utils.checkImageUrl(this.article.spec.cover);
				this.posterEmpty = false;
			}
		},
		fnGetData() {
			this.loadingText = '加载中，请稍等...';
			this.loading = 'loading';
			this.$httpApi.v2
				.getDoubanDetail(this.url)
				.then((res) => {
					this.detail = res;
					this.poster = res.spec.poster;
					setTimeout(() => {
						this.loading = 'success';
					}, 200);
				})
				.catch((err) => {
					console.error(err);
					this.loading = 'error';
					this.loadingText = '豆瓣内容加载失败，点击重试';
				});
		},

		showToast(content) {
			uni.showToast({
				icon: 'none',
				title: content,
				mask: true
			});
		},
		copy(type) {
			if (type === 'post') {
				const articleUrl = this.$baseApiUrl + (this.article?.status?.permalink ?? '');
				this.$utils.copyText(articleUrl, '文章原文地址复制成功');
				return;
			}
			if (type === 'douban') {
				this.$utils.copyText(this.detail?.spec.link, '豆瓣资源地址复制成功');
				return;
			}
			if (type === 'info') {
				const content = `名称:${this.detail?.spec.name}丨其他:${this.detail?.spec.cardSubtitle}丨标签:${this.detail?.spec.genres.join('/')}丨时间:${
					this.detail?.spec.pubdate
				}丨评分:${this.detail?.spec.score}分丨链接:${this.detail?.spec.link}`;
				this.$utils.copyText(content, '资源信息复制成功');
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.w-full {
	width: 100%;
}

.wp-50 {
	width: 50%;
}

.card {
	position: relative;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	padding: 24rpx;
	border-radius: 12rpx;
	background-color: #ffff;
	overflow: hidden;
	margin-bottom: 12rpx;
	border: 1px solid #eee;

	&.error {
		padding: 0;
		border-style: dashed;
		border-color: #e88080;
		color: #e88080;
		background-color: rgba(232, 128, 128, 0.075);
	}

	&.loading {
		padding: 0;
		border-style: dashed;
		border-color: rgba(3, 174, 252, 1);
		color: rgba(3, 174, 252, 1);
		background-color: rgba(3, 174, 252, 0.075);
	}
}

.card-error {
	box-sizing: border-box;
	padding: 50rpx 24rpx;
	font-size: 24rpx;
	border-radius: 12rpx;
	text-align: center;
}
.poster {
	box-sizing: border-box;
	width: 180rpx;
	height: 220rpx;
	flex-shrink: 0;
	background-color: #eee;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
}

.box {
	flex-grow: 1;
	box-sizing: border-box;
	font-size: 26rpx;
	padding-left: 24rpx;
	overflow: hidden;
}
.title {
	box-sizing: border-box;
	font-size: 32rpx;
	font-weight: bold;
}
.content {
	box-sizing: border-box;
	margin-top: 12rpx;
	line-height: 36rpx;
	color: rgba(0, 0, 0, 0.85);
}
.tag {
	box-sizing: border-box;
	position: absolute;
	right: 0;
	top: 0;
	font-size: 24rpx;
	padding: 2rpx 12rpx;
	background-color: #f5c618;
	border-radius: 0 6rpx 0 12rpx;
}
.btn-group {
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 22rpx;
	gap: 0 22rpx;
}
</style>
