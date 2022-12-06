<template>
	<view class="tm-gap" :class="[vertical?'d-inline-block':'d-block']"
	:style="{
		width:vertical?gutter+'rpx':'auto',
		height:!vertical?gutter+'rpx':'auto',
	}"
	></view>
</template>

<script>
	/**
	 * 间隙
	 * @param {Number} gutter = [] 24 间隙
	 * @param {Boolean} vertical = [true/false] 默认：false 是否竖向。
	 */
	export default {
		name:"tm-gap",
		props:{
			gutter:{
				type:Number|String,
				default:24
			},
			vertical:{
				type:Boolean|String,
				default:false
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">

</style>
