<template>
	<view class="tm-actionSheetMenu">
		<tm-poup @change="toogle" ref="pop" :black="false" v-model="showpop" height="auto" bg-color="none">
			<view class="ma-32">
				<view class=" round-8 overflow ">
					<tm-button
						:fllowTheme="false"
						:black="black_tmeme"
						font-size="22"
						font-color="grey"
						:theme="black_tmeme ? 'grey-darken-4' : 'white'"
						block
						flat
					>
						{{ title }}
					</tm-button>
					<slot>
						<tm-button
							:fllowTheme="false"
							:black="black_tmeme"
							@click="onclick(index, item)"
						 v-for="(item, index) in actions"
							:key="index"
							:item-class="'text-' + color_tmeme"
							:theme="black_tmeme ? 'grey-darken-4' : 'white'"
							block
							flat
						>
							{{ item[rangKey] ? item[rangKey] : item }}
						</tm-button>
					</slot>
				</view>
				<view style="height: 96upx " class="pb-24 pt-16">
					<tm-button :round="8" :fllowTheme="false" :item-class="' text-weight-b'" :black="black_tmeme" @click="close" :theme="black ? 'grey-darken-4' : 'white'" block>
						取消
					</tm-button>
				</view>
				<!-- #ifdef H5 -->
				<view style="height: var(--window-bottom);"></view>
				<!-- #endif -->
			</view>
		</tm-poup>
	</view>
</template>

<script>
/**
 * 动作面板
 * @description 动作面板,从底部弹出的操作菜单。
 * @property {Boolean} black = [true|false] 默认：null，暗黑模式
 * @property {Boolean} value = [true|false] 默认：false，显示菜单，推荐使用v-model,使用value.sync达到双向绑定。
 * @property {String} title = [] 默认：'请操作',弹出层的标题。
 * @property {Array} actions = [] 默认：[],可以是对象数组，也可是字符串数组。
 * @property {String} rang-key = [title] 默认：title,actions对象数组时，需要提供自定义标题键。
 * @property {Boolean} click-close = [true|false] 默认：true,点击项目时，是否自动关闭弹层。
 * @property {Boolean} font-color = [] 默认：primary,文字颜色。可以是主题颜色，也可以是颜色格式rgb,rgba,#ff0000格式
 * @property {Function} change 点击项目时触发,返回：{index:项目索引,data:actions的对象数据}
 * @property {Function} input 弹层显示和隐藏时，将会触发。
 * @example <tm-actionSheetMenu  :value="true" :actions="['说明文档','说明文档']"></tm-actionSheetMenu>
 */

import tmPoup from '@/tm-vuetify/components/tm-poup/tm-poup.vue';
import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
export default {
	components: { tmButton, tmPoup },
	name: 'tm-actionSheetMenu',
	model: {
		prop: 'value',
		event: 'input'
	},
	props: {
		value: {
			type: Boolean,
			default: false
		},
		black: {
			type: Boolean,
			default: null
		},
		title: {
			type: String,
			default: '请操作'
		},
		fontColor: {
			type: String,
			default: 'black'
		},
		actions: {
			type: Array,
			default: () => {
				return [];
			}
		},
		// 自定义标题键key.
		rangKey: {
			type: String,
			default: 'title'
		},
		// 点击项目时，是否关闭弹层
		clickClose: {
			type: Boolean,
			default: true
		},
		// 跟随主题色的改变而改变。
		fllowTheme: {
			type: Boolean | String,
			default: true
		}
	},
	data() {
		return {
			showpop: false
		};
	},
	mounted() {
		this.showpop = this.value;
	},
	computed: {
		color_tmeme: function() {
			if (this.$tm.vx.state().tmVuetify.color !== null && this.$tm.vx.state().tmVuetify.color && this.fllowTheme) {
				return this.$tm.vx.state().tmVuetify.color;
			}
			return this.fontColor;
		},
		black_tmeme: function() {
			if (this.black !== null) return this.black;
			return this.$tm.vx.state().tmVuetify.black;
		}
	},
	watch: {
		value: function(val) {
			this.showpop = val;
		}
	},
	methods: {
		close() {
			this.$refs.pop.close();
		},
		toogle(e) {
			let t = this;
			if (e) {
				this.$nextTick(function() {
					if (this.dataValue != this.defaultValue) {
						this.dataValue = this.defaultValue;
					}
				});
			}
			this.$emit('input', e);
			this.$emit('update:value', e);
		},
		onclick(index, item) {
			this.$emit('change', { index: index, data: item });
			if (this.clickClose === true) {
				this.$refs.pop.close();
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.tm-actionSheetMenu-title {
	.tm-actionSheetMenu-close {
		top: 32upx;
		right: 32upx;
		width: 50upx;
		height: 50upx;
	}
}
</style>
