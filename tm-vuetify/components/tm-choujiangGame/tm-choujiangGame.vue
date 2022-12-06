<template>
	<view class="tm-choujiangGame  py-32">
		<view class="tm-choujiangGame-theme-1 flex-center flex-col">
			<view class="tm-choujiangGame-bg ">
				<view
					 @click="clickImgPlay"
					class="tm-choujiangGame-bg-image"
					:style="{
						backgroundImage: `url(${them_data.bg})`
					}"
				></view>
				<view  class="tm-choujiangGame-bg-prod  ">
					<view
						class="tm-choujiangGame-bg-cp text-red  text-align-center "
						:style="{
							width: '25%',
							height: '100%',
							transform: `translateY(${reisetInitTop}px)`
						}"
						:animation="animationData0"
					>
						<view
						v-for="(item, index) in listData"
						:key="index"
						style="height: 100%;"
						class="flex-center flex-col"
						>
							<tm-images v-if="item.img" :previmage="false" :width="60" :src="item.img"></tm-images>
							{{item.name}}
						</view>
					</view>
					<view
						class="tm-choujiangGame-bg-cp text-red  text-align-center "
						:style="{
							width: '25%',
							height: '100%',
							transform: `translateY(${reisetInitTop}px)`
						}"
						:animation="animationData1"
					>
						<view
						v-for="(item, index) in listData"
						:key="index"
						style="height: 100%;"
						class="flex-center flex-col"
						>
							<tm-images v-if="item.img" :previmage="false" :width="60" :src="item.img"></tm-images>
							{{item.name}}
						</view>
					</view>
					<view
						class="tm-choujiangGame-bg-cp text-red  text-align-center "
						:style="{
							width: '25%',
							height: '100%',
							transform: `translateY(${reisetInitTop}px)`
						}"
						:animation="animationData2"
					>
						<view
						v-for="(item, index) in listData"
						:key="index"
						style="height: 100%;"
						class="flex-center flex-col"
						>
							<tm-images v-if="item.img" :previmage="false" :width="60" :src="item.img"></tm-images>
							{{item.name}}
						</view>
					</view>
					<view
						class="tm-choujiangGame-bg-cp text-red  text-align-center "
						:style="{
							width: '25%',
							height: '100%',
							transform: `translateY(${reisetInitTop}px)`
						}"
						:animation="animationData3"
					>
						<view
						v-for="(item, index) in listData"
						:key="index"
						style="height: 100%;"
						class="flex-center flex-col"
						>
							<tm-images v-if="item.img" :previmage="false" :width="60" :src="item.img"></tm-images>
							{{item.name}}
						</view>
					</view>
				</view>
				
				<view   class="flex-end tm-choujiangGame-point">
					<view class="tm-choujiangGame-point-bar"
					:style="{
						transform:  aniOff?'rotate(0)':'rotate(25deg)'
					}"
					>
						<tm-images :previmage="false" :width="120" :src="them_data.point"></tm-images>
					</view>
				</view>
			</view>
			<!-- transform: choujiangJieGuo==null?`translateY(-100%)`:`translateY(0)` -->
			<view class="tm-choujiangGame-pingtai flex-center">
				<view class="tm-choujiangGame-pingtai-coll" :style="{
					transition: 'all 0.5s',
					transform: choujiangJieGuo==null?`translateY(-100%)`:`translateY(0)`
				}">
					<view class="tm-choujiangGame-pingtai-text">中奖啦~</view>
					<tm-images :previmage="false" :width="380" :height="200" :src="them_data.dizuo"></tm-images>
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
 * @property {Boolean} disabledCenter = [] 默认 false，是否禁用点中间图片开始。
 * @property {Number} duration = [] 默认 3000，动画时长
 * @property {Array} list = [] 默认 [测试的数据]，奖品数据。
 * @property {Function} start 游戏开始时触发。
 * @property {Function} end 游戏结束触发，并返回奖品数据。
 * @example <tm-choujiangGame ></tm-choujiangGame>
 */
import tmImages from "@/tm-vuetify/components/tm-images/tm-images.vue"
	export default {
		components:{tmImages},
	name: 'tm-choujiangGame',
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
						bg: 'https://jx2d.cn/yuwuimages/choujiangGame_1.png?k=9',
						point: 'https://jx2d.cn/yuwuimages/choujiangGame_1_0.png',
						dizuo: 'https://jx2d.cn/yuwuimages/choujiangGame_2_1.png'
					},
					{
						bg: 'https://jx2d.cn/yuwuimages/choujiangGame_2.png?k=9',
						point: 'https://jx2d.cn/yuwuimages/choujiangGame_2_0.png',
						dizuo: 'https://jx2d.cn/yuwuimages/choujiangGame_2_1.png'
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
			default: 150
		},
		list: {
			type: Array,
			default: () => {
				return [
					{ name: '1', gailv: 30, id: 1, img: 'https://jx2d.cn/yuwuimages/jiangping_2.png' },
					{ name: '2', gailv: 10, id: 2, img: 'https://jx2d.cn/yuwuimages/jiangping_1.png' },
					{ name: '3', gailv: 10, id: 3, img: 'https://jx2d.cn/yuwuimages/jiangping_2.png' },
					{ name: '4', gailv: 10, id: 4, img: 'https://jx2d.cn/yuwuimages/jiangping_1.png' },
					{ name: '5', gailv: 10, id: 5, img: 'https://jx2d.cn/yuwuimages/jiangping_2.png' },
					{ name: '7', gailv: 10, id: 7, img: 'https://jx2d.cn/yuwuimages/jiangping_1.png' },
					{ name: '8', gailv: 10, id: 8, img: 'https://jx2d.cn/yuwuimages/jiangping_2.png' },
					{ name: '9', gailv: 10, id: 9, img: 'https://jx2d.cn/yuwuimages/jiangping_1.png' }
				
				];
			}
		}
	},
	data() {
		return {
			animationData0: '',
			animationData1: '',
			animationData2: '',
			animationData3: '',
			aniOff: true,
			choujiangJieGuo:null,
			listData: [],
			
			
		};
	},
	mounted() {
		this.listData = this.list;
		
	},
	computed: {
		reisetInitTop:function(){
			return -(this.listData.length-1)*uni.upx2px(160)
		},
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
			let xh = [
				ml.getResult(),
				ml.getResult(),
				ml.getResult(),
				ml.getResult()
			]
			
			for(let i=0 ;i<xh.length;i++){
			
				let index = 0
				for(let j=0;j<this.listData.length;j++){
					if(this.listData[j].id === xh[i].id){
						index = j;
						
						break;
					}
				}
				//(this.listData.length-1)*2
				let cisu = (this.listData.length-1)*2+1 + (this.listData.length - index);
				zhongle.push({
					index:index,
					data:xh[i],
					playNum:cisu
				})
			}
			
			return zhongle;
		},
		async play() {
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
			
			this.$nextTick(async function() {
				await this.resetInit();
				
				this.aniOff = false;
				let duration = this.duration;
				let dhIndex=[0,0,0,0];//内部播放次数。
				let ydIndex =[0,0,0,0] ; //达到长度时，要循环。
				let isok = [false,false,false,false]
				async function aniOpen(ix){
					if(ydIndex[ix]>t.listData.length-1){
						
						
						if(ix==0){
							var animation0 = uni.createAnimation({
								duration: 0
							});
							t.animationData0 = animation0;
							animation0.translateY(-(t.listData.length-1)*uni.upx2px(160)).step({duration:0});
							t.animationData0 = animation0.export();
						}else if(ix==1){
							var animation1 = uni.createAnimation({
								duration: 0
							});
							t.animationData1 = animation1;
							animation1.translateY(-(t.listData.length-1)*uni.upx2px(160)).step({duration:0});
							t.animationData1 = animation1.export();
						}else if(ix==2){
							var animation2 = uni.createAnimation({
								duration: 0
							});
							t.animationData2 = animation2;
							animation2.translateY(-(t.listData.length-1)*uni.upx2px(160)).step({duration:0});
							t.animationData2 = animation2.export();
						}else if(ix==3){
							var animation3 = uni.createAnimation({
								duration: 0
							});
							t.animationData3 = animation3;
							animation3.translateY(-(t.listData.length-1)*uni.upx2px(160)).step({duration:0});
							t.animationData3 = animation3.export();
						}
						await uni.$tm.sleep(50);
						ydIndex[ix] = 0;
					}else{
						var animation = uni.createAnimation({
							duration: duration,
							timingFunction: 'linear'
						});
						
						
						if(ix==0){
							t.animationData0 = animation;
							let jl = -(t.listData.length-1)*160+ydIndex[ix]*160;
							animation.translateY(uni.upx2px(jl)).step();
							t.animationData0 = animation.export();
						}else if(ix==1){
							t.animationData1 = animation;
							let jl = -(t.listData.length-1)*160+ydIndex[ix]*160;
							animation.translateY(uni.upx2px(jl)).step();
							t.animationData1 = animation.export();
						}else if(ix==2){
							t.animationData2 = animation;
							let jl = -(t.listData.length-1)*160+ydIndex[ix]*160;
							animation.translateY(uni.upx2px(jl)).step();
							t.animationData2 = animation.export();
						}else if(ix==3){
							let jl = -(t.listData.length-1)*160+ydIndex[ix]*160;
							animation.translateY(uni.upx2px(jl)).step();
							t.animationData3 = animation.export();
							
						}
						
						await uni.$tm.sleep(duration);
						
						
					}
					
					dhIndex[ix] = dhIndex[ix]+1;
					ydIndex[ix] = ydIndex[ix]+1;
				
					if(dhIndex[ix] > zhongjiang[ix].playNum){
						isok[ix] = true;
						if(isok[0]&&isok[1]&&isok[2]&&isok[3]){
							// 结束动画.
							t.aniOff = true;
							t.$emit('end',zhongjiang)
							t.choujiangJieGuo = zhongjiang;
						}
					}else{
						await aniOpen(ix);
					}
					
				}
				
				
				for(let i =0;i<zhongjiang.length;i++){
					aniOpen(i);
				}
				
				
			});
		},
		// 重置 角度。
		async resetInit() {
			this.animationData0 = '';
			var animation0 = uni.createAnimation({duration: 0});
			this.animationData0 = animation0;
			animation0.translateY(-uni.upx2px((this.listData.length-1)*160)).step();
			this.animationData0 = animation0.export();
			
			this.animationData1 = '';
			var animation1 = uni.createAnimation({duration: 0});
			this.animationData1 = animation1;
			animation1.translateY(-uni.upx2px((this.listData.length-1)*160)).step();
			this.animationData1 = animation1.export();
			
			this.animationData2 = '';
			var animation2 = uni.createAnimation({duration: 0});
			this.animationData2 = animation2;
			animation2.translateY(-uni.upx2px((this.listData.length-1)*160)).step();
			this.animationData2 = animation2.export();
			
			this.animationData3 = '';
			var animation3 = uni.createAnimation({duration: 0});
			this.animationData3 = animation3;
			animation3.translateY(-uni.upx2px((this.listData.length-1)*160)).step();
			this.animationData3 = animation3.export();
			await uni.$tm.sleep(50);
			
		}
	}
};
</script>

<style lang="less" scoped>
.tm-choujiangGame {
	overflow: hidden;
	.tm-choujiangGame-theme-1 {
		.tm-choujiangGame-bg {
			width: 600upx;
			height: 600upx;
			position: relative;

			z-index: 2;
			.tm-choujiangGame-bg-image {
				width: 100%;
				height: 100%;
				position: relative;
				z-index: 3;
				background-repeat: no-repeat;
				background-size: cover;
			}
			.tm-choujiangGame-point {
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
				right: 0;
				.tm-choujiangGame-point-bar{
					position: relative;
					right: 0;
					z-index: 0;
					top: -50upx;
					transform-origin: left right;
					transition:all 0.5s;
				}
			}
			.tm-choujiangGame-bg-prod {
				position: absolute;
				overflow: hidden;
				width: 370upx;
				height: 160upx;
				top: 95upx;
				left: 103upx;
				display: flex;
				z-index: 4;
				.tm-choujiangGame-bg-cp {
					transform-origin: center bottom;
					
				}
			}
		}
		.tm-choujiangGame-pingtai {
			position: relative;
			z-index: 2;
			margin-left: -20upx;
			margin-top: -140upx;
			overflow: hidden;
			height: 190upx;
			.tm-choujiangGame-pingtai-coll{
				position: relative;
				.tm-choujiangGame-pingtai-text{
					position: absolute;
					z-index: 3;
					font-size: 48upx;
					text-align: center;
					width: 100%;
					top: 10upx;
					color: red;
					font-weight: bold;
				}
			}
		}
	}
}
</style>
