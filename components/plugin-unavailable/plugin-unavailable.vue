<template>
	<view v-if="pluginInfo" class="plugin-unavailable flex flex-col flex-center"
		:class="{border:useBorder,'decoration':useDecoration}" :style="[calcCustomStyle]">
		<!-- 图标 -->
		<image class="plugin-logo" :src="pluginInfo.logo" mode="scaleToFill"></image>
		<!-- 名称 -->
		<view class="plugin-name">
			{{ pluginInfo.name }}
		</view>
		<view class="plugin-error">
			未安装/启用插件
		</view>
		<!-- 描述 -->
		<view class="plugin-desc">
			{{ pluginInfo.desc }}
		</view>
		<view v-if="errorText" class="plugin-tip">
			{{errorText}}
		</view>
		<!-- 插件地址 -->
		<view class="plugin-url">
			插件地址：{{ pluginInfo.url }}
		</view>
		<!-- 反馈按钮/复制地址 -->
		<view class="plugin-btns w-full flex-center">
			<!-- #ifndef MP-WEIXIN -->
			<tm-button theme="light-blue" :block="true" class="w-full" :height="70" @click="copy">复制地址</tm-button>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<tm-button theme="light-blue" plan text :height="70" @click="copy">复制地址</tm-button>
			<tm-button theme="light-blue" open-type="contact" :height="70">提交反馈</tm-button>
			<!-- #endif -->
		</view>

		<view class="plugin-copyright">
			提示：请确保 Halo 博客已安装相关插件
		</view>
	</view>
</template>

<script>
	import {
		NeedPluginIds,
		NeedPlugins,
		CheckNeedPluginAvailable
	} from "@/utils/plugin.js"
	import utils from '@/utils/index.js'

	import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';

	export default {
		name: "plugin-unavailable",
		components: {
			tmButton
		},
		props: {
			pluginId: {
				type: String,
				default: ""
			},
			errorText: {
				type: String,
				default: ""
			},
			useDecoration: {
				type: Boolean,
				default: true
			},
			useBorder: {
				type: Boolean,
				default: true
			},
			customStyle: {
				type: Object,
				default: () => ({})
			}
		},
		data() {
			return {
				NeedPluginIds,
				NeedPlugins,
				pluginInfo: null,
				defaultStyle: {
					width: "80vw",
					borderRadius: "24rpx"
				}
			};
		},
		computed: {
			calcCustomStyle() {
				const style = this.customStyle ?? {}
				return {
					...this.defaultStyle,
					...style
				}
			}
		},
		watch: {
			pluginId: {
				deep: true,
				immediate: true,
				handler(newVal, oldVal) {
					this.pluginInfo = NeedPlugins.get(newVal)
				}
			}
		},
		methods: {
			copy() {
				utils.copyText(this.pluginInfo.url, "插件地址已复制")
			}
		}
	}
</script>

<style lang="scss" scoped>
	.plugin-unavailable {
		box-sizing: border-box;
		margin: auto;
		padding: 100rpx 36rpx;
		gap: 24rpx;
		font-size: 28rpx;

		&.border {
			// border: 2rpx solid #E2E8F0;
			border: 2rpx solid #eee;
		}

		&.decoration {
			background-color: rgba(255, 255, 255, 0.95);
			box-shadow: 0 0 12rpx rgba(226, 232, 240, 0.35);
			backdrop-filter: blur(6rpx);
			border-top: 12rpx solid rgba(3, 169, 244, 1);
		}

	}

	.plugin-logo {
		box-sizing: border-box;
		width: 120rpx;
		height: 120rpx;
		border-radius: 24rpx;
	}

	.plugin-name {
		box-sizing: border-box;
		font-weight: bold;
		color: #333;
		font-size: 32rpx;
	}

	.plugin-error {
		box-sizing: border-box;
		padding: 6rpx 16rpx;
		border-radius: 36rpx;
		background-color: rgba(255, 61, 49, 0.075);
		color: rgba(255, 61, 49, 1);
		font-size: 24rpx;
		font-weight: bold;
	}

	.plugin-tip {
		box-sizing: border-box;
		padding: 10rpx 20rpx;
		border-radius: 12rpx;
		border: 2rpx dashed #f2c97d;
		color: #f0a020;
		font-size: 24rpx;
	}

	.plugin-desc {
		box-sizing: border-box;
		width: 60vw;
		font-size: 24rpx;
		text-align: center;
		color: #64748b;
	}

	.plugin-url {
		width: 100%;
		box-sizing: border-box;
		padding: 16rpx 24rpx;
		border-radius: 12rpx;
		background-color: #F1F5F9;
		color: #666;
		font-size: 24rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.plugin-btns {
		box-sizing: border-box;
	}

	.plugin-copyright {
		font-size: 20rpx;
		color: #999;
		transform: scale(0.9) translateY(20px);
	}
</style>