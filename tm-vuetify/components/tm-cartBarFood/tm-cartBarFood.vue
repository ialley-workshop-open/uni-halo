<template>
	<view class="tm-cartBarFood">
		<view
		@touchmove.stop.prevent="stopMove"
		@click.stop="openList=!openList"
			class="tm-cartBarFood-bg absolute"
			v-if="openList"
			:style="{
				height: sywi + 'px'
			}"
		></view>
		<view 
			:style="{
				width: position != 'static' ? wininfo.windowWidth - offsetLeft * 2 + 'px' : 'auto',
				left: position != 'static' ? offsetLeft + 'px' : '0px',
				top: position == 'top' ? top_px + 'px' : 'auto',
				bottom: position == 'bottom' ? bottom_px + 'px' : 'auto'
			}"
			class="tm-cartBarFood-body "
			:class="[
				
				position,
				border === 'top' ? 'border-t-1' : '',
				border === 'bottom' ? 'border-b-1' : '',
				'sheetIDX'
			]"
		>
			<view class="tm-cartBarFood-list white "
			:class="[
				black_tmeme ? 'grey-darken-5' : '',
				black_tmeme ? 'bk' : '',
			]"
			>
				<!-- :cartNum.sync="test" -->
				<view v-show="openList" class="pb-32">
					
					<view  @touchmove.stop.prevent="stopMove" class="flex-between px-32 py-24">
						<text class="text-size-s text-weight-b">已选商品</text>
						<view @click="clearEmpty" class="text-size-s text-grey">
							<tm-icons color="grey" size="20" name="icon-delete-fill"></tm-icons>
							清空购物车
						</view>
					</view>
					<block v-if="listData.length <= 0"><tm-empty label="没有商品,快去选购吧" model="listEmpty"></tm-empty></block>
					<view class="tm-cartBarFood-list-srcoll" >
						<block v-for="(item, index) in listData" :key="index">
							<tm-cartCellListFood :black="black_tmeme" :key="index" @change="listAddChange($event, index)" :mdata="item"  :cartNum.sync="item.buy" :color="color" dense ></tm-cartCellListFood>
						</block>
					</view>
					<!-- #ifndef H5 -->
					<view style="height:100upx;"></view>
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<view style="height:50upx;"></view>
					<!-- #endif -->
				</view>
			</view>
			
			<view :style="{ background: bgColor }" :class="[
				'on',
				black_tmeme ? 'grey-darken-5' : '',
				black_tmeme ? 'bk' : '',
				'round-' + round,
				bgTheme,
				
				]" class=" flex-between tm-cartBarFood-wk">
				<view class="flex-start">
					<view  @click="openlistfun" class="tm-cartBarFood-body px-32">
						<tm-badges  :offset="[10,-5]" v-if="sum.num > 0" :dot="false" :label="sum.num"></tm-badges>
						<view :class="[openList?'ani':'']">
							<tm-icons :black="black_tmeme"  :color="list.length > 0&&disabled==false ? color : colorGrey" :size="60" name="icon-shopping-cart-fill"></tm-icons>
						</view>
					</view>
					<view class="flex flex-col">
						<view class="text-weight-b" :class="[`text-${color}`]">
							<text class="text-size-xs">￥</text>
							<text class="text-size-lg">{{ sum.price }}</text>
						</view>
						<view v-if="label!=''&&label.length>0&&label!=true&&label!='true'" class="text-size-xs text-grey">{{label}}</view>
					</view>
				</view>
				<view class="pr-16"><tm-button :black="black_tmeme" @click="confirm" size="n" :theme="list.length > 0&&disabled==false ? btnColor : colorGrey" font-color="white" round="24">{{btnText}}</tm-button></view>
			</view>
			<!-- 安全区域的高度。 -->
			<view v-if="safe" class="safe--hei " :class="[
				black_tmeme ? 'grey-darken-5' : 'white',
				black_tmeme ? 'bk' : '',
			]"></view>
		</view>
	</view>
</template>

<script>
/**
 * 底部餐饮结算工具条
 * @property {Array} list = [] 默认：[],当前购物车产品列表，
 * @property {String} bg-theme = [] 默认："white",背景颜色主题名称
 * @property {String | Boolean} black = [true|false] 默认：null,暗黑模式。
 * @property {String} bg-color = [] 默认：'',自定义背景颜色。
 * @property {String} color = [] 默认：primary,文字默认激活色。
 * @property {String} btn-color = [] 默认：primary,默认按激活主题色。
 * @property {String} color-grey = [] 默认：gret,购物车为空时主题色。
 * @property {String} btnT-text = [] 默认：确认商品,确认按钮上的文字。
 * @property {String} position = [bottom|top|static] 默认：bottom,可选位置：bottom|top|static
 * @property {Number|String} top = [] 默认：0,距离顶部的距离：只有在position=='top'使用
 * @property {Number|String} bottom = [] 默认：0,距离底部的距离：只有在position=='bottom'使用
 * @property {String} border = [top|bottom] 默认：top,显示上边线还是下边线。可选top / bottom
 * @property {String|Number} offset-left = [] 默认：0,偏移量。即离左边的间距。如果提供，自动居中出现两边间隙。
 * @property {String|Boolean} safe = [true|false] 默认：true,// 是否开启底部安全区域。
 * @property {Number} round = [] 默认：0,圆角
 * @property {String} label = [] 默认：注意选择的超市哦,价格正文的文字说明。
 * @property {Function} change 购物车增减商品时触发{num,index}。
 * @property {Function} confirm 确认提交按钮时触发
 *
 */

	import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
	import tmEmpty from "@/tm-vuetify/components/tm-empty/tm-empty.vue"
	import tmButton from "@/tm-vuetify/components/tm-button/tm-button.vue"
	import tmBadges from "@/tm-vuetify/components/tm-badges/tm-badges.vue"
	import tmCartCellListFood from "@/tm-vuetify/components/tm-cartCellListFood/tm-cartCellListFood.vue"
	export default {
		components:{tmIcons,tmEmpty,tmButton,tmCartCellListFood,tmBadges},
	name: 'tm-cartBarFood',
	props: {
		list: {
			Array,
			default: () => {
				return [];
			}
		},
		// 背景颜色主题名称
		bgTheme: {
			type: String,
			default: 'white'
		},
		// 是否启用暗黑主题。
		black: {
			type: String | Boolean,
			default: null
		},
		// 背景颜色，自定义。
		bgColor: {
			type: String,
			default: ''
		},

		// 自定义项目文字默认激活色。
		color: {
			type: String,
			default: 'primary'
		},
		btnColor: {
			type: String,
			default: 'primary'
		},
		btnText:{
			type:String,
			default:'确认商品'
		},
		// 自定义项目文字默认失去焦点色。
		colorGrey: {
			type: String,
			default: 'grey'
		},
		// 可选bootom / top / static
		position: {
			type: String,
			default: 'bottom'
		},
		// 距离顶部的距离。默认是0,只有在position=='top'使用
		top: {
			type: Number | String,
			default: 0
		},
		// 距离顶部的距离。默认是0,只有在position=='bottom'使用
		bottom: {
			type: Number | String,
			default: 0
		},
		// 显示上边线还是下边线。可选top / bottom
		border: {
			type: String,
			default: ''
		},

		// 只支持圆角主题。如round-5
		round: {
			type: String | Number,
			default: 0
		},
		// 偏移量。即离左边的间距。如果提供，整个navbar的宽度会是100% - offsetLeft*2。
		offsetLeft: {
			type: String | Number,
			default: 0
		},
		// 是否开启底部安全区域。
		safe: {
			type: String | Boolean,
			default: true
		},
		disabled: {
			type: String | Boolean,
			default: false
		},
		// 是否开启点按动画，默认开启。
		ani: {
			type: String | Boolean,
			default: true
		},
		//价格下方的说明。
		label:{
			type:String,
			default:'注意选择的超市哦'
		}
	},
	watch: {
		list:{
			deep:true,
			handler(){
				this.listData = uni.$tm.deepClone(this.list)
			}
		}
	},
	computed: {
		black_tmeme: function() {
			if (this.black !== null) return this.black;
			return this.$tm.vx.state().tmVuetify.black;
		},
		top_px: function() {
			return this.top;
		},
		bottom_px: function() {
			return this.bottom;
		},

		wininfo: function() {
			return uni.getSystemInfoSync();
		},
		listLen: function() {
			return this.listData.length;
		},
		sum:function(){
			let t = this;
			let pr = 0;
			let num =0;
			this.listData.forEach(item => {
				pr += item.price * item.buy;
				num += item.buy;
			});
			
			return {
				price:pr<=0?0:pr.toFixed(2),
				num:num
			}
		}
	},
	data() {
		return {
			safeBottomeHeight: '0',
			sywi: 0,
			openList: false,
			listData:[]
			
		};
	},
	mounted() {
		let t = this;
		this.sywi = uni.getSystemInfoSync().windowHeight;
		// t.safeBottomeHeight = uni.getSystemInfoSync().safeAreaInsets.bottom;
		this.listData = uni.$tm.deepClone(this.list)
	},
	methods: {
		openlistfun(){
			if(this.disabled) return;
			this.openList = !this.openList;
		},
		listAddChange(e,index) {
			this.$nextTick(function(){
				this.$emit('change',{num:e,index:index})
			})
			
		},
		
		clearEmpty() {

			this.$emit('clear')
		},
		getlist() {
			if(this.list.length<=0) return;
			let rlist = {
				priceTotal:this.sum.price,
				numTotal:this.sum.num,
				list:this.list
			};
			
			return rlist;
		},
		confirm() {
			if(this.list.length<=0||this.disabled) return;
			let rlist = {
				priceTotal:this.sum.price,
				numTotal:this.sum.num,
				list:this.list
			};
			this.$emit('confirm',rlist);
			return rlist;
		},
		stopMove(){
			return false;
		}
	}
};
</script>

<style lang="scss" scoped>
	.safe--hei{
		height: var(--status-bar-height);
	}
.tm-cartBarFood {
	
	.tm-cartBarFood-bg {
		top: 0;
		left: 0;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.3);
		
	}
	.tm-cartBarFood-wk{
		height: 100rpx;
		position: relative;
		z-index: 15;
		&.on{
			box-shadow: 0 -5px 10px rgba(0,0,0,0.05);
		}
	}
	.tm-cartBarFood-body {
		animation: scalse 0.4s linear;
		.tm-cartBarFood-list {
			position: absolute;
			bottom: 40rpx;
			width: 100%;
			z-index: 10;
			.tm-cartBarFood-list-srcoll{
				max-height: 600rpx;
				overflow-y: scroll;
			}
		}
		
		&.bottom {
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 400;
		}

		&.top {
			position: fixed;
			z-index: 400;
			top: 0;
			left: 0;
		}
	}
}
.ani {
	animation: scalse 0.4s linear;
}
@keyframes scalse {
	0% {
		transform: scale(0.9);
	}
	50% {
		transform: scale(1.1);
	}
	100% {
		transform: scale(1);
	}
}
</style>
