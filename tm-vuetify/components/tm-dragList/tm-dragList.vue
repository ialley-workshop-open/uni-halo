<template>
	<view class="tm-dragList ">
		<view :style="{height:h*list.length+'px',width:w+'px'}" class="relative"
			:class="[disabled?'opacity-7':'']">
			<view class="fulled-height overflow" :class="[bgColor,black_tmeme?'grey-darken-4 bk':'',
				'absolute',
				'tm-dragList-item','shadow-'+(nowMove_index==index?16:0),'flex-between']" v-for="(item,index) in listData"
				:key="index" :style="{
					transition: nowMove_index==index||endDrage?'all 0s':'all 0.25s',
					top: item.top+'px',
					height:h+'px',width:w+'px',zIndex:nowMove_index==index?5:0}">
				<view class=" flex-start  fulled" :class="[black_tmeme?'border-grey-darken-5-b-1':'border-b-1']"
				:style="{height:(h-1)+'px'}"
				>
					<view v-if="item['icon']" class="flex-shrink pl-32 fulled-height flex-center">
						<tm-icons :black="black_tmeme" :color="item['color']||'black'" :fllowTheme="fllowTheme" dense
							:name="item['icon']" :size="40"></tm-icons>

					</view>
					<view class="pl-32 text-size-n" :class="[black_tmeme?'bk':'']">{{item.text}}</view>
				</view>
				<view
				 :style="{height:(h-1)+'px',width: '100rpx'}"
				    @touchstart="m_start($event,index)"
					@mousedown="m_start($event,index)"
					@touchmove.stop.prevent="m_move($event,index)" 
					@mousemove.stop.prevent="m_move($event,index)"
					@touchend="m_end($event,index)" 
					@mouseup="m_end($event,index)"
					class="flex-shrink flex-end " :class="[black_tmeme?'border-grey-darken-5-b-1':'border-b-1']">
					<text class="iconfont icon-menu pr-32  text-size-n"
						:class="[black_tmeme?' bk text-grey-darken-2':'text-grey']"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 拖放排序
	 * @property {String | Boolean} black = [true|false] 默认：null，是否开启暗黑模式
	 * @property {String | Boolean} disabled = [true|false] 默认：false，是否禁用，禁用后无法操作。
	 * @property {Number} width = [] 默认：0，组件的宽度，rpx,可不提供，默认为父组件的宽度。
	 * @property {Number} height = [] 默认：120，列表项目的高度，rpx,
	 * @property {String} bgColor = [] 默认：white，项目的背景色
	 * @property {String} right-icon = [] 默认：''，项目右边可拖动的图标
	 * @property {String} rang-key = [] 默认：'text'，列表项目读取文本的key
	 * @property {String} list = [] 默认：[]，列表数据[{text: "菜单选项",icon: 'icon-menu',color:'red'}]
	 * @param {Function} change 拖动排序后，触发，返回新的排序后list数据。
	 */
	import tmIcons from '@/tm-vuetify/components/tm-icons/tm-icons.vue';
	export default {
		name: "tm-dragList",
		components: {
			tmIcons
		},
		props: {
			disabled: {
				type: String | Boolean,
				default: false
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
			width: {
				type: Number,
				default: 0
			},
			height: {
				type: Number,
				default: 120
			},
			list: {
				type: Array,
				default: () => {
					return []
				}
			},
			rangKey: {
				type: String,
				default: 'text'
			},
			rightIcon: {
				type: String,
				default: "icon-menu"
			},
			bgColor: {
				type: String,
				default: "white"
			},

		},
		destroyed() {
			clearTimeout(999)
		},
		watch: {
			list: {
				deep: true,
				handler() {
					this.jishunTopData();
				}
			}
		},
		data() {
			return {
				w: 0,
				h: 0,
				totalH: 0,
				y: 0,

				new_index: null, //即将被替换的索引（实质性被替换）
				nowMove_index: null, //现在正在移动的索引
				listData: [], //被处理过的数据。
				new_item: [], //虚拟列表，内部排列好，但未在页面中渲染。
				endDrage: false,
				Drage__id: '', //正在被拖动的id;
				h_top: 0,

			};
		},
		computed: {
			black_tmeme: function() {
				if (this.black !== null) return this.black;
				return this.$tm.vx.state().tmVuetify.black;
			},
		},
		async mounted() {
			let t = this;
			this.jishunTopData();
		},
		methods: {
			jishunTopData() {
				this.$nextTick(async function() {
					this.listData = [];
					let p = await this.$Querey(".tm-dragList", this).catch(e => {})
					this.w = uni.upx2px(this.width) || p[0].width;
					this.h = uni.upx2px(this.height)
					
					this.totalH = this.h * this.list.length
					let list = [];
					for (let i = 0; i < this.list.length; i++) {
						let p = this.list[i];
						p['top'] = i * this.h;
						p['i'] = i;
						p['__id'] = uni.$tm.guid();
						this.listData.push(p)
					}
					this.new_item = [...this.listData];

				})
			},
			m_start(event, index) {
				event.preventDefault()
				event.stopPropagation()
				if (this.disabled) return;

				this.nowMove_index = index;
				
				this.endDrage = false;
				this.new_item = [...this.listData];
				if (event.type.indexOf('mouse') == -1 && event.changedTouches.length == 1) {
					var touch = event.changedTouches[0];
					this.y = touch.pageY - event.currentTarget.offsetTop - this.listData[index].top
				} else {
					this.y = event.pageY - event.currentTarget.offsetTop - this.listData[index].top
				}

				// #ifdef MP
				uni.vibrateShort({})
				// #endif
			},
			m_move(event, index) {
				if (this.disabled) return;
				let t = this
				event.preventDefault()
				event.stopPropagation()

				if (t.nowMove_index == null) return;
				//当前元素的top位置。
				let ch = 0;
				if (event.type.indexOf('mouse') == -1 && event.changedTouches.length == 1) {
					var touch = event.changedTouches[0];
					ch = touch.pageY - t.y

				} else {
					ch = event.pageY - t.y
				}

				t.listData.splice(index, 1, {
					...t.listData[index],
					top: ch
				})
				const currenit_index = index;
				const currentSort = t.listData[currenit_index].i;
				const currenit_id = t.listData[currenit_index].__id;

				// 计算当前移动的index.
				let moveIndex = Math.round(ch / t.h);

				moveIndex = moveIndex < 0 ? 0 : moveIndex;
				moveIndex  = moveIndex > t.listData.length - 1 ? t.listData.length - 1 : moveIndex;
				
				moveIndex = Math.abs(moveIndex)
				
				index = moveIndex;
				let elList = [...t.listData]
				for (let i = 0; i < elList.length; i++) {
					if (currentSort < moveIndex) {
						if (elList[i].i > currentSort && elList[i].i <= moveIndex) {
							elList[i].i -= 1;
						};
					} else if (currentSort > moveIndex) {
						if (elList[i].i < currentSort && elList[i].i >= moveIndex) {
							elList[i].i += 1;
						};
					}
				};
				elList[currenit_index].i = moveIndex;
				elList = elList.map(im => {
					if (im.__id != currenit_id) {
						im.top = im.i * t.h;
					}
				
					return im;
				})
				t.listData = elList;
				t.new_index = moveIndex;
				// #ifdef MP
				uni.vibrateShort({})
				// #endif


			},
			m_end(event, index) {
				if (this.disabled) return;
				let t = this;
				event.preventDefault()
				event.stopPropagation()
				this.nowMove_index = null;
				this.endDrage = true;
				if (this.new_index == null) return;
				let elList = t.listData
				elList = elList.map(im => {
					im.top = im.i * t.h;
					return im;
				})
				elList.sort((a,b)=>a.i-b.i)
				t.listData = [...elList]
				this.moveChange();
			},

			moveChange(e, index) {
				if (this.disabled) return;
				//change后修改的数据 。
				this.$emit('change', this.listData);
			}
		},
	}
</script>

<style lang="scss">
	
</style>
