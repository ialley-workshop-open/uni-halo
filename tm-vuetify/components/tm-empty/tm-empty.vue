<template>
	<view class="tm-empty flex-center flex-col my-32">

		<view class="py-32">
			<tm-icons @click="$emit('click')" :color="color" :name="icon?icon:listIcon[model].name" :size="size"></tm-icons>
		</view>
		<view class="text-size-n" :class="[
			`text-${color}`,
			'py-12'
		]">{{label?label:listIcon[model].label}}</view>
		<view>
			<slot></slot>
		</view>
	</view>
</template>

<script>
	/**
	 * 数据空
	 * @property {String} model = [bug|refresh] 默认bug,待扩展。
	 * @property {String} color = [] 默认grey-lighten-1,主题颜色。
	 * @property {Number} size = [] 默认120,图标大小,单位upx
	 * @property {String} label = [] 默认 '',自定义错误文字。
	 * @property {String} icon = [] 默认 '',自定义错误图片。
	 * @property {Function} click 点击图标或者图片时触发。
	 * @example <tm-empty></tm-empty>
	 */
	import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
	export default {
		components:{tmIcons},
		name: "tm-empty",
		props: {
			model: {
				type: String,
				default: 'refresh'
			},
			color: {
				type: String,
				default: 'grey-lighten-1'
			},
			size: {
				type: String|Number,
				default: 120
			},
			label:{
				type:String,
				default:''
			},
			//自定义图标图片。
			icon:{
				type:String,
				default:''
			}
		},
		data() {
			return {
				listIcon: {
					bug: {
						name: 'icon-bug-report',
						label: '软件出现了bug'
					},
					refresh:{
						name: 'icon-redo',
						label: '刷新试下'
					},
					listEmpty:{
						name: 'icon-box-fill',
						label: '数据为空哦'
					}
				}
			};
		}
	}
</script>

<style lang="scss">

</style>
