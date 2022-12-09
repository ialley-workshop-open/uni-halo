<template>
	<view class="tm-poups "  @click.stop="">

		<block v-if="position_sv != 'center'">
			<view v-show="value==true&&position_sv != 'center'" class="tm-poup " :class="[
						isFilter?'blur':'',
						position_sv == 'center' ? 'tm-poup-center' : '',
						position_sv !='center'?position_sv:'',
						isClickbled?'isClickbled':''
					]" @click.stop.prevent="overClick"  @touchmove.stop.prevent="stopMove" :style="{
						backgroundColor: overColor,
						width:'100%',height:'100%'
					}">
				<!-- 内容 -->
				<!-- <view class="tm-poup-wk bottom">{{ show ? 'on' : 'off'}}</view> -->
				<scroll-view :animation="aniData" @click.stop.prevent="" class="tm-poup-wk dhshiKa" scroll-y="true" :class="[
							position_sv == 'top'?'round-b-' + round:'',
							position_sv == 'bottom'?'round-t-' + round:'', 
							position_sv, aniOn ? 'on ' : 'off', 
							black_tmeme ? 'grey-darken-5 bk' : bgColor
						]" :style="{
							width: (position_sv == 'top' || position_sv == 'bottom') ? '100%' : width_w,
							height: position_sv == 'right' || position_sv == 'left' ?'100%' : height_h,
							
						}">
					<view :class="[clssStyle]" >
						<slot></slot>
					</view>
				</scroll-view>
			</view>
			<view class="bottomHeight"></view>
		</block>

		<view v-if="value===true&&position_sv == 'center'" class="tm-poup " :class="[
				isFilter?'blur':'',
				position_sv == 'center' ? 'tm-poup-center' : ''
			]" @click="overClick" @touchmove.stop.prevent="stopMove" :style="{
				backgroundColor: overColor,
				width:sysInfo.screenWidth+'px',height:'100%'
			}">
			<!-- 内容 -->
			<scroll-view :animation="aniData" @click.stop.prevent="" class="tm-poup-wk " scroll-y="true" :class="[
					`round-${round}`,aniOn ? 'on' : 'off', position_sv,
					black_tmeme ? 'grey-darken-5 bk' : bgColor
				]" :style="{
					width: width_w,
					height: height_h
				}">
				<view :class="[clssStyle]">
					<slot></slot>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	/**
	 * poup弹出层
	 * @description  poup弹出层，上下，左右方向。
	 * @property {Boolean} value = [true|false] 使用时value.sync可同步，也可不同步。等同于v-model
	 * @property {Boolea} v-model 显示和关闭。
	 * @property {String} position = [bottom|top|left|right|center] 方向可选bottom,left,right,top,center
	 * @property {Function} change 改变时会调用此函数，参数e等同于v-model和value
	 * @property {String|Number} width 宽，位置为left,right是起作用。可以是30%或者数字(单位upx)
	 * @property {String|Number} height 宽，位置为top,bottom是起作用。可以是30%或者数字(单位upx)
	 * @property {String|Number} round 圆角0-25
	 * @property {String|Boolean} black = [true|false] 暗黑模式
	 * @property {Boolean} over-close = [true|false] 是否点击遮罩关闭。
	 * @property {Boolean} is-filter = [true|false] 是否背景模糊
	 * @property {String} clss-style = [] 自定内容的类
	 * @property {String} bg-color = [white|blue] 默认：white,白色背景；请填写背景的主题色名称。
	 * @property {String} over-color = [] 默认：rgba(0,0,0,0.3), 遮罩层颜色值不是主题。
	 * @example <tm-poup height="85%"  v-model="show"></tm-poup>
	 */
	export default {
		name: 'tm-poup',
		props: {
			bgColor: {
				type: String,
				default: 'white'
			},
			// 遮罩层颜色。
			overColor: {
				type: String,
				default: 'rgba(0,0,0,0.3)'
			},
			black: {
				type: Boolean | String,
				default: null
			},
			clssStyle: {
				type: String,
				default: ''
			},
			value: {
				type: Boolean,
				default: false
			},
			// bottom,left,right,top
			position: {
				type: String,
				default: 'bottom'
			},
			round: {
				type: String | Number,
				default: '10'
			},
			width: {
				type: String | Number,
				default: '30%'
			},
			height: {
				type: String | Number,
				default: 220
			},
			overClose: {
				type: Boolean,
				default: true
			},
			isFilter: {
				type: Boolean,
				default: true,
			},
			//允许穿透背景遮罩。
			isClickbled: {
				type: Boolean,
				default: false
			}
		},
		model: {
			prop: 'value',
			event: 'input',
			sysInfo: {},
		},
		watch: {
			value:function(val){
				this.$emit('change', val);
				if(val){
					this.open()
				}else{this.close()}
			},
			position: function() {
				this.position_sv = this.position
			}
		},
		created() {
			this.sysInfo = uni.getSystemInfoSync();
		},
		computed: {
			black_tmeme: function() {
				if (this.black !== null) return this.black;
				return this.$tm.vx.state().tmVuetify.black;
			},
			width_w: function() {
				let w = this.$TestUnit(this.width);
				let i = w.value;
				if (w.type == 'number') {
					i = w.value + 'px';
				}
				return i;
			},
			height_h: function() {
				let w = this.$TestUnit(this.height);
				let i = w.value;
				if (w.type == 'number') {
					i = w.value + 'px';
				}
				return i;
			},

		},
		data() {
			return {
				aniOn: false,
				closeTimid: null,
				position_sv: this.position,
				dhshiKa:true,//是否结束动画
				aniData:null,
				timdiiid:6369784254,
				
			};
		},
		deactivated() {
			clearTimeout(this.closeTimid)
		},
		destroyed() {
			clearTimeout(this.closeTimid)
		},
		mounted() {
			if(this.value){
				this.open()
			}
		},
		methods: {
			overClick() {
				if (!this.overClose) return;
				this.close();
			},
			close() {
				let t = this;	
				clearTimeout(this.timdiiid)
				this.dhshiKa=false;
				t.aniOn=false;
				this.createBtT(this.position_sv,'off').then(()=>{
					t.$emit('input', false);
					t.closeTimid = null;
					t.dhshiKa = true;
					// t.$emit('change', false);
					// console.log('off');
				})
			},
			open() {
				let t = this;
				clearTimeout(this.timdiiid)
				
				
				this.dhshiKa=false
				this.aniOn=true;
				
				this.createBtT(this.position_sv,'on').then(()=>{
					t.dhshiKa=true
					
					t.isclick=false
					// console.log('on');
				})
				
			},
			//下至上。
			createBtT(pos,type){
				let t = this;
				this.aniData = '';
				let aniData = uni.createAnimation({
					duration:240,
					timingFunction: 'ease',
				})
				this.aniData = aniData;
				if(pos=='bottom'){
					if(type=='on'){
						aniData.translateY('0%').step();
						this.aniData = aniData.export()
						
					}
					if(type=='off'){
						aniData.translateY('100%').step();
						this.aniData = aniData.export()
						
					}
				}else if(pos=='top'){
					if(type=='on'){
						aniData.translateY('0%').step();
						this.aniData = aniData.export()
						
					}
					if(type=='off'){
						aniData.translateY('-100%').step();
						this.aniData = aniData.export()
						
					}
				}else if(pos=='left'){
					if(type=='on'){
						aniData.translateX('0%').step();
						this.aniData = aniData.export()
						
					}
					if(type=='off'){
						aniData.translateX('-100%').step();
						this.aniData = aniData.export()
						
					}
				}else if(pos=='right'){
					if(type=='on'){
						aniData.translateX('0%').step();
						this.aniData = aniData.export()
						
					}
					if(type=='off'){
						aniData.translateX('100%').step();
						this.aniData = aniData.export()
						
					}
				}else if(pos=='center'){
					
					if(type=='on'){
						aniData.opacity(1).scale(1).step();
						this.aniData = aniData.export()
						
					}
					if(type=='off'){
						aniData.opacity(0).scale(0.6).step();
						this.aniData = aniData.export()
						
					}
				}
				
				return new Promise(res=>{
					t.timdiiid = setTimeout(()=>{
						t.aniData = null;
						res();
					},240)
				})
			},
			stopMove(e) {}
		}
	};
</script>

<style lang="scss" scoped>
	.bottomHeight{
		height: var(--window-bottom);
	}
	.tm-poup {
		position: fixed;
		z-index: 452;
		width: 100%;
		height: 100%;
		min-height: 100%;
		min-width: 100%;
		overflow: hidden;
		top: 0;
		left: 0;
		
		&.isClickbled {
			pointer-events: none;
		}
		&.okkk{
			pointer-events: none;
		}
		&.blur {
			backdrop-filter: blur(3px);
		}

		&.on {
			animation: opta 1s ease;
		}

		&.off {
			animation: opta_off 0.24s ease;
		}
		.tm-poup-wk {
			position: absolute;
			overflow: hidden;
			pointer-events: auto;
			// transition: all 0.3s;
			&.bottom {
				transform: translateY(100%);
				width: 100%;
				bottom: 0;
				
			}

			&.top {
				top: 0;
				left: 0;
				width: 100%;
				transform: translateY(-100%);
			}

			&.left {
				top: 0;
				transform: translateX(-100%);
				border-radius: 0 !important;
				left: 0;
			}

			&.right {
				top: 0;
				right: 0;
				transform: translateX(100%);
				border-radius: 0 !important;

			}

			&.center {
				opacity:0;
				transform: scale(0.6);
			}
		}

		&.tm-poup-center {
			display: flex;
			justify-content: center;
			align-items: center;
			align-content: center;
			

			.tm-poup-wk {
				position: static;
			}

		}
	}

	@keyframes opta {
		from {
			opacity: 0.3;
		}

		to {
			opacity: 1;
		}
	}

	@keyframes opta_off {
		from {
			opacity: 1;
		}

		to {
			opacity: 0;
		}
	}

	@keyframes bottomTtop {
		from {
			transform: translateY(100%);
		}

		to {
			transform: translateY(0%);
		}
	}

	@keyframes bottomTtop_off {
		from {
			transform: translateY(0%);
		}

		to {
			transform: translateY(100%);
		}
	}

	@keyframes topTbottom {
		from {
			transform: translateY(-100%);
		}

		to {
			transform: translateY(0);
		}
	}

	@keyframes topTbottom_off {
		from {
			transform: translateY(0);
		}

		to {
			transform: translateY(-100%);
		}
	}

	@keyframes leftTright {
		from {
			transform: translateX(-100%);
		}

		to {
			transform: translateX(0);
		}
	}

	@keyframes leftTright_off {
		from {
			transform: translateX(0);
		}

		to {
			transform: translateX(-100%);
		}
	}

	@keyframes rightTleft {
		from {

			transform: translateX(100%);
		}

		to {
			transform: translateX(0%);
		}
	}

	@keyframes rightTleft_off {
		from {
			transform: translateX(0%);
		}

		to {
			transform: translateX(100%);
		}
	}

	@keyframes Centerleft {
		from {
			transform: scale(0.65);
			opacity: 0.3;
		}

		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	@keyframes Centerleft_off {
		from {
			transform: scale(1);
			opacity: 1;
		}

		to {
			transform: scale(0.65);
			opacity: 0.3;

		}
	}
</style>
