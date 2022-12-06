<template>
	<view class="tm-coupon ">
		<view :class="[`round-${round} `]">
			<view :class="[disabled?'gray-100 opacity-4':'']" class="flex-start  " style="height: 150rpx;">
				<view :class="[color_tmeme,black?'bk':'',text?'text':'',`round-r-${round} round-l-${round}`]" class=" flex-center flex-col px-24 flex-shrink fulled-height">
					<view v-if="!h_objData.img">
						<text v-show="h_objData.saleSplit" class="text-size-s">{{h_objData.saleSplit}}</text>
						<text class=" text-weight-b" style="font-size:60rpx;">{{h_objData.sale}}</text>
						<text v-show="h_objData.suffix" class="text-size-s">{{h_objData.suffix}}</text>
					</view>
					<view v-if="h_objData.img">
						<image style="width: 100rpx;height: 100rpx;" class="rounded" :src="h_objData.img"></image>
					</view>
					<text v-show="h_objData.saleLable" class="text-size-xs text-align-center">{{h_objData.saleLable}}</text>
				</view>
				<view :class="[color_tmeme,black?'bk':'',text?'text':'',`round-l-${round} round-r-${round}`]" class=" flex-start fulled-height fulled overflow">
					<view class="opacity-2" style="height: 100%;width: 0px;border-style: dashed; border-width: 0.5px;"></view>
					<view class="px-24 flex-between fulled" >
						<view class="flex-col">
							<text v-show="h_objData.title" class="text-size-n text-weight-b d-block">{{h_objData.title}}</text>
							<text v-show="h_objData.time" class="text-size-xxs d-block">{{h_objData.time}}</text>
						</view>
						<view @click="onclick" class=" flex-shrink" :class="[h_objData.title&&h_objData.time?'pl-24':'']">
							<view :class="[color_tmeme,black?'bk':'',text?'':'text']" class="text-size-xs d-block round-24 px-24 py-6 ">{{h_objData.btnText}}</view>
						</view>
					</view>
					
				</view>
			</view>
			<view class="py-10 px-24 white" v-show="h_objData.label">
				<text  class="text-size-xs d-block text-overflow-1 opacity-6">{{h_objData.label}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 优惠券
	 * @property {String|Number} shadow = [] 默认：6，投影
	 * @property {String|Number} round = [] 默认：4，圆角
	 * @property {String | Boolean} text = [true|false] 默认：false，是否为文本模式，即减淡背景颜色。
	 * @property {String | Boolean} black = [true|false] 默认：false，是否开启暗黑模式
	 * @property {String | Boolean} disabled = [true|false] 默认：false，是否禁用（已使用）
	 * @property {String | Boolean} hdata = [] 默认：｛｝，数据格式见文档
	 * @property {String} color = [] 默认：primary，主题颜色名称
	 * @property {Function} click 整个组件点击事件,返回项目数据
	 * @example <tm-coupon :hdata="d_1"></tm-coupon>
	 */
	export default {
		name:"tm-coupon",
		props:{
			// 跟随主题色的改变而改变。
			fllowTheme:{
				type:Boolean|String,
				default:false
			},
			shadow: {
				type: String|Number,
				default: 3
			},
			round: {
				type: String|Number,
				default: 3
			},
			// 是否为文本模式，即减淡背景颜色。
			text: {
				type: String | Boolean,
				default: false
			},
			// 是否开启暗黑模式
			black: {
				type: String | Boolean,
				default: null
			},
			// 是否已经使用。
			disabled: {
				type: String | Boolean,
				default: false
			},
			// 主题颜色名称
			color: {
				type: String,
				default: 'primary'
			},
			hdata:{
				type:Object,
				default:()=>{
					return {}
				}
			}
		},
		computed:{
			black_tmeme: function() {
				if (this.black !== null) return this.black;
				return this.$tm.vx.state().tmVuetify.black;
			},
			color_tmeme:function(){
				if(this.$tm.vx.state().tmVuetify.color!==null&&this.$tm.vx.state().tmVuetify.color && this.fllowTheme){
					return this.$tm.vx.state().tmVuetify.color;
				}
				return this.color;
			},
			h_objData:function(){
				let ps = {
						img:'',//礼品图片，提供了图片，不显示数字和数字券说明。
						sale:'0',
						saleSplit:'￥',
						saleLable:'',
						title:'',
						time:'',
						btnText:'去使用',
						label:'',
						suffix:''
					}
				if(typeof this.hdata !== 'object') return ps;
				ps = {...ps,...this.hdata};
				return ps;
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			onclick(e) {
				if(this.disabled) return;
				this.$emit('click',this.h_objData);
			}
		},
	}
</script>

<style lang="scss">

</style>
