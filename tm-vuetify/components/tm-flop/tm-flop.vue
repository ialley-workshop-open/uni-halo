<template>
	<view class="tm-flop vertical-align-middle d-inline-block ">
		<slot name="default" :value="displayValue">{{ displayValue }}</slot>
	</view>
</template>

<script>
/**
 * 数字翻牌
 * @property {Number} startVal = [] 0,起始值
 * @property {Number} endVal = [] 0,最终值
 * @property {Number} duration = [] 3000,从起始值到结束值数字变动的时间
 * @property {Boolean} autoplay = [] true,是否自动播放
 * @property {Number} decimals = [] 0,保留的小数位数
 * @property {String} decimal = [] '.',小数点分割符号
 * @property {String} separator = [] ',',上了三位数分割的符号
 * @property {String} prefix = [] '',前缀
 * @property {String} suffix = [] '',后缀
 * @property {Boolean} isFrequent = [] false,是否隔一段时间数字跳动，这里的跳动是隔一段时间设置初始值
 * @property {Number} frequentTime = [] 5000,跳动间隔时间
 * 此库移植自：https://github.com/sitonlotus/vue-digital-flop
 */
import tmTranslate from '@/tm-vuetify/components/tm-translate/tm-translate.vue';
import { requestAnimationFrame, cancelAnimationFrame } from './requestAnimationFrame';
export default {
	name: 'tm-flop',
	components: {
		tmTranslate
	},
	props: {
		/**
		 * @description 起始值
		 */
		startVal: {
			type: Number,
			required: false,
			default: 0
		},
		/**
		 * @description 最终值
		 */
		endVal: {
			type: Number,
			required: false,
			default: 2021
		},
		/**
		 * @description 从起始值到结束值数字变动的时间
		 */
		duration: {
			type: Number,
			required: false,
			default: 3000
		},
		/**
		 * @description 是否自动播放
		 */
		autoplay: {
			type: Boolean,
			required: false,
			default: true
		},
		/**
		 * @description 保留的小数位数
		 */
		decimals: {
			type: Number,
			required: false,
			default: 0,
			validator(value) {
				return value >= 0;
			}
		},
		decimal: {
			type: String,
			required: false,
			default: '.'
		},
		/**
		 * @description 三位三位的隔开效果
		 */
		separator: {
			type: String,
			required: false,
			default: ','
		},
		/**
		 * @description 前缀
		 * @example '¥' 人民币前缀
		 */
		prefix: {
			type: String,
			required: false,
			default: ''
		},
		/**
		 * @description 后缀
		 * @example
		 */
		suffix: {
			type: String,
			required: false,
			default: ''
		},

		/**
		 * @description 是否具有连贯性
		 */
		useEasing: {
			type: Boolean,
			required: false,
			default: true
		},

		/**
		 * @description 是否隔一段时间数字跳动，这里的跳动是隔一段时间设置初始值
		 */
		isFrequent: {
			type: Boolean,
			required: false,
			default: false
		},
		/**
		 * @description 跳动间隔时间
		 */
		frequentTime: {
			type: Number,
			required: false,
			default: 5000
		}
	},
	data() {
		return {
			localStartVal: this.startVal,
			displayValue: this.formatNumber(this.startVal),
			printVal: null,
			paused: false,
			localDuration: this.duration,
			startTime: null,
			timestamp: null,
			remaining: null,
			rAF: null,
			timer: null
		};
	},
	computed: {
		countDown() {
			return this.startVal > this.endVal;
		}
	},
	watch: {
		startVal() {
			if (this.autoplay) {
				this.start();
			}
		},
		endVal() {
			if (this.autoplay) {
				this.start();
			}
		}
	},
	mounted() {
		if (this.autoplay) {
			this.start();
		}
		if (this.isFrequent && this.frequentTime) {
			this.timer = setInterval(() => {
				this.start(this.randomNum(0, this.endVal));
			}, this.frequentTime);
		}
		this.$emit('mountedCallback');
	},
	destroy(){
		this.destroyed();
	},
	methods: {
		easingFn(t = 0, b = 0, c = 0, d = 0) {
			let p = (c * (-Math.pow(2, (-10 * t) / d) + 1) * 1024) / 1023 + b;
			return p;
		},
		randomNum(a, b) {
			return Math.round(Math.random() * (b - a) + a);
		},
		start(startVal) {
			this.localStartVal = startVal || this.startVal;
			this.startTime = null;
			this.localDuration = this.duration;
			this.paused = false;

			this.rAF = requestAnimationFrame(this.count);
		},
		pauseResume() {
			if (this.paused) {
				this.resume();
				this.paused = false;
			} else {
				this.pause();
				this.paused = true;
			}
		},
		pause() {
			cancelAnimationFrame(this.rAF);
		},
		resume() {
			this.startTime = null;
			this.localDuration = +this.remaining;
			this.localStartVal = +this.printVal;
			requestAnimationFrame(this.count);
		},
		reset() {
			this.startTime = null;
			cancelAnimationFrame(this.rAF);
			this.displayValue = this.formatNumber(this.startVal);
		},
		count(timestamp) {
			if (!this.startTime) this.startTime = timestamp;
			this.timestamp = timestamp;
			const progress = timestamp - this.startTime;
			this.remaining = this.localDuration - progress;

			if (this.useEasing) {
				if (this.countDown) {
					this.printVal = this.localStartVal - this.easingFn(progress, 0, this.localStartVal - this.endVal, this.localDuration) || 0;
				} else {
					this.printVal = this.easingFn(progress, this.localStartVal, this.endVal - this.localStartVal, this.localDuration);
				}
			} else {
				if (this.countDown) {
					this.printVal = this.localStartVal - (this.localStartVal - this.endVal) * (progress / this.localDuration);
				} else {
					this.printVal = this.localStartVal + (this.endVal - this.localStartVal) * (progress / this.localDuration);
				}
			}
			if (this.countDown) {
				this.printVal = this.printVal < this.endVal ? this.endVal : this.printVal;
			} else {
				this.printVal = this.printVal > this.endVal ? this.endVal : this.printVal;
			}

			this.displayValue = this.formatNumber(this.printVal);
			if (progress < this.localDuration) {
				this.rAF = requestAnimationFrame(this.count);
			} else {
				this.$emit('callback');
			}
		},
		isNumber(val) {
			return !isNaN(parseFloat(val));
		},
		formatNumber(num) {
			num = num.toFixed(this.decimals);
			num += '';
			const x = num.split('.');
			let x1 = x[0];
			const x2 = x.length > 1 ? this.decimal + x[1] : '';
			const rgx = /(\d+)(\d{3})/;
			if (this.separator && !this.isNumber(this.separator)) {
				while (rgx.test(x1)) {
					x1 = x1.replace(rgx, '$1' + this.separator + '$2');
				}
			}
			return this.prefix + x1 + x2 + this.suffix;
		}
	},
	destroyed() {
		cancelAnimationFrame(this.rAF);
		this.timer && clearInterval(this.timer);
	}
};
</script>

<style></style>
