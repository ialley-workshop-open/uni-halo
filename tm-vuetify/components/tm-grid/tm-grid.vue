<template>
	<view class="tm-grid ">
		<tm-row :custom-class="border ? '  border-grey-lighten-4-a-1 round-5 overflow ' +(black_tmeme?' bk ':'') : ''">
			<tm-col
				:maxCol="maxGrid"
				:custom-class="(border ? ((index+1)<=(colNum-1)*grid?'border-grey-lighten-4-b-1 ':'') + ((index + 1) % grid ? 'border-grey-lighten-4-r-1 ' : ' ') : '') + (black_tmeme?' bk ':'')"
				 v-for="(item, index) in listData" :key="index" :grid="col" justify="center"
				align="middle"
				:color="bgColor"
				>
				<view @click.stop="onclick(index,item)" class="tm-grid-hover flex-center flex-col "  :style="{height:height_s+'px'}">
					
					<view class=" pb-6 flex-shrink px-10 " style="">
						<view class="tm-grid-icon flex-shrink"  v-if="item.dot" >
							
							<tm-badges  :color="item.color?item.color:color_tmeme" @click="clickDot(index,item)"  v-if="item.dotIcon" :offset="[10,0]" :dot="false" :icon="item.dotIcon" ></tm-badges>
							<tm-badges  @click="clickDot(index,item)" v-if="!item.dotIcon" :offset="[10,0]" :dot="true"  ></tm-badges>
							
							
						</view>
						<tm-icons :prefx="item['prefx']?item['prefx']:''" :color="item.color?item.color:color_tmeme" :size="item.iconSize?item.iconSize:iconSize"
							:name="item.icon?item.icon:''"></tm-icons>
					</view>
					<view class="flex-center fulled">
						<text class="text-size-s  text-align-center"
							:class="[item.fontColor?'text-'+item.fontColor:'text-'+fontColor]">{{ item.text?item.text:'' }}</text>
					</view>
				</view>
			</tm-col>

		</tm-row>
	</view>
</template>

<script>
	/**
	 * 九宫格
	 * @description 九宫格,快速建立宫格列表，如果想要个性化推荐tm-row tm-col建立。
	 * @property {Boolean} border = [] 默认：false,是否显示边框
	 * @property {Boolean} black = [] 默认：null,暗黑模式
	 * @property {String} color = [] 默认：primary,图标主题色。
	 * @property {String} bg-color = [grey-lighten-5] 默认：'',宫格背景主题色。
	 * @property {String} font-color = [] 默认：grey-darken-1,文字颜色
	 * @property {Number} icon-size = [] 默认：40,图标大小
	 * @property {Number} height = [] 默认：140,高度，单位upx
	 * @property {Number} maxGrid = [] 默认：12,布局的列表，比如我想一行5个，就可以用到此属性，设置为10，然后grid=2即可。
	 * @property {Number} grid = [] 默认：4,一行几个。
	 * @property {Array} list = [] 默认：[],列表数据。
	 * @property {Function} change 项目被点击，返回的参数：{index:索引,data:项目的数据}
	 * @property {Function} click-dot 右上角的角标被点击触发。
	 * @example <tm-grid :list="[{ text: '应用配置', icon: 'icon-aliwangwang' , size:40 }]"></tm-grid>
	 */
	
	import tmRow from "@/tm-vuetify/components/tm-row/tm-row.vue"
	import tmCol from "@/tm-vuetify/components/tm-col/tm-col.vue"
	import tmBadges from "@/tm-vuetify/components/tm-badges/tm-badges.vue"
	import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
	export default {
		components:{tmRow,tmCol,tmBadges,tmIcons},
		name: 'tm-grid',
		props: {

			black:{
				type:String|Boolean,
				default:null
			},
		
			// 是否显示边框。
			border: {
				type: Boolean,
				default: false
			},
			// 主题色。
			color: {
				type: String,
				default: 'primary'
			},
			// 背景主题色。
			bgColor: {
				type: String,
				default: ''
			},
			fontColor: {
				type: String,
				default: 'grey-darken-1'
			},
			// 一行几个。
			grid: {
				type: Number,
				default: 4
			},
			iconSize: {
				type: Number,
				default: 40
			},
			height: {
				type: Number,
				default: 140
			},
			list: {
				type: Array,
				default: () => {
					return [];
				}
			},
			// 跟随主题色的改变而改变。
			fllowTheme:{
				type:Boolean|String,
				default:true
			},
			//默认计算方式是12列布局。
			maxGrid:{
				type:Number,
				default:12
			}

		},
		computed: {
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
			col: function() {
				return isNaN(this.maxGrid / this.grid) ? 4 : this.maxGrid / this.grid;
			},
			listData: function() {
				let gs = this.grid - Math.floor(this.list.length / this.grid);
				return this.list;
			},
			gridNum:function(){
				return this.grid;
			},
			colNum:function(){
				let ts = parseInt(this.listData.length/this.grid);
				ts = this.listData.length/this.grid>ts?ts+1:ts;
				return ts;
			},
			height_s:function(){
				return uni.upx2px(this.height)||70
			}
		},
		data() {
			return {
				hoverClass: ''
			};
		},
		methods: {
			onclick(index, item) {
				this.$emit('change', {
					index: index,
					data: item
				})
			},
			clickDot(index, item) {
				this.$emit('click-dot', {
					index: index,
					data: item
				})
			}
		},
	};
</script>

<style lang="scss" scoped>
.tm-grid{
	.tm-grid-icon{
		
		
	}
}
</style>
