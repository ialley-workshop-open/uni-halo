<template>
	<view @click.stop="" class="tm-menubars fulled ">
		<view v-if="!transparent" :style="{ height: tabHeight }"></view>
		<view v-if="!transparent" :style="{ height: '45px' }"></view>
		<view class="body  fulled"  :class="[
				black_tmeme ? 'bk grey-darken-5 ' : '',
				'shadow-' + color_tmeme + `-${shadow} `,
				transparent ? (isTransparent ? 'transparent flat ' + `text-${fontColorTheme}` : color_tmeme) : color_tmeme,
				flat ? 'flat' : ''
			]">
			<view :style="{ height: tabHeight }"></view>
			<view class="body_wk flex-between">
				<view class="left flex-start">
					<block v-if="showback">
						<view v-if="pageUrl && isHome == false" class="home-btn mr-20 text flex-center flex-shrink"
							:class="[color_tmeme,black_tmeme ? 'outlined bk' : '']">
							<navigator :url="pageUrl" open-type="reLaunch" class="flex-center">
								<text class="iconfont icon-home" :style="{ fontSize: '32rpx' }"></text>
							</navigator>
						</view>
						<navigator v-if="!pageUrl" open-type="navigateBack" class="flex-center px-24 flex-shrink fulled-height">
							<text class="iconfont icon-angle-left" :class="[`text-${fontColorTheme}`]" :style="{ fontSize: '28rpx' }"></text>
						</navigator>
					</block>
					<slot name="left" :data="{ style: widths, isTransparent: isTransparent, title: title }"></slot>
				</view>
				<view class="center flex-center text-size-g text-overflow text-align-center" :class="[`text-${fontColorTheme}`]">
					<slot name="default" :data="{ style: widths, isTransparent: isTransparent, title: title }">
						{{ title }}
					</slot>
				</view>
				<view class="right flex-end" :style="{ width: widths.btns }">
					<slot name="right" :data="{ style: widths, isTransparent: isTransparent, title: title }"></slot>
				</view>
			</view>
		</view>
	</view>
	
</template>

<script>
	/**
	 * 菜单工具栏
	 * @property {Boolean} black = [true|false] 默认:false,暗黑模式。
	 * @property {String|Array} color = [primary] 默认:primary,主题颜色名称如果为array,则为渐变色格式第一个方向：top,bottom,right,left[top,color1,color2]，如果为string时，可以为rgba,rgb,#fff或者颜色主题名称如：purple-darken-4
	 * @property {String} theme = [black|white] 默认:custom,只有在transparent:true时，black:表示黑色模式，文字变白。white文字变黑。
	 * @property {String} font-color = [] 默认:null,文字颜色,默认不需要提供根据主题色自动推断。一旦赋值，自带的theme失效。使用用户颜色类。
	 * @property {String} home-url = [] 默认:'/pages/index/index',应用的首页地址。当从其它页面以reLaunch进入非首页时会自动显示首页按钮。
	 * @property {Boolean} flat = [true|false] 默认:false,去除投影，边线
	 * @property {Boolean} transparent = [true|false] 默认:false,开启透明顶部。下拉时会变成自定义的背景色。
	 * @property {Number} scroll-tobg = [true|false] 默认:0,当值大于0即开启透明背景。下拉时达到设定的值，即显示自定义的背景和文字色。
	 * @property {Number | String} width = [] 默认:0,宽度，数字，或者百度比。数字的单位是upx
	 * @property {Boolean} showback = [true|false] 默认:true,是否显示左边的返回和首页按钮。
	 * @property {String} title = [] 默认:标题, 中间标题文字。
	 * @example <tm-menubars  color="white" :showback="false"></tm-menubars>
	 *
	 */

	import tmIcons from '@/tm-vuetify/components/tm-icons/tm-icons.vue';
	export default {
		components: {
			tmIcons
		},
		options:{
			multipleSlots: true
		},
		name: 'tm-menubars',
		props: {
			// 是否开启暗黑模式
			black: {
				type: String | Boolean,
				default: null
			},
			// 主题颜色名称如果为array,则为渐变色格式第一个方向：top,bottom,right,left[top,color1,color2]
			// 如果为string时，可以为rgba,rgb,#fff或者颜色主题名称如：purple-darken-4
			color: {
				type: String | Array,
				default: 'primary'
			},
			fontColor:{
				type:String,
				default:''
			},
			// custom为自定导航样式 。black标题文字为白。white标题文字为黑。它表示的是所处背景的模式。
			theme: {
				type: String,
				default: 'custom' //'black'|'white'|'custom'
			},
			// 几乎所有组件都有flat选项，去除投影，边线。
			flat: {
				type: String | Boolean,
				default: false
			},
			// 是否开启顶部透明模式。
			transparent: {
				type: String | Boolean,
				default: false
			},
			// 当值大于0即开启透明背景。下拉时达到设定的值，即显示自定义的背景和文字色。
			scrollTobg: {
				type: Number,
				default: 70
			},
			// 是否显示左边的返回和首页按钮。
			showback: {
				type: Boolean,
				default: true
			},
			// 中间标题文字。
			title: {
				type: String,
				default: '标题'
			},
			// 首页页面地址。当前访问子页面时，将会显示首页按钮。
			homeUrl: {
				type: String,
				default: '/pages/index/index'
			},
			shadow: {
				type: String | Number,
				default: 3
			},
			// 跟随主题色的改变而改变。
			fllowTheme: {
				type: Boolean | String,
				default: true
			}
		},
		data() {
			return {
				pageUrl: '',
				nowScrollTop: 0,
				isHome: false,
				tabHeight: 0
			};
		},
		computed: {
			black_tmeme: function() {
				if (this.black !== null) return this.black;
				return this.$tm.vx.state().tmVuetify.black;
			},
			color_tmeme: function() {
				if (this.$tm.vx.state().tmVuetify.color !== null && this.$tm.vx.state().tmVuetify.color && this
					.fllowTheme) {
					return this.$tm.vx.state().tmVuetify.color;
				}
				if(this.transparent){
					if(this.isTransparent) return ''
				}
				return this.color;
			},
			fontColorTheme:function(){
				if(this.theme == 'custom') return this.fontColor;
				if(this.transparent){
					if(this.isTransparent){
						if(this.theme == 'black') return 'white';
						if(this.theme == 'white') return 'black';
					}
				}
				
				return this.fontColor;
			},
			// 当页面在滚动时返回当前是透明还是不透明背景。
			isTransparent: function() {
				return this.nowScrollTop < this.scrollTobg;
			},
			ColorThemeName:function(){
				return this.color;
			},
			widths: function() {
				let jnwd = 0; //小程序有的胶囊宽度.
				// #ifdef MP
				// 胶囊的大小。
				let mw = uni.getMenuButtonBoundingClientRect();
				jnwd = mw.width;
				// #endif
				return uni.$tm.objToString({
					btns: jnwd + 'px',
				});
			}
		},
		created() {
			let sysinfo = uni.getSystemInfoSync();
			let sysbarheight = 0;
			// #ifdef MP || APP-PLUS || APP-VUE
			sysbarheight = sysinfo.statusBarHeight;
			// #endif
			this.tabHeight = sysbarheight + 'px';
			
		},
		mounted() {
		
			uni.$on('onPageScroll', e => {
				this.nowScrollTop = e.scrollTop;
			});
			// 检查页面栈
			let pages = getCurrentPages();
			let nopage = pages[pages.length - 1].route;
			if (nopage[0] != '/') {
				nopage = '/' + nopage;
			}
			if (nopage == this.homeUrl) {
				this.isHome = true;
			}
			if (pages.length == 1 && typeof pages[0].route !== 'undefined') {
				// #ifdef H5
				this.pageUrl = '/';
				// #endif
				// #ifdef MP
				this.pageUrl = this.homeUrl;
				// #endif
			}
		},
		methods: {}
	};
	//
</script>

<style lang="scss" scoped>
	.tm-menubars {
		.body {
			position: fixed;
			z-index: 450;
			top: 0;
			left: 0;

			&.transparent {
				background: none !important;
				transition: all 0.6s;
			}

			.body_wk {
				height: 45px;
				// opacity: 0.9;

				.left {
					max-width: 74px;
					min-width: 74px;

					.home-btn {
						border-radius: 50%;

						height: 30px;
						width: 30px;
						line-height: 30px;
						margin-left: 24upx;
					}
				}

				.right {
					max-width: 74px;
					min-width: 74px;
				}

				.center {
					width: calc(100% - 148px);
					flex-shrink: 0;
				}
			}
		}
	}
</style>
