<template>
	<view class="tm-switchList fulled overflow border-b-1" :class="[black_tmeme?'grey-darken-4 bk':bgColor]"
		:style="{height:height+'rpx'}">
		<movable-area :style="{height:height+'rpx',width:w+'px'}">

			<movable-view :disabled="disabled" :animation="showright" :x="activeOn"
				:style="{height:height+'rpx',width:(w-i_w)+'px'}" inertia @change="onChange" direction="horizontal">
				<view :style="{width:(w-i_w)+'px'}" :class="[disabled?'gray-100':'']"
					class="fulled fulled-height  flex-between  relative">
					<view @click="click"   @touchend="move_action_end" @touchstart="move_action_start"
						:style="{width:(w+i_w)+'px',left:-(w)+'px'}" class=" fulled-height flex-shrink absolute">
						<view class="fulled-height  " :style="{width:(w)+'px',marginLeft:(w-i_w)+'px'}">
							<view class="fulled fulled-height flex-start overflow ">
								<view v-if="icon" class=" d-inline-block">
									<view class="overflow flex-end" style="width: 102rpx;height: 80rpx;">
										<view v-if="dotObj.dot!==null" class="absolute fulled-height fulled" style="z-index: 10;">
											<tm-badges :dot="dotObj.dot" :label="dotObj.label" :icon="dotObj.icon"
												:offset="[5,10]"></tm-badges>
										</view>
										<view class=" flex-center overflow flex-shrink round-4" style="width: 80rpx;height: 80rpx;">
											
											<slot name="left" :hdata="{width:80,height:80}">
												<tm-images :round="4" :src="iconName" :width="80" :height="80" v-if="vtype==false"></tm-images>
												<view v-if="vtype==true" class="round-4 flex-center "
													:class="[color_tmeme,black_tmeme?'bk':'']"
													style="width: 80rpx;height: 80rpx;">

													<text :style="{fontSize: iconSize+'rpx'}" 
														:class="[prefx_computed,iconName]"></text>
												</view>
											</slot>
										</view>
									</view>
								</view>
								<view class="d-inline-block   overflow px-32 "
									:style="{width: `calc(100% - ${icon?164:0}rpx)`,height:height+'rpx'}">
									<view class="fulled-height flex-between overflow">
										<view :style="{width: `calc(100% - ${icon?160:150}rpx)`}">
											<slot name="default">
												<view class="text-size-n text-overflow ">{{title}}</view>
												<view v-if="label" class="text-size-s text-grey  text-overflow pt-4">
													{{label}}
												</view>
											</slot>
										</view>
										<view class="flex-end fulled-height relative">
											<view class=" absolute flex-shrink" style="z-index: 9;">
												<slot name="right">
													<view v-if="rightLabel"
														class="text-size-s text-grey text-align-right nowrap">{{rightLabel}}
													</view>
													<view v-if="rightIcon" class="flex-end nowrap pt-10">
														<tm-icons :fllowTheme="fllowTheme" :color="color_tmeme"
															:name="rightIcon"></tm-icons>
													</view>
												</slot>
											</view>
										</view>
									</view>

								</view>
							</view>
						</view>
					</view>
					<view @click="click"   @touchend="move_action_end" @touchstart="move_action_start"
						:style="{width:w+'px'}" class="fulled fulled-height flex-end absolute">
						<block v-if="showright">
							<view @click.stop="actionsClick(index,item)" v-for="(item,index) in actions" :key="index"
								:style="{width:(item.width||itemWidth)+'rpx'}" :class="[item['color']||'white']"
								class=" fulled-height flex-center text-size-n flex-shrink">{{item.text}}</view>
						</block>
					</view>
				</view>
			</movable-view>
		</movable-area>
	</view>
</template>

<script>
	/**
	 * 滑动单元格
	 * @property {String | Boolean} black = [true|false] 默认：null，是否开启暗黑模式
	 * @property {String | Boolean} disabled = [true|false] 默认：false，是否禁用，禁用后无法操作。
	 * @property {String | Boolean} on = [true|false] 默认：false，是否打开操作栏
	 * @property {Number} width = [] 默认：0，单元格的宽度，rpx,可不提供，默认为父组件的宽度
	 * @property {Number} height = [] 默认：120，单元格的高度度，rpx,
	 * @property {Number} item-width = [] 默认：140，底部操作按钮的宽度，rpx,
	 * @property {Number} icon-size = [] 默认：40，项目左边的图标大小，rpx,
	 * @property {String} color = [] 默认：primary，主题颜色名称
	 * @property {String} bgColor = [] 默认：white，项目的背景色
	 * @property {String} icon = [] 默认：''，项目左边的图标
	 * @property {String} right-icon = [] 默认：''，项目右边的图标
	 * @property {String} right-label = [] 默认：''，项目右边的文字
	 * @property {String} title = [] 默认：''，项目的标题
	 * @property {String} label = [] 默认：''，项目的详细信息文字
	 * @property {String|Boolean|Number} dot = [] 默认：false，是否显示左边图标的角标.Boolean类型时，显示dot。String类型时显示图标,Number类型时显示数字角标。
	 * @property {String} actions = [] 默认：[]，底部的操作按钮格式：{text: "删除列表",width: 190,color: 'red'}
	 * @param {Function} click 点击项目时触发
	 * @param {Function} actionsClick 点击操作按钮时触发，{index:index,item:item}
	 */
	import tmIcons from '@/tm-vuetify/components/tm-icons/tm-icons.vue';
	import tmBadges from '@/tm-vuetify/components/tm-badges/tm-badges.vue';
	import tmImages from '@/tm-vuetify/components/tm-images/tm-images.vue';
	export default {
		name: "tm-switchList",
		components: {
			tmIcons,
			tmBadges,tmImages
		},
		props: {
			width: {
				type: Number,
				default: 0
			},
			height: {
				type: Number,
				default: 140
			},
			itemWidth: {
				type: Number,
				default: 180
			},
			on: {
				type: Boolean,
				default: false
			},
			color: {
				type: String,
				default: 'primary'
			},
			bgColor: {
				type: String,
				default: 'white'
			},
			// 跟随主题色的改变而改变。
			fllowTheme: {
				type: Boolean | String,
				default: true
			},
			// 是否开启暗黑模式
			black: {
				type: String | Boolean,
				default: null
			},
			disabled: {
				type: String | Boolean,
				default: false
			},
			icon: {
				type: String,
				default: ''
			},
			iconSize: {
				type: Number | String,
				default: 40
			},
			rightIcon: {
				type: String,
				default: ''
			},
			rightLabel: {
				type: String,
				default: ''
			},
			title: {
				type: String,
				default: '标题'
			},
			label: {
				type: String,
				default: ''
			},
			dot: {
				type: String | Boolean | Number,
				default: false
			},
			actions: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		data() {
			return {
				x: 0,
				old_x: 0,
				w: 0,
				h: 0,
				i_w: 0,
				showright: false,
				isopnen: 0,
				timidId: 88656,
				isDrageUp: false,
				is_js_cha_old_x: true,
				cha_old_x: 0,
				last_len: 0, //最后一次的距离差，
				last_dir: 0 //最后一次的方向。原因在于滑动时，可能断点
			};
		},
		watch:{
			on:function(){
				if(this.on==true){
					this.$nextTick(function(){
						this.activeOn = 0
					})
				}else if(this.on==false){
					this.$nextTick(function(){
						this.activeOn = this.i_w;
					})
				}
			},
			actions:function () {
				this.initsWH();
			}
		},
		computed: {
			
			vtype: function() {
				if (this.icon[0] == "." ||
					this.icon[0] == "/" ||
					this.icon.substring(0, 4) == 'http' ||
					this.icon.substring(0, 5) == 'https' ||
					this.icon.substring(0, 3) == 'ftp'
				) {
					return false;
				}
				return true;
			},
			iconName: function() {
				return this.icon;
			},
			prefx_computed(){
				let prefix = this.icon.split('-')[0];
				if(prefix=='icon') return 'iconfont';
				if(prefix=='mdi') return 'mdi';
				
				return prefix;
			},
			dotObj: function() {
				if (typeof this.dot === 'number' && this.dot) {
					return {
						dot: false,
						label: this.dot,
						icon: ''
					};
				}
				if (typeof this.dot === 'string' && this.dot) {
					
					if(this.dot.indexOf('-')>0){
						return {
							dot: false,
							label: 0,
							icon: this.dot
						};
					}else{
						
						return {
							dot: false,
							label: this.dot,
							icon: ''
						};
					}
					
				}
				if (typeof this.dot === 'boolean' && this.dot) {
					return {
						dot: true,
						label: 0,
						icon: ''
					};
				}
				return {
					dot: null,
					label: 0,
					icon: ''
				};
			},
			activeOn: {
				get: function() {
					if (this.disabled) return this.i_w;
					return this.isopnen;
				},
				set: function(val) {
					this.isopnen = val

				}
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

		},
		async mounted() {
			this.initsWH();
		},
		methods: {
			initsWH(){
				let t = this;
				let iitemw = uni.upx2px(this.itemWidth);
				let total = 0;
				for (let i = 0; i < this.actions.length; i++) {
					if (this.actions[i]['width']) {
						total += uni.upx2px(this.actions[i]['width'])
					} else {
						total += iitemw
					}
				}
				
				this.$nextTick(async function() {
				
					let p = await this.$Querey(".tm-switchList", this,30).catch(e => {})
					this.w = uni.upx2px(this.width) || p[0].width
					this.i_w = total
					this.x = this.on ? 0 : this.i_w;
					this.isopnen = this.on ? 0 : this.i_w;
					setTimeout(function() {
						t.showright = true;
					}, 50)
				})
			},
			move_action_start(e) {
				if (this.activeOn)
					this.isDrageUp = false;
				this.is_js_cha_old_x = true

			},
			async move_action_end(e) {
				this.isDrageUp = true;
				let t = this;
				await uni.$tm.sleep(50)
				//t.last_len移动的距离。
				//t.last_dir 负为左。正为右
				//左方向。需要达到一定的距离差才会执行
				//以免误触。
				if (t.last_dir < 0) {
					
					// console.log('左');
					// 如果此时，已经在左边。如果还继续往左拉，就是复位到左边。而不是右边。
					if (t.activeOn == 0) {
						t.activeOn = 20;
						await uni.$tm.sleep(200)
						t.activeOn = 0;
						return;
					}
					if (t.last_len > 20) {
						t.activeOn = t.i_w + 10;
						t.$nextTick(function() {
							t.activeOn = 0;
						})
					} else if (t.last_len <= 20) {
						t.activeOn = t.x - 10
						t.$nextTick(function() {
							t.activeOn = t.i_w;
						})
					}
					//右方向
				} else if (t.last_dir > 0) {
					// console.log('右');
					t.activeOn = t.i_w + 10
					await uni.$tm.sleep(10)
					t.$nextTick(function() {

						t.activeOn = t.i_w;
					})
				}
			},
			actionsClick(index, item) {
				if (this.disabled) return;
				this.$emit('actionsClick', {
					index: index,
					item: item
				});
			},
			click(e) {
				this.activeOn = this.i_w;
				if (this.disabled) return;
				this.$emit('click', e)

			},
			onChange: function(e) {
				let t = this;
				let pos_x = e.detail.x;
				this.last_dir = pos_x - this.x; //上一次移动到下一次移动的距离。正为右，负为反方向左。
				if (this.is_js_cha_old_x == true && this.isDrageUp == false) {
					this.cha_old_x = pos_x;
					this.is_js_cha_old_x = false;
					// console.log('按下', pos_x);
				}
				if (this.isDrageUp == true && this.is_js_cha_old_x == false) {
					this.$nextTick(function() {
						this.is_js_cha_old_x = true;
						this.last_len = Math.floor(Math.abs(this.cha_old_x - pos_x)); //从第一次移动到结束时的移动距离。
						// console.log('松开', this.last_len);
					})
				}
				t.x = pos_x;


			}
		}
	}
</script>

<style lang="scss">

</style>
