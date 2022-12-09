<template>
	<!-- 基础容器 -->
	<view
		
		@click="$emit('click', $event)"
		class="sheet  fulled"
		:style="[
			bgColor?{backgroundColor: bgColor }:'',
			widths?{width:widths}:'',
			heights?{height:heights}:'',
		]"
		:class="[
			text ? 'text' : '',
			flat ? 'flat' : '',
			'shadow-' + shadowthemeName + '-' + shadow,
			'round-' + round,
			black_tmeme ? 'bk' : '',
			black_tmeme == 'true' || black_tmeme === true ? 'grey-darken-5' : (bgColor?'':color),
			dense === true || dense == 'true' ? 'nom' : '',
			'mx-'+margin[0],'my-'+margin[1],
			'px-'+padding[0],'py-'+padding[1],
			classs,
			border ? 'border-a-1' : '',
			outlined ? 'outlined' : ''
		]"
		
	>
		<view class="fulled" >
			<slot name="default"></slot>
		</view>
	</view>
</template>
<script>
	/**
	 * 基础容器
	 * @description 基本是大部分组件的基础组件。
	 * @property {String | Boolean} black = [true|false] 暗黑模式。
	 * @property {String} classname = [] 自定认容器类
	 * @property {String|Number} round = [] 圆角
	 * @property {Array} margin = [] 外间距默认[32,32]
	 * @property {Array} padding = [] 内间距默认[32,32]
	 * @property {Boolean|String} dense = [] 默认false,去除内部和外部间距。
	 * @property {String|Number} width = [100%|auto] 宽度数字时单位为upx.可以是百分比
	 * @property {String|Number} height = [100%|auto] 宽度数字时单位为upx.可以是百分比
	 * @property {String} color = [white|blue|primary] 主题颜色名称。默认：white
	 * @property {String} bgColor = [] 自定义背景颜色rgb,rgba,#0000等格式。
	 * @property {String|Number} shadow = [5|10] 投影大小
	 * @property {Boolean|String} border = [true|false] 是否开启边线
	 * @property {Boolean|String} flat = [true|false] 是否开启扁平模式。
	 * @property {Boolean|String} text = [true|false] 是否开启文本模式
	 * @example  <tm-sheet :margin="[32,32]" >9</tm-sheet>
	 */
export default {
	props: {
		black: {
			type: String | Boolean,
			default: null
		},
		classname: {
			type: String,
			default: ''
		},
		round: {
			type: String | Number,
			default: '4'
		},
		margin:{
			type:Array,
			default:()=>{return [32,32]; }
		},
		padding:{
			type:Array,
			default:()=>{return [32,32]; }
		},
		dense: {
			type: Boolean|String,
			default: false
		},
		width: {
			type: String | Number,
			default: 'auto'
		},
		height: {
			type: String | Number,
			default: 'auto'
		},
		// 主题颜色名称。
		color: {
			type: String,
			default: 'white'
		},
		// 自定义背景色。
		bgColor: {
			type: String,
			default: ''
		},
		shadow: {
			type: String | Number,
			default: 5
		},
		border: {
			type: Boolean|String,
			default: false
		},
		outlined: {
			type: Boolean|String,
			default: false
		},

		flat: {
			type: Boolean,
			default: false
		},
		// 是否为文本模式，即减淡背景颜色。
		text: {
			type: String | Boolean,
			default: false
		}
	},

	computed: {
		// 投影的颜色名字。
		shadowthemeName: function() {
			if (!this.color) return 'none';
			return this.color.split('-')[0];
		},
		classs: function() {
			return ' ' + this.classname + ' ';
		},
		widths: function() {
			if (typeof this.width === 'string') {
				if (/([rpx|upx|rem|em|vx|vh|px|%]|auto)$/.test(this.width)) {
					return this.width;
				}
				return uni.upx2px(parseInt(this.width)) + 'px';
			}

			if (typeof this.width == 'number') return uni.upx2px(this.width) + 'px';
		},
		heights: function() {
			if (typeof this.height === 'string') {
				if (/([rpx|upx|rem|em|vx|vh|px|%]|auto)$/.test(this.height)) {
					return this.height;
				}
				return uni.upx2px(parseInt(this.height)) + 'px';
			}
			if (typeof this.height == 'number') return uni.upx2px(this.height) + 'px';
		},
		black_tmeme:function(){
			if(this.black!==null) return this.black;
			return this.$tm.vx.state().tmVuetify.black;
		}
	},

};
</script>
<style lang="scss" scoped>
.nom{
	margin: 0 !important;
	padding: 0 !important;
}
</style>
