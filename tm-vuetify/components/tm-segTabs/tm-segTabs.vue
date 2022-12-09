<template>
	<view class="tm-segTabs d-inline-block relative ">
		<view class="tm-segTabs-wkbody  fulled flex-start  relative" :class="['pa-'+gutter]"
			:style="{width:width>0?width+'rpx':'auto'}">
			<view @click="clickItem(index, item)" :class="[
					`px-${margin[0]} py-${margin[1]}`,
					`text-size-${fontSize}`,
					`round-${round}`,
					active_index == index
						? 'text-weight-b ' + (black_tmeme ? `text-grey-lighten-3 ` : `text-${color_tmeme}`)
						: black_tmeme
						? `text-grey bk`
						: `text-${color}`
				]" :id="'tm-segTabs-item-' + index" v-for="(item, index) in listData" :key="index"
				class="tm-segTabs-item flex-shrink flex-center" :style="{
					width:width_item+'px'
				}">
				<slot name="default"
					:item="{color:color_tmeme, data: item, index: index, isActive: active_index == index }">
					{{ returnKeyValue(item) }}
				</slot>
			</view>
		</view>
		<view :class="[black_tmeme ? 'grey-darken-5' : bgColor, `round-${round}`]"
			class="tm-segTabs-bg absolute  l-0 t-0 fulled  " :style="{ height: body_height + 'px' }">
			<view
				:class="[`shadow-${activeColor}-${shadow}`,black_tmeme ? 'grey-darken-3' : activeColor, `round-${round}`,aniOn?'aniOn':'',`mt-${gutter} ml-${gutter/2}`]"
				class="tm-segTabs-bg-bar   relative"
				:style="{ width: `${active_barWidth}px`, height: `${active_barHeight}px`,transform: `translateX(${left}px)` }">
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 分段器选项卡
	 * @property {Number} value = [] 默认0,当前激活的选项.
	 * @property {Array} list = [] 默认数据,对象数组或者字符串数组
	 * @property {String} rang-key = [] 默认text,list对象数组时取文本的字段名称
	 * @property {String} color = [] 默认black,默认的文字颜色
	 * @property {String} bg-color = [] 默认grey-lighten-4,默认的背景色
	 * @property {String} active-font-color = [] 默认black,激活的文本色
	 * @property {String} active-color = [] 默认black,激活项的背景色
	 * @property {String} font-size = [] 默认 n,字号，xxs,xs,s,n,g,lg,xl
	 * @property {Array} margin = [] 默认 [24,10],左右和上下的间距，调整它可以控制宽度和高度。
	 * @property {Number} round = [] 默认4， 圆角
	 * @property {Number} shadow = [] 默认4， 投影
	 * @property {Number} gutter = [] 默认4， 四边的间隙
	 * @property {Number} width = [] 默认0， 整体的宽度，默认不自动宽度，提供了后，项目内的宽度为均分此宽度。
	 * @property {Boolean} black = [] 默认false， 是否暗黑模式
	 * @property {Boolean} fllow-theme = [] 默认true， 是否跟随主题切换主色。
	 */
	export default {
		name: 'tm-segTabs',
		props: {
			value: {
				type: Number,
				defalut: 0
			},
			list: {
				type: Array,
				default: () => []
			},
			//整体的宽度，不设置使用默认计算的宽度。
			width: {
				type: Number,
				default: 0
			},
			// 四周的间隙 
			gutter: {
				type: Number,
				default: 4
			},
			shadow: {
				type: Number,
				default: 4
			},
			margin: {
				type: Array,
				default: () => [24, 10]
			},
			rangKey: {
				type: String,
				default: 'text'
			},
			color: {
				type: String,
				default: 'black'
			},
			bgColor: {
				type: String,
				default: 'grey-lighten-4'
			},
			activeFontColor: {
				type: String,
				default: 'black'
			},
			activeColor: {
				type: String,
				default: 'white'
			},
			fontSize: {
				type: String,
				default: 'n'
			},
			round: {
				type: String | Number,
				default: 4
			},
			// 跟随主题色的改变而改变。
			fllowTheme: {
				type: Boolean | String,
				default: true
			},
			black: {
				type: Boolean | String,
				default: null
			}
		},
		data() {
			return {
				body_height: 0,
				active_barHeight: 0,
				active_barWidth: 0,
				aniOn: false,
				left: 0,
				preventLeft: 0,
				width_item_w: 0,
			};
		},
		watch: {
			value(newValue, oldValue) {
				this.active_index = newValue;
			},
			list: {
				deep: true,
				async handler() {
					this.width_item = this.width;
					await this.setInits();
				}
			}
		},
		computed: {
			width_item: {
				get: function() {
					return this.width_item_w;

				},
				set: function(val) {
					if (val == 0) {
						this.width_item_w = 'auto'
					} else {
						this.width_item_w = (uni.upx2px(val) / this.list.length)
					}

				}
			},
			black_tmeme: function() {
				if (this.black !== null) return this.black;
				return this.$tm.vx.state().tmVuetify.black;
			},
			color_tmeme: function() {
				if (this.$tm.vx.state().tmVuetify.color !== null && this.$tm.vx.state().tmVuetify.color && this
					.fllowTheme) {
					return this.$tm.vx.state().tmVuetify.color;
				}
				return this.activeFontColor;
			},
			listData: function() {
				return this.list;
			},
			active_index: {
				get: function() {
					return this.value;
				},
				set: function(val) {
					this.active = val;
					this.$emit('input', val);
					this.$emit('update:value', val);
					// this.$emit('change', val);
					this.$nextTick(function() {
						this.setDefaultPos();
					});
				}
			}
		},
		created() {
			this.active_index = this.value;
			this.width_item = this.width;
		},
		mounted() {
			let t = this;
			t.setInits();
		},
		updated() {
			this.setInits();
		},
		methods: {
			setInits() {
				let t = this;
				this.width_item = this.width;
				this.$nextTick(function() {
					uni.createSelectorQuery().in(t).select('.tm-segTabs-wkbody')
						.boundingClientRect().select('#tm-segTabs-item-' + this.active).boundingClientRect()
						.exec(function(tx) {
							
							let p = tx[0]
							if (!p) return;
							t.body_height = p.height;
							t.preventLeft = p.left;

							let p1 = tx[1]
							if (!p1) return;
							t.active_barHeight = p1.height;
							let left = 0;
							if (t.width == 0) {
								t.active_barWidth = p1.width;
								left = p1.left;
							} else {
								t.active_barWidth = t.width_item
								left = t.preventLeft + t.width_item * t.active;
							}

							let lsl = Math.floor((t.gutter / 2))
							t.left = left - t.preventLeft - uni.upx2px(lsl);

							t.aniOn = true;
						})


				});
			},
			returnKeyValue(item) {
				if (typeof item == 'string') {
					return item;
				}
				if (typeof item == 'object') {
					return item[this.rangKey];
				}
			},
			setDefaultPos() {
				let t = this;
				uni.createSelectorQuery().in(t).select('#tm-segTabs-item-' + this.active)
					.boundingClientRect().exec(
						function(p1) {
							if (!p1[0]) return;
							t.active_barHeight = p1[0].height;
							t.active_barWidth = p1[0].width;
							let lsl = Math.floor((t.gutter / 2))

							t.left = p1[0].left - t.preventLeft - uni.upx2px(lsl);
						})



			},
			clickItem(index, item) {
				this.active_index = index;
				this.$emit('change', index);
				this.$nextTick(function() {
					this.setDefaultPos();
				});
			}
		}
	};
</script>

<style lang="scss">
	.tm-segTabs {
		.tm-segTabs-wkbody {
			z-index: 2;

			.tm-segTabs-item {
				transition: all 0.2s linear;
			}
		}

		.tm-segTabs-bg {
			.tm-segTabs-bg-bar {

				&.aniOn {
					transition: all 0.2s ease-in-out;
				}
			}

			box-shadow: 0 0 3px 2px rgba(0, 0, 0, 0.02) inset;
		}
	}
</style>
