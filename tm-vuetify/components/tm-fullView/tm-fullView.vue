<template>
	<view
		class="tm-fullView fulled "
		:class="[$tm.vx.state().tmVuetify.black ? 'grey-darken-6 bk' : '',classCus,text?'text':'',bgColor]"
		:style="{
			width: width?(width + 'px'):'100%',
			minHeight: height?(height + 'px'):'100%'
		}"
	>
		<slot name="default" :info="{width:width,height:height,sysinfo:sysinfo}"></slot>
	</view>
</template>

<script>
/**
 * 满屏
 * @description 满屏，即占满一屏，用于单页使用。
 * @property {String|Array} class-name = [] 默认 '',自定义类
 * @property {String} bg-color = [] 默认 'grey',背景颜色
 * @property {Boolean} text = [true|false] 默认 true,淡背景模式。
 * @example <tm-fullView ></tm-fullView>
 */
export default {
	name: 'tm-fullView',
	props:{
		className:{
			type:String|Array,
			default:''
		},
		bgColor:{
			type:String,
			default:'grey'
		},
		text:{
			type:Boolean|String,
			default:true
		}
	},
	computed:{
		classCus:function(){
			if(typeof this.className === 'string') return this.className;
			if(typeof this.className === 'object' && Array.isArray(this.className)){
				return  this.className.join(" ");
			}
		}
	},
	data() {
		return {
			width: 0,
			height: 0,
			sysinfo:null,
		};
	},
	created(){
		this.sysinfo = uni.getSystemInfoSync();
		this.width = this.sysinfo.windowWidth;
		this.height = this.sysinfo.windowHeight;
	},
	mounted() {
		
	}
};
</script>

<style lang="scss" scoped>
	.tm-fullView{
		.tm-fullView-body{
			margin: 0;
			padding:0;
		}
	}
</style>
