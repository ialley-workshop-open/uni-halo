<template>
	<view class="tm-sliderNav fulled-height">
		<scroll-view scroll-y :style="{
				height:activeHeight+'px',
				width:activeWidth+'px',
			}">
			<tm-listitem  :disabled="item['disabled']==true?true:false" :black="black_tmeme"
			@click="change(index)" 
			v-for="(item,index) in formaData" :key='index'
			:color="activeIndex==index?(text?' text ' + color_tmeme:'white'):bgColor" 
			:show-right-icon="false" 
			:margin="[0,0]" 
			:padding="[10,32]"
			:fontSize="fontSize"
			:class-style="activeIndex==index?`border-${color_tmeme}-l-2`:`border-${bgColor}-l-2`"
			round="0" shadow="0"
			>
			<tm-badges color='red' :fllowTheme="false" :offset="[12,-10]" v-if="item.dot>0&&dot" :dot="false" :label="item.dot"></tm-badges>
			<view class="" >
				<text :class="[`text-${activeIndex==index?color_tmeme:fontColor}`,item['disabled']?'opacity-3':'']">{{item[rangKey]}}</text>
			</view>
			</tm-listitem>
		</scroll-view>
	</view>
</template>

<script>

	/**
	 * 侧边导航
	 * @property {Number|String} height = [] 默认0，单位upx,自动使用父组件的高度。
	 * @property {Number|String} width = [] 默认190，单位upx,宽度
	 * @property {Number} round = [] 默认4，单位upx,圆角
	 * @property {Array} list = [] 默认[]，数据结构对象，必须需要含有唯一标识符id即可。[{title:'苏州'}],，可以含有dot,显示角标。每一个类目和子类可以含有disabled值，用来禁用类目或者选项。
	 * @property {String} rang-key = [] 默认'title'，数据结构对象中，需要展示标签的key
	 * @property {String} color = [] 默认 primary，主题色名
	 * @property {String} bg-color = [] 默认 grey-lighten-5，主题色名未选择时的背景色。
	 * @property {String} font-color = [] 默认 grey，未选中时的文字颜色
	 * @property {String} font-size = [] 默认 28，项目文字大小单位rpx
	 * @property {Boolean} black = [] 默认 false，是否暗黑模式。
	 * @property {Boolean} dot = [] 默认 false，是否显示角标数字,当前选中的数量。
	 * @property {Boolean} text = [] 默认 false，使用主题文本色为高亮色。
	 * @property {Function} change 每次选择变化都会触发全局change,
	 * @example <tm-sliderNav  :text="true" :list="list"></tm-sliderNav>
	 */

	import tmListitem from "@/tm-vuetify/components/tm-listitem/tm-listitem.vue"
	import tmGrouplist from "@/tm-vuetify/components/tm-grouplist/tm-grouplist.vue"
	import tmBadges from "@/tm-vuetify/components/tm-badges/tm-badges.vue"
	export default {
		components:{tmListitem,tmGrouplist,tmBadges},
		name:"tm-sliderNav",
		props:{
			// 高度，默认为0时，自动使用父组件的高度.单位upx
			height: {
				type: String | Number,
				default: 0
			},
			//单位upx
			width: {
				type: String | Number,
				default: 190
			},
			//单位upx
			round: {
				type: Number,
				default: 4
			},
			// 对象数组
			list:{
				type:Array,
				default:()=>{
					return [];
				}
			},
			// 显示标签的key.
			rangKey:{
				type:String,
				default:'title'
			},
			// 主题色名
			color:{
				type:String,
				default:'primary'
			},
			fontColor:{
				type:String,
				default:'grey-darken-1'
			},
			
			black:{
				type:Boolean|String,
				default:null
			},
			// 是否显示角标数字当前选中的数量。
			dot:{
				type:Boolean,
				default:true
			},
			// 使用主题文本色为高亮色。
			text:{
				type:Boolean,
				default:false
			},
			fontSize:{
				type:String|Number,
				default:'28'
			},
			// 未选择时的背景色。
			bgColor:{
				type:String,
				default:'grey-lighten-5'
			},
			// 跟随主题色的改变而改变。
			fllowTheme:{
				type:Boolean|String,
				default:true
			}
		},
		watch:{
			list:{
				deep:true,
				handler(){
					this.dataList = this.list;
				}
			}
		},
		data() {
			return {
				activeHeight:0,
				activeWidth:0,
				activeIndex:0,
				formaData:[]
			};
		},
		computed:{
			dataList:{
				get:function(){
						
						return this.formaData
					},
				set:function(val){
					let t = this;
					let p = [...val];
					for(let j=0;j<p.length;j++){
						if(!p[j].hasOwnProperty('dot')){
							p[j]['dot'] = 0;
						}
					}
				
					this.formaData = p;
				}
			},
			black_tmeme: function() {
				if (this.black !== null) return this.black;
				return this.$tm.vx.state().tmVuetify.black;
			},
			color_tmeme:function(){
				if(this.$tm.vx.state().tmVuetify.color!==null&&this.$tm.vx.state().tmVuetify.color && this.fllowTheme){
					return this.$tm.vx.state().tmVuetify.color;
				}
				return this.color;
			},
		},
		mounted() {
			let t = this;
			this.$nextTick(async function() {
				this.activeHeight = uni.upx2px(this.height);
				if (!this.activeHeight) {
					let wsz = await this.$Querey(".tm-sliderNav",this).catch(e=>{})
					this.activeHeight = wsz[0].height||250;
					this.activeWidth =uni.upx2px(this.width)||100;
				}
				this.dataList = this.list;
			});
		},
		methods: {
			change(index) {
				this.activeIndex=index;
				this.$emit('change',index);
			}
		},
	}
</script>

<style lang="scss">

</style>
