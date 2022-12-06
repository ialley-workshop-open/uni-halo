<template>
	<view @click="$emit('click',$event)" class="tm-loadding flex-center vertical-align-middle">
		<!-- 加载中。 -->
		<view style="line-height: 0;" v-if="model=='load'" class="tm-loadding-load d-inline-block vertical-align-middle">
			<tm-icons  dense :name="icon?icon:'icon-loading'"  :color="color?color:'grey'"></tm-icons>
		</view>
		<view style="line-height: 0;" v-if="model=='fail'" class="tm-loadding-error d-inline-block vertical-align-middle">
			<tm-icons  dense :name="icon?icon:'icon-wind-cry'"  :color="color?color:'red'"></tm-icons>
		</view>
		<view style="line-height: 0;" v-if="model=='success'" class="tm-loadding-error d-inline-block vertical-align-middle">
			<tm-icons  dense :name="icon?icon:'icon-wind-smile'" :color="color?color:'green'"></tm-icons>
		</view>
		<text class="text-size-s pl-12" :class="['text-'+(color?color:text[model].color)]">{{label?label:text[model].text}}</text>
	</view>
	
</template>

<script>
	/**
	 * 加载状态
	 * @description 为了方便管理数据加载提示。在全为true时，fail最先展示 ，其次success,其次load.
	 * @property {Boolean} load = [true|false] 默认true,优先级最低。
	 * @property {Boolean} success = [true|false] 默认false,优先级高于load。
	 * @property {Boolean} fail = [true|false] 默认false,优先级高于success。
	 * @property {String} label = [] 默认 '',自定义文本
	 * @property {String} icon = [] 默认 '',自定义图标
	 * @property {String} color = [] 默认 '',自定义主题
	 * @property {Function} click 点击事件
	 * @example <tm-loadding ></tm-loadding>
	 */
	import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
	export default {
		components:{tmIcons},
		name:"tm-loadding",
		props:{

			// 优先级最低。
			load:{
				type:Boolean,
				default:true
			},
			//优先级最高。
			fail:{
				type:Boolean,
				default:false
			},
			//优先级高于load
			success:{
				type:Boolean,
				default:false
			},
			label:{
				type:String,
				default:''
			},
			icon:{
				type:String,
				default:''
			},
			color:{
				type:String,
				default:''
			}
		},
		computed:{
			model:function(){
				
				if(this.fail) return 'fail';
				if(this.success) return 'success';
				if(this.load) return 'load';
				return 'load';
			}
		},
		data() {
			return {
				text:{
					load:{
						text:"加载中...",
						color:"grey"
					},
					fail:{
						text:"加载失败...",
						color:"red"
					},
					success:{
						text:"加载成功...",
						color:"green"
					},
					loadmore:{
						text:"上拉加载更多",
						color:"grey"
					},
					nomore:{
						text:"没有更多了哦",
						color:"grey"
					}
				}
			};
		}
	}
</script>

<style lang="scss" scoped>
	.tm-loadding{
		.tm-loadding-load{
			animation: xhRote 0.8s infinite linear;
		}
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
