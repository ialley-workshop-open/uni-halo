<!-- 悬浮按钮 -->
<template>
	<view class="nobody fulled"
		:class="[absolute?'fulled':'',fixed?'d-inline-block':'',absolute&&position=='bottom'?'flex-end-center height100':'']">
		<view  
			:class="[absolute?'fulled':'',absolute?'relative':'',absolute&&position=='top'?'flex-center':'',absolute&&position=='bottom'?'flex-end-center height100':'',fixed?'d-inline-block':'']">

			<view  class="flotbtnId" :style="pos" :class="[absolute?'absolute':'',fixed?'fixed':'']">

				<slot name="default">
					<tm-button
					v-if="isRender"
					@contact="$emit('contact', $event)"
					@error="$emit('error', $event)"
					@getphonenumber="$emit('getphonenumber', $event)"
					@getuserinfo="$emit('getuserinfo', $event)"
					@launchapp="$emit('launchapp', $event)"
					@opensetting="$emit('opensetting', $event)"
					@longpress="$emit('longpress', $event)"
					@touchcancel="$emit('touchcancel', $event)"
					:open-type="openType"
					@click="click"
					:padding="[0,0]"
					 :showValue="showText" vertical :label="label" :fontSize="fontSize"
						 :iconSize="iconSize" :theme="color_tmeme" round="rouned" :font-color="fontColor"  :bgcolor="bgcolor"
						:size="size" :width="width" :height="width" :icon="icon" fab>
					</tm-button>
				</slot>
				<view  v-if="(show || showActions)&&actions.length>0" class="menulistAction" :class="[actionsPos]">
					<view class="menulistAction_item" v-for="(item,index) in actions" :key="index">
						<tm-button :fllowTheme="false" fab @click="itemChange(index)" iconSize="40" :icon="item.icon" :theme="item.color" size="m"></tm-button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 悬浮按钮
	 * @property {Array} actions = [] 默认：[],悬浮按钮展开的子按钮。格式[{icon,color}]
	 * @property {String} actions-pos = [top | left | bottom | right] 默认：top,子菜单按钮显示的方向
	 * @property {String|Boolean} show-actions = [false|true] 默认：false,始终展开子菜单。点击子菜单后不消失.
	 * @property {String|Boolean} click-actions-hiden = [false|true] 默认：true,点击菜单后是否隐藏所有子菜单。
	 * @property {String} size = [xs|s|m|n|l|g] 默认：n, 按钮大小。
	 * @property {String|Number} width = [] 默认：NaN, 自定义按钮大小。
	 * @property {String|Boolean} show-text = [false|true] 默认：false, 是否显示文字。下下排列结构上图标，下文字。
	 * @property {String} label = [] 默认：'', 主按钮下方的文字
	 * @property {String} icon = [] 默认：icon-plus, 默认图标.
	 * @property {String} bgcolor = [] 默认："", 自定义-背景颜色
	 * @property {String|Number} font-size = [22|23|24|26|28] 默认：22, 文字大小
	 * @property {String} font-color = [] 默认：'', 文字颜色
	 * @property {String|Number} icon-size = [] 默认：'36', 图标大小。
	 * @property {String} color = [] 默认：primary,主题颜色
	 * @property {String|Boolean} absolute = [] 默认：false, 相对父组件定位。
	 * @property {String|Boolean} fixed = [] 默认：true, 绝对定位，根据屏幕定位。
	 * @property {String|Boolean} safe = [true|false] 默认：true,// 是否开启底部安全区域。
	 * @property {String} position = [ topLeft | topRight | bottomRight | bottomLeft|top|bottom|left|right] 默认：bottomRight, 在absolute模式下没有left和right剧中。fixed模式包含所有模式。
	 * @property {Array} offset = [] 默认： [16, 16], 单位upx，自定义偏移量，left,right
	 * @property {Function} click 主按钮点击触发的事件。
	 * @property {Function} change 当有子菜单按钮时，点击子按钮触发事件，并返回顺序Index
	 * @example <tm-flotbutton label="发文" show-text="true" ></tm-flotbutton>
	 */
	import tmButton from "@/tm-vuetify/components/tm-button/tm-button.vue"
	export default {
		name:"tm-flotbutton",
		components:{tmButton},
		props: {
			// 子菜单如果有。
			actions: {
				type: Array,
				default: () => {
					return [];
				}
			},
			// 同原生btn相同。contact|getPhoneNumber|getUserInfo|launchapp|share|openSetting
			openType: {
				type: String,
				default: ''
			},
			// 子菜单按钮显示的方向。top | left | bottom | right
			actionsPos: {
				type: String,
				default: 'top'
			},
			// 始终展开子菜单。
			showActions: {
				type: String | Boolean,
				default: false
			},
			// 点击菜单后是否隐藏所有子菜单。
			clickActionsHiden: {
				type: String | Boolean,
				default: true
			},
			// 同button xs,s,m,n,l,g
			size: {
				type: String,
				default: 'n'
			},
			width: {
				type: String | Number,
				default: 100
			},
			height: {
				type: String | Number,
				default: 100
			},
			// 是否显示询问文字
			showText: {
				type: String | Boolean,
				default: false
			},
			// 底部文字。需要和上方同时使用。
			label: {
				type: String,
				default: ''
			},
			icon: {
				type: String,
				default: 'icon-plus'
			},

			// 自定义-背景颜色
			bgcolor: {
				type: String | Array,
				default: ''
			},
			// 文字大小。
			fontSize: {
				type: Number | String,
				default: 22
			},
			// 定义文字颜色
			fontColor: {
				type: String,
				default: 'white'
			},
			// 图标大小。
			iconSize: {
				type: Number | String,
				default: 36
			},
			// 主题颜色
			color: {
				type: String,
				default: 'primary'
			},
			// 根据像组件定位四个角和上下居中位置。6个位置。
			absolute: {
				type: String | Boolean,
				default: false
			},
			//是否开启询问安全距离。如果开启了，会计算底部偏差。
			safe:{
				type: String | Boolean,
				default: true
			},
			// 要的屏幕的宽高定位四个角和上下左右共8个位置
			fixed: {
				type: String | Boolean,
				default: true
			},
			// topLeft | topRight | bottomRight | bottomLeft 。在absolute模式下没有left和right剧中。只有top和bottom剧中模式。fixed模式包含所有模式。
			position: {
				type: String,
				default: 'bottomRight'
			},
			// 单位upx
			offset: {
				type: Array,
				default: () => {
					return [16, 16];
				}
			},
			// 跟随主题色的改变而改变。
			fllowTheme:{
				type:Boolean|String,
				default:true
			}
		},
		computed: {
			offsets: {
				get: function() {
					return this.offset;
				},
				set: function() {
					try {
						this.offset = [uni.upx2px(this.offset[0]), uni.upx2px(this.offset[1])];
					} catch (e) {
						this.offset = [0, 0];
					}
				}
			},
			color_tmeme:function(){
				if(this.$tm.vx.state().tmVuetify.color!==null&&this.$tm.vx.state().tmVuetify.color && this.fllowTheme){
					return this.$tm.vx.state().tmVuetify.color;
				}
				return this.color;
			},
			pos: {
				get: function() {
					
					return this.thisPos;
				},
				set:function(){
					this.thisPos = this.posfun();
				}
				
			}
		},
		data() {
			return {
				position_info: [],
				show: false,
				isRender:false,
				thisPos:''
			};
		},
		
		async mounted() {
			this.init();
			
		},
		methods: {
			init(){
				let t = this;
				this.$nextTick(function(){
					t.isRender=true;
					t.position_info = [{width:uni.upx2px(this.width),height:uni.upx2px(this.height)}];
					t.thisPos = t.posfun();
				})
				// #ifdef H5
				
				window.addEventListener('scroll',function(){
					t.thisPos = t.posfun();
					
				})
				// #endif
			},
			getsafeJl(){
				let sy = uni.getSystemInfoSync();
				// #ifdef MP
				return Math.abs(sy.screenHeight - sy.safeArea.bottom);
				// #endif
				// #ifdef H5
				return Math.abs(sy.windowHeight - sy.safeArea.height);
				// #endif
				// #ifdef APP
				return Math.abs(sy.safeArea.bottom - sy.safeArea.height);
				// #endif
				return 24;
			},
			posfun(){
				if (this.absolute && !this.fixed) {
					if (this.position == 'topLeft') {
						return `transform:translateY(${this.offset[1]}px);left:${this.offset[0]}px`;
					} else if (this.position == 'topRight') {
						return `transform:translateY(${this.offset[1]}px);right:${this.offset[0]}px;`
					} else if (this.position == 'bottomRight') {
						
						return `transform:translateY(${this.offset[1]}px);right:${this.offset[0]}px;`;
					} else if (this.position == 'bottomLeft') {
						return `btransform:translateY(${this.offset[1]}px);left:${this.offset[0]}px`;
					} else if (this.position == 'top') {
						return `transform:translateX(${this.offset[0]}px) translateY(${this.offset[1]}px)`
					} else if (this.position == 'bottom') {
						return `transform:translateX(${this.offset[0]}px) translateY(${this.offset[1]}px)`
					}
				
				}
				if (!this.absolute && this.fixed) {
					
					if (this.position == 'topLeft') {
						return `top:${ this.offset[1]}px;left:${this.offset[0]}px`;
					} else if (this.position == 'topRight') {
						return `top: ${this.offset[1]}px;right: ${this.offset[0]}px`;
					} else if (this.position == 'bottomRight') {
					
						let safbo = this.getsafeJl()
						if(!this.safe) safbo=0
						return `bottom: ${this.offset[1]+safbo}px;right: ${this.offset[0]}px;`;
				
					} else if (this.position == 'bottomLeft') {
						let sy = uni.getSystemInfoSync();
						
						let safbo = this.getsafeJl()
						if(!this.safe) safbo=0
						
						return `bottom:${ this.offset[1]+safbo}px;left:${this.offset[0]}px;`;
					} else if (this.position == 'top') {
						
						let js = uni.getSystemInfoSync();
						let left = js.windowWidth;
						
						if (this.position_info.length > 0) {
							let w = this.position_info[0].width;
							return `transform:translateX(${this.offset[0]}px) translateY(${this.offset[1]}px);top:0;left:${(left-w)/2}px;`;
						}
				
					} else if (this.position == 'bottom') {
						let safbo = this.getsafeJl()
						if(!this.safe) safbo=0
						let js = uni.getSystemInfoSync();
						let left = js.windowWidth;
						if (this.position_info.length > 0) {
							let w = this.position_info[0].width;
							console.log(w);
							return `transform:translateX(${this.offset[0]}px) translateY(${this.offset[1]}px);bottom:${safbo}px;left:${(left-w)/2}px`;
				
						} else if (this.position == 'left') {
							let js = uni.getSystemInfoSync();
							let left = js.windowHeight;
							if (this.position_info.length > 0) {
								let w = this.position_info[0].height;
								return `transform:translateX(${this.offset[0]}px) translateY(${this.offset[1]}px);left:0;top:${(left-w)/2}px`;
				
							}
				
						} else if (this.position == 'right') {
							let js = uni.getSystemInfoSync();
							let left = js.windowHeight;
							if (this.position_info.length > 0) {
								let w = this.position_info[0].height;
								return {
									transform: `translateX(${this.offset[0]}px) translateY(${this.offset[1]}px)`,
									right: 0,
									top: (left - w) / 2 + 'px',
								};
								`transform:translateX(${this.offset[0]}px) translateY(${this.offset[1]}px);right:0;top:{(left-w)/2}px`;
							}
				
						}
					}
				}
								
			},
			click(e) {
				this.$emit('click', e);
				this.show = !this.show;
				
			},
			itemChange(index) {
				
				this.$emit('change', index);
				if (!this.clickActionsHiden) return;
				this.show = !this.show;

			}
		},
	}
</script>

<style lang="scss" scoped>
	.nobody {
		.menulistAction {
			.menulistAction_item {
				position: relative;
				// #ifdef H5
				animation: sscsl 0.5s;
				// #endif
			}

			&.top {
				position: absolute;
				bottom: 130upx;
				left: 10upx;

				.menulistAction_item {
					
					margin-bottom: 10px;
				}
			}

			&.left {
				position: absolute;
				bottom: 10upx;
				display: flex;
				flex-flow: row;
				right: 140upx;

				.menulistAction_item {
					margin-left: 10px;
				}
			}

			&.bottom {
				position: absolute;
				top: 140upx;
				display: flex;
				flex-flow: column;
				left: 10upx;

				.menulistAction_item {
					margin-top: 10px;
				}
			}
			&.right {
				position: absolute;
				bottom: 10upx;
				display: flex;
				flex-flow: row;
				left: 140upx;
			
				.menulistAction_item {
					margin-left: 10px;
				}
			}
		}
	}

	@keyframes sscsl {
		from {
			transform: scale(0.5);
		}

		to {
			transform: scale(1);
		}
	}

	.height100 {
		height: 100%;
	}

	.fixed,
	.absolute {
		z-index: 400;
		bottom: 0;
	}
</style>
