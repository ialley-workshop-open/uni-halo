<template>
	<view class="app-page bg-gradient-blue-lighten-b">
		<!-- 流星-->
		<view class="tn-satr">
			<view class="sky"></view>
			<view class="stars">
				<view class="falling-stars">
					<view class="star-fall"></view>
					<view class="star-fall"></view>
					<view class="star-fall"></view>
					<view class="star-fall"></view>
				</view>
				<view class="small-stars">
					<view class="star"></view>
					<view class="star"></view>
					<view class="star"></view>
					<view class="star"></view>
					<view class="star"></view>
					<view class="star"></view>
					<view class="star"></view>
					<view class="star"></view>
					<view class="star"></view>
					<view class="star"></view>
					<view class="star"></view>
					<view class="star"></view>
				</view>
				<view class="medium-stars">
					<view class="star"></view>
					<view class="star"></view>
					<view class="star"></view>
					<view class="star"></view>
					<view class="star"></view>
					<view class="star"></view>
					<view class="star"></view>
					<view class="star"></view>
					<view class="star"></view>
					<view class="star"></view>
					<view class="star"></view>
					<view class="star"></view>
				</view>
			</view>
		</view>

		<!-- 头像用户信息 -->
		<view class="user-info__container flex flex-col flex-center">
			<image class="user-info__avatar" src="https://blog-oss.925i.cn/blog-files/d500acd35e8b6d24bbfa2dabd2a605e6.png" mode="aspectFill"></image>
			<view class="user-info__nick-name">「 uni-halo 」</view>
		</view>

		<view class="text-align-center text-white" style="padding: 60vh 0 0 0;">
			<view class="" style="font-size: 44rpx;">全新UI，准备出发</view>
			<view class="mt-30 text-size-m">新触动 新感受 新体验</view>
		</view>

		<view class="" style="padding: 120rpx 200rpx;z-index: 999;position: relative;"><view class="start-btn" @click="fnStart()">全新出发</view></view>

		<!-- 波浪效果 -->
		<wave></wave>
	</view>
</template>

<script>
import wave from '@/components/wave/wave.vue';
export default {
	components: { wave },
	methods: {
		fnStart() {
			uni.switchTab({
				url: '/pages/tabbar/home/home',
				success: () => {
					uni.setStorageSync('APP_HAS_STARTED', true);
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.app-page {
	width: 100vw;
	height: 100vh;
}
.start-btn {
	box-sizing: border-box;
	background-color: transparent;
	padding: 16rpx 50rpx;
	border-radius: 50rpx;
	border: 2rpx solid #ffffff;
	color: #ffffff;
	text-align: center;
	font-size: 28rpx;
}

/* 用户信息 start */
.user-info {
	&__container {
		position: absolute;
		top: 25vh;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
	}

	&__avatar {
		width: 200rpx;
		height: 200rpx;
		border: 8rpx solid rgba(255, 255, 255, 0.05);
		border-radius: 50%;
		overflow: hidden;
		box-shadow: 0rpx 0rpx 80rpx 0rpx rgba(0, 0, 0, 0.15);
	}

	&__nick-name {
		color: #ffffff;
		margin-top: 26rpx;
		font-size: 36rpx;
		font-weight: 600;
		text-align: center;
	}
}
/* 用户信息 end */

/* 流星*/
.tn-satr {
	position: fixed;
	width: 100%;
	height: 600px;
	overflow: hidden;
	flex-shrink: 0;
	z-index: 998;
}

.stars {
	position: absolute;
	z-index: 1;
	width: 100%;
	height: 400px;
}

.star {
	border-radius: 50%;
	background: #ffffff;
	box-shadow: 0px 0px 6px 0px rgba(255, 255, 255, 0.8);
}

.small-stars .star {
	position: absolute;
	width: 3px;
	height: 3px;
}
.small-stars .star:nth-child(2n) {
	opacity: 0;
	-webkit-animation: star-blink 1.2s linear infinite alternate;
	animation: star-blink 1.2s linear infinite alternate;
}
.small-stars .star:nth-child(1) {
	left: 40px;
	bottom: 50px;
}
.small-stars .star:nth-child(2) {
	left: 200px;
	bottom: 40px;
}
.small-stars .star:nth-child(3) {
	left: 60px;
	bottom: 120px;
}
.small-stars .star:nth-child(4) {
	left: 140px;
	bottom: 250px;
}
.small-stars .star:nth-child(5) {
	left: 400px;
	bottom: 300px;
}
.small-stars .star:nth-child(6) {
	left: 170px;
	bottom: 80px;
}
.small-stars .star:nth-child(7) {
	left: 200px;
	bottom: 360px;
	-webkit-animation-delay: 0.2s;
	animation-delay: 0.2s;
}
.small-stars .star:nth-child(8) {
	left: 250px;
	bottom: 320px;
}
.small-stars .star:nth-child(9) {
	left: 300px;
	bottom: 340px;
}
.small-stars .star:nth-child(10) {
	left: 130px;
	bottom: 320px;
	-webkit-animation-delay: 0.5s;
	animation-delay: 0.5s;
}
.small-stars .star:nth-child(11) {
	left: 230px;
	bottom: 330px;
	-webkit-animation-delay: 7s;
	animation-delay: 7s;
}
.small-stars .star:nth-child(12) {
	left: 300px;
	bottom: 360px;
	-webkit-animation-delay: 0.3s;
	animation-delay: 0.3s;
}
@-webkit-keyframes star-blink {
	50% {
		width: 3px;
		height: 3px;
		opacity: 1;
	}
}
@keyframes star-blink {
	50% {
		width: 3px;
		height: 3px;
		opacity: 1;
	}
}
.medium-stars .star {
	position: absolute;
	width: 3px;
	height: 3px;
	opacity: 0;
	-webkit-animation: star-blink 1.2s ease-in infinite alternate;
	animation: star-blink 1.2s ease-in infinite alternate;
}
.medium-stars .star:nth-child(1) {
	left: 300px;
	bottom: 50px;
}
.medium-stars .star:nth-child(2) {
	left: 400px;
	bottom: 40px;
	-webkit-animation-delay: 0.4s;
	animation-delay: 0.4s;
}
.medium-stars .star:nth-child(3) {
	left: 330px;
	bottom: 300px;
	-webkit-animation-delay: 0.2s;
	animation-delay: 0.2s;
}
.medium-stars .star:nth-child(4) {
	left: 460px;
	bottom: 300px;
	-webkit-animation-delay: 0.9s;
	animation-delay: 0.9s;
}
.medium-stars .star:nth-child(5) {
	left: 300px;
	bottom: 150px;
	-webkit-animation-delay: 1.2s;
	animation-delay: 1.2s;
}
.medium-stars .star:nth-child(6) {
	left: 440px;
	bottom: 120px;
	-webkit-animation-delay: 1s;
	animation-delay: 1s;
}
.medium-stars .star:nth-child(7) {
	left: 200px;
	bottom: 140px;
	-webkit-animation-delay: 0.8s;
	animation-delay: 0.8s;
}
.medium-stars .star:nth-child(8) {
	left: 30px;
	bottom: 480px;
	-webkit-animation-delay: 0.3s;
	animation-delay: 0.3s;
}
.medium-stars .star:nth-child(9) {
	left: 460px;
	bottom: 400px;
	-webkit-animation-delay: 1.2s;
	animation-delay: 1.2s;
}
.medium-stars .star:nth-child(10) {
	left: 150px;
	bottom: 10px;
	-webkit-animation-delay: 1s;
	animation-delay: 1s;
}
.medium-stars .star:nth-child(11) {
	left: 420px;
	bottom: 450px;
	-webkit-animation-delay: 1.2s;
	animation-delay: 1.2s;
}
.medium-stars .star:nth-child(12) {
	left: 340px;
	bottom: 180px;
	-webkit-animation-delay: 1.1s;
	animation-delay: 1.1s;
}
@keyframes star-blink {
	50% {
		width: 4px;
		height: 4px;
		opacity: 1;
	}
}
.star-fall {
	position: relative;
	border-radius: 2px;
	width: 80px;
	height: 2px;
	overflow: hidden;
	-webkit-transform: rotate(-20deg);
	transform: rotate(-20deg);
}
.star-fall:after {
	content: '';
	position: absolute;
	width: 50px;
	height: 2px;
	background: -webkit-gradient(linear, right top, left top, from(rgba(0, 0, 0, 0)), to(rgba(255, 255, 255, 0.4)));
	background: linear-gradient(to left, rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0.4) 100%);
	left: 100%;
	-webkit-animation: star-fall 3.6s linear infinite;
	animation: star-fall 3.6s linear infinite;
}

.star-fall:nth-child(1) {
	left: 80px;
	bottom: -100px;
}
.star-fall:nth-child(1):after {
	-webkit-animation-delay: 2.4s;
	animation-delay: 2.4s;
}

.star-fall:nth-child(2) {
	left: 200px;
	bottom: -200px;
}
.star-fall:nth-child(2):after {
	-webkit-animation-delay: 2s;
	animation-delay: 2s;
}

.star-fall:nth-child(3) {
	left: 430px;
	bottom: -50px;
}
.star-fall:nth-child(3):after {
	-webkit-animation-delay: 3.6s;
	animation-delay: 3.6s;
}

.star-fall:nth-child(4) {
	left: 400px;
	bottom: 100px;
}
.star-fall:nth-child(4):after {
	-webkit-animation-delay: 0.2s;
	animation-delay: 0.2s;
}

@-webkit-keyframes star-fall {
	20% {
		left: -100%;
	}
	100% {
		left: -100%;
	}
}

@keyframes star-fall {
	20% {
		left: -100%;
	}
	100% {
		left: -100%;
	}
}
</style>
