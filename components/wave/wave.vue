<template>
	<view class="wave-wrap waveAnimation">
		<view class="waveWrapperInner bgTop"><view class="wave waveTop"></view></view>
		<view class="waveWrapperInner bgMiddle"><view class="wave waveMiddle"></view></view>
		<view class="waveWrapperInner bgBottom"><view class="wave waveBottom"></view></view>
	</view>
</template>

<script>
export default {
	name: 'wave',
	props: {
		height: {
			type: String,
			default: '35rpx'
		}
	}
};
</script>

<style lang="scss" scoped>
.wave-wrap {
	overflow: hidden;
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	top: 0;
	margin: auto;
}
.waveWrapperInner {
	position: absolute;
	width: 100%;
	overflow: hidden;
	height: 100%;
}
.wave {
	position: absolute;
	left: 0;
	width: 200%;
	height: 100%;
	background-repeat: repeat no-repeat;
	background-position: 0 bottom;
	transform-origin: center bottom;
}

.bgTop {
	opacity: 0.4;
}
.waveTop {
	background-size: 50% 45px;
	background-image: url('~@/static/wave/wave-1.png');
}
.waveAnimation .waveTop {
	animation: move_wave 4s linear infinite;
}
@keyframes move_wave {
	0% {
		transform: translateX(0) translateZ(0) scaleY(1);
	}
	50% {
		transform: translateX(-25%) translateZ(0) scaleY(1);
	}
	100% {
		transform: translateX(-50%) translateZ(0) scaleY(1);
	}
}
.bgMiddle {
	opacity: 0.6;
}
.waveMiddle {
	background-size: 50% 40px;
	background-image: url('~@/static/wave/wave-2.png');
}
.waveAnimation .waveMiddle {
	animation: move_wave 3.5s linear infinite;
}

.bgBottom {
	opacity: 0.95;
}
.waveBottom {
	background-size: 50% 35px;
	background-image: url('~@/static/wave/wave-1.png');
}
.waveAnimation .waveBottom {
	animation: move_wave 2s linear infinite;
}
</style>
