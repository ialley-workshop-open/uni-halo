
<template>
	<view class="tm-menu relative d-inline-block">
		<view @click.stop="toogle">
			<slot></slot>
		</view>
		<view v-if="showMenu" class="tm-menu-block absolute animation" :class="[direction,mentDirection]">
			<view v-if="direction==='bottom'" class=" px-16" :class="[tipFangx]">
				<text class="iconfont icon-sort-up  " style="font-size: 46upx;line-height: 0.5;margin-bottom: -4upx;"
					:class="{
					'text-white':!black_tmeme,
					'text-grey-darken-3':black_tmeme
					}"></text>
			</view>
			<view class="round-3 overflow-x" :style="{maxHeight:maxHeight+'rpx'}">
				<tm-listitem  
				@click="showMenu=false;$emit('change',{index:index,value:item})" 
				:black="black_tmeme"
				v-for="(item,index) in list" :key="index" 
				dense
				:left-icon="item['icon']"
				:left-icon-color="(item['iconColor']||iconColor)"
				:left-icon-size="36"
				:show-left-icon="item['icon']?true:false"
				:round="0"
				>
					<text class="text-size-n">
						{{ listType?item:item[rangKey] }}
					</text>
				</tm-listitem>
			
			</view>

			<view v-if="direction==='top'" class=" px-16" :class="[tipFangx]">
				<text class="iconfont icon-sort-down  " style="font-size: 46upx;line-height: 0.5;margin-top: -4upx;"
					:class="{
				'text-white':!black_tmeme,
				'text-grey-darken-3':black_tmeme
				}"></text>
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
	 * @property {Boolean} disabled = [true|false] 默认:false,禁用
	 * @property {Number} maxHeight = [] 默认:500,单位rpx
	 * @property {String} icon-color = [] 默认:primary,如果有图标将会使用这个图标颜色，如果在数据格式中不提供
	 * @property {String} tip-direction = [left | center | right] 默认:center,指示三角形的方向
	 * @property {String} direction = [top | bottom] 默认:bottom,弹出方向，top | bottom
	 * @property {String} ment-direction = [left | center | right] 默认:center,弹出在父组件上的对齐方式，默认居中。可选left,right,center
	 * @property {Array} list = [] 默认:[],菜单列表可以是字符串对象或者数组对象。
	 * @property {String} rang-key = [] 默认:title,菜单列表数组对象时，需要提供key
	 * @property {Function} change 点击列表项目时触发，返回：{index:index,value:item}
	 * @example <tm-menu :list="['菜单1','菜单2']"><tm-button>弹出菜单</tm-button></tm-menu>
	 * 
	 */
	import tmGrouplist from "@/tm-vuetify/components/tm-grouplist/tm-grouplist.vue"
	import tmListitem from "@/tm-vuetify/components/tm-listitem/tm-listitem.vue"
	import tmMaskFlow from "@/tm-vuetify/components/tm-maskFlow/tm-maskFlow.vue"
	export default {
		components:{tmGrouplist,tmListitem,tmMaskFlow},
		name: "tm-menu",
		props: {
			black: {
				type:Boolean | String,
				default:null
			},
			maxHeight:{
				type:Number|String,
				default:500
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
			disabled: {
				type: Boolean,
				default: false
			},
			// 如果列表有图标，显示的图标颜色主题名称
			iconColor: {
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
			list: {
				type: Array,
				default: () => {
					return [];
				}
			},
			// 如果list提供的是对象数组，需要提供对象的key。如果是string对象，无需提供。默认title
			rangKey: {
				type: String,
				default: 'title'
			}
		},
		computed: {
			listType: function() {
				return typeof this.list[0] === 'string';
			},
			tipFangx: function() {
				if (this.tipDirection === 'left') return 'flex-start';
				if (this.tipDirection === 'center') return 'flex-center';
				if (this.tipDirection === 'right') return 'flex-end';
			},
			black_tmeme: function() {
				if (this.black !== null) return this.black;
				return this.$tm.vx.state().tmVuetify.black;
			}
		},
		data() {
			return {
				showMenu: false,
			};
		},
		mounted() {
			if(this.disabled) return;
			this.showMenu = this.show;
		},
		methods: {
			toogle() {
				if (!this.list || this.list.length == 0) return;
				if(this.disabled) return;
				this.showMenu = !this.showMenu;
				this.$emit("update:show",this.showMenu)
			},
			open() {
				if (!this.list || this.list.length == 0) return;
				if(this.disabled) return;
				this.showMenu = true;
				this.$emit("update:show",true)
			},
			off() {
				if (!this.list || this.list.length == 0) return;
				if(this.disabled) return;
				this.showMenu = false;
				this.$emit("update:show",false)
			}
		},
	}
</script>

<style lang="scss" scoped>
	.tm-menu {
		position: relative;
		text-align: center;
		.tm-menu-block {
			z-index: 501;
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
