<template>
	<view class="d-block tm-slider " :class="[step > 0 ? 'pb-36' : 'pb-24']"
		:style="{ height: vertical ? heightpx + 'px' : 'auto', width: vertical ? '5px' : 'auto' }">
		<view class=" tm-slider-id  " :class="[vertical ? 'vertical' : 'flex-between']">
			<!-- 左边label -->
			<view v-if="showLeft" class="label_slider left  flex-col text-size-xs text-grey-darken-1"
				:class="[vertical ? '' : 'flex-center']">
				<slot name="left" :data="{ value: value, color: color_tmeme, icon: leftIcon,max:max }">
					<tm-icons v-if="leftIcon && !vertical" size="28" :name="leftIcon" :color="color_tmeme"></tm-icons>
					<view class="text-size-xs text-grey-darken-1 ">{{ value[0] }}</view>
				</slot>
			</view>
			<!-- 条子内容 -->
			<view class="slider_id "
				:style="{ width: vertical ? 'auto' : sliderWidth + 'px', height: vertical ? sliderWidth + 'px' : '5px' }">
				<view class="slider_id_bg  round-10" :class="[bgColor,black_tmeme?'bk':'']"></view>
				<view
					:style="{left:vertical?'0':bar_minLeft+'px',
					 top:vertical?bar_minLeft+'px':0,
					 width: vertical ? '100%' : active_width + '%', height: vertical ? active_width + '%' : '100%' }"
					class="slider_id_active round-10 " :class="[color_tmeme,black_tmeme?'bk':'']"></view>
				<view :style="{ left: vertical ? 0 : barLeft + 'px', top: vertical ? barLeft + 'px' : 0 }"
					@touchcancel="barEnd" @touchstart="barStart" @touchend="barEnd" @touchmove.stop.prevent="barMove"
					@mouseleave="barEnd" @mousedown="barStart" @mouseup="barEnd" @mousemove.stop.prevent="barMove"
					class="slider_bar border-white-a-2  rounded" :class="[color_tmeme,black_tmeme?'bk':'', ` shadow-${color_tmeme}-10`]">
					<view v-if="showTopTips||showTip" class="slider_bar_showbg border-white-a-1" :class="[color_tmeme,black_tmeme?'bk':'']">
					</view>
					<view v-if="showTopTips||showTip" class="slider_bar_num text-size-xs flex-center" :class="[color_tmeme,black_tmeme?'bk':'']">
						<slot name="tipsLeft" :data="value">{{ value[0] }}</slot>
					</view>
				</view>
				<view :style="{ left: vertical ? 0 : barLeft_1 + 'px', top: vertical ? barLeft_1 + 'px' : 0 }"
					@touchcancel="barEnd_1" @touchstart="barStart_1" @touchend="barEnd_1" @touchmove.stop.prevent="barMove_1"
					@mouseleave="barEnd_1" @mousedown="barStart_1" @mouseup="barEnd_1" @mousemove.stop.prevent="barMove_1"
					class="slider_bar border-white-a-2  rounded" :class="[color_tmeme,black_tmeme?'bk':'', ` shadow-${color_tmeme}-10`]">
					<view v-if="showTopTips||showTip" class="slider_bar_showbg border-white-a-1" :class="[color_tmeme,black_tmeme?'bk':'']">
					</view>
					<view v-if="showTopTips||showTip" class="slider_bar_num text-size-xs flex-center" :class="[color_tmeme,black_tmeme?'bk':'']">
						<slot name="tipsRight" :data="value">{{ value[1] }}</slot>
					</view>
				</view>
				<!-- 步长刻度尺 -->
				<view class="kdc_wk ">
					<view v-for="(item, index) in kdcNum" :key="index"
						:style="{ left: vertical ? 0 : item.left, top: vertical ? item.left : 0 }" :class="[color_tmeme,black_tmeme?'bk':'']"
						class="kdc_wk_item rounded  border-white-a-1 ">
						<view class="kdc_wk_item_label  pl-0" :class="[vertical ? 'pl-24' : 'pa-24']">
							<text class="text-size-xs text-grey-darken-1 ">{{ item.kedu }}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 右边label -->
			<view v-if="showRight" class="label_slider right  flex-col text-size-xs text-grey-darken-1"
				:class="[vertical ? 'flex-end' : 'flex-center']">
				<slot name="right" :data="{ value: value, color: color_tmeme, icon: rightIcon,max:max }">
					<tm-icons v-if="rightIcon && !vertical" size="28" :name="rightIcon" :color="color_tmeme"></tm-icons>
					<view class="text-size-xs text-grey-darken-1 ">{{ max }}</view>
				</slot>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 滑块
	 * @property {Number} value = [0] 赋值，如果需要同步使用value.sync推荐使用v-model绑定。
	 * @property {Boolean} vertical = [true|false] 默认：false,是否启用竖向模式。
	 * @property {Number} height = [200] 默认：200,竖向模式时才有作用。
	 * @property {Number} width = [] 默认：0,横向时起作用，如果为0自动获取外层宽度。
	 * @property {Boolean} show-left = [true|false] 默认：false,显示左边数据。
	 * @property {Boolean} show-right = [true|false] 默认：false,显示右边数据。
	 * @property {Number} max = [] 默认：100,显示的最大刻度。
	 * @property {Number} value-diog = [] 默认：0,取值小数点后几位
	 * @property {Boolean} disabled = [true|false] 默认：false, 是否禁用。
	 * @property {Boolean} showTip = [true|false] 默认：false, 始终显示进度标签。
	 * @property {Number} step = [10|20] 默认：0, 步长,设置请尽量大于20.太小滑动容易过小出问题。
	 * @property {String} color = [primary] 默认：primary,  主题颜色名称。
	 * @property {String} bg-color = [grey-lighten-2] 默认：grey-lighten-2,  底部不活动的背景色,颜色名称。
	 * @property {String} left-icon = [] 默认：icon-minus,   左边图标
	 * @property {String} right-icon = [] 默认：icon-plus,   右边图标
	 * @property {Function} change 同v-model和value相等的参数，变动时触发。
	 * @example <tm-slider v-model="checked"  ></tm-slider>
	 * 
	 */
	import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
	export default {
		components:{tmIcons},
		name: "tm-sliders",
		model: {
			prop: 'value',
			event: 'input'
		},
		props: {
			black: {
				type: Boolean,
				default: null
			},
			vertical: Boolean, //是否启用竖向模式。需要和height配合使用。
			// 单位upx.
			height: {
				type: Number,
				default: 200
			},
			width: {
				type: Number,
				default: 0
			},
			showLeft: Boolean, //显示左边
			showRight: Boolean, //显示右边
			// 最大刻度。
			max: {
				type: Number,
				default: 100
			},
			// 默认的数据。不能大于max.,使用.sync修饰。双向绑定数据。
			value: {
				type: Array,
				default: ()=>{
					return [0,0];
				}
			},
			// 取值小数点后几位。默认为0
			valueDiog: {
				type: Number,
				default: 0
			},
			// 是否禁用。
			disabled: Boolean,
			//步长。默认为0,设置请尽量大于0.太小滑动容易过小出问题。
			step: {
				type: Number,
				default: 0
			},
			// 主题颜色名称。
			color: {
				type: String,
				default: 'primary'
			},
			// 底部不活动的背景色,颜色名称。。
			bgColor: {
				type: String,
				default: 'grey-lighten-2'
			},
			// 左边图标名称。
			leftIcon: {
				type: String | Boolean,
				default: 'icon-minus'
			},
			// 右边图标名称。
			rightIcon: {
				type: String | Boolean,
				default: 'icon-plus'
			},
			// 始终显示进度提示窗
			showTip: {
				type: Boolean,
				default: false
			},
			// 跟随主题色的改变而改变。
			fllowTheme:{
				type:Boolean|String,
				default:true
			}
		},
		watch: {
			value: {
				handler(val) {
					let rdl = this.sliderWidth * (Math.abs(val[0]) / Math.abs(this.max));
					this.barLeft = rdl >= this.sliderWidth || rdl < 0 ? this.sliderWidth : rdl;
					rdl = this.sliderWidth * (Math.abs(val[1]) / Math.abs(this.max));
					this.barLeft_1 = rdl >= this.sliderWidth || rdl < 0 ? this.sliderWidth : rdl;
				},
				deep:true
			},
			barLeft: function() {
				let value = (this.barLeft / this.sliderWidth) * this.max;

				if (!isNaN(value)) {
					if (this.valueDiog > 0) {
						let s = value[0].toString();

						let st = s.split('.');

						let ruslt = 0;
						if (st.length > 1) {
							ruslt = parseFloat(st[0] + '.' + st[1].substring(0, this.valueDiog));
						} else {
							ruslt = parseFloat(s);
						}
						this.$emit('update:value', [ruslt,this.value[1]]);
						this.$emit('input', [ruslt,this.value[1]]);
						this.$emit('change',  [ruslt,this.value[1]]);
					} else {
						this.$emit('update:value', [parseInt(value),this.value[1]]);
						this.$emit('input',[parseInt(value),this.value[1]]);
						this.$emit('change',  Math.abs(parseInt(value-this.value[1])));
						
					}
				}
			},
			
			barLeft_1: function() {
				let value = (this.barLeft_1 / this.sliderWidth) * this.max;
			
				if (!isNaN(value)) {
					if (this.valueDiog > 0) {
						let s = value.toString();
			
						let st = s.split('.');
			
						let ruslt = 0;
						if (st.length > 1) {
							ruslt = parseFloat(st[0] + '.' + st[1].substring(0, this.valueDiog));
						} else {
							ruslt = parseFloat(s);
						}
						this.$emit('update:value', [this.value[0],ruslt]);
						this.$emit('input',  [this.value[0],ruslt]);
						this.$emit('change',  Math.abs(this.value[0]-ruslt));
					} else {
						
						this.$emit('update:value', [this.value[0],parseInt(value)]);
						this.$emit('input', [this.value[0],parseInt(value)]);
						this.$emit('change', Math.abs(parseInt(value-this.value[0])));
					}
				}
			}
		},
		computed: {
			black_tmeme: function() {
				if (this.black !== null) return this.black;
				return this.$tm.vx.state().tmVuetify.black;
			},
			// 计算刻度尺的数量
			kdcNum: function() {
				if (Math.abs(this.step) <= 0) return [];
				let jlv = Math.abs(this.step) / Math.abs(this.max);
				let left_width = jlv * (this.sliderWidth - 0);
				let kd_num = parseInt(this.sliderWidth / left_width);
				let ar = [];
				for (let i = 0; i <= kd_num; i++) {
					ar.push({
						index: i, //顺序
						left: i * left_width + 'px', //距离左边距离
						kedu: this.step * i //当前刻度数量。
					});
				}
				return ar;
			},
			//比例
			active_width: function() {
				return (Math.abs(this.barLeft - this.barLeft_1) / this.sliderWidth) * 100;
			},
			heightpx: function() {
				return uni.upx2px(this.height);
			},
			bar_minLeft:function(){
				
				let value = this.barLeft;
				if(this.barLeft >= this.barLeft_1){
					value = this.barLeft_1;
				}
				
				return value;
			},
			color_tmeme:function(){
				if(this.$tm.vx.state().tmVuetify.color!==null&&this.$tm.vx.state().tmVuetify.color && this.fllowTheme){
					return this.$tm.vx.state().tmVuetify.color;
				}
				return this.color;
			},
		},
		data() {
			return {
				sliderWidth: 0,
				x: 0,
				startMove: false,
				barLeft: 0,
				barLeft_1: 0,
				isError: false,
				showTopTips: false
			};
		},
		async mounted() {
			this.$nextTick(async function() {
				await this.getwidth();

				if (Math.abs(this.value[1]) > Math.abs(this.max)) {
					this.isError = true;
					return;
				}
				let rdl = this.sliderWidth * (Math.abs(this.value[0]) / Math.abs(this.max));
				this.barLeft = rdl >= this.sliderWidth || rdl < 0 ? this.sliderWidth : rdl;
				let rdl_1 = this.sliderWidth * (Math.abs(this.value[1]) / Math.abs(this.max));
				this.barLeft_1 = rdl_1 >= this.sliderWidth || rdl_1 < 0 ? this.sliderWidth : rdl_1;
			});
		},
		updated() {
			this.$nextTick(async function() {
				await this.getwidth();
			
				if (Math.abs(this.value[1]) > Math.abs(this.max)) {
					this.isError = true;
					return;
				}
				let rdl = this.sliderWidth * (Math.abs(this.value[0]) / Math.abs(this.max));
				this.barLeft = rdl >= this.sliderWidth || rdl < 0 ? this.sliderWidth : rdl;
				let rdl_1 = this.sliderWidth * (Math.abs(this.value[1]) / Math.abs(this.max));
				this.barLeft_1 = rdl_1 >= this.sliderWidth || rdl_1 < 0 ? this.sliderWidth : rdl_1;
			});
		},
		methods: {
			barStart(e) {
				if (this.disabled || this.isError) return;
				
				if(e.type.indexOf('mouse')>-1&&e.changedTouches.length==0){
					this.x = (this.vertical ? e.pageY : e.pageX) - this.barLeft;
					this.startMove = true;
					this.showTopTips = true;
				}else{
					if (e.changedTouches.length > 0) {
						this.x = (this.vertical ? e.changedTouches[0].pageY : e.changedTouches[0].pageX) - this.barLeft;
						this.startMove = true;
						this.showTopTips = true;
					}
				}
				this.$nextTick(function(){
					this.$emit('start',this.value)
				})
			},
			barEnd(e) {
				if (this.disabled || this.isError) return;
				this.startMove = false;
				this.showTopTips = false;
				this.$nextTick(function(){
					this.$emit('end',this.value)
				})
			},
			barMove(e) {
				if (this.disabled || this.isError) return;
				if (!this.startMove) return;
				let left = 0;
				if(e.type.indexOf('mouse')>-1&&e.changedTouches.length==0){
					left = (this.vertical ? e.pageY : e.pageX) - this.x;
				}else{
					left = (this.vertical ? e.changedTouches[0].pageY : e.changedTouches[0].pageX) - this.x;
				}
				if (left <= 0) {
					this.barLeft = 0;
					return;
				}
				if (left >= this.sliderWidth) {
					this.barLeft = this.sliderWidth;
					return;
				}
				let nowStep = parseInt(Math.abs(left - this.barLeft));
				let bdi = parseInt((this.step / this.max) * this.sliderWidth);
				if (nowStep >= bdi) {
					// 每一小段的值。
					if (this.step !== 0) {
						let kedud = this.sliderWidth / (this.max / this.step);
						this.barLeft = Math.round(left / kedud) * kedud;
					} else {
						this.barLeft = left;
					}
				}
			},
			
			barStart_1(e) {
				if (this.disabled || this.isError) return;
			
				if(e.type.indexOf('mouse')>-1){
					this.x = (this.vertical ? e.pageY : e.pageX) - this.barLeft_1;
					this.startMove = true;
					this.showTopTips = true;
				}else{
					if (e.changedTouches.length > 0) {
						this.x = (this.vertical ? e.changedTouches[0].pageY : e.changedTouches[0].pageX) - this.barLeft_1;
						this.startMove = true;
						this.showTopTips = true;
					}
				}
			},
			barEnd_1(e) {
				if (this.disabled || this.isError) return;
				this.startMove = false;
				this.showTopTips = false;
			},
			barMove_1(e) {
				if (this.disabled || this.isError) return;
				if (!this.startMove) return;
				let left = 0;
				if(e.type.indexOf('mouse')>-1){
					left = (this.vertical ? e.pageY : e.pageX) - this.x;
				}else{
					left = (this.vertical ? e.changedTouches[0].pageY : e.changedTouches[0].pageX) - this.x;
				}
			
				if (left <= 0) {
					this.barLeft_1 = 0;
					return;
				}
				if (left >= this.sliderWidth) {
					this.barLeft_1 = this.sliderWidth;
					return;
				}
				let nowStep = parseInt(Math.abs(left - this.barLeft_1));
				let bdi = parseInt((this.step / this.max) * this.sliderWidth);
				if (nowStep >= bdi) {
					// 每一小段的值。
					if (this.step !== 0) {
						let kedud = this.sliderWidth / (this.max / this.step);
						this.barLeft_1 = Math.round(left / kedud) * kedud;
					} else {
						this.barLeft_1 = left;
						
					}
				}
			},
			
			async getwidth() {
				let res = await this.$Querey('.tm-slider-id', this,0).catch(e=>{});
				res[0].width = res[0].width||uni.upx2px(this.width);
				res[0].height = res[0].height||uni.upx2px(this.height);
				
				if (this.showLeft === false && this.showRight === false) {

					this.sliderWidth = this.vertical ? res[0].height : res[0].width;
					return;
				}
				if (this.showLeft !== false && this.showRight !== false) {
					this.sliderWidth = (this.vertical ? res[0].height : res[0].width) - uni.upx2px(this.vertical ? 50 :
						100) * 2;
					return;
				}
				if (this.showLeft === true || this.showRight === true) {
					this.sliderWidth = (this.vertical ? res[0].height : res[0].width) - uni.upx2px(this.vertical ? 50 :
						100);
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.label_slider {
		flex-shrink: 0;

		&.left,
		&.right {
			width: 100upx;
		}
	}

	.tm-slider-id {
		width: 100%;

		.slider_id {
			position: relative;
			height: 4px;

			.slider_id_bg {
				width: 100%;
				height: 100%;
			}

			.slider_id_active {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				z-index: 5;
			}

			.slider_bar {
				position: absolute;
				width: 40upx;
				height: 40upx;
				left: 0;
				top: 0;
				margin-top: -22upx;
				z-index: 10;
				
				.slider_bar_showbg {
					position: absolute;
					width: 50upx;
					height: 50upx;
					border-radius: 30upx;
					border-bottom-left-radius: 5upx;
					transform: rotate(-45deg);
					bottom: 60upx;
					left: -9upx;
					// transition: translateY;
					animation: roteScaleTop_BG 0.3s ease-in-out;
				}

				.slider_bar_num {
					position: absolute;
					width: 50upx;
					height: 50upx;
					border-radius: 50upx;
					left: -8upx;
					bottom: 60upx;
					line-height: 50upx;
					text-align: center;
					background: transparent !important;
					animation: roteScaleTop 0.3s ease-in-out;
				}
			}

			.kdc_wk {
				width: 100%;
				height: 100%;
				position: absolute;
				z-index: 6;
				left: 0;
				top: -2upx;

				.kdc_wk_item {
					width: 10upx;
					height: 10upx;
					position: absolute;
					z-index: 7;
					text-align: center;

					.kdc_wk_item_label {
						margin-left: -100%;
					}
				}
			}
		}

		&.vertical {
			height: 100%;

			.label_slider {
				flex-shrink: 0;

				&.left,
				&.right {
					width: auto;
					height: 50upx;
				}
			}

			.slider_bar {
				margin-left: -18upx;
			}

			.kdc_wk {
				top: 0upx;

				.kdc_wk_item {
					.kdc_wk_item_label {
						margin-left: 100%;
						margin-top: -15upx;
					}
				}
			}
		}
	}
	
	@keyframes roteScaleTop_BG{
		0%{
			transform: scale(0.9) translateY(20rpx) rotate(-45deg);
			opacity: 0;
		}
		100%{
			transform: scale(1)  translateY(0rpx) rotate(-45deg);
			opacity: 1;
		}
	}
	@keyframes roteScaleTop{
		0%{
			transform: scale(0.9) translateY(20rpx);
			opacity: 0;
		}
		100%{
			transform: scale(1)  translateY(0rpx);
			opacity: 1;
		}
	}
</style>
