<template>
	<view class="category-mini-card">
		<!-- 	<image class="img" lazy-load :src="$utils.checkThumbnailUrl(category.thumbnail)" mode="aspectFill"></image> -->
		<cache-image
			class="img"
			height="120rpx"
			:url="$utils.checkThumbnailUrl(category.thumbnail)"
			:fileMd5="$utils.checkThumbnailUrl(category.thumbnail)"
			mode="aspectFill"
		></cache-image>

		<text class="label">{{ category.postCount }}&nbsp;篇</text>
		<view class="name">{{ category.name }}</view>
	</view>
</template>

<script>
export default {
	name: 'category-mini-card',
	props: {
		category: {
			type: Object,
			default: () => {}
		}
	}
};
</script>

<style scoped lang="scss">
.category-mini-card {
	display: inline-block;
	width: 260rpx;
	height: 180rpx;
	position: relative;
	border-radius: 12rpx;
	background-color: #fff;
	overflow: hidden;
	// border: 2rpx solid #f7f7f7;
	box-shadow: 0rpx 2rpx 24rpx rgba(0, 0, 0, 0.03);
	.img {
		width: 100%;
		height: 120rpx;
		border: 6rpx 6rpx 0 0;
	}
	.label {
		position: absolute;
		left: 0;
		top: 86rpx;
		color: #03a9f4;
		font-size: 24rpx;
		background-color: rgba(255, 255, 255, 1);
		border-radius: 0rpx 24rpx 0 0;
		display: flex;
		padding: 2rpx 12rpx;
		padding-right: 24rpx;
	}
	.name {
		font-size: 24rpx;
		text-align: center;
		color: var(--main-text-color);
	}
}
</style>
