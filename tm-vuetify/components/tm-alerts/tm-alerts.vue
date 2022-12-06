<template>
	<!-- 提示框 -->
	<view :animation="animation" v-if="show" @click="onclick" @tap="onclick" class="tm-alerts  text-size-n "
		:class="[color_tmeme,(outlined||outlined=='true')?'outlined':'','round-'+round,black_tmeme?'bk':'',
		text=='true'||text?'text':'',
		`mx-${margin[0]} my-${margin[1]} shadow-${color_tmeme}-${shadow}`
		]" 
		 >
		<view  class=" flex-start" :class="[dense===true||dense=='true'?'py-16 px-32':'py-32 px-32']">
			
			<view v-if="leftIcon&&leftIcon!='true'" class="body-left ">
				<tm-icons :color="(text||outlined)?color_tmeme:iconColor" :dense="true" :name="leftIcon" size="32"></tm-icons>
			</view>
			
			<view v-if="valueType===true" @click.stop="openUrl(label)" class="body-center text-overflow">{{label[rangKey]?label[rangKey]:label}}</view>
			<view v-if="valueType===false"  class="tm--alerts--id body-center" :style="{height:sliderwidth.height}">
				<swiper v-if="sliderwidth.width"  :vertical="vertical" :style="{height:sliderwidth.height,width:sliderwidth.width}" :interval="interval_vs" circular autoplay :duration="duration_vs" >
					<swiper-item @click.stop="openUrl(item)"  v-for="(item,index) in label" :key="index" class="body-center text-overflow" style="line-height: 50upx;" :style="{height:sliderwidth.height}">
						{{item[rangKey]?item[rangKey]:item}}
					</swiper-item>
				</swiper>
			</view>
			<view v-if="url && !close" class="body-right text-align-right">
				<tm-icons :color="(text||outlined)?color_tmeme:iconColor" :dense="true" :name="rightIcon" size="28"></tm-icons>
			</view>
			<view v-if="close" class="body-right text-align-right">
				<tm-icons  @click="closeview" :color="(text||outlined)?color_tmeme:iconColor" :dense="true" name="icon-times" size="28"></tm-icons>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 消息提示框
	 * @property {String | Boolean} dense = [true|false] 默认：true，是否减小边距。
	 * @property {Array} margin = [] 默认：[32,24]，边距。
	 * @property {String|Number} shadow = [] 默认：6，投影
	 * @property {String|Number} round = [] 默认：4，圆角
	 * @property {String|Number} duration = [] 默认：500，轮播速度。
	 * @property {String|Number} interval = [] 默认：1500，轮播间隙。
	 * @property {String | Boolean} outlined = [true|false] 默认：false，是否为边框样式
	 * @property {String | Boolean} text = [true|false] 默认：false，是否为文本模式，即减淡背景颜色。
	 * @property {String | Array} label = [true|false] 默认：""，当为数组时，自动变成轮播信息。
	 * @property {String | Boolean} black = [true|false] 默认：false，是否开启暗黑模式
	 * @property {String} color = [] 默认：primary，主题颜色名称
	 * @property {String} icon-color = [] 默认：white，图标的主题颜色名称
	 * @property {Boolean} url = [true|false] 默认：false，是否显示打开链接图标
	 * @property {String} left-icon = [] 默认："icon-lightbulb"，左边图标名称
	 * @property {String} right-icon = [] 默认："icon-angle-right"，右边图标名称
	 * @property {String} rang-key = [] 默认："text"，当label娄数组时需要提供此值。
	 * @property {String | Boolean} ani = [true|false] 默认：false，是否禁用动画，
	 * @property {String | Boolean} vertical = [true|false] 默认：false，是否是纵向。
	 * @property {String | Boolean} close = [true|false] 默认：false， 是否显示关闭图标，
	 * @property {Function} click 整个组件点击事件
	 * @example <tm-alerts  label="9"></tm-alerts>
	 */
	import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"

	export default {
		components:{tmIcons},
		name:"tm-alerts",
		model:{
			prop:'value',
			event:'input'
		},
		props: {
			// 是否减小边距。
			dense: {
				type: String | Boolean,
				default: true
			},
			// 是否为边框样式，
			outlined: {
				type: String | Boolean,
				default: false
			},
			// 边距。
			margin: {
				type: Array,
				default: ()=>{
					return [32,24];
				}
			},
			shadow: {
				type: String|Number,
				default: 4
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
			// 当为数组时，自动变成轮播信息。
			label:{
				type:String | Array,
				default:""
			},
			// 当label娄数组时需要提供此值。
			rangKey:{
				type:String,
				default:"text"
			},
			// 是否开启暗黑模式
			black: {
				type: String | Boolean,
				default: null
			},
			// 主题颜色名称
			color: {
				type: String,
				default: 'primary'
			},
			// 图标主题颜色名称
			iconColor: {
				type: String,
				default: 'white'
			},
			// 是否显示为打开链接的消息提醒。
			url: {
				type: Boolean,
				default: false
			},
			// 左边图标名称
			leftIcon: {
				type: String,
				default: 'icon-lightbulb'
			},
			// 右边图标名称
			rightIcon: {
				type: String,
				default: 'icon-angle-right'
			},
			//是否禁用动画，
			ani: {
				type: Boolean,
				default: false
			},
			// 是否显示关闭图标
			close: {
				type: Boolean,
				default: false
			},
			// 跟随主题色的改变而改变。
			fllowTheme:{
				type:Boolean|String,
				default:true
			},
			duration:{
				type:Number,
				default:1000
			},
			vertical:{
				type:Boolean,
				default:false
			},
			//间隔，单位ms
			interval:{
				type:Number,
				default:1500
			},
			value: {
				type: Boolean|String,
				default: true
			},
		},
		data() {
			return {
				
				animation: null,
				outid: 'alert-88',
				sliderwidth:{height:0,width:0},
			};
		},
		computed:{
			// valueType:true,//默认是string.
			valueType:function(){
				
				if(Array.isArray(this.label)){
					 return false;
				}
				
				return true;
			},
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
			duration_vs:function () {
				return this.duration;
			},
			interval_vs:function () {
				return this.interval;
			},
			show:{
				get:function(){
					return this.value;
				},
				set:function(val){
					this.$emit('input',val)
					this.$emit('update:value',val)
				},
			},
		},
		mounted() {
			let t= this;
			this.$Querey('.tm--alerts--id',this,50).then(res=>{
				let wh = res[0];
				t.sliderwidth = {
					height:uni.upx2px(50)+'px',width:(wh.width||0)+'px'
				}
			}).catch(e=>{})
			
		},
		methods: {
			onclick(e) {
				this.$emit('click', e);
			},
			openUrl(e) {
				this.$emit('click', e);
				if(typeof e !== 'object' || !e['url']) return;
				
				let urls = getCurrentPages();
				let url = e.url;
				if (urls.length >= 5) {
					uni.redirectTo({
						url:url,
						fail: e => {
							console.error(e);
						}
					});
				} else {
					uni.navigateTo({
						url: url,
						fail: e => {
							console.error(e);
						}
					});
				}
			},
			closeview(e) {
				let t  = this;
				var animation = uni.createAnimation({
					duration: 500,
					timingFunction: 'ease'
				});
				this.animation = animation;
				animation
					.scale(0.7, 0.7)
					.opacity(0)
					.step();
				this.outid = setTimeout(() => {
					t.show = false;
					t.animation = null;
				}, 500);
				
			}
		}
	};
</script>

<style lang="scss" scoped>
	.tm-alerts {
		
		.gs {
			width: 50upx;
			min-width: 70upx;
		}

		.body-left,
		.body-right {
			@extend .gs;
		}

		.body-center {
			width: 100%;
			
		}
	}
</style>
