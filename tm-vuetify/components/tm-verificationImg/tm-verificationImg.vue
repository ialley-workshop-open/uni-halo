<template>
	<view class="tm-verificationImg flex-center flex-col">
		<view class="flex-shrink rounded overflow relative" 
		:style="{
			width:`${size}rpx`,
			height:`${size}rpx`,
			
		}"
		>	
			<view v-if="success" class="tm-verificationImg-success fulled fulled-height rounded absolute flex-center opacity-8" >
					<tm-icons name="icon-check" color="white" :size="100"></tm-icons>
				</view>
			<view :style="{transform: `rotate(${default_value_num}deg)`}">
				<tm-images model="aspectFit" :width="size" :height="size" round="rounded" :src="src"></tm-images>
			</view>
		</view>
		<view :style="{width:`${size}rpx`}" class="py-32">
			<tm-slider :disabled="disabled" :fllowTheme="fllowTheme" :color="color_tmeme" v-model="default_value_num" :max="360"></tm-slider>
		</view>
	</view>
</template>

<script>
	//https://jx2d.cn/yuwuimages/test.png
	//测试图片角度为正120
	/**
	 * 图片安全验证
	 * @property {String} model = [normal|rotate] 默认：normal，rotate表示图片本身有角度的模式。normal是随机一张正常的图片（图片本身是没有角度的）
	 * @property {Number} rotate = [] 默认：0，当前model=normal时，应承打乱图片 的角度。当model=rotate，是特指图片本身的角度。
	 * @property {Number} size = [] 默认：200，大小。
	 * @property {String} color = [] 默认：primary，主题色。
	 * @property {String} src = [] 默认：''随机一张图片，图片地址。
	 * @property {Boolean} disabled = [] 默认：false,是否禁用
	 * @property {Function} change 旋转的时候触发，返回参数为当前的检验，正确是为true,失败为false
	 */
	import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
	import tmImages from "@/tm-vuetify/components/tm-images/tm-images.vue"
	import tmSlider from "@/tm-vuetify/components/tm-slider/tm-slider.vue"
	export default {
		components:{tmSlider,tmIcons,tmImages},
		name:"tm-verificationImg",
		props:{
			//rotate表示图片本身有角度的模式。normal是随机一张正常的图片（图片本身是没有角度的）
			model:{
				type:String,
				default:'normal' ,//normal|rotate ，
			},
			//当前model=normal时，应承打乱图片 的角度。当model=rotate，是特指图片本身的角度。
			rotate:{
				type:Number,
				default:0
			},
			size:{
				type:Number|String,
				default:200
			},
			color:{
				type:String,
				default:'primary'
			},
			src:{
				type:String,
				default:'https://picsum.photos/300'
			},
			// 跟随主题色的改变而改变。
			fllowTheme:{
				type:Boolean|String,
				default:true
			},
			disabled:Boolean
		},
		data() {
			return {
				default_value_num:0,
				imgrotate:0,
				wucha:5,
				success:false
			};
		},
		computed:{
			color_tmeme:function(){
				if(this.$tm.vx.state().tmVuetify.color!==null&&this.$tm.vx.state().tmVuetify.color && this.fllowTheme){
					return this.$tm.vx.state().tmVuetify.color;
				}
				return this.color;
			},
		},
		mounted() {
			if(this.model=='normal'){
				this.default_value_num = this.rotate
				this.imgrotate = 0
			}else{
				this.default_value_num = 0
				this.imgrotate = this.rotate
			}
		},
		watch:{
			default_value_num:function(val){
				let zque = Math.abs(360-this.imgrotate);
				if(this.model=='normal'){
					if(val>=360){
						this.success=true
						
					}else{
						this.success=false
					}
				}else{
					if(val>=zque-5 && val <=zque+5){
						this.success=true
					}else{
						this.success=false
					}
				}
				this.$emit('change',this.success)
			}
		},
		methods: {
			name() {
				
			}
		},
	}
</script>

<style lang="scss">
.tm-verificationImg{
	.tm-verificationImg-success{
		top: 0;
		left: 0;
		z-index: 9;
		background-color: rgba(0,0,0,0.2);
		backdrop-filter: blur(2px);
		-webkit-backdrop-filter: blur(2px);
		
	}
}
</style>
