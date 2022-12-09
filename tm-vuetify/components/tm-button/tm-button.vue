<template>
	<view class="tm-button " :class="[block ? 'd-block' : 'd-inline-block ']" hover-class="opacity-6">
		<view
			class="flex-center tm-button-btn fulled-height"
			:class="[block ? '' : customDense_puted ? '' : 'ma-10', block ? 'd-block' : 'd-inline-block', black_tmeme ? 'bk' : '', customStyleTm]"
		>
		<!-- @getuserinfo="getuserinfo" -->
			<button
				@contact="contact"
				@error="error"
				@getphonenumber="getphonenumber"
				@launchapp="launchapp"
				@opensetting="opensetting"
				@click="onclick"
				@longpress="$emit('longpress', $event)"
				@touchcancel="$emit('touchcancel', $event)"
				@touchend="$emit('touchend', $event)"
				@touchstart="$emit('touchstart', $event)"
				:disabled="disabled"
				:loading="loading"
				:open-type="openType"
				:hover-start-time="hoverStartTime"
				:hover-stay-time="hoverStaySime"
				:hover-stop-propagation="hoverStopPropagation"
				:send-message-img="sendMessageImg"
				:send-message-path="sendMessagePath"
				:send-message-title="sendMessageTitle"
				:show-message-card="showMessageCard"
				:class="[
					
					showValue ? 'showValue' : '',
					titl ? 'text-' + color_tmeme : '',
					vertical ? 'flex-col flex-center' : 'flex-center',
					black_tmeme ? 'bk' : '',
					disabled ? color_tmeme + ' grey-lighten-2' : color_tmeme,
					block ? '' : sizes,
					text || titl ? '' : bgcolor ? 'shadow-' + shadow : 'shadow-' + shadowthemeName + '-' + shadow,
					flat ? 'flat' : '',
					text ? 'text ' : '',
					plan ? 'plan outlined' : '',
					titl ? 'titl' : '',
					
					fab?'rounded':'round-' + round,
					customClassTm_puted
				]"
				:style="{
					background: bgcolor ? bgcolor + ' !important' : 'default',
					width: widths != 0 && widths != 'inherit' ? widths : 'inherit',
					height: heights,
					lineHeight: 'inherit'
				}"
			>
				<slot name="icon" :data="{ icon: icon, size: icon_size.upx, fab: fab }">
					<block v-if="vtype == true">
						<text
							v-if="!fab && icon"
							:class="[`${prefx_computed} ${icon}`, fontColor ? `text-${colors.color}` : '', black_tmeme ? 'opacity-6' : '', 'px-12','flex-shrink']"
							:style="{
								fontSize: `${icon_size.px}px`,
								lineHeight:'normal'
							}"
						></text>
						<text
							v-if="fab && icon && !loading && !titl"
							:class="[`${prefx_computed} ${icon}`, fontColor ? `text-${colors.color}` : '', black_tmeme ? 'opacity-6' : '','flex-shrink']"
							:style="{
								fontSize: `${icon_size.px}px`,
								lineHeight:'normal'
							}"
						></text>
						<text
							v-if="fab && icon && !loading && titl"
							:class="[`${prefx_computed} ${icon}`, fontColor ? `text-${color_tmeme}` : '', black_tmeme ? 'opacity-6' : '','flex-shrink']"
							:style="{
								fontSize: `${icon_size.px}px`,
								lineHeight:'normal'
							}"
						></text>
					</block>
					<block v-if="vtype == false"><tm-icons :size="icon_size.upx" :name="icon"></tm-icons></block>
				</slot>

				<view v-if="!fab || showValue" class="d-inline-block tm-button-label flex-shrink" :style="{ fontSize: font_size }" :class="[fontColor ? `text-${colors.color}` : '',vertical ? 'full ' : '',]">
					<slot name="default" :data="label">{{ label }}</slot>
				</view>
			</button>
		</view>
	</view>
</template>

<script>
/**
 * 按钮
 * @description 注意，按钮功能同原生按钮功能，所有属性都有。
 * @property {Function} contact
 * @property {Function} error
 * @property {Function} getphonenumber
 * @property {Function} getuserinfo
 * @property {Function} opensetting
 * @property {Function} click
 * @property {Boolean} disabled = [true|false] 是否禁用
 * @property {Boolean} loading = [true|false] 是否加载中
 * @property {String} open-type = [contact|getPhoneNumber|getUserInfo|launchapp|share|openSetting] 同原生btn相同,//当等于getUserProfile时，自动获取微信授权。
 * @property {Boolean} block = [true|false] 是否独占一行
 * @property {Boolean} show-value = [true|false] fab模式是隐藏文字的。如果这个设置为true,不管在什么情况下都会显示文字。
 * @property {String} url = [] 默认"",如果提供将会跳转连接。
 * @property {String} size = [xs|s|m|n|l|g] 默认"n",按钮尺寸大小。
 * @property {Number|String} font-size = [] 默认 0,自定义文字大小，默认使用主题size的大小。
 * @property {Number|String} icon-size = [] upx单位默认 0,自定义图标大小，默认使用主题size的大小。
 * @property {String} icon = [] 单位默认 "",自定义按钮图标。
 * @property {String} item-class = [] 默认 "",按钮自定样式类。
 * @property {String|Number} shadow = [] 默认 5,按钮投影
 * @property {String} font-color = [] 默认主题颜色,自定文字颜色
 * @property {String} bgcolor = [] 默认主题颜色,自定义-背景颜色
 * @property {String} theme = [] 默认 primary,主题颜色
 * @property {Boolean|String} black = [true|false] 默认 false, 暗黑模式
 * @property {Boolean|String} flat = [true|false] 默认 false, 去除所有投影圆角效果，扁平模式。
 * @property {Boolean|String} text = [true|false] 默认 false, 文本模式。背景减淡。文字使用主题色。
 * @property {Boolean|String} plan = [true|false] 默认 false, 镂空。
 * @property {Boolean|String} fab = [true|false] 默认 false, 圆模式。
 * @property {Boolean|String} dense = [true|false] 默认 false, 是否去除外间隙。
 * @property {Boolean|String} titl = [true|false] 默认 false, 无背景，无边框，只保留按钮区域和文字颜色或者图标颜色。
 * @property {String} label = [] 默认 "", 按钮文字也可以使用插槽模式直接写在组件内部。
 * @property {String|Number} width = [] 默认 "", 按钮宽,  单位px ,可以是百分比 如果不设置block为true时，此项设置无效。
 * @property {String|Number} height = [] 默认 "", 按钮高, 单位px ,可以是百分比如果不设置block为true时，此项设置无效。
 * @property {String|Number} round = [] 默认 2, 圆角
 * @property {String|Number} navtie-type = [form] 默认 :'', 可选值form，提供此属性为form时，事件会被表单接替，会触发表单提交事件。
 * @property {String} userProfileError = ['auto'] 默认:'auto' 仅open-type='getUserProfile'时有效，当微信授权失败提示的信息，默认为auto,如果非auto将显示自定义错误提示。如果为''，将不显示错误提示。
 * @example <tm-button>确定</tm-button>
 */
import tmIcons from '@/tm-vuetify/components/tm-icons/tm-icons.vue';
export default {
	components: { tmIcons },
	name: 'tm-button',
	props: {
		hoverStartTime:20,
		hoverStaySime:70,
		appParameter:String,
		hoverStopPropagation:{
			type:Boolean,
			default:false
		},
		sessionFrom:String,
		sendMessageTitle:String,
		sendMessagePath:String,
		sendMessageImg:String,
		showMessageCard:String,
		navtieType: {
			type: String,
			default: '' //form
		},
		// 内联还是独占一行的块状100%，默认内联样式。
		block: {
			type: String | Boolean,
			default: false
		},
		// fab模式是隐藏文字的。如果这个设置为true,不管在什么情况下都会显示文字。
		showValue: {
			type: String | Boolean,
			default: false
		},
		disabled: {
			type: String | Boolean,
			default: false
		},
		loading: {
			type: String | Boolean,
			default: false
		},
		url: {
			type: String,
			default: ''
		},
		// xs,s,n,l,g
		size: {
			type: String,
			default: 'n'
		},

		// 文字大小。
		fontSize: {
			type: Number | String,
			default: 0
		},

		// 图标大小。
		iconSize: {
			type: Number | String,
			default: 0
		},
		// icon-cog-fill
		icon: {
			type: String,
			default: ''
		},
		// 按钮自定样式类。
		itemClass: {
			type: String,
			default: ''
		},
		// 同原生btn相同。contact|getPhoneNumber|getUserInfo|launchapp|share|openSetting
		//当等于getUserProfile时，自动获取微信授权。
		openType: {
			type: String,
			default: ''
		},
		shadow: {
			type: Number | String,
			default: 4
		},
		vertical: {
			type: Boolean | String,
			default: false
		},
		// 自定义-文字颜色。
		fontColor: {
			type: String,
			default: ''
		},
		// 自定义-背景颜色
		bgcolor: {
			type: String | Array,
			default: ''
		},
		// 主题颜色
		theme: {
			type: String,
			default: 'primary'
		},
		//优先级最高： 优先级1
		black: {
			type: Boolean | String,
			default: null
		},
		// 优先级高：优先级2
		flat: {
			type: Boolean | String,
			default: null
		},
		// 优先级高：文本模式。背景减淡。文字使用主题色。
		text: {
			type: Boolean | String,
			default: false
		},
		// 优先级高：镂空。
		plan: {
			type: Boolean | String,
			default: false
		},
		// 圆模式。
		fab: {
			type: Boolean | String,
			default: false
		},
		// 无背景，无边框，只保留按钮区域和文字颜色或者图标颜色。
		titl: {
			type: Boolean | String,
			default: false
		},
		label: {
			type: String,
			default: ''
		},
		// 如果不设置block为true时，此项设置无效。
		width: {
			type: String | Number,
			default: NaN
		},
		// 如果不设置block为true时，此项设置无效。
		height: {
			type: String | Number,
			default: NaN
		},
		// 圆角
		round: {
			type: String | Number,
			default: 3
		},
		dense: {
			type: Boolean | String,
			default: false
		},
		// 跟随主题色的改变而改变。
		fllowTheme: {
			type: Boolean | String,
			default: true
		},
		//当微信授权失败提示的信息，默认为auto,如果非auto将显示自定义错误提示。如果为''，将不显示错误提示。
		userProfileError:{
			type:String,
			default:'auto'
		}
	},
	created() {
		this.customClassTm_puted = this.itemClass;
		this.customDense_puted = this.dense;
		this.color_tmeme = this.theme;
	},
	watch: {
		theme: function() {
			this.color_tmeme = this.theme;
		}
	},
	computed: {
		prefx_computed() {
			let prefix = this.icon.split('-')[0];
			if (prefix == 'icon') return 'iconfont';
			if (prefix == 'mdi') return 'mdi';

			return prefix;
		},
		customDense_puted: {
			get: function() {
				return this.customDense;
			},
			set: function(val) {
				this.customDense = val;
			}
		},
		customClassTm_puted: {
			get: function() {
				return this.customClassTm;
			},
			set: function(val) {
				this.customClassTm = val;
			}
		},
		vtype: function() {
			if (this.icon[0] == '.' || this.icon[0] == '/' || this.icon.substring(0, 4) == 'http' || this.icon.substring(0, 5) == 'https' || this.icon.substring(0, 3) == 'ftp') {
				return false;
			}
			return true;
		},
		black_tmeme: function() {
			if (this.black !== null) return this.black;
			return this.$tm.vx.state().tmVuetify.black;
		},
		color_tmeme: {
			get: function() {
				if (this.$tm.vx.state().tmVuetify.color !== null && this.$tm.vx.state().tmVuetify.color && this.fllowTheme) {
					return this.$tm.vx.state().tmVuetify.color;
				}
				return this.color_tmeme_computed;
			},
			set: function(val) {
				this.color_tmeme_computed = val;
			}
		},
		// 投影的颜色名字。
		shadowthemeName: function() {
			if (!this.theme) return 'none';
			return this.color_tmeme;
		},
		widths: {
			get: function() {
				let w;

				if (typeof this.width === 'undefined') {
					return 'auto';
				}
				let item = this.$TestUnit(this.width);

				if (item) {
					if (item.type == 'string') {
						w = item.value;
					}
					if (item.type == 'number') {
						w = item.value + 'px';
					}
				}

				return w;
			}
		},
		heights: {
			get: function() {
				let item = this.$TestUnit(this.height);
				if (item) {
					if (item.type == 'string') {
						return item.value;
					}
					if (item.type == 'number') {
						return item.value + 'px';
					}
				}

				return 'auto';
			}
		},
		sizes: function() {
			if (!isNaN(this.width) || !isNaN(this.height)) return;
			if (this.size == 'xs') {
				return this.fab ? 'fabxs text-size-xs rounded' : 'wxs  round-1 text-size-xs';
			} else if (this.size == 's') {
				return this.fab ? 'fabs text-size-xs rounded' : 'ws  round-1 text-size-s';
			} else if (this.size == 'm') {
				return this.fab ? 'fabm text-size-xs rounded' : 'wm  round-1 text-size-n';
			} else if (this.size == 'n') {
				return this.fab ? 'fabn text-size-xs rounded' : 'wn round-1 text-size-n';
			} else if (this.size == 'l') {
				return this.fab ? 'fabl text-size-xs rounded' : 'wl round-2 text-size-g';
			} else if (this.size == 'g') {
				return this.fab ? 'fabg text-size-xs rounded' : 'wg round-3 text-size-g';
			}
		},
		font_size: function() {
			if (this.fontSize > 0) {
				return this.fontSize + 'rpx';
			}
			if (this.size == 'xs') {
				return uni.upx2px(20) + 'px';
			} else if (this.size == 's') {
				return uni.upx2px(22) + 'px';
			} else if (this.size == 'm') {
				return uni.upx2px(24) + 'px';
			} else if (this.size == 'n') {
				return uni.upx2px(28) + 'px';
			} else if (this.size == 'l') {
				return uni.upx2px(32) + 'px';
			} else if (this.size == 'g') {
				return uni.upx2px(36) + 'px';
			}
		},
		icon_size: function() {
			if (this.iconSize) {
				return { px: uni.upx2px(this.iconSize), upx: this.iconSize };
			}
			if (this.size == 'xs') {
				return { px: uni.upx2px(20), upx: 20 };
			} else if (this.size == 's') {
				return { px: uni.upx2px(22), upx: 22 };
			} else if (this.size == 'm') {
				return { px: uni.upx2px(24), upx: 24 };
			} else if (this.size == 'n') {
				return { px: uni.upx2px(28), upx: 28 };
			} else if (this.size == 'l') {
				return { px: uni.upx2px(32), upx: 32 };
			} else if (this.size == 'g') {
				return { px: uni.upx2px(36), upx: 36 };
			}
		},
		defaultfontsize: function() {
			if (this.iconSize) {
				return this.iconSize;
			}
			if (this.size == 'xs') {
				return uni.upx2px(20);
			} else if (this.size == 's') {
				return uni.upx2px(22);
			} else if (this.size == 'm') {
				return uni.upx2px(24);
			} else if (this.size == 'n') {
				return uni.upx2px(28);
			} else if (this.size == 'l') {
				return uni.upx2px(32);
			} else if (this.size == 'g') {
				return uni.upx2px(36);
			}
		},
		colors: function() {
			let color = this.$TestColor(this.fontColor);
			return color;
		}
	},
	data() {
		return {
			customClassTm: '',
			customDense: false,
			customStyleTm: '',
			color_tmeme_computed: ''
		};
	},
	methods: {
		setConfigStyle(val) {
			this.customStyleTm = val;
		},
		onclick() {
			let t = this;
			this.$emit('click', ...arguments);
			if(this.openType=='getUserInfo' || this.openType == 'getUserProfile'){
				// #ifdef MP-WEIXIN
				uni.getUserProfile({
				    desc: '需要获取用户信息',
				    lang: 'zh',
				    complete: function (userProfile) {
						if(userProfile.errMsg !='getUserProfile:ok'){
							if(t.userProfileError==''||t.userProfileError=='true') return;
							if(t.userProfileError!='auto'){
								uni.showToast({
									title:t.userProfileError,icon:'error',mask:true
								})
								return;
							}
							uni.showToast({
								title:userProfile.errMsg,icon:'error',mask:true
							})
							return;
						}
				        t.$emit('getUserInfo', userProfile);
				        t.$emit('getUserProfile', userProfile);
				    },
					fail: (error) => {
						if(t.userProfileError==''||t.userProfileError=='true') return;
						if(t.userProfileError!='auto'){
							uni.showToast({
								title:t.userProfileError,icon:'error',mask:true
							})
							return;
						}
						uni.showToast({
							title:error
						})
					}
				});
				// #endif
			}
			
			if (this.url !== '' && typeof this.url === 'string') {
				let url = this.url;
				if (url[0] !== '/') url = '/' + url;
				uni.navigateTo({
					url: url
				});
			}
		},
		contact() {
			this.$emit('contact', ...arguments);
		},
		error() {
			this.$emit('error', ...arguments);
		},
		getphonenumber() {
			this.$emit('getphonenumber', ...arguments);
		},
		getuserinfo() {
			this.$emit('getuserinfo', ...arguments);
		},
		launchapp() {
			this.$emit('launchapp', ...arguments);
		},
		opensetting() {
			this.$emit('opensetting', ...arguments);
		}
	}
};
</script>

<style lang="scss" scoped>
.tm-button {
	vertical-align: middle;
	.tm-button-btn button {
		background: none;
		border: none;
		width: 100%;
		height: auto;
		line-height: 88upx;
		height: 88upx;
		vertical-align: middle;
		
		// #ifdef H5
		transition: all 0.3s;
		// #endif
		.tm-button-label {
			vertical-align: middle;
			
		}
		&::after {
			border: none;
		}
		&.fabxs {
			width: 48upx;
			height: 48upx !important;
			line-height: 48upx;
			text-align: center;
			padding: 0 !important;
		}
		&.fabs {
			width: 64upx;
			height: 64upx !important;
			line-height: 64upx;
			text-align: center;
			padding: 0 !important;
		}
		&.fabm {
			width: 90upx;
			height: 90upx !important;
			line-height: 90upx;
			text-align: center;
			padding: 0 !important;
		}
		&.fabn {
			width: 110upx;
			height: 110upx !important;
			line-height: 110upx;
			text-align: center;
			padding: 0 !important;
		}
		&.fabl {
			width: 140upx;
			height: 140upx !important;
			line-height: 140upx;
			text-align: center;
			padding: 0 !important;
		}
		&.fabg {
			width: 180upx;
			height: 180upx !important;
			line-height: 180upx;
			text-align: center;
			padding: 0 !important;
		}

		&.wxs {
			min-width: 64upx;
			height: 36upx !important;
			// line-height: 24upx;
			text-align: center;
			// padding: 0 !important;
			padding: 0 12upx;
		}
		&.ws {
			min-width: 90upx;
			height: 48upx !important;
			
			// line-height: 24upx;
			text-align: center;
			padding: 0 16upx;
		}
		&.wm {
			min-width: 140upx;
			height: 64upx !important;
			// line-height: 88upx;
			text-align: center;
			padding: 0 24upx;
		}
		&.wn {
			min-width: 240upx;
			height: 72upx !important;
			// line-height: 88upx;
			text-align: center;
			// padding: 0 !important;
			padding: 0 32upx;
		}
		&.wl {
			min-width: 280upx;
			height: 72upx !important;
			// line-height: 88upx;
			text-align: center;
			padding: 0 32upx;
		}
		&.wg {
			min-width: 400upx;
			height: 76upx !important;
			// line-height: 88upx;
			text-align: center;
			padding: 0 32upx;
		}

		&.plan {
			box-shadow: none !important;
			// background: transparent !important;
			border-width: 1px !important;
			border-style: solid;
		}
		&.titl {
			box-shadow: none !important;
			background: transparent !important;
			border: none;
		}
		&:active,
		&:focus {
			opacity: 0.64;
		}
		&.showValue {
			line-height: inherit !important;
			padding: 0 !important;
		}

		&.noGutter {
			min-width: 0 !important;
			margin: 0 !important;
			padding: 0 !important;
			overflow: unset !important;
		}
	}
	&.d-block {
		button {
			// padding: 30upx 0;
			font-size: 32upx;
			&.plan {
				box-shadow: none !important;
				background: transparent !important;
				border-width: 1px !important;
				border-style: solid;
			}
		}
		&.showValue {
			line-height: inherit !important;
		}
	}
	&.d-inline-block {
		vertical-align: middle;
	}
}
</style>
