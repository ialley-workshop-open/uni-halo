
<template>
	<view class="tm-helpTips relative d-inline-block">
		<view @click.stop="toogle">
			<slot></slot>
		</view>
		<view v-show="showMenu" class="tm-menu-block absolute" :class="[direction,mentDirection]">
			<view v-if="direction==='bottom'" class=" px-32" :class="[tipFangx]">
				<text class="iconfont icon-sort-up  " style="font-size: 46upx;line-height: 0.5;margin-bottom: -4upx;"
					:class="[!black_tmeme?`text-${color_tmeme} text`:'',black_tmeme?'text-grey-darken-3':'']"></text>
			</view>
			<view :class="[color_tmeme,`shadow-${color_tmeme}-1`,black_tmeme?'bk':'']" class="  pa-16 round-2 text-align-left flex-top-start" >
				<view>
					<text class="text-size-s">{{label}}</text>
				</view>
				<view @click.stop="toogle" class=" text-align-center flex-shrink pl-32">
					<tm-icons :black="black_tmeme" :size="24" :color="iconColor" dense name="icon-times"></tm-icons>
				</view>
				
			</view>

			<view v-if="direction==='top'" class=" px-32" :class="[tipFangx]">
				<text class="iconfont icon-sort-down  " style="font-size: 46upx;line-height: 0.5;margin-top: -4upx;"
					:class="[!black_tmeme?`text-${color_tmeme} text`:'',black_tmeme?'text-grey-darken-3':'']"></text>
			</view>

		</view>
		<tm-maskFlow :blur='false' v-model="showMenu" bgColor='none'></tm-maskFlow>
	</view>
</template>

<script>
	/**
	 * 弹出菜单
	 * @property {Boolean} black = [true|false] 默认:false,暗黑模式。
	 * @property {Boolean} show = [true|false] 默认:false,始终显示菜单。
	 * @property {String} icon-color = [] 默认:white,关闭图标颜色主题名称
	 * @property {String} color = [] 默认:primary,主题背景色
	 * @property {String} tip-direction = [left | center | right] 默认:center,指示三角形的方向
	 * @property {String} direction = [top | bottom] 默认:bottom,弹出方向，top | bottom
	 * @property {String} ment-direction = [left | center | right] 默认:center,弹出在父组件上的对齐方式，默认居中。可选left,right,center
	 * @property {String} label = [] 默认:[],需要显示的内容
	 * @property {String} rang-key = [] 默认:title,菜单列表数组对象时，需要提供key
	 * @property {Function} change 点击列表项目时触发，返回：{index:index,value:item}
	 * @example tm-helpTips direction="top"  label="每点击一次增加一个积分哦,你知道了吗？">
				<tm-icons name="icon-question-circle"></tm-icons>
			</tm-helpTips>
	 * 
	 */
	import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
	import tmMaskFlow from "@/tm-vuetify/components/tm-maskFlow/tm-maskFlow.vue"
	export default {
		components:{tmIcons,tmMaskFlow},
		name: "tm-helpTips",
		props: {
			black: {
				type:Boolean | String,
				default:null
			},
			// 三角形的方向。left | center | right
			tipDirection: {
				type: String,
				default: 'center'
			},
			// 始终显示菜单
			show: {
				type: Boolean,
				default: false
			},
			// 关闭图标颜色主题名称
			iconColor: {
				type: String,
				default: 'white'
			},
			// 主题色
			color: {
				type: String,
				default: 'primary'
			},
			// 弹出方向，top | bottom
			direction: {
				type: String,
				default: 'bottom'
			},
			// 弹出在父组件上的对齐方式，默认居中。可选left,right,center
			mentDirection: {
				type: String,
				default: 'center'
			},
			label: {
				type: String,
				default: () => {
					return "";
				}
			},
			// 如果list提供的是对象数组，需要提供对象的key。如果是string对象，无需提供。默认title
			rangKey: {
				type: String,
				default: 'title'
			},
			// 跟随主题色的改变而改变。
			fllowTheme:{
				type:Boolean|String,
				default:true
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
			tipFangx: function() {
				if (this.tipDirection === 'left') return 'flex-start ';
				if (this.tipDirection === 'center') return 'flex-center';
				if (this.tipDirection === 'right') return 'flex-end ';
			}
		},
		data() {
			return {
				showMenu: false,
			};
		},
		mounted() {
			this.showMenu = this.show;
		},
		methods: {
			toogle() {
				if (!this.label || this.label.length == 0) return;
				this.showMenu = !this.showMenu;
				this.$emit("update:show",this.showMenu)
			},
			open() {
				if (!this.label || this.label.length == 0) return;
				this.showMenu = true;
				this.$emit("update:show",true)
			},
			off() {
				if (!this.label || this.label.length == 0) return;
				this.showMenu = false;
				this.$emit("update:show",false)
			}
		},
	}
</script>

<style lang="scss" scoped>
	.tm-helpTips {
		position: relative;
		text-align: center;
		.tm-menu-block {
			z-index: 502;
			width: 320upx;
			

			&.bottom {
				top: 100%;
				bottom: inherit;
				animation: roteScale 0.3s ease-in-out;
			}

			&.top {
				top: inherit;
				bottom: 100%;
				animation: roteScaleTop 0.3s ease-in-out;
			}

			&.center {
				left: calc(50% - 160upx);
			}

			&.left {
			
				left: 0upx;
			}

			&.right {
				right: 0upx;
				
			}
		}
	}
	
	
	@keyframes roteScale{
		0%{
			transform: scale(0.9) translateY(-20rpx);
			opacity: 0;
		}
		100%{
			transform: scale(1)  translateY(0rpx);
			opacity: 1;
		}
	}
	@keyframes roteScaleTop{
		0%{
			transform: scale(0.9) translateY(20rpx);
			opacity: 0;
		}
		100%{
			transform: scale(1)  translateY(0rpx);
			opacity: 1;
		}
	}
</style>
