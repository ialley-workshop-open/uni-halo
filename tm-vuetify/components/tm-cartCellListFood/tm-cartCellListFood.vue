<template>
	<view class="tm-cartCellListFood px-20 py-32 flex-top-start" :class="[
		bgColor,
		black_tmeme ? 'grey-darken-4' : '',
		black_tmeme ? 'bk' : '',
		border === 'top' ? 'border-t-1' : '',
		border === 'bottom' ? 'border-b-1' : '',
	]">
		<view v-if="mdata[keyMap['img']]" class="tm-cartCellListFood-img" :style="{
			width:imgWidth+'rpx',
			height:imgWidth+'rpx'
		}">
			<tm-images :width="imgWidth" :height="imgWidth" :round="3"  :src="mdata[keyMap['img']]"></tm-images>
		</view>
		<view class="tm-cartCellListFood-r fulled ">
			<view class="pl-15">
				<view class="title  text-size-s text-weight-b text-overflow-2" style="line-height: 32rpx;"  :class="[black_tmeme ? 'bk' : '',]">
					{{mdata[keyMap['title']]}}
				</view>
				<view  style="min-height: 64rpx;" >
					<view v-if="!dense&&mdata[keyMap['label']]" class="tm-cartCellListFood-label text-size-s text-grey py-8">{{mdata[keyMap['label']]}}</view>
					<view v-if="mdata[keyMap['saleLabel']]&&!dense" class="tm-cartCellListFood-sale text-size-s text-grey">
						<block v-for="(item,index) in mdata[keyMap['saleLabel']]" :key="index">
							<tm-tags :black="black_tmeme" :color="color" v-if="index<4" size="xs">{{item}}</tm-tags>
						</block>
					</view>
				</view>
				<view class="tm-cartCellListFood-price flex-between">
					<view>
						<text class="text-size-xs text-red">￥</text>
						<text class="text-size-n text-red text-weight-b px-5">{{mdata[keyMap['price']]}}</text>
						<text v-if="mdata[keyMap['unit']]" class="text-size-xs text-grey pr-10">/{{mdata[keyMap['unit']]}}</text>
						<text v-if="mdata[keyMap['salePrice']]" class="text-delete text-size-xxs text-grey">￥{{mdata[keyMap['salePrice']]}}</text>
						
					</view>
					<view class="flex">
						<block v-if="cNum>0">
							<view :style="{
							width:`${actionSize}rpx`,
							height:`${actionSize}rpx`,
						}" :class="[color,black_tmeme ? 'bk' : '',]" @click="jian" class="tm-cartCellListFood-actions rounded  flex-center outlined">
								<text  class="iconfont icon-minus text-size-xxs"></text>
							</view>
							<view class="px-12 text-size-n " :class="[black_tmeme ? 'bk' : '',]">{{cNum}}</view>
						</block>
						<view :style="{
							width:`${actionSize}rpx`,
							height:`${actionSize}rpx`,
						}" :class="[color,`border-${color}-a-1`,black_tmeme ? 'bk' : '',]" @click="jia" class="tm-cartCellListFood-actions rounded  flex-center ">
							<text class="iconfont icon-plus text-size-xs"></text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 餐饮购物商品列表
	 * @property {Number} img-width = [] 默认：140，图片元素宽度，rpx单位。
	 * @property {Number} cart-num = [] 默认：0，当前销售的数量，需要cartNum.sync。
	 * @property {String} color = [] 默认：primary，主题色
	 * @property {String} bg-color = [] 默认：white，背景主题色
	 * @property {Boolean} dense = [ture|false] 默认：false，是否隐藏中间优惠和文字说明的结构，只保留标题和价格数量按钮。
	 * @property {Number} action-size = [] 默认：34，增减按钮大小。单位rpx
	 * @property {String} border = [top|bottom] 默认：top， 显示上边线还是下边线
	 * @property {Boolean} black = [ture|false] 默认：null，是否暗黑主题
	 * @property {Object} mdata = [] 默认：{}，数据结构
	 * @property {Object} key-map = [] 默认：{}，mdata的字段映射，每个人数据格式都不一样，如果你的数据和默认字段不一致，需要映射下关键字段。
	 * @property {Function} change 改变销售数量时触发，返回当前改变后的销售数量。
	 */
	import tmSliderNav from "@/tm-vuetify/components/tm-sliderNav/tm-sliderNav.vue"
	import tmImages from "@/tm-vuetify/components/tm-images/tm-images.vue"
	import tmTags from "@/tm-vuetify/components/tm-tags/tm-tags.vue"
	export default {
		components:{tmSliderNav,tmImages,tmTags},
		name:"tm-cartCellListFood",
		props:{
			imgWidth:{
				type:Number,
				default:140,
			},
			cartNum:{
				type:Number,
				default:0
			},
			color:{
				type:String,
				default:'primary'
			},
			bgColor:{
				type:String,
				default:'white'
			},
			// 字段映射表，每个人的mdata的数据字段不一样。如果不同就映射下吧。
			keyMap:{
				type:Object,
				default:()=>{
					return {
						img:'img',
						title:'title',
						label:'label',
						price:'price',
						salePrice:'salePrice',
						saleLabel:'saleLabel',
						unit:'unit',
						buy:'buy'
					}
				}
			},
			// 精简后，不显示简介文字和优惠文字，只显示标题，价格和数量
			dense:{
				type:Boolean|String,
				default:false
			},
			//增减按钮大小。单位rpx
			actionSize:{
				type:Number,
				default:38
			},
			// 显示上边线还是下边线。可选top / bottom
			border: {
				type: String,
				default: 'top'
			},
			black:{
				type:Boolean|String,
				default:null
			},
			mdata:{
				type:Object,
				default:()=>{
					// return {
					// 	img:'https://picsum.photos/300?k=2',
					// 	title:'特色单人套餐（任选）',
					// 	label:'这个产品是只有几个融会',
					// 	price:36.2,
					// 	salePrice:76.4,
					// 	saleLabel:['7折优惠','首单减3元'],
					// 	unit:'/斤'
					//  buy:0
					// }
					return {};
				}
			}
		},
		watch:{
			'mdata.buy':function(val){
				if(this.cart_num==val) return;
				this.cart_num = val;
			},
		},
		computed:{
			black_tmeme: function() {
				if (this.black !== null) return this.black;
				return this.$tm.vx.state().tmVuetify.black;
			},
			
			cart_num:{
				get:function(){
					return  this.cNum;
				},
				set:function(val){

					this.cNum = val;
					this.$emit("update:cartNum",val)
					// #ifdef H5
					this.$nextTick(function(){
						this.$emit("change",val)
					})
					// #endif
					
					// #ifndef H5
					this.$emit("change",val)
					// #endif
					
				}
			}
		},
		data() {
			return {
				cNum:0,
			};
		},
		mounted() {
			this.cNum = this.mdata.buy;
		},
		methods:{
			jian(){
				const buyNum = this.cNum;
				if(buyNum<=0) {
					this.cart_num = 0;
					return
				}
				this.cart_num  = buyNum-1
				
			},
			jia(){
				const buyNum = this.cNum;
				this.cart_num  = parseInt(buyNum) + 1

			},
		}
	}
</script>

<style lang="less">

</style>
