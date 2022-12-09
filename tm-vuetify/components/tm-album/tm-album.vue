<template>
	<view class="tm-album">
		
		<view class="tm-album-body flex flex-wrap" :class="[`ml--${gutter}`]" :style="{width:alb_wk_body_size+'rpx'}">
			<block v-for="(item,index) in listData" :key="index">
				<view v-if="index<max-1" :style="{width:alb_body_size+'rpx'}"  class="tm-album-item">
					<view @click="clickAlbum(item,index)" :class="[`py-${item[textKey]?0:gutter}`,`px-${gutter}`]">
						<view :style="{width:alb_size+'rpx',height:height||alb_size+'rpx'}" class="relative flex-center">
							<tm-images :model="model" :round="round"  :width="alb_size" :height="(height||alb_size)" :src="item[rangKey]"></tm-images>
							<view class="tm-album-action absolute fulled fulled-height t-0 l-0" :class="[
								actionsPos=='top'?'flex-top-end':'',
								actionsPos=='bottom'?'flex-end-right':'',
							]">
								<slot name="actions" :item="{data:item,index:index}"></slot>
							</view>
						</view>
						<view v-if="item[textKey]" class="py-24 text-align-center text-overflow">
							<slot name="default" :text="{text:item[textKey]}">
								<text class="text-size-s ">{{item[textKey]}}</text>
							</slot>
						</view>
					</view>
					
				</view>
			</block>
			
			<view v-if="listData.length>max-1" :style="{width:alb_body_size+'rpx'}" class="tm-album-item " :class="[`round-${round}`,black_tmeme?'bk':'']">
				<view @click="more" :class="[`px-${gutter}`]">
					<view :style="{width:alb_size+'rpx',height:height||alb_size+'rpx'}" class="relative flex-center flex-col" :class="[`round-${round}`,color_tmeme]">
						<view><text class="iconfont icon-angle-right text-size-xl"></text></view>
						<view class="text-size-s mt-12">更多</view>
					</view>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 相册集
	 * @property {Array} list = [] 数据列表，可以是对象数组，也可以是字符串数组，也可对象和字符串数组混合型。
	 * @property {Number} grid = [] 默认：4，默认一行几个。
	 * @property {Number} height = [] 默认：0，默认宽度和高度是相同的。指定相册集的高度。如果指定了高度将不使用计算的高度。
	 * @property {Number} gutter = [] 默认：4，图片之间的间隙。
	 * @property {Number} round = [] 默认：3，项目的圆角
	 * @property {Number} max = [] 默认：999，最大可展示数量，超过不显示，以更多项目代替。
	 * @property {String} rang-key = [] 默认：'src'，如果list的项目是对象，则需要提供图片字段名称
	 * @property {String} text-key = [] 默认：'text'，如果list的项目是对象，则需要提供图片标题字段名称
	 * @property {Boolean|String} preview = [] 默认：true，点击图片是否可以预览。
	 * @property {Boolean|String} actions-pos = [bottom|top] 默认：bottom，可选bottom,top,内部压在图片上方的元素位置。内容可在插槽actions中布局。
	 * @property {String} color = [] 默认：primary，主题色名称，显示更多项目的背景主题色。
	 */
	import tmImages from '@/tm-vuetify/components/tm-images/tm-images.vue';
	export default {
		name:"tm-album",
		components: {
			tmImages
		},
		props: {
			list: {
				type: Array,
				default: ()=>[]
			},
			//指定相册集的高度。如果指定了高度将不使用计算的高度。
			height:{
				type:Number,
				default:0
			},
			grid:{
				type:Number,
				default:4
			},
			gutter:{
				type:Number,
				default:4
			},
			round:{
				type:Number,
				default:3
			},
			max:{
				type:Number,
				default:999
			},
			rangKey: {
				type: String,
				default: 'src'
			},
			textKey: {
				type: String,
				default: 'text'
			},
			preview:{
				type:Boolean,
				default:true
			},
			actionsPos:{
				type:String,
				default:'bottom',//bottom，top
			},
			black:{
				type:Boolean,
				default:null
			},
			// 跟随主题色的改变而改变。
			fllowTheme:{
				type:Boolean|String,
				default:true
			},
			color:{
				type:String,
				default:"primary"
			},
			model:{
				type:String,
				default:'scaleToFill',//bottom，top
			}
		},
		data() {
			return {
				alb_size:0,
				alb_body_size:0,
				alb_wk_body_size:0,
				listAlbum:[]
			};
		},
		watch:{
			list:{
				deep:true,
				handler(){
					
					this.listData = this.chuliList(this.list) 
				}
			}
		},
		created(){
			this.listData = this.chuliList(this.list)
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
			listData:{
				get:function () {
					return this.listAlbum; 
				},
				set:function (val) {
					this.listAlbum = val;
				}
			}
		},
		async mounted() {
			this.setInits();
		},
		updated() {
			this.setInits();
		},
		methods: {
			//处理数据，以标准化。
			chuliList(){
				let list = [...this.list];
				let p = [];
				for (var i = 0; i < list.length; i++) {
					if(typeof list[i] == 'string'){
						let ls = {}
						ls[this.rangKey] = list[i];
						ls[this.textKey] = null;
						p.push(ls)
					}else if(typeof list[i] == 'object'){
						let ls = {}
						ls[this.rangKey] = '';
						ls[this.textKey] = null;
						ls={...ls,...list[i]}
						p.push(ls)
					}
				}
				
				return p;
			},
			async setInits(){
				this.$nextTick(async function() {
					let t = this;
					let p = await t.$Querey('.tm-album',t,0).catch(e =>{});
					if (!p[0]) return;
					let grid = t.grid || 1;
					let size = (p[0].width+t.gutter)/grid;
					let gutter = t.gutter*2
					let ratio = 750/uni.upx2px(750);
					let blv = size * ratio - gutter;
					t.alb_body_size = size * ratio;
					t.alb_wk_body_size = p[0].width*ratio+t.gutter*2+(grid*2);
					t.alb_size = blv;
				
				});
			},
			clickAlbum(item,index){
				if(this.preview){
					uni.$tm.preview(item[this.rangKey],this.listData,this.rangKey);
				}
				this.$emit('click',{item,index})
			},
			more(){
				this.$emit('more')
			}
			
		},
	}
</script>

<style lang="scss" scoped>
.tm-album{
	.tm-album-action{
		
	}
}
</style>
