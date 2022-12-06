<template>
	<view class="tm-stepper  d-inline-block">
		<view class="flex-center" :style="{  width: `${width}rpx` }">
			<view :class="[isJianDisabled||disabled?'opacity-6 gray':'']">
				<tm-button @touchcancel="endlongpressEvent" @touchend="endlongpressEvent"
					@touchstart="$emit('touchstart', 'minus')" @longpress="longpressEvent('-')" :fllowTheme="fllowTheme"
					:disabled="isJianDisabled || disabled ? true : false"
					:shadow="isJianDisabled || disabled ? 0 : shadwo_num" :black="black_tmeme" @click="setStep('-')"
					:item-class="circular?' pa-0':` round-l-${round} `" icon-size="24" :round="circular?round:0"
					:theme="disabled ? '' : color_tmeme" :width="height" :height="height" block icon="icon-minus">
				</tm-button>
			</view>
			<input v-if="fixed!=0" @blur="inputVal" @input="inputVal" :disabled="(disabled||disabledInput)"
				v-model="setVal" type="digit" :style="{ height: `${height}rpx`, width: `calc(100% - ${height}rpx)` }"
				class="text-align-center  text-size-n fulled"
				:class="[`text-${font_color}`, black_tmeme&&!circular ? 'grey-darken-4 bk' : '',black_tmeme? 'text-grey-lighten-4' : '',circular?'':'grey-lighten-4']" />
			<input v-if="fixed==0" @blur="inputVal" @input="inputVal" :disabled="(disabled||disabledInput)"
				v-model="setVal" type="number" :style="{ height: `${height}rpx`, width: `calc(100% - ${height}rpx)` }"
				class="text-align-center grey-lighten-4 text-size-n fulled"
				:class="[`text-${font_color}`, black_tmeme&&!circular ? 'grey-darken-4 bk' : '',black_tmeme? 'text-grey-lighten-4' : '',circular?'':'grey-lighten-4']" />
			<view :class="[isAddDisabled||disabled?'opacity-6 gray':'']">
				<tm-button @touchcancel="endlongpressEvent" @touchend="endlongpressEvent"
					@touchstart="$emit('touchstart', 'add')" @longpress="longpressEvent('+')" :fllowTheme="fllowTheme"
					:shadow="isAddDisabled || disabled ? 0 : shadwo_num" :black="black_tmeme" @click="setStep('+')"
					:item-class="circular?' pa-0':` round-r-${round} `" icon-size="24" :round="circular?round:0"
					:theme="disabled ? '' : color_tmeme" :disabled="isAddDisabled || disabled ? true : false"
					:width="height" :height="height" block icon="icon-plus"></tm-button>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 步进器
	 * @property {String|Number} value = [] 默认：''，值，推荐使用value.sync或者v-model
	 * @property {Boolean} disabled = [] 默认：false，是否禁用
	 * @property {Boolean} black = [] 默认：false，是否暗黑模式。
	 * @property {Number|String} step = [] 默认：1， 步幅。
	 * @property {String} color = [] 默认：primary， 主题色。
	 * @property {String} fontColor = [] 默认：black， 输入框的文字主题色。
	 * @property {String|Number} round = [] 默认：3， 圆角。
	 * @property {String|Number} shadow = [] 默认：3， 圆角。
	 * @property {String|Number} max = [] 默认：999， 最大值。
	 * @property {String|Number} min = [] 默认：0， 最小值。
	 * @property {String|Number} width = [] 默认：200， 宽度，单位rpx。
	 * @property {String|Number} height = [] 默认：70， 高度，单位rpx。
	 * @property {String} name = [] 默认：''，提交表单时的的字段名称标识
	 * @property {Boolean|String} disabledInput = [] 默认：false，是否禁用输入框
	 * @property {Boolean|String} circular = [] 默认：false，按钮四角是否跟随圆角
	 * @property {Number} fixed = [] 默认：0， 小数点位数
	 * @example <tm-stepper  value="50"></tm-stepper>
	 */
	import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';

	export default {
		components: {
			tmButton
		},
		name: 'tm-stepper',
		model: {
			prop: 'value',
			event: 'input'
		},
		props: {
			value: {
				type: Number | String,
				default: 0
			},
			//提交表单时的的字段名称
			name: {
				type: String,
				default: ''
			},
			disabled: {
				type: Boolean,
				default: false
			},
			//禁用输入功能
			disabledInput: {
				type: Boolean | String,
				default: false
			},
			black: {
				type: Boolean | String,
				default: null
			},
			// 步幅，默认1
			step: {
				type: Number,
				default: 1
			},
			//固定小数点位数，0表示整数
			fixed: {
				type: Number,
				default: NaN
			},
			color: {
				type: String,
				default: 'primary'
			},
			fontColor: {
				type: String,
				default: 'black'
			},
			round: {
				type: String | Number,
				default: 3
			},
			circular: {
				type: Boolean | String,
				default: false
			},
			shadow: {
				type: String | Number,
				default: 3
			},
			// 跟随主题色的改变而改变。
			fllowTheme: {
				type: Boolean | String,
				default: true
			},
			max: {
				type: Number | String,
				default: 999
			},
			min: {
				type: Number | String,
				default: 0
			},
			height: {
				type: Number | String,
				default: 60
			},
			width: {
				type: Number | String,
				default: 180
			},
			//回调函数。默认返回true即增减，否则不执行增减。
			callback: {
				type: Function | Object | Boolean,
				default: true
			}
		},
		data() {
			return {
				setVal: '',
				timeid: 598985656
			};
		},
		mounted() {
			this.setVal = this.value;
		},
		watch: {
			value: function(val) {
				this.jianchData(parseFloat(val));
			}
		},
		computed: {
			isJianDisabled() {
				if (isNaN(parseInt(this.setVal))) return false;
				if (parseInt(this.setVal) <= this.min) return true;
				return false;
			},
			isAddDisabled() {
				if (isNaN(parseInt(this.setVal))) return false;
				if (parseInt(this.setVal) >= this.max) return true;
				return false;
			},
			black_tmeme: function() {
				if (this.black !== null) return this.black;
				return this.$tm.vx.state().tmVuetify.black;
			},
			color_tmeme: function() {
				if (this.$tm.vx.state().tmVuetify.color !== null && this.$tm.vx.state().tmVuetify.color && this
					.fllowTheme) {
					return this.$tm.vx.state().tmVuetify.color;
				}
				return this.color;
			},
			font_color: function() {
				if (this.fontColor) return this.fontColor;
				return this.color;
			},
			shadwo_num: function() {
				if (typeof this.shadow !== 'undefined') return this.shadow;
				return 3;
			}
		},
		destroyed() {
			clearInterval(this.timeid);
		},
		methods: {
			async setStep(ty) {
				if (this.disabled) return;

				if (typeof this.callback !== 'boolean' && this.callback !== true) {
					uni.showLoading({
						title: '...',
						mask: true
					})
					let p = await this.callasync();
					uni.hideLoading();
					if (p !== true) return;
				}
				this.$nextTick(function() {
					var val = parseFloat(this.value);
					if (!isNaN(this.fixed) && this.fixed > 0) {
						val = val.toFixed(this.fixed)
						if (isNaN(val) || val == 0 || val == '0' || val == '' || !val) {
							val = '0.' + this.strWidth(this.fixed) + this.step
						}
						val = parseFloat(val)
						let setval = '0.' + this.strWidth(this.fixed) + this.step
						setval = parseFloat(setval);
						if (ty == '+') {
							val += setval
						} else {
							val -= setval
						}
					} else if (!isNaN(this.fixed) && this.fixed == 0) {
						val = val.toFixed(this.fixed)
						val = parseInt(val)
						if (ty == '+') {
							val += this.step
						} else {
							val -= this.step
						}
					} else if (isNaN(this.fixed)) {
						if (ty == '+') {
							val += this.step
						} else {
							val -= this.step
						}
					}

					if (val < 0) {
						if (val <= this.min) {
							val = this.min;
						}
						clearInterval(this.timeid);
					} else if (val >= this.max) {
						val = this.max;
						clearInterval(this.timeid);
					}
					const realVal = val;
					this.setVal = isNaN(realVal) ? '' : String(val);
					this.$emit('input', this.setVal);
					this.$emit('update:value', this.setVal);
					this.$emit('change', this.setVal);
				});

			},
			inputVal(e) {
				var val = parseFloat(e.detail.value)
				this.jianchData(val);
			},
			strWidth(len) {
				let v = '';
				for (let i = 0; i < len - 1; i++) {
					v += '0';
				}
				return v;
			},
			jianchData(val) {

				this.$nextTick(function() {
					if (!isNaN(this.fixed) && this.fixed > 0) {
						val = val.toFixed(this.fixed)
						if (isNaN(val) || val == 0 || val == '0' || val == '' || !val) {
							val = '0.' + this.strWidth(this.fixed) + this.step
						}
					} else if (!isNaN(this.fixed) && this.fixed == 0) {
						val = val.toFixed(this.fixed)
					}
					const realval = val;
					if (val < this.min) {
						val = String(this.min);
					}
					if (val > this.max) {
						val = String(this.max);
					}
					this.setVal = isNaN(parseFloat(realval)) ? '' : String(val);
					this.$emit('input', this.setVal);
					this.$emit('update:value', this.setVal);
					this.$emit('change', this.setVal);
				});
			},
			longpressEvent(ty) {
				if (this.disabled) return;
				let t = this;
				clearInterval(this.timeid);
				this.timeid = setInterval(async function() {
					await t.setStep(ty);
				}, 250);
			},
			endlongpressEvent(ty) {
				clearInterval(this.timeid);
			},
			//异步回调
			async callasync() {
				let verify = this.callback;
				verify = await verify()
				if (typeof verify === 'function') {
					verify = await verify()
				}
				if (typeof verify !== 'boolean') verify = true;

				return verify;
			}
		}
	};
</script>

<style lang="scss"></style>
