<template>
	<view class="tm-tabs " :class="[bgColor == 'white' ? (black_tmeme ? 'bk grey-darken-4' : bgColor) : bgColor, 'shadow-' + bgColor + '-' + shadow, black_tmeme ? 'bk' : '']">
		<scroll-view scroll-with-animation :scroll-into-view="toTargetId" @scroll="scrollViesw" scroll-x class="tm-tabs-con ">
			<view
				class="tm-tabs-wk  "
				:class="{
					'text-align-left': align == 'left',
					'text-align-right': align == 'right',
					'text-align-center': align == 'center',
					'flex-between': align == 'split'
				}"
			>
				<view
					@click.stop.prevent="acitveItemClick(index, true, $event)"
					class="tm-tabs-con-item d-inline-block "
					:class="[
						`tm-tabs-con-item-${index}`,
						model == 'rect' ? 'border-' + color_tmeme + '-a-1' : '',
						index !== list.length - 1 && model == 'rect' ? 'tm-tabs-con-item-rborder' : '',
						active == index && model == 'rect' ? color_tmeme : ''
					]"
					:style="{
						height: barheight + 'px',
						lineHeight: barheight + 'px'
					}"
					v-for="(item, index) in list"
					:key="index"
					:id="guid + '_' + index"
				>
					<view
						class="tm-tabs-con-item-text px-24"
						:style="{
							fontSize: active == index ? active_font_size : font_size
						}"
						:class="[
							(model == 'line' || model == 'none') && active == index ? 'text-' + color_tmeme : 'text-'+fontColor,
							(model == 'line' || model == 'none') && active == index ? 'text-weight-b' : '',
							model == 'fill' && active == index ? color_tmeme: '',
						]"
					>
						<slot name="default" :data="item">{{ item[rangeKey] || item }}</slot>
					</view>
				</view>
			</view>
			<view
				v-if="model == 'line'"
				class="tm-tabs-con-item-border"
				:class="[borderColor, `shadow-${color_tmeme}-4`, isOnecLoad == false ? 'tm-tabs-con-item-border-trans' : '']"
				:style="{
					transform: `translateX(${activePos.left})`,
					width: activePos.width
				}"
			></view>
		</scroll-view>
	</view>
</template>

<script>
/**
 * 选项卡切换
 * @property {String} model = [line|rect|fill] 默认：line，样式,线和框两种
 * @property {String} color = [] 默认：primary，主题文字颜色。
 * @property {String} active-border-color = [] 默认：''，底下指示线的颜色主题。
 * @property {String} bg-color = [] 默认：white，主题背景颜色。
 * @property {Number} value = [] 默认：0，当前激活的项。双向绑定使用value.sync或者v-model
 * @property {Number} font-size = [] 默认：28，默认字体大小，单位upx
 * @property {Number} font-color = [] 默认：''，默认文字颜色,默认为空，使用主题自动匹配文字色。
 * @property {Number} active-font-size = [] 默认：28，激活后字体大小，单位upx
 * @property {String} align = [center|left|right|split] 默认：center，居中，左，右，均分对齐
 * @property {String|Number} height = [90|100] 默认：90，高度。单位 upx
 * @property {Array} list = [] 默认：[]，数据数组，可以是字符串数组，也可以是对象数组，需要提供rangKey
 * @property {String} range-key = [] 默认：''，数据数组，需要提供rangKey以显示文本。
 * @property {Function} change 返回当前选中的index值同v-model一样的值
 * @property {String} active-key-value = [] 默认：''，当前激活项(和value一样的功能)，如果提供对象数组，则可以提供当前选项list[index][activeKey]的对象数据来自动解析当前选择的index项
 */
export default {
	name: 'tm-tabs',
	model: {
		prop: 'value',
		event: 'input'
	},
	props: {
		// 样式,
		model: {
			type: String,
			default: 'line' //line|rect|fill
		},
		// 主题色包括文字颜色
		color: {
			type: String,
			default: 'primary'
		},
		activeBorderColor: {
			type: String,
			default: ''
		},
		// 背景颜色。
		bgColor: {
			type: String,
			default: 'white'
		},
		// 当前激活的项。
		value: {
			type: Number,
			default: 0
		},
		// 项目对齐方式。
		align: {
			type: String,
			default: 'center' // center|left|right|split
		},
		// 单位为upx
		height: {
			type: String | Number,
			default: 90
		},
		black: {
			type: Boolean | String,
			default: null
		},
		// 投影。
		shadow: {
			type: String | Number,
			default: 3
		},
		list: {
			type: Array,
			default: () => {
				// { title: '标签1', value: '' }, { title: '标签2标签标签', value: '' }, { title: '标签3', value: '' }
				return [];
			}
		},
		rangeKey: {
			type: String,
			default: ''
		},
		// 当前激活项，如果提供对象数组，则可以提供当前选项的对象数据来自动解析当前选择的index项
		activeKeyValue: {
			type: String,
			default: ''
		},
		fontSize: {
			type: Number,
			default: 28
		},
		//默认文字颜色,默认为空，使用主题自动匹配文字色。
		fontColor: {
			type: String,
			default: ''
		},
		activeFontSize: {
			type: Number,
			default: 28
		},
		// 跟随主题色的改变而改变。
		fllowTheme: {
			type: Boolean | String,
			default: true
		}
	},
	watch: {
		activeKeyValue: function() {
			this.setActiveIndex();
		},
		value: async function(val) {
			this.active = val;
			this.acitveItemClick(val,false);
		},
		active: async function(val) {
			this.$emit('input', val);
			this.$emit('update:value', val);
			this.$emit('change', val);
		},
		list: {
			deep: true,
			async handler() {
				await this.inits();
			}
		}
	},
	computed: {
		font_size: function() {
			return uni.upx2px(this.fontSize) + 'px';
		},
		active_font_size: function() {
			return uni.upx2px(this.activeFontSize) + 'px';
		},
		black_tmeme: function() {
			if (this.black !== null) return this.black;
			return this.$tm.vx.state().tmVuetify.black;
		},
		color_tmeme: function() {
			if (this.$tm.vx.state().tmVuetify.color !== null && this.$tm.vx.state().tmVuetify.color && this.fllowTheme) {
				return this.$tm.vx.state().tmVuetify.color;
			}
			return this.color;
		},
		borderColor: function() {
			if (this.$tm.vx.state().tmVuetify.color !== null && this.$tm.vx.state().tmVuetify.color && this.fllowTheme) {
				return this.$tm.vx.state().tmVuetify.color;
			}
			return this.activeBorderColor || this.color;
		},
		barheight: function() {
			let h = parseInt(this.height);
			if (isNaN(h) || !h) h = 90;
			return uni.upx2px(h);
		}
	},
	data() {
		return {
			active: 0,
			old_active: 0,
			guid: '',
			scrollObj: null,
			activePos: {
				left: 0,
				width: 0
			},
			preantObjinfo: null,
			tid: 88855565656,
			isOnecLoad: true,
			toTargetId: ''
		};
	},
	created() {
		this.guid = uni.$tm.guid();
		this.active = this.value;
	},
	mounted() {
		let t= this;
		uni.$tm.sleep(50).then(()=>{
			t.inits();
		})
	},
	methods: {
		inits() {
			let t = this;
			this.setActiveIndex(this.active);
			let pqu = uni.createSelectorQuery().in(t)
			pqu.select('.tm-tabs')
			.boundingClientRect().exec(function (pd) {
				t.preantObjinfo = pd[0];
				
				t.$nextTick(function() {
					t.acitveItemClick(t.active, false);
				});
			})
			
		},
		scrollViesw(e) {
			this.scrollObj = e;
		},
		setLabelLeft(indexObj_now, callback) {
			let t = this;
			let e = this.scrollObj;
			let escroolet = 0;
			if (e) {
				escroolet = e.detail.scrollLeft;
			}
			let pqu = uni.createSelectorQuery().in(t)
			let ychi = this.activeFontSize==this.fontSize?0:160;
			uni.$tm.sleep(ychi).then(fs=>{
				pqu.select(`.tm-tabs-con-item-${indexObj_now}`)
				.boundingClientRect().select(`.tm-tabs-con-item-0`).boundingClientRect().exec(
						function(res) {
							
							let now_Item_obj = res[0];
							let now_Item_one = res[1];
							
							if(now_Item_obj.id==now_Item_one.id){
								
								// now_Item_obj.right = Math.abs(now_Item_one.left)+now_Item_one.right;
								// now_Item_one.right = Math.abs(now_Item_one.left)+now_Item_one.right;
								// now_Item_obj.left=0;
								// now_Item_one.left=0;
							}
							let nowId = t.guid + '_' + t.active;
							let dleft = now_Item_obj.left;
							let preventLeft = t.preantObjinfo.left;
							let acLeft = 0;
							let lftc = 0;
							let ch = (now_Item_obj.width - 24 - uni.upx2px(24) * 2) / 2;
							if (dleft <= 0) {
								dleft = escroolet + now_Item_obj.left;
								if (now_Item_obj.left == 0 && escroolet == 0) {
									lftc = (now_Item_obj.width - 24 - uni.upx2px(24) * 2) / 2 + 12 + 'px';
									
								} else {
									lftc = dleft + ch + 12 + 'px';
									if(now_Item_obj.id==now_Item_one.id){
										let ptch  = (now_Item_obj.width) / 2;
										lftc = ptch-12+'px'
									}
									
								}
							} else {
								acLeft = Math.abs(now_Item_one.left >= 0 ? 0 : now_Item_one.left) + Math.abs(dleft);
							
								lftc = acLeft + uni.upx2px(24) - (now_Item_one.left >= 0 ? t.preantObjinfo.left : 0) + ch + 'px';
							}
							t.activePos = {
								left: lftc,
								// left:nowPage_x + itemObj.width + 'px',
								width: 24 + 'px'
							};
							t.old_active = t.active;
							callback();
						})
			})
			
			
		},
		setActiveIndex() {
			let t = this;
			if (typeof this.list[0] === 'object' && this.rangeKey) {
				let index = this.list.findIndex(item => {
					return item[t.rangeKey] == t.activeKeyValue;
				});

				if (index > -1) {
					this.active = index;
				}
			}
		},
		acitveItemClick(indx, etype, e) {
			let t = this;
			if (etype !== false) {
				this.isOnecLoad = false;
			}

			if (this.list.length <= 0) return;
			if (typeof this.list[indx] == 'undefined') return;
			t.active = indx;
			t.setLabelLeft(indx, function() {
				let nowScrollToid = '';
				let pqu = uni.createSelectorQuery().in(t)
				pqu.select('#' + t.guid + '_' + indx)
				.boundingClientRect().exec(function (pd) {
					let itemObj = pd[0];
					if (itemObj.left <= 0) {
						t.toTargetId = itemObj.id;
					} else if (itemObj.right > t.preantObjinfo.right) {
						t.toTargetId = itemObj.id;
					} else {
						t.toTargetId = null;
					}
				})
				
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.tm-tabs {
	.tm-tabs-con {
		position: relative;
		width: 100%;

		.tm-tabs-con-item-border {
			height: 4px;
			border-radius: 4px;
			position: absolute;
			margin-top: -4px;
			width: 10px;

			&.tm-tabs-con-item-border-trans {
				transition: all 0.15s linear;
			}
		}
		.tm-tabs-wk {
			position: relative;
			left: 0;
			white-space: nowrap;
			width: 100%;
			.tm-tabs-con-item {
				flex-shrink: 0;
				display: inline-block;
				.tm-tabs-con-item-text {
					// transition: all 0.1s;
				}
				&.tm-tabs-con-item-rborder {
					border-right: 0;
				}
			}
		}
	}
}
</style>
