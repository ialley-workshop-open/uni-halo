<template>
	<!-- 图标 -->
	<view @click="onclick" v-if="name" class="tm-icons " >
		<view
			class="tm-icons-item "
			:style="{
				width: sizes,
				height: sizes,
				lineHeight: sizes
			}"
		>
			<block v-if="vtype == false">
				<image
					:src="name"
					:style="{
						width: sizes,
						height: sizes
					}"
					mode="scaleToFill"
				></image>
			</block>
			<block v-if="vtype == true">
				<!-- #ifdef APP-NVUE -->
				<text
					:style="{
						fontSize: sizes,
						fontFamily: 'iconfontTM'
					}"
					class="icons "
					:class="[black_tmeme ? colors + '-bk' : colors, dense ? '' : 'pa-10', black ? 'opacity-6' : '']"
				>
					{{ iconName }}
				</text>
				<!-- #endif -->
				<!-- #ifndef APP-NVUE -->
				<text
					:style="{
						fontSize: sizes,
						
					}"
					class="icons "
					:class="[prefx_computed, black_tmeme ? 'bk' : '', iconName, colorTheme ? colors : '', dense ? '' : 'pa-10', black ? 'opacity-6' : '']"
				></text>
				<!-- #endif -->
			</block>
		</view>
	</view>
</template>

<script>
/**
 * 图标组件
 * @property {Boolean} dense = [true|false] 默认false,是否去除边距
 * @property {String} prefx = [iconfont] 默认iconfont,默认图标的前缀，对自定义图标时有好处。
 * @property {String} name = [] 默认'',图标名称，注意不带前缀。
 * @property {String | Number} size = [] 默认28, 图标大小，单位是upx
 * @property {String} color = [primary] 默认primary, 图标主题颜色名
 * @property {Function} click 图标点击事件。
 * @example <tm-icons name='icon-clear'></tm-icons>
 */
export default {
	props: {
		dense: {
			//是否小边距
			type: Boolean,
			default: false
		},
		black: {
			type: Boolean,
			default: null
		},
		prefx: {
			type: String, //前缀
			default: 'iconfont'
		},
		name: {
			type: String, //图标名称。
			default: ''
		},
		size: {
			type: String | Number, //图标名称。
			default: 28
		},
		color: {
			type: String|null, //颜色名称或者颜色值。
			default: 'primary'
		},
		//强制转换图标类型，不通过内置判定，解决自己引用图片svg图标时当作字体图标的错误。
		iconType: {
			type: String,
			default: '' //img|icon
		},
		// 跟随主题色的改变而改变。
		fllowTheme: {
			type: Boolean | String,
			default: false
		}
	},
	computed: {
		iconName: function() {
			// #ifdef APP-NVUE || APP-PLUS-NVUE
			let fontList = require('@/tm-vuetify/scss/iconfonts/iconfont.json');
			let name = this.name.replace('icon-', '');

			// fontList.glyphs
			let itemIcon = fontList.glyphs.find((item, index) => {
				return item.font_class == name;
			});
			return eval('"\\u' + itemIcon.unicode + '"');
			// #endif
			return this.name;
		},
		prefx_computed() {
			let prefix = this.name.split('-')[0];
			if (prefix == 'icon') return 'iconfont';
			if (prefix == 'mdi') return 'mdi';

			return prefix;
		},
		black_tmeme: function() {
			return this.$tm.vx.state().tmVuetify.black;
		},
		vtype: function() {
			if (this.name[0] == '.' || this.name[0] == '/' || this.name.substring(0, 4) == 'http' || this.name.substring(0, 5) == 'https' || this.name.substring(0, 3) == 'ftp') {
				return false;
			}
			return true;
		},
		sizes: function() {
			if (typeof this.size === 'string') {
				if (/[rpx|upx|rem|em|vx|vh|px]$/.test(this.size)) {
					return this.size;
				}
				return uni.upx2px(parseInt(this.size)) + 'px';
			}
			if (typeof this.size === 'number' && !isNaN(this.size)) {
				return uni.upx2px(this.size) + 'px';
			}
		},
		color_tmeme: function() {
			if (this.$tm.vx.state().tmVuetify.color !== null && this.$tm.vx.state().tmVuetify.color && this.fllowTheme) {
				return this.$tm.vx.state().tmVuetify.color;
			}
			return this.color;
		},
		colors: {
			get: function() {
				if (!this.color_tmeme) return 'text-primary';
				if (!this.$TestColor(this.color_tmeme)) {
					return this.color_tmeme;
				}
				return 'text-' + this.color_tmeme;
			},
			set: function() {
				if (!this.$TestColor(this.color_tmeme)) {
					this.colorTheme = false;
					return this.color_tmeme;
				}
				this.colorTheme = true;
			}
		}
	},
	data() {
		return {
			colorTheme: true
		};
	},
	methods: {
		onclick(e) {
			this.$emit('click', e);
		}
	}
};
</script>

<style lang="scss" scoped>
.tm-icons {
	display: inline-block;
	.tm-icons-item{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.icons {
		&.black {
			color: #fff;
		}
	}
}
</style>
