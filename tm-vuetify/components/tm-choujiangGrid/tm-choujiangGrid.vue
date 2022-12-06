<template>
	<view class="tm-choujiangGrid">
		<view class="tm-choujiangGrid-bg"
		:style="{
			backgroundImage: `url(${them_data.bg})`
		}"
		>
			<view v-if="listData.length==8"  class="tm-choujiangGrid-con">
				<view v-for="(item,index) in 3" :key="index" class="tm-choujiangGrid-grid">
					<block  v-if="index==0">
						<view   class="tm-choujiangGrid-item">
							
							<view class="tm-choujiangGrid-item-img flex-center">
								<tm-images :width="100" :src="listData[0].img"></tm-images>
							</view>
							<view :class="{on:(aniOff==false&&active==0)||(choujiangJieGuo&&aniOff&&active==0)}" class="tm-choujiangGrid-item-hover"></view>
						</view>
						<view   class="tm-choujiangGrid-item">
							<view class="tm-choujiangGrid-item-img flex-center">
								<tm-images :width="100" :src="listData[1].img"></tm-images>
							</view>
							<view :class="{on:(aniOff==false&&active==1)||(choujiangJieGuo&&aniOff&&active==1)}" class="tm-choujiangGrid-item-hover"></view>
						</view>
						<view   class="tm-choujiangGrid-item">
							<view class="tm-choujiangGrid-item-img flex-center">
								<tm-images :width="100" :src="listData[2].img"></tm-images>
							</view>
							<view :class="{on:(aniOff==false&&active==2)||(choujiangJieGuo&&aniOff&&active==2)}" class="tm-choujiangGrid-item-hover"></view>
						</view>
					</block>
					<block  v-if="index==1">
						<view   class="tm-choujiangGrid-item">
							<view class="tm-choujiangGrid-item-img flex-center">
								<tm-images :width="100" :src="listData[7].img"></tm-images>
							</view>
							<view :class="{on:(aniOff==false&&active==7)||(choujiangJieGuo&&aniOff&&active==7)}" class="tm-choujiangGrid-item-hover"></view>
						</view>
						<view @click="clickImgPlay"  class="tm-choujiangGrid-item">
							<view class="tm-choujiangGrid-item-img flex-center tm-choujiangGrid-item-point">
								<tm-images :width="140" :src="them_data.point"></tm-images>
							</view>
							<view class="tm-choujiangGrid-item-hover"></view>
						</view>
						
						<view   class="tm-choujiangGrid-item">
							<view class="tm-choujiangGrid-item-img flex-center">
								<tm-images :width="100" :src="listData[3].img"></tm-images>
							</view>
							<view :class="{on:(aniOff==false&&active==3)||(choujiangJieGuo&&aniOff&&active==3)}" class="tm-choujiangGrid-item-hover"></view>
						</view>
					</block>
					<block  v-if="index==2">
						
						<view   class="tm-choujiangGrid-item">
							<view class="tm-choujiangGrid-item-img flex-center">
								<tm-images :width="100" :src="listData[6].img"></tm-images>
							</view>
							<view :class="{on:(aniOff==false&&active==6)||(choujiangJieGuo&&aniOff&&active==6)}" class="tm-choujiangGrid-item-hover"></view>
						</view>
						
						<view   class="tm-choujiangGrid-item">
							<view class="tm-choujiangGrid-item-img flex-center">
								<tm-images :width="100" :src="listData[5].img"></tm-images>
							</view>
							<view :class="{on:(aniOff==false&&active==5)||(choujiangJieGuo&&aniOff&&active==5)}" class="tm-choujiangGrid-item-hover"></view>
						</view>
						<view    class="tm-choujiangGrid-item">
							<view class="tm-choujiangGrid-item-img flex-center">
								<tm-images :previmage="false" :width="100" :src="listData[4].img"></tm-images>
							</view>
							<view :class="{on:(aniOff==false&&active==4)||(choujiangJieGuo&&aniOff&&active==4)}" class="tm-choujiangGrid-item-hover"></view>
						</view>
					</block>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * 转盘抽奖
 * @property {Number} theme-index = [] 默认0，主题索引，我已内置两套皮肤。
 * @property {Array} theme-list = [] 默认[已内置两套]，主题列表数据，已有两套。
 * @property {Boolean} disabled = [] 默认 false，是否禁用
 * @property {Number} duration = [] 默认 3000，动画时长
 * @property {Boolean} disabledCenter = [] 默认 false，是否禁用点中间图片开始。
 * @property {Number} turns = [] 默认 2，转的圈数
 * @property {Number} specify = [] 默认 null，为整数时，即可指定奖品，始终中奖保持在这个位置。
 * @property {Array} list = [] 默认 [测试的数据]，奖品数据。
 * @property {Function} start 游戏开始时触发。
 * @property {Function} end 游戏结束触发，并返回奖品数据。
 * @example <tm-choujiangGame ></tm-choujiangGame>
 */
	import tmImages from "@/tm-vuetify/components/tm-images/tm-images.vue"
	export default {
		components:{tmImages},
	name: 'tm-choujiangGrid',
	props: {
		themeIndex: {
			type: Number,
			default: 0
		},
		themeList: {
			type: Array,
			default: () => {
				return [
					{
						bg: 'https://jx2d.cn/yuwuimages/choujiangGrid_1.png?k=9',
						point: 'https://jx2d.cn/yuwuimages/choujiangGrid_1_0.png'
					},
					{
						bg: 'https://jx2d.cn/yuwuimages/choujiangGrid_2.png?k=9',
						point: 'https://jx2d.cn/yuwuimages/choujiangGrid_2_0.png'
					}
				];
			}
		},
		disabled: {
			type: Boolean,
			default: false
		},
		//是否禁用点中间图片开始。
		disabledCenter:{
			type: Boolean,
			default: false
		},
		// 动画时长
		duration: {
			type: Number,
			default: 100
		},
		list: {
			type: Array,
			default: () => {
				return [
					{ name: '1', gailv: 30, id: 1, img: 'https://jx2d.cn/yuwuimages/choujiangGrid_1_1.png' },
					{ name: '2', gailv: 10, id: 2, img: 'https://jx2d.cn/yuwuimages/choujiangGrid_1_2.png' },
					{ name: '3', gailv: 10, id: 3, img: 'https://jx2d.cn/yuwuimages/choujiangGrid_1_1.png' },
					{ name: '4', gailv: 10, id: 4, img: 'https://jx2d.cn/yuwuimages/choujiangGrid_1_2.png' },
					{ name: '5', gailv: 10, id: 5, img: 'https://jx2d.cn/yuwuimages/choujiangGrid_1_2.png' },
					{ name: '6', gailv: 10, id: 7, img: 'https://jx2d.cn/yuwuimages/choujiangGrid_1_1.png' },
					{ name: '7', gailv: 10, id: 8, img: 'https://jx2d.cn/yuwuimages/choujiangGrid_1_1.png' },
					{ name: '8', gailv: 10, id: 9, img: 'https://jx2d.cn/yuwuimages/choujiangGrid_1_2.png' }
				];
			}
		},
		// 转的圈数。
		turns:{
			type:Number,
			default:2
		},
		//指定中奖的奖品数组索引，从0开始
		specify:{
			type:Number,
			default:null
		}
	},
	data() {
		return {
			
			aniOff: true,
			active:0,
			choujiangJieGuo:null,
			listData: [],
			timeid:8564
			
		};
	},
	mounted() {
		this.listData = this.list;
	},
	destroyed() {
		clearTimeout(this.timeid)
	},
	computed: {
		them_index: function() {
			return this.themeIndex;
		},
		them_data: function() {
			return this.themeList[this.them_index];
		}
	},
	methods: {
		clickImgPlay(){
			if (this.disabledCenter) return;
			this.play();
		},
		chuliganlv() {
			var ml = new this.$tm.choujiang(this.listData);
			let zhongle = [];
			let xh = ml.getResult();
			let index = 0
			for(let j=0;j<this.listData.length;j++){
				if(this.listData[j].id === xh.id){
					index = j;
					
					break;
				}
			}
			let cisu  =  (this.listData.length-1)*this.turns+this.turns*2 + (this.specify!==null?this.specify:index);
			zhongle = {
				index:index,
				data:xh,
				playNum:cisu
			}
			return zhongle;
		},
		play() {
			let t = this;
			if (this.disabled) return;
			if (!this.aniOff) {
				console.warn('未结束动画,不能连续点击.');
				return;
			}
			// 开始动画.
			this.$emit('start');
			this.choujiangJieGuo = null;
			let zhongjiang = this.chuliganlv();
			this.$nextTick(function() {
				this.aniOff = false;
				let duration = this.duration;
				let playcCisu = 0; //总次数的序列。
				// 循环的内部索引.
				let nbIndex = 0;
				function aniOpen(){
					if(nbIndex>t.listData.length-1){
						nbIndex = 0;
						t.active = nbIndex;
					}else{
						t.active = nbIndex;
						nbIndex += 1;
					}
					clearTimeout(t.timeid);
					t.timeid = setTimeout(function() {
						playcCisu +=1;
						if(playcCisu > zhongjiang.playNum){
							t.$emit('end',{index:zhongjiang.index,data:zhongjiang.data})
							t.choujiangJieGuo = zhongjiang;
							t.aniOff = true;
						}else{
							aniOpen();
						}
					}, duration);
				}
				aniOpen();
			});
		},

	}
};
</script>

<style lang="less" scoped>
.tm-choujiangGrid {
	overflow: hidden;
	.tm-choujiangGrid-bg{
		width:600upx;
		height: 600upx;
		position: relative;
		margin: auto;
		background-repeat: no-repeat;
		background-size: cover;
		.tm-choujiangGrid-con{
			position: absolute;
			
			width: 450upx;
			height: 450upx;
			top: 75upx;
			left: 75upx;
			.tm-choujiangGrid-grid{
				display: flex;
				justify-content: space-between;
				.tm-choujiangGrid-item{
					width: 137upx;
					height: 130upx;
					border-radius: 20upx;
					overflow: hidden;
					margin-left: 10upx;
					position: relative;
					margin-bottom: 28upx;
					.tm-choujiangGrid-item-img{
						width: 100%;
						height: 100%;
						color: black;
						&.tm-choujiangGrid-item-point{
						animation: scalanit 1s linear infinite;	
						}
					}
					.tm-choujiangGrid-item-hover{
						width: 100%;
						height: 100%;
						position: absolute;
						top: 0;
						left: 0;
						background-color: #ffaa17;
						opacity: 0;
						&.on{
							opacity: 0.6;
						}
					}
				}
			}
		}
	}
}
@keyframes  scalanit {
	0%{
		transform: scale(0.9);
	}
	50%{
		transform: scale(1.1);
	}
	100%{
		transform: scale(0.9);
	}
}
</style>