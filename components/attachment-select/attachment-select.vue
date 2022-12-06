<template>
	<tm-poup v-model="show" position="bottom" height="auto" @change="fnClose">
		<view class="poup-head pa-24 text-align-center text-weight-b ">{{ title }}</view>
		<view class="poup-body pa-24 pt-0 pb-0">
			<view v-if="loading != 'success'" class="loading-wrap flex flex-center">
				<view v-if="loading == 'loading'" class="loading">加载中...</view>
				<view v-else class="error" @click="fnGetData()">加载失败，点击刷新！</view>
			</view>
			<block v-else>
				<view v-if="total == 0" class="empty">无附件</view>
				<scroll-view v-else class="poup-content" :enable-flex="true" :scroll-y="true" @touchmove.stop>
					<view class="card-content">
						<view class="card pa-12" v-for="(file, index) in dataList" :key="index" @click="fnOnSelect(file, index)">
							<view class="card-inner round-3" :class="{ 'is-select': selectIndex == index }">
								<cache-image v-if="file.isImage" class="cover" height="160rpx" :url="file.thumbPath" :fileMd5="file.thumbPath" mode="aspectFill"></cache-image>
								<view v-else class="cover flex pl-46 pr-46 flex-center bg-gradient-blue-grey-accent text-align-center text-size-m">{{ file.mediaType }}</view>

								<view class="name text-overflow text-size-m pa-12">{{ file.name }}</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</block>
		</view>
		<view class="poup-foot pa-30 pb-12 pt-0">
			<!-- 分页 -->
			<view v-if="total > queryParams.size" class="mt-36 pl-24 pr-24">
				<tm-pagination color="bg-gradient-blue-accent" :page.sync="queryParams.page" :total="total" :totalVisible="5" @change="fnGetPagingData"></tm-pagination>
			</view>
			<view class=" flex flex-center mt-12">
				<tm-button size="m" theme="bg-gradient-blue-accent" @click="fnSava()">确定选用</tm-button>
				<tm-button size="m" theme="bg-gradient-orange-accent" @click="fnUpload()">上传</tm-button>
				<tm-button size="m" theme="bg-gradient-blue-grey-accent" @click="fnClose(false)">关 闭</tm-button>
			</view>
		</view>
	</tm-poup>
</template>

<script>
import { getAdminAccessToken } from '@/utils/auth.js';

import tmPoup from '@/tm-vuetify/components/tm-poup/tm-poup.vue';
import tmPagination from '@/tm-vuetify/components/tm-pagination/tm-pagination.vue';
import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
export default {
	name: 'attachment-select',
	components: { tmPoup, tmPagination, tmButton },
	props: {
		title: {
			type: String,
			default: '附件列表'
		},
		selectType: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			show: true,
			loading: 'loading',
			total: 0,
			queryParams: {
				size: 6,
				page: 1
			},
			dataList: [],
			select: null,
			selectIndex: -1
		};
	},
	created() {
		this.fnGetData();
	},
	methods: {
		fnGetData() {
			this.queryParams.page = 1;
			this.fnGetPagingData(1);
		},
		fnGetPagingData(page) {
			this.loading = 'loading';
			const _params = {
				...this.queryParams
			};
			_params.page = page - 1;
			this.$httpApi.admin
				.getAttachmentsByPage(_params)
				.then(res => {
					if (res.status == 200) {
						this.total = res.data.total;
						this.dataList = res.data.content.map(file => {
							if (this.$utils.fnCheckIsFileType('image', file) && file.size / 1024 / 1024 > 2) {
								file.isImage = false;
								file.desc = '图片过大无法显示缩略图';
							} else {
								file.isImage = this.$utils.fnCheckIsFileType('image', file);
							}
							file.thumbPath = this.$utils.checkThumbnailUrl(file.thumbPath);
							return file;
						});
						this.loading = 'success';
					} else {
						uni.$tm.toast('加载失败，请重试！');
						this.loading = 'error';
					}
				})
				.catch(err => {
					console.error(err);
					uni.$tm.toast('加载失败，请重试！');
					this.loading = 'error';
				});
		},
		fnOnSelect(file, index) {
			this.select = file;
			this.selectIndex = index;
		},
		fnSava() {
			if (this.selectType) {
				if (this.$utils.fnCheckIsFileType(this.selectType, this.select)) {
					this.$emit('on-select', this.select);
				} else {
					uni.$tm.toast('该附件类型不符合！');
				}
			} else {
				this.$emit('on-select', this.select);
			}
		},
		fnClose(e) {
			if (!e) {
				this.$emit('on-close');
			}
		},
		fnUpload() {
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
								uni.$tm.toast('上传成功！');
								this.fnGetData(1);
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
		}
	}
};
</script>

<style scoped lang="scss">
.poup-head {
}
.poup-body {
	height: 50vh;
}
.loading-wrap {
	height: 50vh;
	background-color: #fafafa;
}
.poup-content {
	height: inherit;
	box-sizing: border-box;
	.card-content {
		height: inherit;
		display: flex;
		flex-wrap: wrap;
	}
}
.card {
	width: 50%;
	box-sizing: border-box;
	&-inner {
		box-sizing: border-box;
		overflow: hidden;
		box-shadow: 0rpx 4rpx 24rpx rgba(0, 0, 0, 0.05);
		border: 4rpx solid transparent;
		&.is-select {
			border-color: rgb(13, 141, 242);
		}
	}
	.cover {
		width: 100%;
		height: 160rpx;
		flex-wrap: wrap;
		box-sizing: border-box;
	}
	.name {
		color: #303133;
		box-sizing: border-box;
		text-align: center;
	}
}
</style>
