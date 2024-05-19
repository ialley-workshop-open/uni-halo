<template>
	<!-- 轮播图 -->
	<view class="Swiper-mfw-index-box">
		<view class="Swiper-mfw-index Swiper-box" :class="[dotPosition]">
			<swiper class="Swiper-mfw" :style="{ height: height }" :circular="true" :indicator-dots="false"
				:autoplay="autoplay" :interval="3000" :duration="1000" :current="currentIndex"
				:disable-touch="disable_touch" @change="change">
				<!-- 只需要前5条数据 -->
				<block v-for="(item, index) in list" :key="index">
					<swiper-item class="swiper-mfw-item" v-if="index <= 4">
						<!-- /*
					 1. 这里不需要用api控制暂停视频
					 2. 因为video标签上加了v-if="current==index"
					 3. 当current == index时才会创建视频组件
					 4. 否current != index则就销毁视频
					 */ -->
						<!-- 如果有视频，则显示视频-->
						<template v-if="item.mp4 && current == index">
							<video class="ImageVideo" :id="'ImageVideo' + index" :ref="'ImageVideo' + index"
								:src="item.mp4" :loop="true" :muted="false" :autoplay="current == index ? true : false"
								:controls="false" :show-fullscreen-btn="false" :show-play-btn="false"
								:enable-progress-gesture="false" :play-strategy="0"
								:poster="item.image || item.src"></video>
						</template>
						<!-- 否则显示图片 -->
						<image v-else :src="item.image || item.src" class="Image" mode="aspectFill"
							@click.stop="$emit('on-click', item)"></image>
					</swiper-item>
				</block>
			</swiper>
			<!-- 指示器 [Top] -->
			<view v-if="useTop" class="Swiper-indicator-box indicator-Top-box">
				<!-- Top顶部 [今日首推-盒子] -->
				<view class="Top-date-hot">
					<view class="left-date-ri">
						<text class="date-ri-text text">{{ date.month }}</text>
					</view>
					<view class="conter-date-nianyue">
						<view class="left-width-bgcolor"></view>
						<view class="right-date-nianyue">
							<text class="Top-yue-usa text">{{ date.monthEn }}</text>
							<text class="Bottom-nian text">{{ date.year }}</text>
						</view>
					</view>
					<view class="right-hot-ttf">
						<text class="text hot-text">{{ title }}</text>
					</view>
				</view>
			</view>

			<!-- 指示器 标题区域 -->
			<view v-if="useTitle" class="Swiper-indicator-Top" :class="{ 'no-dot': !useDot }">
				<block v-for="(item, index) in list" :key="index">
					<view v-if="currentIndex == index" class="Top-item" :class="current == index ? 'current' : 'no'">
						<!-- 如果存在视频，则显示“视频预览”提示 -->
						<view v-if="item.mp4" class="Top-ImageVideo">
							<!-- icon图标 -->
							<view class="Icons">
								<!-- 播放按钮图标 -->
								<text class="iconfont icon-caret-right"></text>
							</view>
							<text class="text ImageVideo-text app-ttf">视频预览</text>
						</view>
						<!-- 标题 -->
						<view class="Top-Title">
							<text class="text title-text">{{ item.title }}</text>
						</view>
						<!-- 用户信息 -->
						<view class="Bottom-UserInfo">
							<!-- 头像 -->
							<view class="UserImage-box">
								<image :src="item.avatar" class="Image" mode="aspectFill"></image>
							</view>
							<!-- 用户名 -->
							<view class="textbox UserName-box">
								<text class="text UserInfo">{{ item.nickname }}</text>
							</view>
							<view v-if="item.createTime" class="jiange-box"><text class="text jiange-text"></text>
							</view>
							<view v-if="item.createTime" class="textbox UserGPS-box">
								<text class="text UserInfo">发布于 {{ item.createTime }}</text>
							</view>
							<view v-if="item.address" class="jiange-box"><text class="text jiange-text">·</text></view>
							<view v-if="item.address" class="textbox UserGPS-box">
								<text class="text UserInfo">{{ item.address }}</text>
							</view>
						</view>
					</view>
				</block>
			</view>
			<!-- 指示器 [左边图片列表+右边按钮] -->
			<view v-if="useDot" class="Swiper-indicator-Bottom">
				<!-- 左边 -->
				<view class="Bottom-left-Imagelist">
					<block v-for="(item, index) in list" :key="index">
						<view class="Bottom-item" v-if="Number(index) <= 4"
							:class="currentIndex == index ? 'current' : 'no'" @click="SwiperIndTap(index)">
							<image :src="item.image || item.src" class="Image" mode="aspectFill"></image>
						</view>
					</block>
				</view>
				<!-- 右边 -->
				<view v-if="false" class="Bottom-right-lili-btn">
					<view class="Bottom-item is-more">
						<view class="more" @click.stop="$emit('on-more')">
							MORE
							<text class="iconfont icon-caret-right"></text>
						</view>
						<text class="left text indicator-text">更多推荐</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'e-swiper',
		props: {
			title: {
				type: String,
				default: ''
			},
			height: {
				type: String,
				default: '450rpx'
			},
			dotPosition: {
				type: String,
				default: 'bottom'
			},
			useTop: {
				type: Boolean,
				default: true
			},
			useDot: {
				type: Boolean,
				default: true
			},
			useTitle: {
				type: Boolean,
				default: true
			},
			useUser: {
				type: Boolean,
				default: true
			},
			// 轮播图 数据列表
			list: {
				type: Array,
				default: () => []
			},
			// 当前选中的项(指示器坐标位置)
			current: {
				type: Number,
				default: 0
			},
			// 是否自动轮播
			autoplay: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				// 是否禁止用户 touch 操作
				currentIndex: 0,
				disable_touch: false, //touch 用户划动引起swiper变化。
				date: {
					year: '-',
					monthEn: '-',
					month: '-'
				}
			};
		},
		created() {
			this.currentIndex = this.current;
			const date = new Date();
			//将月份名称存储在数组中
			const monthArray = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov',
				'Dec');

			this.date.year = date.getFullYear();
			let month = date.getMonth() + 1;
			this.date.month = month < 10 ? '0' + month : month;
			this.date.monthEn = monthArray[date.getMonth()].toUpperCase();
		},
		methods: {
			// current 改变时会触发 change 事件，event.detail = {current: current, source: source}
			change(e) {
				let {
					current,
					source
				} = e.detail;
				//只有页面自动切换，手动切换时才轮播，其他不允许
				if (source === 'autoplay' || source === 'touch') {
					let event = {
						current: current
					};
					this.currentIndex = current;
					this.$emit('change', event);
				}
			},
			// 手动点击了指示器[小图模式]
			SwiperIndTap(e) {
				let index = e;
				let event = {
					current: index
				};
				this.currentIndex = index;
				this.$emit('change', event);
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import './e-swiper.scss';
</style>