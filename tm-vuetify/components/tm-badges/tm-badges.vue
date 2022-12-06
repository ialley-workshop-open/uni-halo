<!-- 徽章 -->
<template>
	<view class="tm--badges  fulled">
		<view @click.stop="onclick" v-if="icon" class="tm--badges--cm icons flex-center border-white-a-1" :class="[color]" :style="offses+`;width:${iconWidth}rpx;height:${iconWidth}rpx;`">
			<view class="d-inline-block flex-center vertical-align-middle" style="transform: scale(0.7); line-height: 0;">
				<tm-icons style="line-height: 0;" :size="iconSize" :color="iconColor" dense :name="icon"></tm-icons>
			</view>
		</view>
		<view
			@click="onclick"
			v-if="!icon"
			:style="offses"
			class="tm--badges--cm d-inline-block px-6 "
			:class="[color_tmeme, label != '' && !dot ? 'num shadow-red-10' : 'dot', 'flex-center']"
		>
			<text v-if="!dot" class="text-size-xs">{{ label }}</text>
		</view>
		
	</view>
</template>

<script>
/**
 * 徽章、角标
 * @property {String} label = [] 默认：''，当填入信息时即显示数字角标。
 * @property {Number} icon-size = [] 默认：24，当为图标时，可以设置图标大小。
 * @property {Number} icon-width = [] 默认：32，当为图标时，可以设置宽高。
 * @property {String} color = [] 默认：red，主题背景色
 * @property {String} icon-color = [] 默认：white，图标主题背景色
 * @property {Boolean|String} dot = [] 默认：true，使用点。优先级高于label数字展示。
 * @property {String} icon = [] 默认：''，使用图标作为显示角标。
 * @property {Array} offset = [] 默认：[0,0]，位置,x,y偏移量。
 * @property {Funciton} click 点击角标时触发。
 * @example <tm-badges  />
 */
import tmIcons from '@/tm-vuetify/components/tm-icons/tm-icons.vue';
export default {
	components: { tmIcons },
	name: 'tm-badges',
	props: {
		label: {
			type: String | Number,
			default: 0
		},
		// 使用点。优先级高于label数字展示。
		dot: {
			type: Boolean | String,
			default: true
		},
		// 使用图标展示
		icon: {
			type: String,
			default: ''
		},
		iconSize: {
			type: Number|String,
			default: 24
		},
		iconWidth:{
			type: Number|String,
			default: 32
		},
		// 主题色名称
		color: {
			type: String,
			default: 'red'
		},
		// 图标主题色名称
		iconColor: {
			type: String,
			default: 'white'
		},
		// 位置[0,0]
		offset: {
			type: Array,
			default: () => {
				return [0, 0];
			}
		},
		// 跟随主题色的改变而改变。
		fllowTheme: {
			type: Boolean | String,
			default: false
		}
	},
	computed: {
		offses: function() {
			let p = uni.$tm.objToString({
				transform: `translateX(${this.offset[0]}px) translateY(${this.offset[1]}px)`
			});
			return p;
		},
		color_tmeme: function() {
			if (this.$tm.vx.state().tmVuetify.color !== null && this.$tm.vx.state().tmVuetify.color && this.fllowTheme) {
				return this.$tm.vx.state().tmVuetify.color;
			}
			return this.color;
		}
	},
	data() {
		return {};
	},
	methods: {
		onclick(e) {
			this.$emit('click', e);
		}
	}
};
</script>

<style lang="scss" scoped>
.tm--badges {
	position: relative;
	// pointer-events: none;
	display: block;
	.tm--badges--cm {
		position: absolute;
		right: 0;
		top: 0;
		width: 100%;
		&.num {
			width: auto;
			min-width: 26rpx;
			height: 35rpx;
			color: #fff;
			border-radius: 50rpx;
			font-size: 22upx;
			line-height: 35upx;
			text-align: center;
			
		}

		&.icons {
			@extend .num;
		}

		&.dot {
			width: 16upx;
			height: 16upx;
			min-width: 0 !important;
			color: #fff;
			padding: 0;
			border-radius: 50%;
		}
	}
}
</style>
