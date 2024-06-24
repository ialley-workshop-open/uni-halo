<template>
	<view class="category-mini-card">
		<cache-image class="img" height="180rpx" :url="$utils.checkThumbnailUrl(category.spec.cover,false)"
			:fileMd5="$utils.checkThumbnailUrl(category.spec.cover)" mode="aspectFill"></cache-image>
		<view class="content">
			<view class="name">{{ category.spec.displayName }}</view>
			<text class="label">共 {{ category.postCount }} 篇</text>
		</view>
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
		box-shadow: 0rpx 2rpx 24rpx rgba(0, 0, 0, 0.03);
		position: relative;
		text-align: center;
		color: #ffffff;

		&:before {
			content: '';
			position: absolute;
			z-index: 1;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.5);
			backdrop-filter: blur(3rpx);
		}

		.content {
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			z-index: 3;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}

		.img {
			width: 100%;
			height: 100%;

		}

		.name {
			font-weight: bold;
			font-size: 30rpx;
		}

		.label {
			font-size: 24rpx;
			margin-top: 6rpx;
		}
	}
</style>