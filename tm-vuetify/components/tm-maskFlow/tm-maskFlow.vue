<template>
	<view class="tm-maskFlow" :style="{
		width:width+'px',
		height:height+'px'
	}" v-if="show">
		<tm-translate  @start="$emit('start')" :duration="duration" :wait="0"  :animation-name="aniName">
			<view  @click.stop="closeMask" class="tm-maskFlow-mask" :style="{
				background:bgColor,
				width:width+'px',
				height:height+'px'
			}"></view>
			<view  @click.stop="closeMask" class="tm-maskFlow-body flex-center">
				<view @click.stop="">
					<slot></slot>
				</view>
			</view>
		</tm-translate>

	</view>
</template>

<script>
	/**
	 * 黑色遮罩
	 * @property {String} bg-color = [rgba(0,0,0,0.35)] 默认：rgba(0,0,0,0.35)，背景颜色值。
	 * @property {Boolean} close = [] 默认：true，点击遮罩是否关闭。
	 * @property {Boolean} blur = [] 默认：true，是否显示模糊背景。
	 * @property {Boolean} value = [] 默认：false，推荐使用value.sync或者v-model，来控制显示和关闭。
	 * @property {Function} change 和v-model同步，显示 和隐藏时触发，返回当前变化 参数true显示，false关闭。
	 * @example <tm-maskFlow v-model="show"></tm-maskFlow>
	 */
	import tmTranslate from "@/tm-vuetify/components/tm-translate/tm-translate.vue"
	export default {
		components:{tmTranslate},
		name: 'tm-maskFlow',
		model: {
			prop: "value",
			event: 'input'
		},
		props: {
			bgColor: {
				type: String,
				default: 'rgba(0,0,0,0.35)'
			},
			close: {
				type: Boolean,
				default: true
			},
			value: {
				type: Boolean,
				default: false
			},
			duration:{
				type:Number,
				default:300
			},
			blur:{
				type:Boolean|String,
				default:true,
			}
		},
		data() {
			return {
				width: 0,
				height: 0,
				aniName: 'fadeIn'
			};
		},
		created() {
			let syinfo = uni.getSystemInfoSync();
			this.width = syinfo.screenWidth;
			this.height = syinfo.screenHeight;
		},
		watch:{
			show:function(){
				
				this.$emit("input", this.value)
				this.$emit("change", this.value)
				this.$emit("update:value", this.value)
			}
		},
		computed: {
			show: {
				get: function() {
					return this.value;
				},
				set: function(val) {
					
					this.$emit("input", val)
					this.$emit("change", val)
					this.$emit("update:value", val)

				},
			}
		},
		methods: {
			
			closeMask() {
				if (!this.close) return;
				this.show = false;
			}
		},
	}
</script>

<style lang="scss" scoped>
	.tm-maskFlow {
		position: fixed;
		left: 0;
		top: 0;
		z-index: 500;

		.tm-maskFlow-mask {
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			.blur{
				backdrop-filter:blur(3px);
			}
		}

		.tm-maskFlow-body {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			overflow-y: auto;
		}
	}
</style>
