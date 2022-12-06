<!-- 导航工具栏 -->
<template>
	<view :style="{
			width: position != 'static' ? wininfo.windowWidth - offsetLeft * 2 + 'px' : 'auto',
			left: position != 'static' ? offsetLeft + 'px' : '0px',
			top: position == 'top' ? top_px + 'px' : 'auto',
			bottom: position == 'bottom' ? bottom_px + 'px' : 'auto'
		}" class="tm-bottomnavigation " :class="[
			black_tmeme ? 'grey-darken-5' : '',
			black_tmeme ? 'bk' : '',
			'round-' + round,
			bgTheme,
			position,
			border === 'top' ? 'border-t-1' : '',
			border === 'bottom' ? 'border-b-1' : '',
			'sheetIDX'
		]">
		<view :style="{ background: bgColor }" class=" flex-between py-10">

			<block v-for="(item, index) in listDate" :key="index">
				<view :style="{
						width: listLen + '%'
					}" class="flex-center" :key="index" :class="[active_selecindex == index && ani == true ? ` ani ` : ``]">
					
						<tm-button :key="index" titl height="100%" :width="btnwidth"
							:iconSize="item['iconSize'] ? item['iconSize'] : 38"
							:fontSize="item['fontSize'] ? item['fontSize'] : 20" :vertical="vertical" :icon="active_selecindex==index?item.icon:(item['noIcon']||item.icon)"
							:label="item.value" block :theme="active_selecindex == index ? iconColor : iconColorGrey"
							:black="black_tmeme" @click.stop="onclick($event, index)" item-class="noGutter  "
							:font-color="active_selecindex == index ? iconColor : iconColorGrey">
							<template v-slot:icon="{ data }">
								<!-- #ifdef MP -->
								<text v-if="false">{{offsetLeft}}</text>
								<!-- #endif -->
								<view style="height: 52rpx;">
									<view v-if="!item['custom']"  >
										<view v-if="item.showDot" class="relative fulled" style="z-index: 10;">
											<tm-badges  :color="item.dot['color']||iconColor" v-if="!item.dot['dot']&&!item.dot['icon']" :label="item.dot.num"
												:offset="[10, 0]"  :dot="item.dot.dot"></tm-badges>
											<tm-badges :color="item.dot['color']||iconColor" v-if="item.dot['dot']&&!item.dot['icon']"></tm-badges>
											<tm-badges :color="item.dot['color']||iconColor" :offset="[10,0]" :icon="item.dot['icon']" v-if="item.dot['icon']"></tm-badges>
											
										</view>
										
										<tm-icons :black="black_tmeme"
											:color="active_selecindex == index ? iconColor : iconColorGrey" :size="data.size"
											:name="data.icon"></tm-icons>
									</view>
									<view v-if="item['custom'] === true"
										class="tm-bottomnavigation-custom absolute flex-center" :style="{
											width: '100%',
											height: '100%',
											minHeight: '100%',
											top: '-50%',
											left: '0',
											flexShrink: 0
										}">
										<view
											:class="[item['customColor'] ? item['customColor'] : (bgColor?'':'red'), black_tmeme ? 'bk' : '']"
											:style="{width: '90rpx',height: '90rpx',background:bgColor?bgColor:''}" class="rounded  flex-center">
											<tm-icons :black="black_tmeme" :color="item['customFontColor'] || iconColorGrey"
												:size="data.size" :name="data.icon"></tm-icons>
										</view>
									</view>
								</view>
							</template>
							<template v-slot:default="{data}">
								<text :class="[active_selecindex == index ? 'ani' : '']">{{ data }}</text>
							</template>
						</tm-button>
					
					
				</view>
			</block>

		</view>
		<!-- 安全区域的高度。 -->

		<view v-if="safe" :style="{ height: safeBottomeHeight + 'px',background: bgColor }"></view>
	</view>

	<!-- 	
	list:[{...}],基础属性为：{icon:"图标或者图片",value:"标题"}
	全部属性为（除了上述基本两个属性，其它全为可选。）：
	{
		icon: 'icon-user-fill',
		noIcon:'',//未选中时的图标，不提供默认使用相同的图标icon
		value: '个人中心',
		iconSize: 38,
		fontSize: 20,
		showDot:false,//是否显示角标。
		dot:{
			dot:false,//是否显示点。如果是点，则不显示Num
			num:"",//是否显示数字。
			ico:"",//是否显示图标，优先级高于dot,num.
		},
		path: ''
	}
-->
</template>

<script>
	/**
	 * 底部导航工具条
	 * @property {Array} list = [] 默认：[],基本属性：{icon:"图标或者图片",value:"标题"}，
	 * @property {String} bg-theme = [] 默认："white",背景颜色主题名称
	 * @property {String | Boolean} black = [true|false] 默认：null,暗黑模式。
	 * @property {String} bg-color = [] 默认：'',自定义背景颜色。
	 * @property {String} icon-color = [] 默认：使用主题色,项目默认激活色。
	 * @property {String} icon-color-grey = [] 默认：使用主题色,项目失去焦点时的颜色。
	 * @property {String} position = [bottom|top|static] 默认：bottom,可选位置：bottom|top|static
	 * @property {Number|String} top = [] 默认：0,距离顶部的距离：只有在position=='top'使用
	 * @property {Number|String} bottom = [] 默认：0,距离底部的距离：只有在position=='bottom'使用
	 * @property {String} border = [top|bottom] 默认：top,显示上边线还是下边线。可选top / bottom
	 * @property {String|Boolean} vertical = [true|false] 默认：true,文字方向：默认是竖向。否则为横向。
	 * @property {String|Number} offset-left = [] 默认：0,偏移量。即离左边的间距。如果提供，自动居中出现两边间隙。
	 * @property {String|Boolean} safe = [true|false] 默认：true,// 是否开启底部安全区域。
	 * @property {String|Boolean} auto-selected = [true|false] 默认：true,// 是否开启自动匹配页面选中底部按钮。
	 * @property {Function} change 切换按钮时触发。
	 *
	 */

	import tmButton from "@/tm-vuetify/components/tm-button/tm-button.vue"
	import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
	import tmBadges from "@/tm-vuetify/components/tm-badges/tm-badges.vue"
	export default {
		components: {
			tmButton,
			tmIcons,
			tmBadges
		},
		name: 'tm-bottomnavigation',
		props: {
			list: {
				Array,
				default: () => {
					return [];
				}
			},
			// 背景颜色主题名称
			bgTheme: {
				type: String,
				default: 'white'
			},
			// 是否启用暗黑主题。
			black: {
				type: String | Boolean,
				default: null
			},
			// 背景颜色，自定义。
			bgColor: {
				type: String,
				default: ''
			},

			// 自定义项目文字默认激活色。
			iconColor: {
				type: String,
				default: 'primary'
			},
			// 自定义项目文字默认失去焦点色。
			iconColorGrey: {
				type: String,
				default: 'grey-lighten-1'
			},
			// 可选bootom / top / static
			position: {
				type: String,
				default: 'bottom'
			},
			// 距离顶部的距离。默认是0,只有在position=='top'使用
			top: {
				type: Number | String,
				default: 0
			},
			// 距离顶部的距离。默认是0,只有在position=='bottom'使用
			bottom: {
				type: Number | String,
				default: 0
			},
			// 显示上边线还是下边线。可选top / bottom
			border: {
				type: String,
				default: 'top'
			},
			// 文字方向：默认是竖向。否则为横向。
			vertical: {
				type: String | Boolean,
				default: true
			},
			// 只支持圆角主题。如round-5
			round: {
				type: String | Number,
				default: 0
			},
			// 偏移量。即离左边的间距。如果提供，整个navbar的宽度会是100% - offsetLeft*2。
			offsetLeft: {
				type: String | Number,
				default: 0
			},
			// 是否开启底部安全区域。
			safe: {
				type: String | Boolean,
				default: true
			},
			// 是否开启点按动画，默认开启。
			ani: {
				type: String | Boolean,
				default: true
			},
			// 是否自动匹配页面选中底部按钮？
			autoSelected: {
				type: String | Boolean,
				default: true
			},
			activeIndex:{
				type:Number,
				default:0
			}
		},
		computed: {

			black_tmeme: function() {
				if (this.black !== null) return this.black;
				return this.$tm.vx.state().tmVuetify.black;
			},
			top_px: function() {
				return this.top;
			},
			bottom_px: function() {
				return this.bottom;
			},

			wininfo: function() {
				return uni.getSystemInfoSync();
			},
			listLen: function() {
				if (this.listDate.length == 0) return 1;
				return 100 / this.listDate.length;
			},
			active_selecindex:function(){
				if(!this.autoSelected) return this.slectedIndx;
				return this.$tm.vx.state().tmVuetify.tmVueTifly_pagesIndex;
			}
		},
		created() {
			uni.hideTabBar({animation:false})
		},
		data() {
			return {
				slectedIndx: -1, //默认激活的值。
				btnwidth: 0,
				safeBottomeHeight: 0,
				listDate: [],
				pages:[]
			};
		},
		watch:{
			list:{
				deep:true,
				handler(){
					let t = this;
					this.$nextTick(function() {
						let qr = uni.createSelectorQuery().in(this);
						qr.select('.sheetIDX')
							.boundingClientRect()
							.exec(e => {
								t.btnwidth = e[0].width / 5 + 'px';
								t.listItem();
						});
					});
				}
			},
			activeIndex:function(){
				if(!this.autoSelected) this.slectedIndx = this.activeIndex;
			}
		},
		
		mounted() {
			if(!this.autoSelected) this.slectedIndx = this.activeIndex;
			setTimeout(function(){
				uni.hideTabBar({animation:false})
			},350)
			let t = this;
			this.$nextTick(function() {
				uni.hideTabBar({animation:false})
				let qr = uni.createSelectorQuery().in(this);
				qr.select('.sheetIDX')
					.boundingClientRect()
					.exec(e => {
						t.btnwidth = e[0].width / 5 + 'px';
						t.listItem();
					});
			});
			
		},

		methods: {
			autoxz(){
				
				let sy = uni.getSystemInfoSync();
				// #ifdef MP
				this.safeBottomeHeight = sy.screenHeight - sy.safeArea.bottom;
				// #endif
				// #ifdef H5
				this.safeBottomeHeight = sy.windowHeight - sy.safeArea.height;
				// #endif
				// #ifdef APP
				this.safeBottomeHeight = Math.abs(sy.safeArea.bottom - sy.safeArea.height);
				// #endif
				if(!this.autoSelected){
					return;
				}

				let pageRoute = this.$tm.vx.state().tmVuetify.tmVueTifly_pages;
		
				
				let index = this.listDate.findIndex((el,index)=>{
					let url = el?.path||"";
					url = url.split('?')[0]||"";
					return url == pageRoute
				 })
				
				if(index>-1){
					this.slectedIndx = index;
					this.$tm.vx.commit('setPageNowIndex',index)
					this.$emit('change', {
						index: index,
						item: this.listDate[index]
					});
					
				}
			},
			listItem() {
				let mod = {
					icon: 'icon-user-fill',
					value: '个人中心',
					iconSize: 38,
					fontSize: 20,
					showDot: false, //是否显示角标。
					dot: {
						dot: false, //是否显示点。如果是点，则不显示Num
						num: '', //是否显示数字。
						ico: '' //是否显示图标，优先级高于dot,num.
					},
					path: '',
					openType:'switchTab'
				};

				this.$nextTick(function() {
					let tm = [];
					let ls = this.$tm.deepClone(this.list);
					ls.forEach((item, index) => {
						tm.push({
							...mod,
							...item
						});
					});
					this.listDate = tm;
					this.autoxz();
				});
			},
			onclick(e, index) {
				let t = this;
				this.slectedIndx = index;
				this.$tm.vx.commit('setPageNowIndex',index)
				let item = this.listDate[index];
				this.$emit('change', {
					index: index,
					item: item
				});
				if (item?.path) {
					let oldPath = item['path']||"";
					oldPath = oldPath.split("?")[0]||"";
					let pages = getCurrentPages();
					let url = pages[pages.length-1].route;
					if(url[0]!='/') url = '/' + url;
					url = url.split('?')[0]||"";
					if(url==oldPath) return;
					// #ifdef MP || APP
					try{
						uni.vibrateShort()
					}catch(e){
						// ...
					}
					// #endif
					switch (item['openType']) {
						case 'switchTab':
							uni.switchTab({
								url: item.path,
								fail: (e) => {
									console.log(e);
								}
							})
							break;
						case 'redirect':
							uni.redirectTo({
								url: item.path
							})
							break;
						case 'reLaunch':
							uni.reLaunch({
								url: item.path
							})
							break;
						case 'navigateBack':
							uni.navigateBack({
								url: item.path
							})
							break;
						default:
							uni.navigateTo({
								url: item.path
							})
							break;
					}
				}
				
				
			}
		}
	};
</script>
<style>
	page,
	body {
		padding-bottom: 167rpx;
	}
</style>
<style lang="scss" scoped>
	.tm-bottomnavigation {
		// animation: scalse 0.4s linear;

		&.bottom {
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 450;
		}

		&.top {
			position: fixed;
			z-index: 450;
			top: 0;
			left: 0;
		}
	}

	.ani {
		animation: scalse 0.4s linear;
	}

	@keyframes scalse {
		0% {
			transform: scale(0.9);
		}

		50% {
			transform: scale(1.1);
		}

		100% {
			transform: scale(1);
		}
	}
</style>
