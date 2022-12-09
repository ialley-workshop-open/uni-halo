<template>
	<view class="tm-propress" :style="{ 
		width: width_c ,
		}">
		<view
			class="tm-propress-wk "
			:style="{
				height: height_upx,
				overflow:loading?'hidden':'inherit'
			}"
		>
			<view :class="[shape=='round'?'round-24':'',bgColor,black_tmeme?'bk':'']" class="tm-propress-wk-statick "></view>
			<view :animation="animationData" :class="[black_tmeme?'bk':'',shape=='round'?'round-24':'',colors.theme?colors.color:'',loading?'ani':'']"
				class="tm-propress-wk-active flex-end" 
				:style="{
					height: height_upx,
					width:baifenbi,
					background:colors.theme?'default':colors.color
				}"
			>
			
			<block v-if="value>0&&showValue">
				<slot name="default" :value="value">
					<view  class="tm-propress-wk-active-label flex-center px-10 round-24" 
					:class="[black_tmeme?'bk':'',colors.theme?colors.color:'']" 
					:style="{background:colors.theme?'default':colors.color}">
						<text>{{value}}%</text>
					</view>
				</slot>
			</block>
			
			</view>
			
		</view>
	</view>
</template>

<script>
/**
 * 进度条
 * @property {Function} change value变化时触发.
 * @property {Function} input value变化时触发.
 * @property {Number} value = [] 通过value来赋值进度,如果想双向绑定需要value.sync,建议使用v-model.
 * @property {Number} width = [] 宽度,默认自动宽度,单位rpx,也可输入百分比或者其它类型比如5px
 * @property {Number} height = [] 高度,默认6,单位upx,也可输入百分比或者其它类型比如5px
 * @property {String} shape = [round|square] 默认round,方形:square,半圆形:round.
 * @property {String} color = [] 默认primary,可以是16进制,rgb,rgba,主题色名称.
 * @property {String} bg-color = [] 默认 grey-lighten-4 ,背景颜色
 * @property {Boolean} loading = [true|false] 默认false,自动加载中...
 * @example <tm-propress v-model="checked"  ></tm-propress>
 */
export default {
	name: 'tm-propress',
	model:{
		prop:"value",
		event:"input"
	},
	props: {
		// 单位upx
		width: {
			type: Number|String,
			default: 0
		},
		// 单位upx
		height: {
			type: Number|String,
			default: 8
		},
		value:{
			type:Number,
			default:0
		},
		showValue:{
			type:Boolean|String,
			default:true,
		},
		// 方形:square,半圆形:round.
		shape:{
			type:String,
			default:"round"
		},
		color:{
			type:String,
			default:"primary"
		},
		loading:{
			type:Boolean,
			default:false
		},
		bgColor:{
			type:String,
			default:'grey-lighten-4'
		},
		// 跟随主题色的改变而改变。
		fllowTheme:{
			type:Boolean|String,
			default:true
		},
		black: {
			type: Boolean,
			default: null
		},
	},
	computed: {
		black_tmeme: function() {
			if (this.black !== null) return this.black;
			return this.$tm.vx.state().tmVuetify.black;
		},
		colors:function(){
			return this.$TestColor(this.color_tmeme);
		},
		color_tmeme:function(){
			if(this.$tm.vx.state().tmVuetify.color!==null&&this.$tm.vx.state().tmVuetify.color && this.fllowTheme){
				return this.$tm.vx.state().tmVuetify.color;
			}
			return this.color;
		},
		width_upx: {
			get:function(){
				return this.width_c;
			},
			set:function(val){
				if(val==''||val==0||typeof val === 'undefined'){
					 this.width_c = '100%';
					 return;
				}
				let reg = /(vw|vh|rem|em|\%|upx|rpx|auto|px)/g;
				if (reg.test(val)) {
					this.width_c = val;
					return
				}
				this.width_c = val+'rpx';
				
			}
		},
		height_upx: function() {
			let reg = /(vw|vh|rem|em|\%|upx|rpx|auto|px)/g;
			if (reg.test(this.height)) {
				return this.height;
			}
			return this.height+'rpx';
		},
		baifenbi:function(){
			if(this.loading) return "100rpx";
			let bl = this.value ;
			if(typeof bl !=='number') bl =0;
			if(bl>=100) bl =100;
			if(bl<=0) bl =0;
			this.$emit("input",bl);
			this.$emit("update:value",bl);
			this.$emit("change",bl);
			return bl + "%"
		}
	},
	data() {
		return {
			width_c:0,
			animationData:"",
			animation:null,
			tmiddd:55656
		};
	},
	created() {
		this.width_upx = this.width;
	},
	destroyed() {
		clearInterval(this.tmiddd)
	},
	mounted() {
		this.getRect()
		
	},
	updated() {
		this.getRect()
	},
	methods: {
		getRect(){
			let t =this
			this.$Querey(".tm-propress",this,0).then((p)=>{
				if(!p) return;
				if(!p[0].width) return;
				t.width_upx = p[0].width+'px';
				if(t.loading){
					t.startAni();
				}
			}).catch(e=>{})
		},
		async startAni(){
			// clearInterval(this.tmiddd)
			let t = this;
			var animation = uni.createAnimation({
			      duration: 1000,
			      timingFunction: 'linear',
			    })
			    this.animation = animation
			    animation.opacity(0).translateX(t.width_c).step()
			    this.animationData = animation.export()
			    this.tmiddd = setInterval(async function() {
					t.animationData = ""
					animation.opacity(1).translateX(0).step({duration:0})
					t.animationData = animation.export()
					await uni.$tm.sleep(50)
					animation.opacity(0).translateX(t.width_c).step()
					t.animationData = animation.export()
			    }.bind(this), 1000)
		}
	},
};
</script>

<style lang="scss" scoped>
.tm-propress {
	.tm-propress-wk {
		position: relative;
		.tm-propress-wk-statick,
		.tm-propress-wk-active {
			height: 100%;
			
		}
		.tm-propress-wk-active {
			position: absolute;
			top: 0;
			left: 0;
			transition:0.35s; 
			
			.tm-propress-wk-active-label{
				
				height: 30rpx;
				font-size:22rpx;
				max-width: 100rpx;
				
			}
			// &.ani{
			// 	transition:1s; 
			// 	animation-name: linef;
			// 	animation-duration: 1s;
			// 	animation-timing-function: linear;
			// 	animation-iteration-count: infinite;
			// }
		}
	}
}

@keyframes linef{
	0%{
		// left:0;
		transform: translateX(0);
		opacity: 0.4;
	}
		
	100%{
		// left:100%;
		transform: translateX(311px);
		opacity: 1;
	}
}
</style>
