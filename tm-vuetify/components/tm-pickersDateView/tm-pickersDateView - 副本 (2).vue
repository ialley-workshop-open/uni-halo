<!-- 日期组件 -->
<template>
	<view class="tm-pickersDateView flex-start px-24" :class="[black_tmeme ? 'grey-darken-5' : bgColor]">
		<!-- :value="value_default" @change="change" -->
		<picker-view
			@pickstart="$emit('aniStart')"
			@pickend="$emit('aniEnd')"
			@change="change"
			v-if="list_cD != null"
			:value="value_default"
			:mask-style="black_tmeme ? 'opacity:0;' : ''"
			indicator-style="height:50px;"
			indicator-class="tm-pickersCView-item-h"
			class="tm-pickersCView-wk"
		>
			<picker-view-column v-for="(item, key) in list_cD" :key="key">
				<view
					class="tm-pickersCView-item fulled-height flex-center "
					style="margin: 0 5px;"
					:class="[value_default[reIndex(key)] == index_pub ? ' text-weight-b active' : '', black_tmeme ? 'bk' : '', 'text-size-n']"
					v-for="(item_data, index_pub) in item"
					:key="index_pub"
				>
					<text>{{ buqi(item_data) }}</text>
					<text v-if="mode">{{ modhz[key] }}</text>
				</view>
			</picker-view-column>
		</picker-view>
	</view>
</template>

<script>
/**
 * 日期下拉选择器(嵌入式)
 * @description 多级关联，单级关联选择
 * @property {Array} default-value = [] 默认：当前的时间，初始显示的时间
 * @property {String|Number} item-height = [34|42|50|58|62] 项目的高度单位px
 * @property {String|Boolean} black = [true|false] 是否开启暗黑模式。
 * @property {String|Boolean} disabled = [true|false] 是否禁用
 * @property {String} bg-color = [white|blue] 默认：white,白色背景；请填写背景的主题色名称。
 * @property {Object} show-detail = [{year:true,month:true,day:true,hour:false,min:false,sec:false}] 默认：{year:true,month:true,day:true,hour:false,min:false,sec:false}
 * @property {String} start = [1900-1-1 00:00:00] 默认：1900-1-1 00:00:00，开始的时间
 * @property {String} end = [] 默认：当前，结束的时间
 * @property {String|Boolean} mode = [true|false] 默认：true，是否显示中文年，月后缀
 * @property {String|Boolean} full-number = [true|false] 默认：true，是否把个位数补齐双位数
 */
export default {
	name: 'tm-pickersDateView',
	props: {
		// 行高。
		itemHeight: {
			type: String | Number,
			default: 40
		},
		black: {
			type: String | Boolean,
			default: null
		},
		// 是否禁用
		disabled: {
			type: String | Boolean,
			default: false
		},
		// 背景颜色，主题色名称。
		bgColor: {
			type: String,
			default: 'white'
		},
		//要展示的时间。
		showDetail: {
			type: Object,
			default: () => {
				return {
					year: true, //年
					month: true, //月
					day: true, //天
					hour: false, //小时
					min: false, //分
					sec: false //秒
				};
			}
		},
		start: {
			type: String,
			default: '1949-1-1 00:00:00'
		},
		end: {
			type: String,
			default: ''
		},
		defaultValue: '',
		// 是否显示中文年，月后缀
		mode: {
			type: String | Boolean,
			default: true
		},
		//要展示的时间。
		modeValue: {
			type: Object,
			default: () => {
				return {
					year: '年', //年
					month: '月', //月
					day: '日', //天
					hour: '时', //小时
					min: '分', //分
					sec: '秒' //秒
				};
			}
		},
		// 是否把个位数补齐双位数
		fullNumber: {
			type: String | Boolean,
			default: true
		}
	},
	data() {
		return {
			scrollEvent: 0,
			childrenIndex: 0,
			scrollChildrenIndex: 0,
			listIndex: [],
			listData: [[], [], [], [], [], []],
			dataCauser: {
				year: false, //年
				month: false, //月
				day: false, //天
				hour: false, //小时
				min: false, //分
				sec: false //秒
			},
			hoz: {
				year: '年', //年
				month: '月', //月
				day: '日', //天
				hour: '时', //小时
				min: '分', //分
				sec: '秒' //秒
			},
			startTime: null,
			endTime: null,
			value_default: [],
			pre_value: [],

			syheng_key: [],
			list_cD: null
		};
	},
	created() {
		this.dataCauser = { ...this.dataCauser, ...this.showDetail };
		let ls = Object.keys(this.dataCauser);
		for (let i = 0; i < this.listData.length; i++) {
			let p = {
				itemIndex: 0,
				childrenIndex: 0,
				wz: 0
			};
			p[ls[i]] = this.dataCauser[ls[i]];
			this.listIndex.push(p);
		}
	},
	async mounted() {
		this.chulisdata();
		await uni.$tm.sleep(60);
		this.chulishijian();
		this.setDefaultValue();
	},

	watch: {
		defaultValue: async function() {
			if (this.list_cD == null) return;
			await this.setDefaultValue();
		},
		start: async function() {
			if (this.list_cD == null) return;
			this.chulisdata();
			this.chulishijian();
			await this.setDefaultValue();
		},
		end: async function() {
			if (this.list_cD == null) return;
			
			await this.setDefaultValue();
			
		}
	},
	computed: {
		black_tmeme: function() {
			if (this.black !== null) return this.black;
			return this.$tm.vx.state().tmVuetify.black;
		},
		modhz: function() {
			return { ...this.hoz, ...this.modeValue };
		}
	},
	methods: {
		reIndex(key) {
			let id = 0;
			for (let i = 0; i < this.syheng_key.length; i++) {
				if (this.syheng_key[i] == key) {
					id = i;
					break;
				}
			}
			
			return id;
		},
		chulishijian() {
			let kl = Object.keys(this.dataCauser);
			let d = {};
			let pk = [];
			for (let i = 0; i < kl.length; i++) {
				if (this.dataCauser[kl[i]] == true) {
					let sj = null;
					let key = '';
					if (kl[i] == 'year') {
						sj = this.listData[0];
						key = 'year';
					} else if (kl[i] == 'month') {
						sj = this.listData[1];
						key = 'month';
					} else if (kl[i] == 'day') {
						sj = this.listData[2];
						key = 'day';
					} else if (kl[i] == 'hour') {
						sj = this.listData[3];
						key = 'hour';
					} else if (kl[i] == 'min') {
						sj = this.listData[4];
						key = 'min';
					} else if (kl[i] == 'sec') {
						sj = this.listData[5];
						key = 'sec';
					}

					d[kl[i]] = {...sj};
					pk.push(key);
				}
			}
			this.list_cD = {...d};
			this.syheng_key = [...pk];
		},
		buqi(val) {
			return val > 9 ? '' + val : '0' + val;
		},
		SeletecdeIndexdefault() {
			let kl = Object.keys(this.dataCauser);
			let d = [];
			for (let i = 0; i < this.listIndex.length; i++) {
				if (this.listIndex[i][kl[i]] == true) {
					d.push(this.listIndex[i].itemIndex);
				}
			}
			this.value_default = d;
		},
		// 获取当前选中的数据。
		getSelectedValue() {
			let t = this;
			let ap = [];
			this.listIndex.forEach((item, index) => {
				ap.push(t.listData[index][item.itemIndex]);
			});
			let jg = {
				year: ap[0], //年
				month: ap[1], //月
				day: ap[2], //天
				hour: ap[3], //小时
				min: ap[4], //分
				sec: ap[5] //秒
			};
			let ar = Object.keys(this.dataCauser);

			ar.forEach(item => {
				if (t.dataCauser[item] === false) {
					delete jg[item];
				}
			});
			return jg;
		},
		chulisdata() {
			if (typeof this.showDetail === 'object') {
				this.dataCauser = { ...this.dataCauser, ...this.showDetail };
			}
			this.startTime = new Date(this.start.replace(/-/g, '/'));
			if (isNaN(this.startTime.getFullYear())) {
				this.startTime = new Date('1949/1/1 00:00:00');
			}
			this.endTime = new Date(this.end.replace(/-/g, '/'));

			if (isNaN(this.endTime.getFullYear())) {
				this.endTime = new Date();
			}

			let s_y = this.startTime.getFullYear();
			let s_m = this.startTime.getMonth() + 1;
			let s_d = this.startTime.getDate();
			let s_h = this.startTime.getHours();
			let s_mm = this.startTime.getMinutes();
			let s_s = this.startTime.getSeconds();

			let e_y = this.endTime.getFullYear();
			let e_m = this.endTime.getMonth() + 1;
			let e_d = this.endTime.getDate();
			let e_h = this.endTime.getHours();
			let e_mm = this.endTime.getMinutes();
			let e_s = this.endTime.getSeconds();

			let n_y = this.listData[0][this.listIndex[0].itemIndex];
			n_y = n_y == undefined ? 1949 : n_y;
			let n_m = this.listData[1][this.listIndex[1].itemIndex];
			n_m = n_m == undefined ? 1 : n_m;
			let n_d = this.listData[2][this.listIndex[2].itemIndex];
			n_d = n_d == undefined ? 1 : n_d;
			let n_h = this.listData[3][this.listIndex[3].itemIndex];
			n_h = n_h == undefined ? 0 : n_h;
			let n_mm = this.listData[4][this.listIndex[4].itemIndex];
			n_mm = n_mm == undefined ? 0 : n_mm;
			let n_s = this.listData[5][this.listIndex[5].itemIndex];
			n_s = n_s == undefined ? 0 : n_s;
			let nowDate = new Date(n_y + '/' + n_m + '/' + n_d + ' ' + n_h + ':' + n_mm + ':' + n_s);

			function monthDay(year, month) {
				let date = new Date(year, month, 1, 0, 0, 0);
				let yesterDay = new Date(date - 1000);
				return yesterDay.getDate();
			}

			//年，开始，结束。
			let tsb = [[s_y, e_y]];
			for (let i = 1; i < 6; i++) {
				let st = 0;
				let et = 0;
				if (i == 1) {
					st = 1;
					et = 12;
					if (n_y === s_y) {
						st = s_m;
						et = 12;
					}
					if (n_y === e_y) {
						st = 1;
						et = e_m;
					}
					if(s_y===e_y&&n_y===s_y){
						st = s_m;
						et = e_m;
					}
				}
				if (i == 2) {
					let months = [31, monthDay(n_y, 2), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
					st = 1;
					et = months[n_m - 1];
					if (n_y === s_y && n_m === s_m) {
						st = s_d;
					}
					if (n_y === e_y && n_m === e_m) {
						et = e_d;
					}
				}
				if (i == 3) {
					st = 0;
					et = 23;
					if (n_y === s_y && n_m === s_m && n_d === s_d) {
						st = s_h;
					}
					if (n_y === e_y && n_m === e_m && n_d === e_d) {
						et = e_h;
					}
				}
				if (i == 4) {
					st = 0;
					et = 59;
					if (n_y === s_y && n_m === s_m && n_d === s_d && n_h === s_h) {
						st = s_mm;
					}
					if (n_y === e_y && n_m === e_m && n_d === e_d && n_h === e_h) {
						et = e_mm;
					}
				}
				if (i == 5) {
					st = 0;
					et = 59;
					if (n_y === s_y && n_m === s_m && n_d === s_d && n_h === s_h && n_mm === s_mm) {
						st = s_s;
					}
					if (n_y === e_y && n_m === e_m && n_d === e_d && n_h === e_h && n_mm === e_mm) {
						et = e_s;
					}
				}
				tsb.push([st, et]);
			}
			
			for (let ik = 0; ik < tsb.length; ik++) {
				let idate = tsb[ik];
				let py_data = [];

				for (let i = idate[0]; i <= idate[1]; i++) {
					py_data.push(i);
				}
				this.listData.splice(ik, 1, py_data);
			}


			return this.listData;
		},
		setDefaultValue(date) {
			this.chulisdata();
			this.chulishijian();
			uni.$tm.sleep(50)
			.then(()=>this.inits(date))
			.then(()=>{
				this.chulisdata();
				this.chulishijian();
				return  uni.$tm.sleep(50);
			}).then(()=>{
				this.SeletecdeIndexdefault();
				this.chulisdata();
			})
	
		},
		async inits(date) {
			let t = this;
			let mobj;
			if (date) {
				mobj = new Date(date.replace(/-/g, '/'));
			} else {
				try {
					mobj = new Date(this.defaultValue.replace(/-/g, '/'));
				} catch (e) {
					mobj = new Date();
				}
				if (!this.defaultValue || isNaN(mobj.getFullYear())) {
					mobj = new Date();
				}
			}
			
			let s_y = this.startTime.getFullYear();
			let s_m = this.startTime.getMonth() + 1;
			let s_d = this.startTime.getDate();
			let s_h = this.startTime.getHours();
			let s_mm = this.startTime.getMinutes();
			let s_s = this.startTime.getSeconds();

			let e_y = this.endTime.getFullYear();
			let e_m = this.endTime.getMonth() + 1;
			let e_d = this.endTime.getDate();
			let e_h = this.endTime.getHours();
			let e_mm = this.endTime.getMinutes();
			let e_s = this.endTime.getSeconds();

			let n_y = mobj.getFullYear();
			let n_m = mobj.getMonth() + 1;
			let n_d = mobj.getDate();
			let n_h = mobj.getHours();
			let n_mm = mobj.getMinutes();
			let n_s = mobj.getSeconds();

			if (mobj.getTime() >= this.endTime.getTime()) {
				n_y = e_y;
				n_m = e_m;
				n_d = e_d;
				n_h = e_h;
				n_mm = e_mm;
				n_s = e_s;
			}
			if (mobj.getTime() <= this.startTime.getTime()) {
				n_y = s_y;
				n_m = s_m;
				n_d = s_d;
				n_h = s_h;
				n_mm = s_mm;
				n_s = s_s;
			}

			let tsb = [n_y, n_m, n_d, n_h, n_mm, n_s];
			for (let ik = 0; ik < tsb.length; ik++) {
				
				let itemIndex_y = this.listData[ik].findIndex(item => item == tsb[ik]);
			
				if (itemIndex_y > -1) {
					this.$set(this.listIndex[ik], 'itemIndex', itemIndex_y);
				} else {
					this.$set(this.listIndex[ik], 'itemIndex', 0);
				}
			}
			
		},

		change(e, index) {
			console.log(this.list_cD);
			let pl = e.detail.value;
			this.pre_value = [...this.value_default];
			if (this.disabled) {
				this.value_default = this.pre_value;
				return;
			}
			
			for (let i = 0; i < this.syheng_key.length; i++) {
				for (let j = 0; j < this.listIndex.length; j++) {
					if (this.listIndex[j][this.syheng_key[i]] == true) {
						this.$set(this.listIndex[j], 'itemIndex', pl[i]);
					}
				}
			}

			this.chulisdata();
			this.chulishijian();
			
			this.value_default = pl;
			
		},
		jswid() {
			let wd = this.gridNum - 1 - 2;
			if (wd <= 0) wd = 1;
			return 100 / wd;
		},
		scrllEnd(e) {
			function monthDay(year, month) {
				var date = new Date(year, month, 1, 0, 0, 0);
				var yesterDay = new Date(date - 1000);
				return yesterDay.getDate();
			}
			if (!this.scrollEvent) return;
			let dNum = this.gridNum;
			let d;
			let t = this;
			let idb = 88;
			let idc = 884;
			let srcllTop = this.scrollEvent.detail.scrollTop;

			if (srcllTop <= 0) {
				srcllTop = 0;
			} else if (srcllTop >= this.scrollEvent.detail.srcollHeigh) {
				srcllTop = this.scrollEvent.detail.srcollHeigh;
			}

			d = Math.ceil((srcllTop - this.itemHeight / 2) / this.itemHeight);

			if (d >= t.listData[t.childrenIndex].length - 1) {
				d = t.listData[t.childrenIndex].length - 1;
			}

			t.$set(t.listIndex[t.childrenIndex], 'wz', srcllTop);
			let old_index = this.listIndex[this.childrenIndex].itemIndex || 0;
			if (t.disabled) {
				clearTimeout(idb);
				idb = setTimeout(function() {
					t.$nextTick(function() {
						t.$set(t.listIndex[t.childrenIndex], 'wz', old_index * t.itemHeight);
					});
				}, 5);
				return;
			}

			this.$set(this.listIndex[t.childrenIndex], 'itemIndex', d);
			t.chulisdata();

			clearTimeout(idb);
			idb = setTimeout(function() {
				t.$nextTick(function() {
					t.$set(t.listIndex[t.childrenIndex], 'wz', d * t.itemHeight);

					for (let lsindex = t.childrenIndex + 1; lsindex < 6; lsindex++) {
						if (t.listData[lsindex][t.listIndex[lsindex].itemIndex] == undefined) {
							let pda = t.listData[lsindex].length - 1;

							if (d >= pda) {
								this.$set(this.listIndex[lsindex], 'itemIndex', pda);
								t.$set(t.listIndex[lsindex], 'wz', pda * t.itemHeight);
							} else {
								this.$set(this.listIndex[lsindex], 'itemIndex', 0);
								t.$set(t.listIndex[lsindex], 'wz', 0);
							}
						} else {
							let srcllTop_s = t.listIndex[lsindex].wz;
							const tsdd = t.listIndex[lsindex].itemIndex;

							t.$set(t.listIndex[lsindex], 'wz', tsdd * t.itemHeight - 1);
							this.$nextTick(function() {
								t.$set(t.listIndex[lsindex], 'wz', tsdd * t.itemHeight);
							});
						}
					}
				});
			}, 10);
		}
	}
};
</script>

<style>
.tm-pickersDateView .tm-pickersCView-item-h {
	height: 50px;
	background-color: rgba(0, 0, 0, 0.03);
	width: calc(100% - 10px);
	margin-left: 5px;
	border-radius: 20rpx;
	border: none;
}
.tm-pickersDateView .tm-pickersCView-item-h::after,
.tm-pickersDateView .tm-pickersCView-item-h::before {
	border: none;
}
.tm-pickersDateView .tm-pickersCView-wk {
	position: relative;
	width: 750rpx;
	height: 500rpx;
}
.tm-pickersDateView .tm-pickersCView-wk .tm-pickersCView-item.bk {
	opacity: 0.4;
}
.tm-pickersDateView .tm-pickersCView-wk .tm-pickersCView-item.active {
	opacity: 1;
	border-radius: 20rpx;
	border: none;
	background-color: rgba(0, 0, 0, 0.06);
}
.tm-pickersDateView .tm-pickersCView-wk .tm-pickersCView-item.active.bk {
	background-color: rgba(255, 255, 255, 0.06);
}
</style>
