<!-- 需要配合，tm-row使用。，也可以单独使用。tm-col -->
<template >
	<view class="tm-col" :class="[widths?'':'tm-col-'+grid, 'ma-' + margin,'mb-'+bma[1],'mx-'+bma[0]]" 
	:style="{
		width:widths, 
		order: order,
		verticalAlign: align,
		
	}">
	
		<view class="tm-col-body  " @click="click" :style="{
		 textAlign:justify
		}" :class="['pa-' + padding, aligns,` ${customClass} `,'round-'+round,color]"><slot></slot></view>
	</view>
</template>

<script>
	/**
	 * 栅格排版COL
	 * @description 请注意，可以单独使用，也可搭配row使用。
	 * @property {String} color = [white|blue] 主题颜色名称更多请见文档
	 * @property {String} align = [top|bottom|middle] 默认top,内容纵向对齐方式
	 * @property {String} justify = [left|right|center] 内容横向对齐方式
	 * @property {String|Number} width = [100%] 宽度，可以是数字其它百分比，数字时单位为upx 
	 * @property {String|Number} grid = [1|2|3|6|12] 列宽默认1 1-12自动计算百分比。
	 * @property {String|Number} padding = [0] 内间距默认0 
	 * @property {String|Number} margin = [0] 外间距默认0
	 * @property {String} custom-class = [] 自定义类。
	 * @property {Number} round = [] 默认：0，圆角。
	 * @property {Function} click = [] 点击事件
	 * @property {Number} maxCol = [] 默认：12,布局的列表，比如我想一行5个，就可以用到此属性，设置为10，然后grid=2即可。
	 * @property {String|Number} order = [0|1|2|3|4] 排列的顺序 默认0 可以是1-12的数字或者字符串
	 */
export default {
	props: {
		// 自定义类。
		customClass: {
			type: String,
			default: ''
		},
		// 圆角。
		round: {
			type: String|Number,
			default: '0'
		},
		// 主题色。
		color: {
			type: String,
			default: ''
		},
		// 自定义宽度。可以是数字，单位如：100vw,5%,auto,优先级高于grid
		width: {
			type: String | Number,
			default: ''
		},

		// 列宽1-12自动计算百分比。
		grid: {
			type: String | Number,
			default: 1
		},
		// 内间距。
		padding: {
			type: String | Number,
			default: '0'
		},
		// 外间距。
		margin: {
			type: String | Number,
			default: '0'
		},
		// 子项目横向对齐方式。 left|right|center
		justify:{
			type:String,
			default:'center'
		},
		// 子项目纵向对齐方式。 top|bottom|middle
		align:{
			type:String,
			default:'top'
		},
		// 排列的顺序。
		order: {
			type: String | Number,
			default: '0'
		},
		maxCol:{
			type:Number,
			default:12
		}
	},
	data() {
		return {
		
			widths:'',
			bma:[0,0],
		
		};
	},

	computed: {
		maxCol_count:function() {
			return this.maxCol||12;
		},
		aligns: function() {
			if(this.justify == 'left') return 'flex-start';
			if(this.justify == 'right') return 'flex-end';
			if(this.justify == 'center') return 'flex-center';
		},

	},
	async mounted() {
		let pd = this.$tm.getParentAttr("tm-row",'gutter',this.$parent);
		if(pd) this.bma = pd;
		this.$nextTick(function(){
			this.c_width();
		})

	},
	methods: {
		click(e){
			this.$emit('click',e);
		},
		c_width() {
			let t = this;
				// 如果有自定义宽度，优先使用自定的宽度，否则使用grid的比例。
				if (t.width.indexOf('%') > -1 || t.width.indexOf('vw') > -1 || t.width.indexOf('vh') > -1) {
					t.widths = t.width;
					return ;
				}
				if (t.width === 'auto') {
					t.widths = "100%";
						return;
				}
				if (!isNaN(parseFloat(t.width))) {
					t.widths = uni.upx2px(parseInt(t.width)) + 'px';
					return ;
				}
				
				t.widths = (parseInt(t.grid) / t.maxCol_count) * 100 + '%';
				// console.log(t.maxCol_count);
			}
	},
};
</script>

<style lang="scss" scoped>
	.tm-col{
		height: inherit;
		display: inline-block;
		
		// #ifndef H5
		height: 100%;
		// #endif
		
		
		.tm-col-body{
			display: block;
			
		}
	}
</style>
