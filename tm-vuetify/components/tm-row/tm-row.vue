<template>
	<view @click="$emit('click',$event)" :gutter="gutter" class="tm--row" :class="[preatClass]" >
		<view   class="tm--row--body" :style="style" :class="[customClass]">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	/**
	 * 栅格排版ROW
	 * @description 请注意，它需要配合col使用，不能单独使用。
	 * @property {String} justify = [center|flex-start|flex-start|space-between|space-around] 横向对齐方向
	 * @property {String} align = [center|flex-start|flex-end] 子项目纵向对齐方式。
	 * @property {String|Number} width = [100%|auto] 宽度，可以是数字其它百分比，数字时单位为px 
	 * @property {String|Number} height = [100%|auto] 高度，可以是数字其它百分比，数字时单位为px 
	 * @property {Array} gutter = [] 默认：[0,0]左右，和上下间距。优先级别小于col组件内部的间距。
	 * @property {String} custom-class = [] 自定义类。
	 */
	export default {
		name:"tm-row",
		props:{
			// 自定义类。
			customClass: {
				type: String,
				default: ''
			},
			// 自定义类。
			preatClass: {
				type: String,
				default: ''
			},
			// 子项目横向对齐方式。
			justify:{
				type:String,
				default:'flex-start'
			},
			// 子项目纵向对齐方式。
			align:{
				type:String,
				default:'center'
			},
			width: {
				type: String | Number,
				default: '100%'
			},
			height: {
				type: String | Number,
				default: ""
			},
			// 左右，和上下间距。优先级别小于col组件内部的间距。
			gutter:{
				type:Array,
				default:()=>{
					return [0,0]
				}
			}
		},
		data() {
			return {
				width_px:0,
				children_num:0,
				style:'',
			};
		},
		updated() {
			this.getContinaRect()
		},
		mounted() {
			this.getContinaRect()
		},
		methods:{
			getContinaRect(){
				let t = this;
				this.$Querey('.tm--row',this).then(preantw=>{
					t.width_px = preantw[0].width;
					// #ifndef H5
					t.children_num = t.$children.length;
					// #endif
					// #ifdef H5
					t.children_num = t.$children[0].$children[0].$children[0].$children.length;
					// #endif
					t.style = uni.$tm.objToString({
						'justify-content':t.justify,
						'align-items':t.align,
						'width':t.width,
						'height':!t.height?'default':(uni.upx2px(t.height)+'px')
					},';');
					
				}).catch(e=>{})
			}
		}
	}
</script>

<style lang="scss" scoped>
.tm--row{
	display: flex;
	flex-flow: row wrap;
	width: auto;
	.tm--row--body{
		height: 100%;
		flex-flow: row wrap;
	}
}
</style>
