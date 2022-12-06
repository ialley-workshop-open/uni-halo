<!-- 开关。 -->
<template>
	<view @click="onclick" class="d-inline-block tm-switch " >
		<view class="tm-switch-wk relative " :style="[{width:width+'rpx',height:(height+4)+'rpx'}]">
			<view class="tm-switch-bg  round-l-24 round-r-24 flex-between"
			:class="[bgColorCusjs,loaddingState?'opacity-7':'']"
			
			>
				<view  class="text-size-xs tm-switch-txt text-align-center flex-center" style="width:50%">
					<text>{{text[0]?text[0]:''}}</text>
				</view>
				<view   class="text-size-xs tm-switch-txt text-align-center  flex-center" style="width:50%">
					<text class="pr-8">{{text[1]?text[1]:''}}</text>
				</view>
				
				
			</view>
			<!-- bar -->
			<view  class="tm-switch-wk-bar absolute round-24 white  flex-center " 
			:style="[
				{transform:changValue?`translateX(${(width-(width/2+4))}rpx)`:`translateX(2rpx)`},
				{width:(width/2-4)+'rpx',height:(height-4)+'rpx'}
			]"
			:class="[changValue?'shadow-'+color+'-10':'',changValue?'on aniOn':'aniOff']">
				<text v-if="loaddingState" class="iconfont icon-loading" :class="[loaddingState?'load':'',`text-${color_tmeme}`]"></text>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 开关
	 * @property {String|Boolean} value = [true|false] 同v-model一样的值，如果需要双向绑定需要value.sync，推荐使用v-model
	 * @property {String|Number|Boolean|Object} name = [] 自定义数据，change时携带。
	 * @property {Function} change {checked,value:携带的name数据}
	 * @property {Boolean} disabled = [true|false] 默认：false, 禁用
	 * @property {String} color = [] 默认：primary, 主题色
	 * @property {Boolean} black = [true|false] 默认：false, 暗黑模式
	 * @property {Boolean} loadding = [true|false] 默认：false, 是否加载中
	 * @property {Array} text = [true|false] 默认： ['开','关'], 左右两边的字符
	 * @property {Number} width = [] 默认：100,单位rpx，宽度
	 * @property {Number} height = [] 默认：50,单位rpx，高度
	 * @property {String} offBgcolor = [] 默认：'grey-lighten-2 text-grey', 主题色可以是文字色组合来改变文字和背景色.
	 * @example <tm-switch v-model="checked"></tm-switch>
	 * 
	 */
	export default {
		name: 'tm-switch',
		model: {
			prop: 'value',
			event: 'input'
		},
		props:{
			value:{
				type:String|Boolean,
				default:false
			},
			name:{
				type:String|Number|Boolean|Object,
				default:''
			},
			// 禁用。
			disabled: {
				type:Boolean|String,
				default:false
			},
			loadding: {
				type:Boolean|String,
				default:false
			},
			color:{
				type:String,
				default:'primary'
			},
			// 暗黑
			black: {
				type:Boolean|String,
				default:null
			},
			// 左右两边的字符。
			text:{
				type:Array,
				default:()=>{
					return ['开','关']
				}
			},
			width:{
				type:String|Number,
				default:100
			},
			height:{
				type:String|Number,
				default:50
			},
			offBgcolor:{
				type:String,
				default:'grey-lighten-2 text-grey'
			},
			// 跟随主题色的改变而改变。
			fllowTheme:{
				type:Boolean|String,
				default:true
			}
		},
		watch: {
			value: function(newval, oldval) {
				
				if (newval !== oldval) {
					if (!this.jiancMax()) {
						this.changValue = false;
						return;
					}
				}
			}
		},
		computed: {
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
			changValue: {
				get: function() {
					return this.value;
				},
				set: function(newValue) {
					this.$emit('input', newValue)
					// 如果不想用v-model. 直接使用value,需要:value.sync
					this.$emit('update:value', newValue);
					
				}
			},
			loaddingState:function(){
				return this.loadding;
			},
			bgColorCusjs(){
				if(this.disabled) {
					if(this.black_tmeme){
						return 'grey-darken-4   bk';
					}else{
						return this.color_tmeme+' opacity-5';
					}
				}
				
				if(this.black_tmeme){
					if(this.changValue) return this.color_tmeme + ' bk ';
					if(!this.changValue) return 'grey-darken-1 bk ';
					
				}else{
					if(this.changValue) return this.color_tmeme + ' text-white ';
					if(!this.changValue) return this.offBgcolor;
				}

				
			}
		},
		data() {
			return {
				animationOn:null,
				animationOff:null,
				aniData:null,
			};
		},
		mounted() {
			
		},
		methods: {
			
			
			// 检查是否超过了最大选择。
			jiancMax() {
				if(this.disabled) return false;
				return true;
			},
			onclick(e) {
				if (this.disabled||this.loaddingState) return;
				if (!this.jiancMax()) {
					return;
				}
				this.changValue = !this.changValue;
				this.change();
			},
			change() {
				
				this.$nextTick(function(){
					this.$emit('change', {
						checked: this.changValue,
						value: this.name
					});
				})
			
			}
		},
	}
</script>

<style lang="scss" scoped>
.tm-switch{
	vertical-align: middle;
	.tm-switch-wk{
		// width: 100rpx;
		// height: 52rpx;
	}
	.tm-switch-bg{
		width: 100%;
		height: 100%;
		transition: all 0.5s;
		
		.tm-switch-txt{
			// width: 50upx;
			height: 100%;
			// line-height: 48upx;
		}
	}
	.tm-switch-wk-bar{
		left: 4rpx;
		top: 4rpx;
		// width:40rpx;
		// height: 46rpx;
		transition: all 0.35s ease-in-out;
		.load{
			animation: xhRote 0.8s infinite linear;
		}
	}
}
.aniOn{
	left: inherit;
	
}
.aniOff{
	right: inherit;
}




@keyframes xhRote{
	0%{
		transform: rotate(0deg);
	}
	
	100%{
		transform: rotate(360deg);
	}
}
</style>
