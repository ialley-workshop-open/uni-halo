<!-- 横幅消息提醒。故名思义，即悬浮在顶部的消息条，只有点关闭才会消失，一般用来重要的中断提醒。 -->
<!-- 和tm-alerts有点类似，但作用不同 -->
<template>
	<view :animation="animation" v-if="show"  class="tm-banners  text-size-n "
		:class="[dense===true||dense=='true'?'dense-32':'',black_tmeme?'bk':'',color_tmeme,
		outlined||outlined=='true'?'outlined':'','round-'+round,text?'text':'']" 
		
		:style="widths"
		>
		<view class=" flex-start" :class="[dense===true||dense=='true'?'py-16 px-32 ':'py-32 px-32']">
			<view class="body-left ">
				<tm-icons :black="black_tmeme" :color="(text||outlined)?color_tmeme:iconColor" :dense="true" :name="leftIcon" size="32"></tm-icons>
			</view>
			<view  @click="onclick" @tap="onclick" class="body-center " :class="['text-overflow-'+col]">{{label}}</view>
			
			<view @click.stop="closeview" v-if="close" class="body-right text-align-right">
				<tm-icons :black="black_tmeme" :color="(text||outlined)?color_tmeme:iconColor" :dense="true" name="icon-times" size="28"></tm-icons>
			</view>
		</view>
	</view>
</template>

<script>

	/**
	 * 横幅消息提示框
	 * @property {String | Boolean} dense = [true|false] 默认：true，是否减小边距。
	 * @property {String | Boolean} outlined = [true|false] 默认：false，是否为边框样式
	 * @property {String} position = [top|bottom] 默认：top，位置
	 * @property {String | Boolean} text = [true|false] 默认：false，是否为文本模式，即减淡背景颜色。
	 * @property {String | Array} label = [true|false] 默认：""，当为数组时，自动变成轮播信息。
	 * @property {String | Boolean} black = [true|false] 默认：false，是否开启暗黑模式
	 * @property {String} color = [primary|blue|red|green|yellow|orange] 默认：primary，主题颜色名称
	 * @property {String} icon-color = [primary|blue|red|green|yellow|orange] 默认：primary，图标主题颜色名称
	 * @property {String} left-icon = [icon-lightbulb] 默认："icon-lightbulb"，左边图标名称
	 * @property {String | Boolean} ani = [true|false] 默认：false，是否禁用动画，
	 * @property {String | Boolean} close = [true|false] 默认：false， 是否显示关闭图标，
	 * @property { Number|String} y = [] 默认：0， 距离顶部的偏移量。
	 * @property { Number|String} width = [] 默认：'90%'， 宽度，数字，或者百度比。数字的单位是upx
	 * @property { Number|String} col = [] 默认：1， 多行模式。默认为1行，可选最多3行。
	 * @property { Number|String} round = [] 默认：2， 圆角。
	 * @property {Function} click 整个组件点击事件
	 * @example <tm-banners label="瞪村槈李厚厚霖无可奈何需"></tm-banners>
	 */
import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
export default {
	components:{tmIcons},
		name:'tm-banners',
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
			iconColor:{
				type: String,
				default: 'white'
			},
			// 左边图标名称
			leftIcon: {
				type: String,
				default: 'icon-lightbulb'
			},
			//是否禁用动画，
			ani: {
				type: Boolean,
				default: false
			},
			// 是否显示关闭图标
			close: {
				type: Boolean,
				default: true
			},
			// 距离顶部的偏移量。
			y: {
				type: Number|String,
				default: 16
			},
			// 距离顶部的偏移量。
			position: {
				type: String,
				default: 'top' //top|bottom
			},
			// 宽度，数字，或者百度比。数字的单位是upx
			width: {
				type: Number|String,
				default: '90%'
			},
			// 圆角
			round: {
				type: Number|String,
				default: '3'
			},
			// 多行模式。默认为1行，可选最多3行。
			col:{
				type: Number|String,
				default: 1
			},
			// 跟随主题色的改变而改变。
			fllowTheme:{
				type:Boolean|String,
				default:true
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
				
			};
		},
		computed:{
			show:{
				get:function(){
					return this.value;
				},
				set:function(val){
					this.$emit('input',val)
					this.$emit('update:value',val)
				},
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
			widths:function(){
				let topoffset = 0 + uni.upx2px(parseInt(this.y));
				
				
				if(isNaN(parseInt((this.width)))){
					return this.$tm.objToString({
						width:'100%',
						left:'0px',
						top:this.position=='bottom'?'inherit':`${topoffset}px`,
						bottom:this.position=='top'?'inherit':`${topoffset}px`
					});
				}
				if(String(this.width).indexOf('%')>-1||String(this.width).indexOf('vw')>-1){
					
					let num = parseFloat(this.width.replace(/(\%|vw|)/g,''));
					let blv = this.width.replace(/[\.|a-zA-Z0-9]/g,'');
					
					return this.$tm.objToString({
						width:this.width,
						left:(100-num)/2 + blv,
						top:this.position=='bottom'?'inherit':`${topoffset}px`,
						bottom:this.position=='top'?'inherit':`${topoffset}px`
					});
				}
				let sysinfo = uni.getSystemInfoSync();
				let wid = uni.upx2px(parseFloat(this.width));
				let lf = (sysinfo.windowWidth - wid) / 2;
				return this.$tm.objToString({
					width:uni.upx2px(parseFloat(this.width))+'px',
					left:lf+'px',
					top:this.position=='bottom'?'inherit':`${topoffset}px`,
					bottom:this.position=='top'?'inherit':`${topoffset}px`
				});
				
			}
		},
		mounted() {
			
			
		},
		methods: {
			onclick(e) {
				this.$emit('click', e);
			},

			closeview(e) {
				let t = this;
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
					t.animation=null;
				}, 500);
				
			}
		}
	};
	// 
</script>

<style lang="scss" scoped>
	.tm-banners {
		width: calc(100% - 32upx);
		left: 32upx;
		&.dense-32{
			width: calc(100% - 64upx);
		}
		position: fixed;
		z-index: 500;
		// color: #fff;
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
