<template>
	<view class="tm-position relative ">
		<view class="tm-position-content">
			<slot name="default"></slot>
		</view>
		<view :style="{
			top:position_s.top==true?0:'null'+'px',
			bottom:position_s.bottom==true?0:'null'+'px',
			transform:`translateY(${offset[1]}px) translateX(${offset[0]}px)`,
			
		}" class="tm-position-body absolute" :class="[
			position_s.left?'flex-start':'',
			position_s.right?'flex-end':'',
		]" >
			<slot name="position"></slot>
		</view>
	</view>
</template>

<script>
	/**
	 * 定位组件
	 * @property {Object} position = [] 位置{top:false,left:false,right:false,bottom:false}
	 * @property {Array} offset = [] 默认：[0,0]，偏移x,y
	 */
	export default {
		name:"tm-position",
		props:{
			position:{
				type:Object,
				default:()=>{
					return {};
				}
			},
			offset:{
				type:Array,
				default:()=>{
					return [0,0];
				}
			},
	
		},
		computed:{
			position_s:function(){
				let p = {
						top:false,
						left:false,
						right:false,
						bottom:false
					};
					return {...p,...this.position}
			},
		},
		data() {
			return {
				height:0
			};
		},
		async mounted() {
			// this.$nextTick(async function(){
			// 	let syinfo = await this.$Querey('.tm-position-content',this).catch(e=>{})
			// 	console.log(syinfo);
			// 	this.height = syinfo[0].height;
			// })
		}
	}
</script>

<style lang="less">
.tm-position{
	.tm-position-body{
		width: 100%;
	}
	.tm-position-content{
		
	}
}
</style>
