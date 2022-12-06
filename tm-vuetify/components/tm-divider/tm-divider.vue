<template>
	<view class="tm-divider ">
		<view class="flex-center tm-divider-wk" :class="[
		vertical?' flex-col flexVer ':'',setpsClass
	]" >
			<view :style="{
				borderBottomStyle:model,
				height:vertical?height/2+'px':'1rpx',
				width:vertical?'1rpx':'50%',
			 }" class="tm-divider-left" :class="[vertical?color_tmeme:`border-${color_tmeme}-b-1`]">
			</view>
			<view v-if="text" :class="[
				vertical?'py-20':'px-20'
			]" class="tm-divider-text  text-size-xs" :style="{color:'grey'}">{{text}}</view>
			<!-- 点位符。 -->
			<text v-if="!text"></text>
			<view :style="{
				borderBottomStyle:model,
				height:vertical?(height/2+'px'):'1rpx',
				width:vertical?'1rpx':'50%',
				
			 }" class="tm-divider-right" :class="[vertical?color_tmeme:`border-${color_tmeme}-b-1`]"></view>
		</view>
	</view>
</template>

<script>
	/**
	 * 分割线
	 * @property {String} text = [] 默认：'',显示的文本。
	 * @property {String} color = [] 默认：'#eeeeee',线的颜色16进制或者rgb,rgba
	 * @property {Number} height = [] 默认：0, 竖向高度时，起作用。
	 * @property {Boolean} vertical = [] 默认：false， 是否竖向
	 * @property {String} model = [solid|dashed|dotted] 默认：solid， 线的类型。
	 * @example <tm-divider text="我是分割线"></tm-divider>
	 */
	export default {
		name: "tm-divider",
		props: {

			// 不为空时，显示文本。
			text: {
				type: String,
				default: ''
			},
			// 颜色16进制或者rgb,rgba
			color: {
				type: String,
				default: 'grey'
			},
			// 竖向高度时，起作用。
			height: {
				type: Number,
				default: 100
			},
			// 竖向高度时，起作用。
			width: {
				type: Number,
				default: 0
			},
			// 是否竖
			vertical: {
				type: Boolean,
				default: false
			},
			// solid|dashed|dotted
			model: {
				type: String,
				default: 'solid'
			},
			// 跟随主题色的改变而改变。
			fllowTheme: {
				type: Boolean | String,
				default: false
			}
		},
		computed: {
			wd: {
				get: function() {
					if (this.width) return this.width;
					return this.width_s;
				},
				set: function(val) {
					this.width_s = val;
				}
			},
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
				width_s: 0,
				height_s: 0,
				setpsClass: ''
			};
		},
		async mounted() {
			await this.init();
		},
		methods: {
			async init() {
				this.$nextTick(async function() {
					let tbs = await this.$Querey(".tm-divider");
					this.wd = tbs[0].width ? tbs[0].width : this.wd;


				})
			},
			setWidth(width) {
				this.$nextTick(async function() {
					this.wd = width;

					this.setpsClass = 'setpsClass'
					if (this.text) {
						let tbs_text = await this.$Querey(".tm-divider-text");
						
						this.wd = this.wd - tbs_text[0].width;
					}
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.tm-divider {

		display: block;
		width: auto;

		position: relative;

		.tm-divider-wk {



			&.setpsClass {
				position: absolute;
				// left: -100upx;
				line-height: 0;
				// left: 0;
			}
		}

		.flexVer {
			width: 1px;
		}

		.tm-divider-text {
			flex-shrink: 0;
		}

		.tm-divider-left,
		.tm-divider-right {
			width: 50%;
			height: 1px;
			border-bottom-width: 1px;

		}
	}
</style>
