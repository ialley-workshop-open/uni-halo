<template>
	<view class="tm-rate d-inline-block">
		<view @touchstart="ishover=false" @touchend="ishover=disabled?false:true" v-for="(item,index) in num" :key="index" class="d-inline-block" :class="[ishover&&index+1==indexStar?'ani':'','pr-'+margin]">
			<tm-icons :black="black_tmeme" dense @click="clicSelect(index+1)" :size="size" :color="index+1 <= indexStar?color_tmeme:uncolor"
				:name="icon"></tm-icons>
		</view>
		<slot name="default" :num="num"><text v-if="showNum" :class="['text-'+color_tmeme]">{{indexStar}}</text></slot>
	</view>
</template>

<script>
	/**
	 * 评分
	 * @property {String} color = [] 默认：primary，选中的颜色
	 * @property {String} uncolor = [] 默认：grey-lighten-2，未选中的颜色
	 * @property {Number} num = [] 默认：5，数量
	 * @property {Number} value = [] 默认：0，当前的评分，推荐：value.sync或者v-model.
	 * @property {Number} size = [] 默认：32，单位upx,图标大小。
	 * @property {Number} margin = [] 默认：16，单位upx,间隙。
	 * @property {Boolean} disabled = [] 默认：false，是否禁用。
	 * @property {Boolean} black = [] 默认：null，暗黑模式。
	 * @property {Boolean} show-num = [] 默认：false，是否展示评分数字。
	 * @property {Boolean} icon = [] 默认：icon-collection-fill，图片名称，可以自定义其它的。
	 * @property {String} name = [] 默认：''，提交表单时的的字段名称标识
	 * @property {Function} change 评分改变时触发，参数当前的评分。
	 */
	import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
	export default {
		components:{tmIcons},
		name: "tm-rate",
		model: {
			prop: "value",
			event: "input"
		},
		props: {
			//提交表单时的的字段名称
			name:{
				type:String,
				default:''
			},
			color: {
				type: String,
				default: "primary"
			},
			uncolor: {
				type: String,
				default: "grey-lighten-2"
			},
			black:{
				type:Boolean|String,
				default:null
			},
			num: {
				type: Number,
				default: 5
			},
			value: {
				type: Number,
				default: 0
			},
			size: {
				type: Number,
				default: 42
			},
			margin: {
				type: Number,
				default: 16
			},
			disabled: {
				type: Boolean,
				default: false
			},
			showNum:{
				type: Boolean,
				default: false
			},
			icon:{
				type: String,
				default: 'icon-collection-fill'
			},
			// 跟随主题色的改变而改变。
			fllowTheme:{
				type:Boolean|String,
				default:true
			}
		},
		computed: {
			black_tmeme:function(){
				if(this.black!==null) return this.black;
				return this.$tm.vx.state().tmVuetify.black;
			},
			color_tmeme:function(){
				if(this.$tm.vx.state().tmVuetify.color!==null&&this.$tm.vx.state().tmVuetify.color && this.fllowTheme){
					return this.$tm.vx.state().tmVuetify.color;
				}
				return this.color;
			},
			indexStar: {
				get: function() {
					
					return this.value;
				},
				set: function(val) {
					let dval = val;
					if(val > this.num) dval = this.num;
					this.$emit("input",val)
					this.$emit("update:value",val)
					this.$emit("change",val)
				
				}
			}
		},
		data() {
			return {
				ishover:false,
			};
		},
		methods: {
			clicSelect(index) {
				if (this.disabled) return;
				this.indexStar = index;
				
			}
		},
	}
</script>

<style lang="scss" scoped>
	.tm-rate{
		.ani {
			animation: ani 0.2s  linear;
		}
	}
	
	@keyframes ani {
		0% {
			transform: scale(0.85)
		}
	
		50% {
			transform: scale(1.2)
		}
	
		100% {
			transform: scale(0.85)
		}
	}
</style>
