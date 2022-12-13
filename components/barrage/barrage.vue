<template>
	<view class="barrage-wrap" :class="[type]">
		<view class="danmu-li" v-for="(item, index) in listData" :class="[type, item.type]" :style="[item.style]" :key="index">
			<view class="danmu-inner">
				<view class="user-box">
					<view class="user-img"><image class="avatar" :src="item.item.avatar"></image></view>
					<view class="user-text cl1">{{ item.item.author }}</view>
					<view class="user-status cl1">{{ item.item.content }}</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	props: {
		// rightToLeft leftToRight leftBottom
		type: {
			type: String,
			default: 'rightToLeft'
		},
		list: {
			type: Array,
			default() {
				return [];
			}
		},
		minTime: {
			type: Number,
			default: 4
		},
		maxTime: {
			type: Number,
			default: 9
		},
		minTop: {
			type: Number,
			default: 0
		},
		maxTop: {
			type: Number,
			default: 240
		},
		hrackH: {
			//轨道高度
			type: Number,
			default: 40
		}
	},
	data() {
		return {
			closeTimer: null,
			listData: []
		};
	},

	mounted() {
		//leftBottom 使用参数
		if (this.type === 'leftBottom') {
			this.hrackNum = Math.floor(this.maxTop / this.hrackH);
		}
	},
	methods: {
		add(obj) {
			this.isShow = true;
			this.showFlag = true;
			let data = {
				...obj,
				id: Date.parse(new Date()),
				time: Math.ceil(Math.floor(Math.random() * (this.maxTime - this.minTime + 1) + this.minTime)),
				type: this.type
			};
			if (this.type === 'leftBottom') {
				let objData = {
					item: data,
					type: 'leftBottomEnter',
					style: {
						transition: `all 0.5s`,
						animationDuration: `0.5s`,
						transform: `translateX(0%)`,
						bottom: `${this.minTop}px`
					}
				};
				let listLen = this.listData.length;
				let hrackNum = this.hrackNum;
				for (let i in this.listData) {
					if (this.listData[i].status === 'reuse') {
						//重用
						this.$set(this.listData, i, objData);
					} else if (this.listData[i].status === 'reset') {
						//重置
						this.listData[i].style.transition = 'none';
						this.listData[i].style.bottom = '6px';
						this.listData[i].status = 'reuse';
					} else if (this.listData[i].status === 'recycle') {
						//回收
						this.listData[i].type = 'leftBottomExit';
						this.listData[i].status = 'reset';
					} else {
						this.listData[i].style.bottom = parseInt(this.listData[i].style.bottom) + this.hrackH + 'px';
					}
					if (parseInt(this.listData[i].style.bottom) >= this.maxTop - this.hrackH && this.listData[i].status !== 'reset') {
						//需要回收
						this.listData[i].status = 'recycle';
					}
				}
				if (listLen < hrackNum + 2) {
					this.listData.push(objData);
				}
			} else if (this.type === 'rightToLeft') {
				let objData = {
					item: data,
					type: 'rightToLeft',
					style: {
						animationDuration: `${data.time}s`,
						top: `${Math.ceil(Math.random() * (this.maxTop - this.minTop + 1) + this.minTop)}px`
					},
					delTime: Date.parse(new Date()) + data.time * 1200
				};
				for (let i in this.listData) {
					if (this.listData[i].delTime <= Date.parse(new Date())) {
						this.repaint(i, objData.type);
						objData.type = '';
						this.$set(this.listData, i, objData);
						return;
					}
				}
				this.listData.push(objData);
			}
		},
		async remove(options = {}) {
			if (this.type == 'rightToLeft') {
				if (this.listData.length != 0) {
					const last = this.listData[this.listData.length - 1];
					setTimeout(() => {
						this.listData = [];
					}, last.item.time * 1200 + 1000);
				}
				return;
			}

			options = Object.assign(
				{},
				{
					duration: 5000, // 延迟关闭的时间
					speed: 1000 // 弹幕消失的速度
				},
				options
			);

			const _fnHandleRemove = item => {
				return new Promise(resolve => {
					setTimeout(() => {
						// item['type'] = 'leftBottomExitLeft';
						item['type'] = 'is-hide';
						resolve();
					}, options.speed);
				});
			};
			const _fnHandleLoop = item => {
				return new Promise(resolve => {
					setTimeout(async () => {
						for (var i = 0; i < this.listData.length; i++) {
							await _fnHandleRemove(this.listData[i]);
						}
						resolve();
					}, options.duration);
				});
			};

			await _fnHandleLoop();
			setTimeout(() => {
				this.listData = [];
			}, options.duration + 200);
		},
		repaint(index, type) {
			setTimeout(() => {
				this.listData[index].type = type;
			}, 100);
		}
	}
};
</script>

<style lang="scss" scoped>
@keyframes leftBottomEnter {
	0% {
		transform: translateY(100%);
		opacity: 0;
	}

	100% {
		transform: translateY(0%);
		opacity: 1;
	}
}

@keyframes leftBottomExit {
	0% {
		transform: translateY(0%);
		opacity: 1;
	}

	100% {
		transform: translateY(-200%);
		opacity: 0;
	}
}

@keyframes leftBottomExitLeft {
	0% {
		transform: translateX(0%);
		opacity: 1;
	}
	50% {
		transform: translateX(-50%);
		opacity: 1;
	}
	100% {
		transform: translateX(-100%);
		opacity: 0;
	}
}
@keyframes leftToRight {
	0% {
		transform: translateX(-100%);
	}

	100% {
		transform: translateX(100%);
	}
}

@keyframes rightToLeft {
	0% {
		transform: translateX(100%);
	}

	100% {
		transform: translateX(-100%);
	}
}
.barrage-wrap {
	position: fixed;
	width: 100%;
	height: 100%;
	pointer-events: none;
	top: 0;
	z-index: 99;
	transition: all 1s ease-in-out;
	&.leftBottom {
		top: initial;
		/* #ifdef H5 */
		bottom: 130rpx;
		/* #endif */
		/* #ifndef H5 */
		bottom: 36rpx;
		/* #endif */
	}
}
.danmu-li {
	position: absolute;
	width: 100%;
	transform: translateX(100%);
	animation-timing-function: linear;
	transition: all 0.5s ease-in-out;
	opacity: 1;
	&.is-hide {
		opacity: 0;
		// transform: translateX(-100%) !important;
	}
	&.leftBottom {
		left: 24rpx;
	}
	&.leftBottomEnter {
		animation-name: leftBottomEnter;
	}
	&.leftBottomExit {
		animation-name: leftBottomExit;
		animation-fill-mode: forwards;
	}
	&.leftBottomExitLeft {
		animation-name: leftBottomExitLeft;
		animation-fill-mode: forwards;
	}
	&.rightToLeft {
		animation-name: rightToLeft;
	}

	&.leftToRight {
		animation-name: rightToLeft;
	}

	.danmu-inner {
		display: inline-block;
		font-size: 24rpx;
		.user-box {
			display: flex;
			padding: 6rpx 40rpx 6rpx 10rpx;
			background: rgba(0, 0, 0, 0.3);
			border-radius: 32rpx;
			align-items: center;

			.user-img {
				display: flex;
				align-items: center;
				justify-content: center;
				.avatar {
					width: 42rpx;
					height: 42rpx;
					background: rgba(55, 55, 55, 1);
					border-radius: 50%;
				}
			}

			.user-status {
				margin-left: 10rpx;
				white-space: nowrap;
				font-weight: 400;
				color: rgba(255, 255, 255, 1);
				max-width: 320rpx;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
			}

			.user-text {
				max-width: 100rpx;
				margin-left: 10rpx;
				font-weight: 400;
				color: rgba(255, 255, 255, 1);
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
			}
		}
	}
}
</style>
