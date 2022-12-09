<template>
	<view
		@click.stop="overCloseCHange"
		v-if="show"
		class="tm-dialog fixed flex-center"
		:style="{
			height: sysinfo + 'px'
		}"
	>
		<view @click.stop="" :class="[show ? 'success' : '']">
			<view :class="[clickOverlay ? 'clickover' : '']">
				<tm-sheet :black="black_tmeme" :padding="[0, 0]" classname="overflow" :width="600" :round="round" shadow="10">
					<view class="text-size-g flex-center text-weight-b px-32 pt-32 " :class="[black_tmeme ? 'bk' : '', bottomBorder ? 'border-b-1' : '']">
						<slot name="title">{{ title }}</slot>
					</view>
					<view class="px-50 py-n12 text-size-n text-align-center" style="max-height:700rpx;overflow-y: auto;">
						<slot name="default">
							<view >
								<text :class="[black_tmeme ? 'text-white' : 'text-grey-darken-3']">{{ content }}</text>
								<view v-if="model == 'confirm'" class="pt-24">
									<tm-input bg-color="grey-lighten-5" @input="suren" :black="black_tmeme" v-model="inputValSd" :border-bottom="false" :flat="true"></tm-input>
								</view>
							</view>
						</slot>
					</view>

					<slot name="button">
						<view v-if="theme == 'merge'" class="py-0 flex-between">
							<tm-button
								:fllowTheme="fllowTheme"
								:height="80"
								text
								:black="black_tmeme"
								@click="concelClick"
								v-if="showCancel"
								:theme="black_tmeme ? 'grey-darken-4' : color_tmeme"
								round="0"
								shadow="0"
								style="width: 50%;"
								block
							>
								{{ cancelText }}
							</tm-button>
							<tm-button
								:fllowTheme="fllowTheme"
								:height="80"
								:black="black_tmeme"
								@click="confirmClick"
								:theme="color_tmeme"
								round="0"
								shadow="0"
								:style="{
									width: showCancel ? '50%' : '100%'
								}"
								block
							>
								{{ confirmText }}
							</tm-button>
						</view>
						<view v-if="theme == 'split'" class="px-40 pb-40 flex-between">
							<tm-button
								:fllowTheme="fllowTheme"
								text
								:height="72"
								:black="black_tmeme"
								@click="concelClick"
								v-if="showCancel"
								:theme="black_tmeme ? 'grey-darken-4' : color_tmeme"
								round="24"
								font-size="30"
								shadow="0"
								style="width: 46%;"
								block
							>
								{{ cancelText }}
							</tm-button>
							<tm-button
								:fllowTheme="fllowTheme"
								:height="72"
								:black="black_tmeme"
								@click="confirmClick"
								:theme="color_tmeme"
								round="24"
								font-size="30"
								shadow="0"
								:style="{
									width: showCancel ? '46%' : '100%'
								}"
								block
							>
								{{ confirmText }}
							</tm-button>
						</view>
					</slot>
				</tm-sheet>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * 对话框
 * @property {Boolean} value = [] 显示对话框，推荐使用value.sync或者v-model
 * @property {Boolean} black = [] 暗黑模式。
 * @property {Boolean} bottom-border = [] true,是否显示标题正文的边线。
 * @property {String} confirmColor = [] 默认：primary，确认按钮的主题颜色
 * @property {String} confirmText = [] 默认：确认，确认按钮的文字
 * @property {Boolean} showCancel = [] 默认：true，是否显示取消按钮。
 * @property {Boolean} disabled = [] 默认：false，禁用后，点击哪都关闭不了，只能通过手动设置v-model来关闭窗体。
 * @property {String} cancelColor = [] 默认：primary，取消按钮的主题色。
 * @property {String} cancelText = [] 默认：取消，取消按钮显示的文字。
 * @property {String} title = [] 默认：提示，标题。
 * @property {String} content = [] 默认：''，内容文字
 * @property {String} theme = [merge|split] 默认：'merge'，merge合并按钮，split分割按钮
 * @property {String} model = [dialog|confirm] 默认：'dialog'，对话框类型.dialog|confirm
 * @property {Number|String} round = [] 默认：'4'，圆角
 * @property {String} input-val = [] 默认：''，model=confirm,显示的输入框内容。confirm
 * @property {Boolean} over-close = [] 默认：true，点击遮罩是否关闭窗体。
 * @property {Function} confirm 确认按钮时触发，注意：如果类型为confirm则返回 的参数包含输入框的内容。
 * @property {Function} cancel 点击取消按钮时触发。
 * @example <tm-dialog  v-model="show" content="这是测试的内容"></tm-dialog>
 */
import tmSheet from '@/tm-vuetify/components/tm-sheet/tm-sheet.vue';
import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
import tmInput from '@/tm-vuetify/components/tm-input/tm-input.vue';
export default {
	components: { tmSheet, tmButton, tmInput },
	name: 'tm-dialog',
	model: {
		prop: 'value',
		event: 'input'
	},
	props: {
		value: {
			type: Boolean,
			default: false
		},
		bottomBorder: {
			type: Boolean,
			default: false
		},
		black: {
			type: Boolean | String,
			default: null
		},
		confirmColor: {
			type: String,
			default: 'primary'
		},
		confirmText: {
			type: String,
			default: '确认'
		},
		showCancel: {
			type: Boolean,
			default: true
		},
		cancelColor: {
			type: String,
			default: 'primary'
		},
		cancelText: {
			type: String,
			default: '取消'
		},
		title: {
			type: String,
			default: '消息提示'
		},
		content: {
			type: String,
			default: ''
		},
		// 样式。
		theme: {
			type: String,
			default: 'merge' //merge|split merge合并按钮，split分割按钮
		},
		// 对话框类型.dialog|confirm
		model: {
			type: String,
			default: 'dialog' // dialog|confirm
		},
		round: {
			type: Number | String,
			default: 8
		},
		inputVal: {
			type: String,
			default: ''
		},
		// 跟随主题色的改变而改变。
		fllowTheme: {
			type: Boolean | String,
			default: true
		},
		overClose: {
			type: Boolean | String,
			default: false
		},
		//如果为true,需要你手动关闭。点按钮关闭不了。
		disabled: {
			type: Boolean | String,
			default: false
		}
	},
	computed: {
		show: {
			get: function() {
				return this.value;
			},
			set: async function(val) {
				this.$emit('input', val);
				this.$emit('update:value', val);
			}
		},
		black_tmeme: function() {
			if (this.black !== null) return this.black;
			return this.$tm.vx.state().tmVuetify.black;
		},
		color_tmeme: function() {
			if (this.$tm.vx.state().tmVuetify.color !== null && this.$tm.vx.state().tmVuetify.color && this.fllowTheme) {
				return this.$tm.vx.state().tmVuetify.color;
			}
			return this.confirmColor;
		}
	},
	data() {
		return {
			inputValSd: '',
			sysinfo: 0,
			clickOverlay: false
		};
	},
	created() {
		let sysinfo = uni.getSystemInfoSync();
		// #ifdef APP || MP
		if (sysinfo.windowHeight == sysinfo.screenHeight) {
			this.sysinfo = sysinfo.screenHeight;
		} else if (sysinfo.windowHeight < sysinfo.screenHeight) {
			this.sysinfo = sysinfo.windowHeight;
		}
		// #endif
		// #ifdef H5
		if(sysinfo.screenHeight>=sysinfo.windowHeight){
			this.sysinfo = sysinfo.windowHeight;
		}else{
			this.sysinfo = sysinfo.screenHeight;
		}
		
		// #endif

		this.show = this.value;
	},
	methods: {
		overCloseCHange() {
			if (this.overClose) {
				this.concelClick();
			} else {
				this.anifeed();
			}
		},
		anifeed() {
			let t = this;
			if (this.clickOverlay) this.clickOverlay = !this.clickOverlay;
			this.clickOverlay = true;
			uni.$tm.sleep(100).then(() => {
				t.clickOverlay = false;
			});
		},
		confirmClick() {
			if (this.model == 'confirm') {
				if (!this.inputValSd) {
					uni.$tm.toast('请输入内容');
					this.anifeed();
					return;
				}
				this.$emit('confirm', this.inputValSd);
			} else {
				this.$emit('confirm');
			}
			if (this.disabled == false) {
				this.show = false;
			}
		},
		suren(e) {
			this.$emit('update:inputVal', this.inputValSd);
		},
		concelClick() {
			this.$emit('concel');//错误的拼写兼容
			this.$emit('cancel');//正常的拼写
			if (this.disabled == false) {
				this.show = false;
			}
		}
	}
};
</script>

<style lang="scss">
.tm-dialog {
	width: 100%;
	z-index: 600;
	background-color: rgba(0, 0, 0, 0.3);
	left: 0;
	top: 0;
	
	backdrop-filter: blur(3px);
	transition: all 0.24s;
	.success {
		animation: success 0.24s ease;
		
		// transform: scale(1);
	}
	.clickover {
		animation: clickover 0.24s ease;
	}
}
@keyframes clickover {
	0% {
		transform: scale(0.95);
	}

	50% {
		transform: scale(1.05);
	}

	100% {
		transform: scale(1);
	}
}
@keyframes success {
	0% {
		transform: scale(0.75);
		opacity: 0;
	}
	75% {
		transform: scale(1.05);
	}

	100% {
		transform: scale(1);
		opacity: 1;
	}
}
</style>
