<template>
	<view class="tm-swiper " :class="[inline ? 'd-inline-block' : '']">
		<swiper :previous-margin="`${ani3d}rpx`" :next-margin="`${ani3d}rpx`" :style="{
				width: w_s + 'rpx',
				height: h_s + 'rpx'
			}" :vertical="vertical" :autoplay="autoplay&&!isPlayVedio" :circular="circular" :interval="interval" :duration="duration"
			:indicator-active-color="color_tmeme" :current="nowIndex" @change="change" :class="[round_num > 0 ? ` round-${round_num} overflow` : '']">
			<block v-for="(item, index) in dataList" :key="index">
				<swiper-item :style="{
						width: w_s + 'rpx',
						height: h_s + 'rpx'
					}" class="shadow-24" :class="[round_num > 0 ? ` round-${round_num} overflow` : '']">
					<view
						:class="[nowIndex !== index&&ani3d>0?'a3d':'',round_num > 0 ? ` round-${round_num} overflow` : '',nowIndex<index&&ani3d>0?'a3dL':'',nowIndex>index&&ani3d>0?'a3dR':'']"
						class="tm-swiper-ik fulled fulled-height" :key="index">
						<view class="actvieMarginDh">
							<view class="actvieMarginDh-item"
								:class="[round_num > 0 ? ` round-${round_num} overflow` : '']">
								<image v-if="item.dtype!='video'" @click="itemClick(item)" :style="{
										height: h_s + 'rpx',
										width: (w_s - margin_px) + 'rpx'
									}" @load="imgload($event, index)" :src="item.url"
									:class="[round_num > 0 ? ` round-${round_num} overflow` : '']"></image>
								<video @play="isPlayVedio = true" @pause="isPlayVedio=false" @ended="isPlayVedio=false" :autoplay="nowIndex == index?true:false" :style="{
										height: h_s + 'rpx',
										width: (w_s - margin_px) + 'rpx'
									}" v-if="item.dtype=='video'" :src="item.url"></video>

								<view v-if="item.title" :style="{
										width: (w_s - margin_px) + 'rpx'
									}" class="flex-start relative ">
									<view
										class="text-size-s px-16 absolute b-0 l-0 zIndex-14 flex-start text-overflow text-white"
										:style="{
										height: '66rpx',
										width: (w_s - margin_px-32) + 'rpx',
										lineHeight:'66rpx',
										background:'rgba(0,0,0,0.4)'
									}">
										{{item.title}}
									</view>
								</view>
							</view>
						</view>
					</view>
				</swiper-item>
			</block>
		</swiper>
		<view class="tm-swiper-dot" v-if="indicatorDots&&nowshowDot" :class="[dotDirection]">
		
			<block v-if="dotModel != 'round'">
				<view @click="nowIndex = index" v-for="(item, index) in dataList" :key="index"
					class="tm-swiper-dot-item  flex-center  mx-8"
					:class="[nowIndex == index ? color_tmeme : 'unactive', dotModel]">
					<text v-if="dotModel === 'number'" class="text-size-xs">{{ index + 1 }}</text>
				</view>
			</block>
			<block v-if="dotModel == 'round'">
				<view :class="[dotModel]"
					class="text-size-xs balck text-white  round-24 px-24 tm-swiper-dot-item  flex-center flex-shrink"
					:style="{ height: '40rpx', minWidth: '60rpx' }">
					{{ nowIndex + 1 + '/' + dataList.length }}
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	/**
	 * 图片轮播
	 * @description 很参数与原官方相同。
	 * @property {Number} width = [] 默认：0，轮播宽度，0为自己计算。
	 * @property {Number} height = [] 默认：0，轮播高度，0为自己计算。
	 * @property {Array} list = [] 默认：[]，图片列表，可以是string数组或者object数组。
	 * @property {String} rang-key = [] 默认：[]，图片列表object数组时，需要提供图片地址 的键值。
	 * @property {Boolean} inline = [] 默认：false，是否内联，方便一排放多个轮播组件。
	 * @property {Boolean} previmage = [] 默认：true,是否预览图片，点击图片时，放大预览。
	 * @property {Boolean} vertical = [] 默认：false,是否竖向滚动。
	 * @property {Boolean} circular = [] 默认：false,是否采用衔接滑动，即播放到末尾后重新回到开头
	 * @property {Boolean} autoplay = [] 默认：false,是否自动切换
	 * @property {Number} interval = [] 默认：3000,自动切换时间间隔
	 * @property {Number} duration = [] 默认：500,滑动动画时长
	 * @property {Number} ani3d = [] 默认：0,开启3d缩放动画
	 * @property {Boolean} indicator-dots = [] 默认：true,是否显示指示
	 * @property {String} color = [] 默认：primary,指示点的主题色。
	 * @property {Number} current = [] 默认：0,如果需要双向绑定请使用current.sync.
	 * @property {String} dot-model = [dot|number|rect|round] 默认：dot,指示点的类型。
	 * @property {String} dot-direction = [left|center|right] 默认：center,指示点的位置。
	 * @property {Number} round = [] 默认：0,圆角,单位rpx
	 * @property {Number} margin = [] 默认：0,单位rpx
	 * @property {Function} change 轮播切换时触发。参数返回当前播放位置。
	 * @property {Function} click 轮播项目被点击时触发发,返回项目数据
	 * @example <tm-swiper :list="['https://picsum.photos/300?jv=3','https://picsum.photos/300?jv=3']" ></tm-swiper>
	 */
	export default {
		name: 'tm-swiper',
		props: {
			width: {
				type: Number | String,
				default: 0
			},
			// 自定高度。
			height: {
				type: Number | String,
				default: 0
			},
			list: {
				type: Array,
				default: () => {
					return [];
				}
			},
			rangKey: {
				type: String,
				default: 'src'
			},
			// 是否内联。
			inline: {
				type: Boolean,
				default: false
			},
			// 是否开启预览模式，即点击图片可以预览。
			previmage: {
				type: Boolean | String,
				default: true
			},
			vertical: false,
			circular: false,
			autoplay: false,
			interval: {
				type: Number,
				default: 3000
			},
			duration: {
				type: Number,
				default: 500
			},
			// 是否显示指示
			indicatorDots: false,
			//指示点的主题色。
			color: {
				type: String,
				default: 'primary'
			},
			// 当前位置。
			current: {
				type: Number,
				default: 0
			},
			ani3d: {
				type: Number,
				default: 0
			},
			// 指示点的类型。
			dotModel: {
				type: String,
				default: 'dot' //dot|number|rect
			},
			// 指示点的位置 。
			dotDirection: {
				type: String,
				default: 'center' //left|center|right
			},
			round: {
				type: Boolean | Number,
				default: 0
			},
			margin: {
				type: Number,
				default: 0
			},
			// 跟随主题色的改变而改变。
			fllowTheme: {
				type: Boolean | String,
				default: true
			}
		},
		watch: {
			current: function(newval) {
				if (newval >= this.dataList.length) {
					this.nowIndex = 0;
					return;
				}
				this.nowIndex = newval;
			},
			list: {
				deep: true,
				handler() {
					this.chulidata();
				}
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
			round_num: function() {
				if (typeof this.round === 'boolean') return 0;
				return this.round;
			},
			nowIndex: {
				get: function() {
					return this.dotIndex;
				},
				set: function(val) {
					this.dotIndex = val;
					this.$emit('update:current', val);
					this.$emit('change', val);
				}
			},
			nowshowDot:function(){
				return this.showdot();
				
			},
			w_s: {
				get: function() {
					return this.w_w;
				},
				set: function(val) {
					this.w_w = val;
				}
			},
			h_s: {
				get: function() {
					return this.h_h;
				},
				set: function(val) {
					this.h_h = val;
				}
			},
			margin_px: function() {
				return this.margin * 2;
			},

		},

		data() {
			return {
				w_w: 0,
				h_h: 0,
				dataList: [],
				dotIndex: 0,
				isPlayVedio:false,
			};
		},
		async mounted() {
			this.nowIndex = this.current;

			let w = this.width;
			if (String(w).indexOf('px') > -1 && typeof w == 'string') {
				let p = parseInt(h);
				let sy = 750 / uni.getSystemInfoSync().windowWidth;
				w = p * sy;
			}
			if (typeof w == 'string') {
				w = parseInt(w);
			}
			this.w_w = w;

			let h = this.height;
			if (String(h).indexOf('px') > -1 && typeof h == 'string') {
				let p = parseInt(h);
				let sy = 750 / uni.getSystemInfoSync().windowWidth;
				h = p * sy;
			}
			if (typeof h == 'string') {
				h = parseInt(h);
			}

			this.h_h = h;

			this.$nextTick(async function() {
				await this.chulidata();
			});
		},
		methods: {
			
			showdot(){
				if(typeof this.dataList[this.nowIndex]=='string') return true;
				if(typeof this.dataList[this.nowIndex]=='object'){
					if(this.dataList[this.nowIndex].dtype=='video') return false;
				}
				return true;
			},
			async chulidata() {
				let t = this;
				let tb = await this.$Querey('.tm-swiper', this).catch(ev => {});
				//console.log(uni.getSystemInfoSync());
				let sy = 750 / uni.getSystemInfoSync().windowWidth;
				let upxw = tb[0].width * sy;
				let sw = this.w_s > 0 ? this.w_s : upxw > 0 ? upxw : 100;
				this.w_s = sw;
				let sh = this.h_s > 0 ? this.h_s : tb[0].height > 0 ? tb[0].height : 300;
				this.h_s = sh;
				let d = [];
				this.list.forEach(item => {
					if (typeof item === 'string') {
						d.push({
							width: sw,
							height: sh,
							url: item,
							title: '',
							dtype: '',
							data: item
						});
					} else if (typeof item === 'object') {
						d.push({
							width: sw,
							height: sh,
							url: item[t.rangKey],
							title: item['title'] || '',
							dtype: item['type'] || '',
							data: item
						});
					}
				});
				this.dataList = d;
			},
			imgload(e, index) {},
			change(event) {
				this.nowIndex = event.detail.current;
			},
			itemClick(e) {
				if (this.previmage) {
					uni.previewImage({
						current: e.url,
						urls: [e.url]
					});
				}
				this.$emit('click', e);
			}
		}
	};
</script>
<style></style>
<style lang="scss" scoped>
	.tm-swiper {
		position: relative;

		.tm-swiper-ik {
			transition: all 1s;
		}

		.a3d {
			transform: scale(0.76);
		}

		.a3dL {
			transform: scale(0.76) translateX(-24rpx)
		}

		.a3dR {
			transform: scale(0.76) translateX(24rpx)
		}

		.actvieMarginDh {
			display: flex;
			justify-content: center;

			.actvieMarginDh-item {
				overflow: hidden;
				line-height: 0;
			}
		}

		.tm-swiper-dot {
			.tm-swiper-dot-item {
				width: 16upx;
				height: 16upx;
				border-radius: 50%;

				&.unactive {
					background-color: rgba(255, 255, 255, 0.6);
				}

				&.number {
					width: 34upx;
					height: 34upx;
				}

				&.rect {
					width: 24upx;
					height: 6upx;
					border-radius: 0;
				}

				&.round {
					background-color: rgba(0, 0, 0, 0.4);
				}
			}

			width: 100%;
			position: absolute;
			left: 0;
			display: flex;
			bottom: 20upx;

			&.center {
				display: flex;
				justify-content: center;
			}

			&.left {
				display: flex;
				justify-content: flex-start;
				padding-left: 20upx;
				width: calc(100% - 20upx);
			}

			&.right {
				display: flex;
				justify-content: flex-end;
				padding-right: 20upx;
				width: calc(100% - 20upx);
			}
		}
	}
</style>
