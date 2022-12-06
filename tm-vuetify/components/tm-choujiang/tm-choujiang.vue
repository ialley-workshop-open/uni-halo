<template>
	<view class="tm-choujiang  py-32">
		<view class="tm-choujiang-theme-1 flex-center flex-col">
			<view class="tm-choujiang-bg ">
				<view
					:animation="animationData"
					class="tm-choujiang-bg-image"
					:style="{
						backgroundImage: `url(${them_data.bg})`
					}"
				></view>
				<view :animation="animationData" class="tm-choujiang-bg-prod  ">
					<view
						class="tm-choujiang-bg-cp text-red absolute text-align-center "
						:style="{
							width: intewidth,
							height: inteheight,
							transform: `rotate(${45 * (index + 1)}deg)`
						}"
						v-for="(item, index) in listData"
						:key="index"
					>
						<tm-images v-if="item.img" :previmage="false" :width="60" :src="item.img"></tm-images>
						<view class="mx-40" style="line-height: 1;">
							<text v-if="item.name" class="text-size-xs ">{{ item.name }}</text>
						</view>
					</view>
				</view>
				<view class="flex-center tm-choujiang-point"><tm-images v-if="them_data.point" @click="clickImgPlay" :previmage="false" :width="120" :src="them_data.point"></tm-images></view>
			</view>
			<view class="tm-choujiang-pingtai flex-center"><tm-images v-if="them_data.dizuo" :previmage="false" :width="600" :src="them_data.dizuo"></tm-images></view>
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
 * @property {Number} turns = [] 默认2，转的圈数
 * @property {Array} list = [] 默认 [测试的数据]，奖品数据。
 * @property {Function} start 游戏开始时触发。
 * @property {Function} end 游戏结束触发，并返回结果数组。
 * @example <tm-choujiang ></tm-choujiang>
 */
import tmImages from "@/tm-vuetify/components/tm-images/tm-images.vue"
	export default {
		components:{tmImages},
	name: 'tm-choujiang',
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
						bg: 'https://jx2d.cn/yuwuimages/choujiang_theme_1_0.png?k=9',
						point: 'https://jx2d.cn/yuwuimages/choujiang_theme_1_1.png',
						dizuo: 'https://jx2d.cn/yuwuimages/choujiang_theme_1_2.png'
					},
					{
						bg: 'https://jx2d.cn/yuwuimages/choujiang_theme_2_0.png?k=9',
						point: 'https://jx2d.cn/yuwuimages/choujiang_theme_2_1.png',
						dizuo: 'https://jx2d.cn/yuwuimages/choujiang_theme_2_2.png'
					}
				];
			}
		},
		disabled: {
			type: Boolean,
			default: false
		},
		// 动画时长
		duration: {
			type: Number,
			default: 3000
		},
		turns:{
			type:Number,
			default:3
		},
		//是否禁用点中间图片开始。
		disabledCenter:{
			type: Boolean,
			default: false
		},
		list: {
			type: Array,
			default: () => {
				return [
					{ name: '谢谢惠顾', gailv: 30, id: 1, img: 'https://jx2d.cn/yuwuimages/jiangping_2.png' },
					{ name: '90', gailv: 10, id: 2, img: 'https://jx2d.cn/yuwuimages/jiangping_1.png' },
					{ name: '135', gailv: 10, id: 3, img: 'https://jx2d.cn/yuwuimages/jiangping_2.png' },
					{ name: '180', gailv: 10, id: 4, img: 'https://jx2d.cn/yuwuimages/jiangping_1.png' },
					{ name: '225', gailv: 10, id: 5, img: 'https://jx2d.cn/yuwuimages/jiangping_2.png' },
					{ name: '275', gailv: 10, id: 7, img: 'https://jx2d.cn/yuwuimages/jiangping_1.png' },
					{ name: '315', gailv: 10, id: 8, img: 'https://jx2d.cn/yuwuimages/jiangping_2.png' },
					{ name: '360', gailv: 10, id: 9, img: 'https://jx2d.cn/yuwuimages/jiangping_1.png' }
				];
			}
		},
		//默认返回真执行，否则不执行开始游戏。
		playCallback:{
			type:Function,
			default:()=>{
				return function(){
					return true;
				}
			}
		}
	},
	data() {
		return {
			animationData: '',
			aniOff: true,
			jiaodu_old:0,
			listData: []
		};
	},
	mounted() {
		this.listData = this.list;
		this.chuliganlv();
	},
	watch:{
		list:{
			handler(){
				this.listData = this.list;
				this.chuliganlv();
			},
			deep:true
		}
	},
	computed: {
		intewidth: function() {
			if (!this.list.length) return 0;
			return (uni.upx2px(400) * 3.14) / this.list.length + 'px';
		},
		inteheight: function() {
			if (!this.list.length) return 0;
			return uni.upx2px(400) / 2 + 'px';
		},
		them_index: function() {
			return this.themeIndex;
		},
		them_data: function() {
			return this.themeList[this.them_index];
		}
	},
	methods: {
		chuliganlv() {
			var ml = new this.$tm.choujiang(this.listData);
			let jieguo = ml.getResult();
			let jd = 360 / this.listData.length;
			let index = this.listData.findIndex(item => {
				return item.id === jieguo.id;
			});
			return {
				index: index,
				data: this.listData[index],
				jiaodu: 360 - (index + 1) * 45 + 180*(this.turns*2)
			};
		},
		clickImgPlay(){
			if (this.disabledCenter) return;
			this.play(this.playCallback);
		},
		async play(callback) {
			
			if (this.disabled) return;
			if (!this.aniOff) {
				console.warn('未结束动画,不能连续点击.');
				return;
			}
			let isPlay = true;
			if(typeof callback ==='function'){
				isPlay = callback();
			}
			if(isPlay==false) return;
			// 开始动画.
			this.$emit('start');
			let zhongjiang = this.chuliganlv();
			
			this.$nextTick(async function() {
				await this.resetInit();
				this.animationData = '';
				this.aniOff = false;
				let duration = this.duration;
				var animation = uni.createAnimation({
					duration: duration,
					timingFunction: 'ease'
				});
				this.animation = animation;
				animation.rotate(zhongjiang.jiaodu).step();
				
				this.animationData = animation.export();
				await uni.$tm.sleep(duration);
				// 结束动画.
				this.aniOff = true;
				
				this.$emit('end', this.listData[zhongjiang.index]);
			});
		},
		// 重置 角度。
		async resetInit() {
			this.animationData = '';
			var animation = uni.createAnimation({
				duration: 0,
				timingFunction: 'ease'
			});
			this.animation = animation;
			animation.rotate(-45).step();
			this.animationData = animation.export();
			await uni.$tm.sleep(50);
		}
	}
};
</script>

<style lang="less" scoped>
.tm-choujiang {
	.tm-choujiang-theme-1 {
		.tm-choujiang-bg {
			width: 600upx;
			height: 600upx;
			position: relative;

			z-index: 2;
			.tm-choujiang-bg-image {
				width: 100%;
				height: 100%;

				background-repeat: no-repeat;
				background-size: cover;
			}
			.tm-choujiang-point {
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
			}
			.tm-choujiang-bg-prod {
				position: absolute;
				width: 400upx;
				height: 400upx;
				top: 100upx;
				left: 100upx;
				display: flex;
				justify-content: center;
				transform: rotate(0deg);
				.tm-choujiang-bg-cp {
					transform-origin: center bottom;
				}
			}
		}
		.tm-choujiang-pingtai {
			position: relative;
			z-index: 1;
			margin-top: -120upx;
		}
	}
}
</style>
