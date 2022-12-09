<template>
	<view class="journal-card mb-24  round-3 bg-white ">
		<view class="head pa-24 pb-0 flex flex-between">
			<view class="left flex">
				<cache-image
					class="avatar rounded"
					radius="50%"
					width="70rpx"
					height="70rpx"
					:url="bloggerInfo.avatar"
					:fileMd5="bloggerInfo.avatar"
					mode="scaleToFill"
				></cache-image>
				<view class="info pl-16 flex flex-col">
					<view class="nickname text-weight-b text-grey-darken-4">{{ bloggerInfo.nickname }}</view>
					<view class="mt-3 time text-size-m ">{{ $tm.dayjs(journal.createTime).format('YYYY-MM-DD HH:mm:ss') }}</view>
				</view>
			</view>
			<view class="right">
				<tm-button v-if="useLike" :shadow="0" theme="light-blue" size="s" @click="fnLike(journal)">点赞({{ journal.likes }})</tm-button>
				<tm-button v-if="useEdit" :shadow="0" theme="light-blue" size="s" @click="$emit('on-edit', journal)">编辑</tm-button>
				<tm-button v-if="useDel" :shadow="0" theme="red" size="s" @click="fnDel(journal)">删除</tm-button>
			</view>
		</view>
		<tm-more v-if="journal.content.length > 50" :maxHeight="100" label="查看全部内容" open-label="隐藏部分内容">
			<mp-html
				class="evan-markdown"
				lazy-load
				:domain="markdownConfig.domain"
				:loading-img="markdownConfig.loadingGif"
				:scroll-table="true"
				:selectable="true"
				:tag-style="markdownConfig.tagStyle"
				:container-style="markdownConfig.containStyle"
				:content="journal.content"
				:markdown="true"
				:showLineNumber="true"
				:showLanguageName="true"
				:copyByLongPress="true"
			/>
		</tm-more>
		<mp-html
			v-else
			class="evan-markdown"
			lazy-load
			:domain="markdownConfig.domain"
			:loading-img="markdownConfig.loadingGif"
			:scroll-table="true"
			:selectable="true"
			:tag-style="markdownConfig.tagStyle"
			:container-style="markdownConfig.containStyle"
			:content="journal.content"
			:markdown="true"
			:showLineNumber="true"
			:showLanguageName="true"
			:copyByLongPress="true"
		/>
	</view>
</template>

<script>
import MarkdownConfig from '@/common/markdown/markdown.config.js';
import mpHtml from '@/components/mp-html/components/mp-html/mp-html.vue';
import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
import tmMore from '@/tm-vuetify/components/tm-more/tm-more.vue';
export default {
	name: 'journal-card',
	components: { mpHtml, tmButton, tmMore },
	props: {
		isAdmin: {
			type: Boolean,
			default: false
		},
		journal: {
			type: Object,
			default: () => {}
		},
		useLike: {
			type: Boolean,
			default: false
		},
		useEdit: {
			type: Boolean,
			default: false
		},
		useDel: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			markdownConfig: MarkdownConfig
		};
	},
	computed: {
		// 获取博主信息
		bloggerInfo() {
			let blogger = this.$tm.vx.getters().getBlogger;
			blogger.avatar = this.$utils.checkAvatarUrl(blogger.avatar, true);
			return blogger;
		}
	},
	methods: {
		fnLike(journal) {
			uni.showLoading({
				mask: true,
				title: '正在点赞中...'
			});
			this.$httpApi
				.postJournalLikes(journal.id)
				.then(res => {
					if (res.status == 200) {
						journal.likes += 1;
						uni.$tm.toast('o(￣▽￣)ｄ点赞成功！');
					} else {
						uni.$tm.toast('Ծ‸Ծ点赞失败了~');
					}
				})
				.catch(err => {
					uni.$tm.toast('Ծ‸Ծ点赞失败了~');
				});
		},

		fnDel(journal) {
			uni.$eShowModal({
				title: '提示',
				content: '您确定要删除该日记吗？',
				showCancel: true,
				cancelText: '否',
				cancelColor: '#999999',
				confirmText: '是',
				confirmColor: '#03a9f4'
			})
				.then(res => {
					this.$httpApi.admin
						.deleteJournalsById(journal.id)
						.then(res => {
							if (res.status == 200) {
								this.$emit('on-del', journal);
								uni.$tm.toast('删除成功！');
							} else {
								uni.$tm.toast('Ծ‸Ծ删除失败~');
							}
						})
						.catch(err => {
							uni.$tm.toast('Ծ‸Ծ删除失败~');
						});
				})
				.catch(() => {});
		}
	}
};
</script>

<style scoped lang="scss">
.journal-card {
	box-sizing: border-box;
	box-shadow: 0rpx 2rpx 24rpx rgba(0, 0, 0, 0.05);
	overflow: hidden;
	.avatar {
		width: 70rpx;
		height: 70rpx;
		border: 6rpx solid #fff;
		box-shadow: 0rpx 0rpx 24rpx rgba(0, 0, 0, 0.05);
	}
	.info {
		justify-content: center;
		.nickname {
			font-size: 30rpx;
		}
		.time {
			font-size: 26rpx;
		}
	}
}
</style>
