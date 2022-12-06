<template>
	<view>
		<view v-if="show_dev" @click.stop.prevent="maskClick" :class="[mask?'mask':'']"
			class="tm-message fixed t-0 l-0 fulled fulled-height flex-center">
			<view :class="[black_dev?'black bk':'',clickOverlay?'clickOverlay':'']" class="tm-message-body  round-6 pa-24 flex-center shadow-24 ">
				<view class=" flex-center flex-col">
					<view :class="[
						model,
						
						]"><text class="iconfont" style="font-size: 54rpx;"
							:class="[ `text-${color_tmeme[model]}`,icon_dev||icon[model],black_dev?'text-white':'']"></text>
					</view>
					<view class="pt-12 text-align-center">
						<text class="text-size-n text-align-center  "
							:class="[black_dev?`text-${color_tmeme[model]||color_tmeme}`+' text-white bk':`text-grey-darken-5`]">
							{{label_dev||label[model]}}
						</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 提示框
	 * @property {Object} color = [] 默认对应的类型主题色
	 * @property {Object} icon = [] 默认对应的类型图标
	 * @property {Object} label = [] 默认对应的类型提示文字
	 * @property {Boolean} black = [] 默认false,是否使用暗黑主题。
	 */
	export default {
		name: 'tm-message',
		props: {
			color: {
				type: Object,
				default: () => {
					return {
						load: 'primary',
						error: 'red',
						info: 'grey-darken-4',
						warn: 'orange',
						quest: 'primary',
						success: 'green',
						disabled: 'pink',
						wait: 'primary',
					}
				}
			},
			icon: {
				type: Object,
				default: () => {
					return {
						load: 'icon-loading',
						error: 'icon-times-circle',
						info: 'icon-info-circle',
						warn: 'icon-exclamation-circle',
						quest: 'icon-question-circle',
						success: 'icon-check-circle',
						disabled: 'icon-ban',
						wait: 'icon-clock',
					}
				}
			},
			label: {
				type: Object,
				default: () => {
					return {
						load: '加载中',
						error: '出错啦',
						info: '信息提示',
						warn: '警告信息',
						quest: '似乎有问题',
						success: '操作成功',
						disabled: '禁止操作',
						wait: '请等待',
					}
				}
			},
			// 暗黑
			black: {
				type: Boolean | String,
				default: null
			},
			// 跟随主题色的改变而改变。
			fllowTheme: {
				type: Boolean | String,
				default: true
			}
		},
		computed: {
			black_tmeme: function() {
				if (this.black !== null) return this.black;
				return this.$tm.vx.state().tmVuetify.black;
			},
			color_tmeme: function() {
				if (this.$tm.vx.state().tmVuetify.color !== null && this.$tm.vx.state().tmVuetify.color && this
					.fllowTheme) {
						let cos = this.$tm.vx.state().tmVuetify.color;
						let co={...this.color,info:cos,quest:cos,load:cos,wait:cos};
						
						
					return co;
				}
				return this.color;
			}
		},
		data() {
			return {
				model: 'wait', //load,error,info，warn，quest，success,disabled，wait
				icon_dev: '',
				label_dev: '',
				timeId: 8964566588,
				show_dev: false,
				mask: false,
				black_dev: false,
				clickOverlay:false,
			};
		},
		destroyed(){
			clearTimeout(this.timeId);
		},
		methods: {
			async anifeed(){
				
				this.clickOverlay = true;
				await uni.$tm.sleep(50)
				this.clickOverlay = false;
			},
			//{label,model,icon,mask,wait,black}
			show() {
				let t = this;
				let def = {
					label: '',
					model: 'info',
					icon: '',
					mask: false,
					wait: 2000,
					black: this.black_tmeme
				};
				let arg = arguments[0] ? {
					...def,
					...arguments[0]
				} : def;
				const {
					label,
					model,
					icon,
					mask,
					wait,
					black
				} = arg;
				this.label_dev = label;
				this.model = model;
				this.icon_dev = icon;
				this.black_dev = black;
				this.mask = mask;
				clearTimeout(this.timeId);
				if (this.model == 'load') {
					this.show_dev = true;
				} else {
					this.show_dev = true;
					this.timeId = setTimeout(function() {
						t.hide();
					}, wait);
				}
			},
			async maskClick(){
				
				await this.anifeed();
			},
			hide() {
				this.show_dev = false;
				clearTimeout(this.timeId);
				this.mask = false;
				this.label_dev = '';
				this.model = 'info';
				this.model = 'info';
				this.icon_dev = '';
				this.black_dev = this.black_tmeme;
			},
		},
	};
</script>

<style lang="scss" scoped>
	.tm-message {
		z-index: 601;
		pointer-events: none;
		background-color: transparent;

		&.mask {
			backdrop-filter: blur(3px);
			background-color: rgba(0, 0, 0, 0.3);
			pointer-events: auto;
		}

		.tm-message-body {
			min-width: 110rpx;
			min-height: 120rpx;
			max-width: 64%;
			backdrop-filter: blur(10px);
			background-color: rgba(255, 255, 255, 0.75);
			
			&.black {
				background-color: rgba(0, 0, 0, 0.90) !important;
			}

			animation: outin 0.3s ease-in-out;
			&.clickOverlay{
				animation: none !important;
			}
			.load {
				animation: load 0.5s infinite linear;
			}

			.error {
				animation: error 1.5s infinite linear;
			}

			.info {
				animation: info 0.5s linear;
			}

			.warn {
				animation: warn 0.5s infinite linear;
			}

			.quest {
				animation: quest 1s infinite linear;
			}

			.success {
				animation: success 1s linear;
			}

			.disabled {
				animation: warn 0.5s infinite linear;
			}

			.wait {
				animation: wait 3.5s infinite linear;
			}
		}
	}






	@keyframes outin {
		0% {
			transform: scale(0.64)
		}

		25% {
			transform: scale(1.1)
		}

		50% {
			transform: scale(0.9)
		}

		100% {
			transform: scale(1)
		}
	}

	// 					wait:'primary',
	@keyframes wait {
		0% {
			transform: rotate(0deg)
		}

		100% {
			transform: rotate(360deg)
		}
	}

	@keyframes success {
		0% {
			transform: scale(1.9)
		}

		25% {
			transform: scale(0.7)
		}

		50% {
			transform: scale(1)
		}

		75% {
			transform: scale(0.9)
		}

		100% {
			transform: scale(1)
		}
	}

	@keyframes quest {
		0% {
			transform: rotate(-45deg)
		}

		50% {
			transform: rotate(45deg)
		}

		100% {
			transform: rotate(-45deg)
		}
	}

	@keyframes warn {
		0% {
			transform: translateX(-10rpx)
		}

		50% {
			transform: translateX(10rpx)
		}

		100% {
			transform: translateX(-10rpx)
		}
	}

	@keyframes info {
		0% {
			transform: scale(0.5)
		}

		100% {
			transform: scale(1)
		}
	}

	@keyframes error {
		0% {
			transform: scale(0.8)
		}

		50% {
			transform: scale(1.2)
		}

		100% {
			transform: scale(0.8)
		}
	}

	@keyframes load {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
</style>
