<template>
	<view class="scroll-btn" :style="{ bottom: bottom }" @click.stop="fnScroll()">
		<text v-if="_scrollTop >= 180" class="iconfont icon-long-arrow-up"></text>
		<text v-else class="iconfont icon-long-arrow-down"></text>
	</view>
</template>

<script>
import throttle from '@/utils/throttle.js';
export default {
	name: 'scroll-btn',
	props: {
		bottom: {
			type: String,
			default: '180rpx'
		},
		scrollTop: {
			type: Number,
			default: 0
		}
	},
	data() {
		return { timer: null, _scrollTop: 0 };
	},
	watch: {
		scrollTop(val) {
			this._scrollTop = val;
			this.$forceUpdate();
		}
	},
	created() {
		this._scrollTop = this.scrollTop;
	},
	methods: {
		fnScroll() {
			throttle(() => {
				this.$emit('on-status', false);
				const isTop = this._scrollTop >= 180;
				this._scrollTop = isTop ? 0 : 999999999999;
				uni.pageScrollTo({
					duration: 500,
					scrollTop: this._scrollTop,
					success: () => {
						clearTimeout(this.timer);
						this.timer = setTimeout(() => {
							this.$emit('on-status', true);
						}, 500);
					}
				});
				this.$emit('update:scrollTop', this._scrollTop);
			});
		}
	}
};
</script>

<style scoped lang="scss">
.scroll-btn {
	position: fixed;
	// bottom: 200rpx;
	// right: -90rpx;
	right: 52rpx;
	width: 80rpx;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	border-radius: 50%;
	border: 4rpx solid #ffffff;
	background-color: #bfe9ef;
	box-shadow: 0rpx 4rpx 24rpx rgba(0, 0, 0, 0.1);
	z-index: 99;
	transition: right 0.5s ease-in-out;

	&.is-show {
		right: 52rpx;
	}

	.iconfont {
		font-size: 36rpx;
		color: #555;
	}
}
</style>
