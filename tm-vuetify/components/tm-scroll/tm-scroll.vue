<template>
	<view class="tm-scroll relative" :style="{width:`${width}rpx`}">
		<scroll-view scroll-anchoring @scroll="onscrollEvent" :style="{width:`${width}rpx`}" scroll-x>
			<view class="fulled  " style="white-space: nowrap;">
				<slot></slot>
			</view>
		</scroll-view>
		<view v-if="showDot" style="height: 24rpx;"></view>
		<view v-if="showDot" class="absolute tm-scroll-bar fulled flex-center">
			<view class="tm-scroll-bar-active grey-lighten-2 round-24 overflow"
				:class="[$tm.vx.state().tmVuetify.black?'bk':'']">
				<view :style="{marginLeft:`${left}px`}" class="tm-scroll-bar-active-bar round-24"
					:class="[color_tmeme]"></view>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 横向滚动
	 * @property {Number} width = [] 默认650,单位rpx,宽度
	 * @property {String} color = [] 默认primary,任意主题色名称
	 * @property {Boolean|String} show-dot = [] 默认true,是否显示指示点。
	 */
	export default {
		name: "tm-scroll",
		props: {
			width: {
				type: Number | String,
				default: 650,
			},
			color: {
				type: String,
				default: 'primary',
			},
			// 跟随主题色的改变而改变。
			fllowTheme: {
				type: Boolean | String,
				default: true
			},
			//是否显示指示点。
			showDot: {
				type: Boolean | String,
				default: true
			}
		},
		computed: {
			color_tmeme: function() {
				if (this.$tm.vx.state().tmVuetify.color !== null && this.$tm.vx.state().tmVuetify.color && this
					.fllowTheme) {
					return this.$tm.vx.state().tmVuetify.color;
				}
				return this.color;
			},
		},
		data() {
			return {
				left: 0,
				totlal_w: 0,
				totlal_L: 0,

			}
		},
		methods: {
			onscrollEvent(e) {
				// clearTimeout(this.timeid)
				let t = this;
				let dbw = uni.upx2px(100);
				let dbw_active_w = dbw * 0.4;
				let aw = uni.upx2px(t.width);
				let totlal_w = e.detail.scrollWidth - aw;
				let totlal_L = e.detail.scrollLeft;
				if (totlal_L <= 0) {
					totlal_L = 0;
				}
				if (totlal_L >= totlal_w) {
					totlal_L = totlal_w;
				}
				let bl = totlal_L / totlal_w;
				let ml = (dbw - dbw_active_w) * bl;
				t.left = ml;

			}
		}
	}
</script>

<style lang="scss" scoped>
	.tm-scroll {
		.tm-scroll-bar {
			bottom: 0;
			left: 0;

			.tm-scroll-bar-active {
				height: 10rpx;
				width: 100rpx;

				.tm-scroll-bar-active-bar {
					height: 10rpx;
					width: 40%;
				}
			}
		}
	}
</style>
