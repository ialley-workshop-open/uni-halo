<template>
	<view
		@click="onclick"
		:style="configStyle"
		class="tm--avatar d-inline-block  "
		:class="[titl ? 'round-2' : 'rounded', text ? '' : `shadow-${color_tmeme}-${shadow}`, customClass]"
	>
		<view class="tm--avatar--dot" :class="[dotPos == 'top' ? 'top' : '', dotPos == 'bottom' ? 'bottom' : '']">
			<slot name="dot">
				<view v-if="dotPos == 'bottom'" style="width: 100%;"><tm-badges :offset="[0, -10]" v-if="dot" :color="dotColor"></tm-badges></view>
				<tm-badges :offset="[2, -2]" v-if="dot && dotPos == 'top'" :color="dotColor"></tm-badges>
			</slot>
		</view>
		<view
			class="flex-center overflow text-align-center tm--avatar--conter"
			:class="[
				titl ? `round-${round}` : 'rounded',
				!label && !src ? color_tmeme : '',
				label ? color_tmeme : '',
				black_tmeme ? 'bk' : '',
				text ? 'text' : '',
				outlined ? 'outlined' : '',
				`border-${color_tmeme}-a-${border}`
			]"
			:style="{ width: imgstyle.width, height: imgstyle.height }"
		>
			<slot name="default" :src="src">
				<image v-if="!label" :class="[titl ? 'round-0' : 'rounded']" :style="{ width: imgstyle.width, height: imgstyle.height }" :src="src"></image>
				<text v-if="label" :style="{ fontSize: fontsize }">{{ label }}</text>
			</slot>
		</view>
	</view>
</template>

<script>
/**
 * 头像框
 * @property {Number | String} size = [98|80|64] 默认：98，头像的宽高,单位upx
 * @property {String} color = [primary] 默认：primary，主题背景色
 * @property {Number|String} shadow = [] 默认：0，投影
 * @property {Number} round = [] 默认：0，圆角，只有在titl下起作用。
 * @property {String} label = [] 默认：''，当填入信息时，文本头像，禁用img模式。
 * @property {String} font-size = [] 默认：'36'，文字大小，单位upx，label时启用。
 * @property {String} src = [] 默认：'https://picsum.photos/200'，头像图片地址，label时禁用用。
 * @property {Boolean} titl = [true|false] 默认：false，开户titl模式即正常的正方形而非圆形。
 * @property {Boolean} text = [true|false] 默认：false，文本模式
 * @property {Boolean} outlined = [true|false] 默认：false，边框模式
 * @property {Boolean} dot = [true|false] 默认：false，显示头像点。建议自行通过slot dot 自行设置。
 * @property {String} dot-color = [] 默认：primary，角标颜色
 * @property {String} dot-pos = [top|bottom] 默认：top，解析的位置
 * @property {Number|String} border = [] 默认：0，边框，边框颜色为你的color颜色
 * @property {String | Boolean} black = [true|false] 默认：false，是否开启暗黑模式
 * @property {String} custom-class = [] 默认：''，自定义类。
 * @property {Function} click 返回：{event,src,label})。
 * @example <tm-avatar ></tm-avatar>
 */
import tmBadges from '@/tm-vuetify/components/tm-badges/tm-badges.vue';
export default {
	components: { tmBadges },
	name: 'tm-avatar',
	props: {
		// 头像的宽高upx
		size: {
			type: Number | String,
			default: 98
		},
		// 主题背景色
		color: {
			type: String,
			default: 'primary'
		},
		dotColor: {
			type: String,
			default: 'red'
		},
		// 自定义类
		customClass: {
			type: String,
			default: ''
		},
		// 投影
		shadow: {
			type: Number | String,
			default: 0
		},
		// 当填入信息时，禁用img模式。
		label: {
			type: String,
			default: ''
		},
		// 单位upx
		fontSize: {
			type: String | Number,
			default: 36
		},
		// 注意，只有当label没有填写时才会启用。
		src: {
			type: String,
			default: 'https://picsum.photos/200'
		},
		// 开户til模式即正常的正方形而非圆形。
		titl: {
			type: Boolean,
			default: false
		},
		black: {
			type: Boolean | String,
			default: null
		},
		round: {
			type: Number,
			default: 0
		},
		text: {
			type: Boolean,
			default: false
		},

		outlined: {
			type: Boolean,
			default: false
		},
		dot: {
			type: Boolean,
			default: false
		},
		dotPos: {
			type: String,
			default: 'top'
		},
		border: {
			type: Number | String,
			default: 0
		},
		// 跟随主题色的改变而改变。
		fllowTheme: {
			type: Boolean | String,
			default: true
		}
	},
	data() {
		return {
			imgstyle: { width: 0, height: 0 },
			wkstyle: {}
		};
	},
	computed: {
		fontsize: function() {
			return uni.upx2px(this.fontSize) + 'px';
		},
		black_tmeme: function() {
			if (this.black !== null) return this.black;
			return this.$tm.vx.state().tmVuetify.black;
		},
		color_tmeme: function() {
			if (this.$tm.vx.state().tmVuetify.color !== null && this.$tm.vx.state().tmVuetify.color && this.fllowTheme) {
				return this.$tm.vx.state().tmVuetify.color;
			}
			return this.color;
		},
		configStyle: {
			get: function() {
				return this.wkstyle;
			},
			set: function(obj) {
				this.wkstyle = uni.$tm.objToString(obj);
			}
		}
	},
	mounted() {
		this.imgstyle = {
			width: uni.upx2px(parseInt(this.size)) + 'px',
			height: uni.upx2px(parseInt(this.size)) + 'px'
		};
	},
	methods: {
		setConfigStyle(val) {
			this.configStyle = val;
		},
		onclick(e) {
			this.$emit('click', { event: e, src: this.src, label: this.label });
		}
	}
};
</script>

<style lang="scss" scoped>
.tm--avatar {
	position: relative;
	line-height: 0;
	vertical-align: middle;
	.tm--avatar--dot {
		position: absolute;
		z-index: 10;
		width: 100%;
		&.bottom {
			bottom: 0upx;
		}
	}
	.tm--avatar--conter {
		line-height: 0;
	}
}
</style>
