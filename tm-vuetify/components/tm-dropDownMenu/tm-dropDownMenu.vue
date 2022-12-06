<template>
	<view class="relative">
		<view class="tm-dropDownMenu absolute fulled" :style="{zIndex:101}">
			<view
				class="tm-dropDownMenu-bar"
				:class="[
					!black_tmeme && bgColor != 'white' ? bgColor : black_tmeme && bgColor == 'white' ? 'grey-darken-4' : bgColor,
					black_tmeme ? '' : 'shadow-' + bgColor + '-' + shadow,
					black_tmeme ? 'bk' : ''
				]"
			>
				<tm-row align="center" justify="center">
					<tm-col color="none" justify="center" align="middle" @click="changeIndex(index)" v-for="(item, index) in formartData" :key="index" :width="itemLength + '%'">
						<view class="flex-center" :style="{height: height+'rpx',lineHeight:height+'rpx'}">
							<text class=" pr-10" :style="{fontSize:fontSize+'rpx'}" :class="[activeIndex == index ? 'text-' + activeColor : 'text-' + unColor]">{{ item.title }}</text>
							<tm-icons
								style="line-height: 0;"
								dense
								:color="activeIndex == index ? activeColor : unColor"
								size="24"
								:name="activeIndex == index ? 'icon-sort-up' : 'icon-sort-down'"
							></tm-icons>
						</view>
					</tm-col>
				</tm-row>
			</view>

			<view v-if="formartData[activeIndex]" class="tm-dropDownMenu-body py-24 " :class="[black_tmeme ? 'grey-darken-5 bk' : 'white', 'shadow-' + shadow]">
				<view v-if="formartData[activeIndex]['children']" :style="{maxHeight:maxHeight+'rpx',overflowY: 'auto'}">
					<block v-for="(item, index) in formartData[activeIndex].children" :key="index">
						<block v-if="item['children']&&rendIdx>=index" >
							<view class="pa-24 text-size-s text-weight-b optAniopt" v-if="item['title']">{{ item.title }}</view>
							<view class="optAniopt">
								<block v-if="item.model == 'checkbox'">
									<tm-groupcheckbox>
										<block v-for="(item2, index2) in item.children" :key="index2">
											<tm-checkbox :disabled="item2['disabled'] || item['disabled'] ? true : false" dense v-model="item2.checked">
												<view class="px-10" :class="[item2['disabled'] || item['disabled'] ? 'opacity-6' : '']">
													<tm-button 
														:fllowTheme="false"
														:black="black_tmeme"
														:theme="item2.checked ? color: (black_tmeme?'grey-darken-3':'grey-lighten-2')"
														:font-color="item2.checked ? color : 'grey'"
														dense
														style="width: auto"
														font-size="24"
														height="70"
														item-class="mx-14 my-10"
														plan
														block
														icon="icon-check-circle"
														:shadow="2"
														:height="64"
														:round="2"
													>
														{{ item2.title }}
													</tm-button>
												</view>
											</tm-checkbox>
										</block>
									</tm-groupcheckbox>
								</block>
								<block v-if="item.model == 'radio'">
									<tm-groupradio>
										<block v-for="(item2, index2) in item.children" :key="index2">
											<tm-radio :disabled="item2['disabled'] || item['disabled'] ? true : false" dense v-model="item2.checked">
												<view class="px-10" :class="[item2['disabled'] || item['disabled'] ? 'opacity-6' : '']">
													<tm-button
														:fllowTheme="false"
														:black="black_tmeme"
														:theme="item2.checked ? color: (black_tmeme?'grey-darken-3':'grey-lighten-2')"
														:font-color="item2.checked ? color : 'grey'"
														dense
														style="width: auto"
														font-size="24"
														height="70"
														item-class="mx-14 my-10"
														plan
														block
														icon="icon-check-circle"
														:shadow="2"
														:height="64"
														:round="2"
													>
														{{ item2.title }}
													</tm-button>
												</view>
											</tm-radio>
										</block>
									</tm-groupradio>
								</block>
								<block v-if="item.model == 'list'">
									<tm-groupradio key="test">
										<block v-for="(item2, index2) in item.children" :key="index2">
											<tm-radio :inline="false" :disabled="item2['disabled'] || item['disabled'] ? true : false" dense v-model="item2.checked">
												<view class="fulled">
													
													<tm-listitem
														:disabled="item2['disabled'] || item['disabled'] ? true : false" 
														:title-color="item2.checked ? color : 'grey-darken-3'"
														:rightIconColor="item2.checked ? color : 'grey-lighten-3'"
														:margin="[24, 12]"
														:title="item2.title"
														fontSize="28"
														:shadow="0"
														:borderBottom="true"
														:rightIconSize='30'
														:rightIcon="item2.checked ? 'icon-check-circle' : ''"
													></tm-listitem>
												</view>
											</tm-radio>
										</block>
									</tm-groupradio>
								</block>
								
								<block v-if="item.model == 'listCheckbox'">
									<tm-groupcheckbox >
										<block v-for="(item2, index2) in item.children" :key="index2">
											<tm-checkbox :inline="false" :disabled="item2['disabled'] || item['disabled'] ? true : false" dense v-model="item2.checked">
												<view class="fulled">
													
													<tm-listitem
														:disabled="item2['disabled'] || item['disabled'] ? true : false" 
														:title-color="item2.checked ? color : 'grey-darken-3'"
														:rightIconColor="item2.checked ? color : 'grey-lighten-3'"
														:margin="[24, 12]"
														:title="item2.title"
														fontSize="28"
														:shadow="0"
														:borderBottom="true"
														:rightIconSize='30'
														:rightIcon="item2.checked ? 'icon-check-circle' : ''"
													></tm-listitem>
												</view>
											</tm-checkbox>
										</block>
									</tm-groupcheckbox>
								</block>
								
								
							</view>
						</block>
						<block v-else>
							<block v-if="item.model == 'input'&&rendIdx>=index" >
								<view class="pa-24 text-size-s text-weight-b optAniopt" v-if="item['title']">{{ item.title }}</view>
								<tm-input
									:fllowTheme="fllowTheme"
									border-color="grey-lighten-1"
									:disabled="chiludis(item)"
									:black="black_tmeme"
									:color="color"
									:border-bottom="false"
									:input-type="item.type || 'text'"
									:value.sync="item.value"
								></tm-input>
							</block>
							<block v-if="item.model == 'slider'&&rendIdx>=index" >
								<view class="pa-24 text-size-s text-weight-b optAniopt" v-if="item['title']">
									{{ item.title }}
									<text class="px-24 " :class="[`text-${color}`]">
										{{ item.value ? item.value : '未设置' }}{{ item.value ? (item['suffix'] ? item.suffix : '') : '' }}
									</text>
								</view>
								<view class="px-42 py-24 optAniopt">
									<tm-slider
										:fllowTheme="fllowTheme"
										:disabled="chiludis(item)"
										:black="black_tmeme"
										:color="color"
										:max="item.max ? item.max : 100"
										v-model="item.value"
									>
										<template v-slot:tips>
											{{ item.value }}
										</template>
									</tm-slider>
								</view>
							</block>
							<block v-if="item.model == 'pickers'&&rendIdx>=index" >
								<view class="pa-24 text-size-s text-weight-b optAniopt" v-if="item['title']">
									{{ item.title }}
								</view>
								<view class="optAniopt">
									<tm-pickers
										:default-value.sync="item.value"
										rang-key="title"
										:btn-color="color"
										:list="item.data"
									>
										<tm-input :value="pickTostring(item.value)" prefixp-icon="icon-calendaralt-fill" disabled :placeholder="item['placeholder']?item['placeholder']:'请选择'" suffix-icon="icon-sort-down"></tm-input>
									</tm-pickers>
								</view>
							</block>
						</block>
					</block>
				</view>

				<view class="flex-between px-32 pt-32">
					<tm-button :fllowTheme="fllowTheme" @click="getData" :theme="color" block style="width: 48%;" height="80">确认</tm-button>
					<tm-button
						:fllowTheme="fllowTheme"
						@click="resetinit"
						:black="black_tmeme"
						block
						:theme="color"
						:font-color="color"
						text
						shadow="0"
						style="width: 48%;"
						height="80"
					>
						重置
					</tm-button>
				</view>
			</view>
		</view>
		<view @click="activeIndex=-1" v-if="activeIndex>-1" class="fixed fulled" :style="{height:height_bg+'px',top:vtop+'px',width:barwidth,background:'rgba(0,0,0,0.33)',zIndex:100}">
			
		</view>
	</view>
</template>

<script>
/**
 * 下拉选项
 * @property {String} color = [] 默认：primary ，主题色下方选项子组件的主题色。
 * @property {String} un-color = [] 默认：black ，默认未激活时。bar条上的文字颜色
 * @property {String} active-color = [] 默认：primary ，默认激活时。bar条上的文字颜色
 * @property {String} bg-color = [] 默认：white ，导航条背景主题色。
 * @property {Number} shadow = [] 默认：10 ，导航条的投影。
 * @property {Array} list = [] 默认：[] ，数据格式见文档
 * @property {Number} maxHeight = [] 默认：650 ，弹出的标签页，最大内容高度，超过自动滚动。
 * @property {Number} height = [] 默认：88 ，标签导航的高度
 * @property {Number} font-size = [] 默认：28 ，标签导航的文字大小
 * @property {Array} default-selected = [] 默认：[] ，默认赋值选中的选项，注意可以是id数组或者对象数组，对象数组情况下必须含id标签符，且是唯一的。
 * @property {Boolean} black = [] 默认：false ，暗黑模式。
 * @property {Function} change 切换选项页面时触发。
 * @property {Function} confirm 点击确认按钮时触发，返回所有选中的项。
 * @example <tm-dropDownMenu  color="orange" :list="list"></tm-dropDownMenu>
 */
import tmRow from '@/tm-vuetify/components/tm-row/tm-row.vue';
import tmCol from '@/tm-vuetify/components/tm-col/tm-col.vue';
import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
import tmIcons from '@/tm-vuetify/components/tm-icons/tm-icons.vue';
import tmInput from '@/tm-vuetify/components/tm-input/tm-input.vue';
import tmGroupcheckbox from '@/tm-vuetify/components/tm-groupcheckbox/tm-groupcheckbox.vue';
import tmCheckbox from '@/tm-vuetify/components/tm-checkbox/tm-checkbox.vue';

import tmGroupradio from '@/tm-vuetify/components/tm-groupradio/tm-groupradio.vue';
import tmRadio from '@/tm-vuetify/components/tm-radio/tm-radio.vue';
import tmSlider from '@/tm-vuetify/components/tm-slider/tm-slider.vue';
import tmListitem from '@/tm-vuetify/components/tm-listitem/tm-listitem.vue';
import tmPickers from '@/tm-vuetify/components/tm-pickers/tm-pickers.vue';

export default {
	components: {tmPickers, tmRow, tmCol, tmButton, tmIcons, tmInput, tmGroupcheckbox, tmCheckbox, tmGroupradio, tmRadio, tmSlider, tmListitem },
	name: 'tm-dropDownMenu',
	props: {
		// 主题色下方选项子组件的主题色
		color: {
			type: String,
			default: 'primary'
		},
		// 默认未激活时。bar条上的文字颜色
		unColor: {
			type: String,
			default: 'black'
		},
		// 默认激活时。bar条上的文字颜色
		activeColor: {
			type: String,
			default: 'primary'
		},
		// 背景颜色。
		bgColor: {
			type: String,
			default: 'white'
		},
		list: {
			type: Array,
			default: () => {
				return [];
			}
		},
		maxHeight:{
			type:Number|String,
			default:650
		},
		height:{
			type:Number|String,
			default:88
		},
		fontSize:{
			type:Number|String,
			default:28
		},
		//菜单的投影。
		shadow: {
			type: Number | String,
			default: 10
		},
		// 可以是id索引也可以是对象数组,可以混着来。
		defaultSelected: {
			type: Array,
			default: () => {
				return [];
			}
		},
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
		itemLength: function() {
			if (this.list.length == 0) return 100;
			return 100 / this.list.length;
		},
		black_tmeme: function() {
			if (this.black !== null) return this.black;
			return this.$tm.vx.state().tmVuetify.black;
		}
	},
	watch:{
		list:{
			deep:true,
			handler(){
				this.$nextTick(function() {
					this.formartData = this.chulidata();
				});
			}
		}
	},
	data() {
		return {
			activeIndex: -1,
			formartData: [],
			oldList: [],
			test: [],
			height_bg:0,
			vtop:0,
			maxLeng:40,//最大渲染级别
			rendIdx:0,
			barwidth:'100%'
		};
	},
	created() {
		this.height_bg = uni.getSystemInfoSync().screenHeight;
	},
	mounted() {
		this.$nextTick(function() {
			this.formartData = this.chulidata();
			this.oldList = [...this.list]
			let t = this;
			uni.$tm.sleep(40).then(e=>{
				uni.createSelectorQuery().in(this).select('.tm-dropDownMenu').boundingClientRect().exec(function(v){
					// #ifdef H5
					t.vtop = v[0].top+v[0].height+uni.getSystemInfoSync().windowTop;
					// #endif
					// #ifndef H5
					t.vtop = v[0].top+v[0].height;
					console.log(v[0]);
					// #endif
					t.barwidth = v[0].width+'px'
					
				})
			})
		});
	},
	methods: {
		pickTostring(item){
			let p = [];
			item.forEach(el=>{
				if(typeof(el)=="string"){
					p.push(el)
				}else if(typeof el == 'object'){
					p.push(el.title);
				}
			})
			return p.join("-")
		},
		chiludis(item) {
			return item?.disabled || false;
		},
		chulidata(list) {
			// 处理相关数据格式以保持 一致。
			let t = this;
			let p = this.$tm.deepClone(list||this.list);
			for (let j = 0; j < p.length; j++) {
				p[j]['dot'] = 0;
				if (p[j]['children']) {
					let ic = p[j].children;
					if (ic.length > 0) {
						for (let k = 0; k < ic.length; k++) {
							let children = ic[k]['children'];
							if (children) {
								if (ic[k]['model'] == 'checkbox'|| ic[k]['model'] == 'listCheckbox'  || ic[k]['model'] == 'list'  || (ic[k]['model'] == 'radio' && children.length > 0)) {
									for (let z = 0; z < children.length; z++) {
										let im = children[z];
										if (!im.hasOwnProperty('checked')) {
											im['checked'] = false;
										}
										for (let i = 0; i < t.defaultSelected.length; i++) {
											let lsitem = t.defaultSelected[i];
											if (typeof lsitem === 'object') {
												if (lsitem['id'] == im['id']) {
													im['checked'] = true;
												}
											} else {
												if (lsitem == im['id']) {
													im['checked'] = true;
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}

			return p;
		},
		// 重置只重置当前打开的页面数量，并不重置其它页面数据。
		resetinit(index) {
			let pd = this.formartData[this.activeIndex];
			if (pd['children']) {
				let ic = pd.children;
				if (ic.length > 0) {
					for (let k = 0; k < ic.length; k++) {
						let children = ic[k]['children'];
						if (children) {
							if (ic[k]['model'] == 'checkbox'||ic[k]['model'] == 'listCheckbox'||ic[k]['model'] == 'list' || (ic[k]['model'] == 'radio' && children.length > 0)) {
								for (let z = 0; z < children.length; z++) {
									let im = children[z];
									im['checked'] = false;
								}
							}
						} else {
							if (ic[k]['model'] == 'slider') {
								ic[k].value = 0;
							} else if (ic[k]['model'] == 'input') {
								ic[k].value = '';
							} else if (ic[k]['model'] == 'pickers') {
								ic[k].value = [];
							} else if (ic[k]['model'] == 'pickersDate') {
								ic[k].value = "";
							}
						}
					}
				}
			}
			const p = this.chulidata(this.oldList);
			this.formartData.splice(this.activeIndex, 1, p[this.activeIndex]);
		},
		changeIndex(index) {
			let t = this;
			let itmod = 659;
			clearInterval(itmod)
			if (this.activeIndex === index) {
				this.activeIndex = -1;	
				
			} else {
				this.activeIndex = index;
				
			}
			this.$emit('change', this.activeIndex);
			
			this.rendIdx = 0;
			clearInterval(itmod)
			itmod = setInterval(function(){
				t.rendIdx+=1;
				
				if(t.rendIdx>t.maxLeng||t.activeIndex==-1){
					clearInterval(itmod)
				}
			},10)
		},
		// 获取选中以及填写的数据。
		getData() {
			let p = [...this.formartData];
			let xz = [];
			for (let i = 0; i < p.length; i++) {
				if (p[i]['children']) {
					for (let j = 0; j < p[i].children.length; j++) {
						let ic = p[i].children[j];
						let ps = [];
						if (ic.model == 'checkbox' || ic.model == 'radio' || ic.model == 'listCheckbox'  || ic.model == 'list') {
							if (ic['children']) {
								for (let k = 0; k < ic.children.length; k++) {
									if (ic.children[k].checked === true) {
										ps.push(ic.children[k]);
									}
								}
							}
						} else if (ic.model == 'input' || ic.model == 'slider') {
							ps.push(ic);
						} else if(ic.model == 'pickers'){
							ps.push(ic);
						}

						let pyz = { ...ic };
						delete pyz.children;
						xz.push({
							...pyz,
							children: ps
						});
					}
				}
			}

			this.$emit('confirm', xz);
			this.activeIndex = -1;
		}
	}
};
</script>

<style lang="scss" scoped>
.tm-dropDownMenu {
	position: relative;
	.tm-dropDownMenu-bar {
		position: relative;
		z-index: 303;
	}
	.tm-dropDownMenu-body {
		background-color: rgba(0, 0, 0, 0.35);
		min-height: 150upx;
		position: absolute;
		z-index: 304;
		width: 100%;
	}
}
.optAniopt{
	animation: opt 0.2s linear;
}
@keyframes opt{
	0%{opacity: 0;}
	100%{opacity: 1;}
}
</style>
