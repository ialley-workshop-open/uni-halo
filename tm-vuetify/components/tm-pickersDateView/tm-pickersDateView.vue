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
			<picker-view-column v-show="syheng_key[key]" v-for="(item, key) in list_cD" :key="key">
				<view
					class="tm-pickersCView-item fulled-height flex-center "
					style="margin: 0 5px;"
					:class="[value_default[key] == index_pub ? ' text-weight-b active' : '', black_tmeme ? 'bk' : '', 'text-size-n']"
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
			totalRow:0,
			syheng_key: {},
			//当前生成的所有数据年~秒
			r_list:[],
			list_cD: null,
			value_default: [],
			nowObj:null,
		};
	},
	created() {
		this.dataCauser = {...this.dataCauser,...(this.showDetail||{})}
		this.setdataCauserArray();
		this._reInits();
		
	},
	mounted() {
		
	},

	watch: {
		showDetail:{
			deep:true,
			handler(){
				this.dataCauser = {...this.dataCauser,...this.showDetail};
				this.setdataCauserArray();
			}
		},
		defaultValue: function(val) {
			let nowdateVal;
			if (val) {
				nowdateVal = new Date(val.replace(/-/g, '/'));
			} else {
				nowdateVal = new Date();
			}
			this.nowObj = nowdateVal;
			if(this.list_cD==null) return;
			this._reInits();
			
		},
		start: async function() {
			if(this.list_cD==null) return;
			this._reInits();
		},
		end: async function() {
			if(this.list_cD==null) return;
			this._reInits();
		}
	},
	computed: {
		black_tmeme: function() {
			if (this.black !== null) return this.black;
			return this.$tm.vx.state().tmVuetify.black;
		},
		modhz: function() {
			let hz = [];
			let moz = { ...this.hoz, ...this.modeValue };
			hz.push(moz.year)
			hz.push(moz.month)
			hz.push(moz.day)
			hz.push(moz.hour)
			hz.push(moz.min)
			hz.push(moz.sec)
			return hz;
		},
		detavlue:function () {
			let d = this.defaultValue;
			if(!d){
				let ys = new Date();
				d = ys.getFullYear()+'-'+(ys.getMonth()+1)+'-'+ys.getDate()+' '+ys.getHours()+':'+ys.getMinutes()+':'+ys.getSeconds()
			}
			
			return d.replace(/-/g, '/');
		},
		//结束的日期，默认为当前
		end_str:function () {
			let d = this.end;
			if(!d){
				let ys = new Date();
				d = ys.getFullYear()+'-'+(ys.getMonth()+1)+'-'+ys.getDate()+' '+ys.getHours()+':'+ys.getMinutes()+':'+ys.getSeconds()
			}
			return d.replace(/-/g, '/');
		},
		//开始默认为1960年
		start_str:function () {
			let d = this.start;
			if(!d){
				d='1960-1-1 00:00:00'
			}
			return d.replace(/-/g, '/');
		},
	},
	methods: {
		//设置显示的行当。
		setdataCauserArray(){
			let t = this;
			let f = {
				'0':this.dataCauser['year'],
				'1':this.dataCauser['month'],
				'2':this.dataCauser['day'],
				'3':this.dataCauser['hour'],
				'4':this.dataCauser['min'],
				'5':this.dataCauser['sec'],
			}
			//显示的列表数。
			let totalHoz = 0;
			let p = Object.keys(this.dataCauser);
			p = p.filter(el=>t.dataCauser[el]==true)
			this.totalRow = p.length;
			this.syheng_key = f;
		},
		//初始生成对应的开始和结束日期数据。
		_reInits(date){
			let t = this;
			let nowdateVal;
			if (date) {
				nowdateVal = new Date(date.replace(/-/g, '/'));
			} else {
				nowdateVal = new Date(this.detavlue);
			}
			this.nowObj = nowdateVal;
			/**
			 * 接下来，需要比对，年月，日。
			 * 分开比较的原因是：如果年不变的话，只是改变月，那么只需重新
			 * 更改日的数据（如果每月的日期一样，也不需要改变。）
			 */
			//根据提供的值nodwdateVal来划定开始和结束的日期数据。为了保证流畅，采用一次性生成的方法。
			//先生成开始的数据。
			//开始
			const start = new Date(this.start_str);
			
			//结束
			const end = new Date(this.end_str);
			//当前
			const now = nowdateVal;
			let list = [];
			let year = this.range(start.getFullYear(),end.getFullYear())
			list.push(year)
			// 月。是需要根据nowdateVal提供的值来生成。因为月是不固定的。
			//默认先生成start到12的
			let month_s = this.range(start.getMonth()+1,12)
			let month_e = this.range(1,end.getMonth()+1)
			//同年同月
			if(start.getFullYear()==end.getFullYear()&&start.getMonth()==end.getMonth()){
				let tn = this.range(start.getMonth()+1,end.getMonth()+1);
				list.push([tn,tn])
			}else{
				list.push([month_s,month_e])
			}
			
			
			let day_s = this.range(start.getDate(),this.monthDay(start.getFullYear(),start.getMonth()))
			let day_e = this.range(1,end.getDate())
			//同年同月同日
			if(start.getFullYear()==end.getFullYear()
			&&start.getMonth()==end.getMonth()
			&&start.getDate()==end.getDate()
			){
				let tn = this.range(start.getDate(),end.getDate());
				list.push([tn,tn])
			}else{
				list.push([day_s,day_e])
			}
			
			let hours_s = this.range(start.getHours(),23)
			let hours_e = this.range(0,end.getHours())
			//同年同月同日同时
			if(start.getFullYear()==end.getFullYear()
			&&start.getMonth()==end.getMonth()
			&&start.getDate()==end.getDate()
			&&start.getHours()==end.getHours()
			){
				let tn = this.range(start.getHours(),end.getHours());
				list.push([tn,tn])
			}else{
				list.push([hours_s,hours_e])
			}
			let minutes_s = this.range(start.getMinutes(),59)
			let minutes_e = this.range(0,end.getMinutes())
			//同年同月同日同时同分
			if(start.getFullYear()==end.getFullYear()
			&&start.getMonth()==end.getMonth()
			&&start.getDate()==end.getDate()
			&&start.getHours()==end.getHours()
			){
				let tn = this.range(start.getMinutes(),end.getMinutes());
				list.push([tn,tn])
			}else{
				list.push([minutes_s,minutes_e])
			}
			let seconds_s = this.range(start.getSeconds(),59)
			let seconds_e = this.range(0,end.getSeconds())
			//同年同月同日同时同分同秒
			if(start.getFullYear()==end.getFullYear()
			&&start.getMonth()==end.getMonth()
			&&start.getDate()==end.getDate()
			&&start.getHours()==end.getHours()
			&&start.getSeconds()==end.getSeconds()
			){
				let tn = this.range(start.getSeconds(),end.getSeconds());
				list.push([tn,tn])
			}else{
				list.push([seconds_s,seconds_e])
			}
			
			this.r_list = list;
			
			this.$nextTick(function () {
				this._getListCd(start,end,now)
			})
			
		},
		//生成对应的列表数据，以供选择。不需要生成所有，只要生成默认当前时间的。
		_getListCd(start,end,now,issetd){
			
			let list_cD = [];
			//年
			list_cD.push(this.r_list[0])
			//月。
			let year_s = new Date(String(start.getFullYear())+'/1/1').getTime()
			let year_e = new Date(String(end.getFullYear())+'/1/1').getTime()
			let year_n = new Date(String(now.getFullYear())+'/1/1').getTime()
			if(
			year_s===year_e //开始和结束相同
			||(year_s!=year_e&&year_n==year_s) //现在=开始。
			||(year_s!=year_e&&year_n<year_s) //现在小于开始
			){
				list_cD.push(this.r_list[1][0])
			}else if(
			(year_s!=year_e&&year_n==year_e) //现在=结束。
			||(year_s!=year_e&&year_n>year_e) //现在大于结束
			){
				list_cD.push(this.r_list[1][1])
			}else{ //在开始和结束之间。
				list_cD.push(this.range(1,12))
			}
			//日。
			let day_s = new Date(start.getFullYear()+'/'+(start.getMonth()+1)+'/1').getTime()
			let day_e = new Date(end.getFullYear()+'/'+(end.getMonth()+1)+'/1').getTime()
			let day_n = new Date(now.getFullYear()+'/'+(now.getMonth()+1)+'/1').getTime()
			
			if(
			day_s===day_e //开始和结束相同
			||(day_s!=day_e&&day_n==day_s) //现在=开始。
			||(day_s!=day_e&&day_n<day_s) //现在小于开始
			){
				list_cD.push(this.r_list[2][0])
			}else if(
			(day_s!=day_e&&day_n==day_e) //现在=结束。
			||(day_s!=day_e&&day_n>day_e) //现在大于结束
			){
				list_cD.push(this.r_list[2][1])
			}else{ //在开始和结束之间。
				list_cD.push(this.range(1,this.monthDay(now.getFullYear(),now.getMonth())))
			}
			//时。
			let hours_s = new Date(String(start.getFullYear())+'/'+(start.getMonth()+1)+'/'+start.getDate()).getTime()
			let hours_e = new Date(String(end.getFullYear())+'/'+(end.getMonth()+1)+'/'+end.getDate()).getTime()
			let hours_n = new Date(String(now.getFullYear())+'/'+(now.getMonth()+1)+'/'+now.getDate()).getTime()
			
			if(
			hours_s===hours_e //开始和结束相同
			||(hours_s!=hours_e&&hours_n==hours_s) //现在=开始。
			||(hours_s!=hours_e&&hours_n<hours_s) //现在小于开始
			){
				list_cD.push(this.r_list[3][0])
			}else if(
			(hours_s!=hours_e&&hours_n==hours_e) //现在=结束。
			||(hours_s!=hours_e&&hours_n>hours_e) //现在大于结束
			){
				list_cD.push(this.r_list[3][1])
			}else{ //在开始和结束之间。
				list_cD.push(this.range(0,23))
			}
			//分。
			let min_s = new Date(String(start.getFullYear())+'/'+(start.getMonth()+1)+'/'+start.getDate()+' '+start.getHours()+':00:00').getTime()
			let min_e = new Date(String(end.getFullYear())+'/'+(end.getMonth()+1)+'/'+end.getDate()+' '+end.getHours()+':00:00').getTime()
			let min_n = new Date(String(now.getFullYear())+'/'+(now.getMonth()+1)+'/'+now.getDate()+' '+now.getHours()+':00:00').getTime()
			if(
			min_s===min_e //开始和结束相同
			||(min_s!=min_e&&min_n==min_s) //现在=开始。
			||(min_s!=min_e&&min_n<min_s) //现在小于开始
			){
				list_cD.push(this.r_list[4][0])
			}else if(
			(min_s!=min_e&&min_n==min_e) //现在=结束。
			||(min_s!=min_e&&min_n>min_e) //现在大于结束
			){
				list_cD.push(this.r_list[4][1])
			}else{ //在开始和结束之间。
				list_cD.push(this.range(0,59))
			}
			//秒。
			let seccode_s = new Date(String(start.getFullYear())+'/'+(start.getMonth()+1)+'/'+start.getDate()+' '+start.getHours()+':'+start.getMinutes()+':00').getTime()
			let seccode_e = new Date(String(end.getFullYear())+'/'+(end.getMonth()+1)+'/'+end.getDate()+' '+end.getHours()+':'+start.getMinutes()+':00').getTime()
			let seccode_n = new Date(String(now.getFullYear())+'/'+(now.getMonth()+1)+'/'+now.getDate()+' '+now.getHours()+':'+start.getMinutes()+':00').getTime()
			if(
			seccode_s===seccode_e //开始和结束相同
			||(seccode_s!=seccode_e&&seccode_n==seccode_s) //现在=开始。
			||(seccode_s!=seccode_e&&seccode_n<seccode_s) //现在小于开始
			){
				list_cD.push(this.r_list[4][0])
			}else if(
			(seccode_s!=seccode_e&&seccode_n==seccode_e) //现在=结束。
			||(seccode_s!=seccode_e&&seccode_n>seccode_e) //现在大于结束
			){
				list_cD.push(this.r_list[4][1])
			}else{ //在开始和结束之间。
				list_cD.push(this.range(0,59))
			}
			this.$nextTick(function () {
				this.list_cD = list_cD;
				if(!issetd){
					this.$nextTick(function () {
						this.setDefaultIndex();
					})
				}
			})
		},
		monthDay(year, month) {
			
			let date = new Date(year, month, 1, 0, 0, 0);
			date.setMonth(date.getMonth()+1)
			
			let yesterDay = new Date(date - 1000);
			return yesterDay.getDate();
		},
		//生成一个数据数组。
		range(from=0,to){
			const range = [];
			if(from===to) return [from];
			for (let i = from; i <= to; i++) {
				range.push(i)
			}
			return range
		},
		//设置当前选中的索引。
		setDefaultIndex(){
			if(!this.list_cD) return;
			let value_default = [];
			let t = this;
			// 年。
			let year = this.list_cD[0].findIndex(el=>el==t.nowObj.getFullYear());
			year=year<=0?0:year;
			let month = this.list_cD[1].findIndex(el=>el==t.nowObj.getMonth()+1);
			month=month<=0?0:month;
			let day = this.list_cD[2].findIndex(el=>el==t.nowObj.getDate());
			day=day<=0?0:day;
			let hours = this.list_cD[3].findIndex(el=>el==t.nowObj.getHours());
			hours=hours<=0?0:hours;
			let minutes = this.list_cD[4].findIndex(el=>el==t.nowObj.getMinutes());
			minutes=minutes<=0?0:minutes;
			let seconds = this.list_cD[5].findIndex(el=>el==t.nowObj.getSeconds());
			seconds=seconds<=0?0:seconds;
			// 开始设置，如果当前默认的日期不在范围内。默认选中的索引日期。
			value_default = [year,month,day,hours,minutes,seconds]
			
			this.$nextTick(function () {
				this.value_default = value_default;
				
			})
			
		},
		
		//回显到初始化值。
		resetVal(setd){
			let val = this.defaultValue;
			if(setd) val = setd;
			let nowdateVal;
			if (val) {
				nowdateVal = new Date(val.replace(/-/g, '/'));
			} else {
				nowdateVal = new Date();
			}
			this.nowObj = nowdateVal;
			if(this.list_cD==null) return;
			this._reInits();
			this.$nextTick(function () {
				this.setDefaultIndex();
			})
		},
		buqi(val) {
			return val > 9 ? '' + val : '0' + val;
		},
		//通过索引获取当前数据
		SeletecdeIndexdefault(value_default) {
			if(!value_default) value_default = this.value_default;
			let t = this;
			let ap = [];
			this.value_default.forEach((item,index) => {
				let f = t.list_cD[index][parseInt(item)];
				f = typeof(f)=="undefined"? t.list_cD[index][ t.list_cD[index].length-1]:f;
				ap.push(f);
			});
			return ap;
		},
		// 获取当前选中的数据。
		getSelectedValue() {
			let t = this;
			let ap = this.SeletecdeIndexdefault();
			
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
		getSelsectDate() {
			let t = this;
			let ap = this.SeletecdeIndexdefault();
			let jg = {
				year: ap[0], //年
				month: ap[1], //月
				day: ap[2], //天
				hour: ap[3], //小时
				min: ap[4], //分
				sec: ap[5] //秒
			};
			return new Date(ap[0]+'/'+ap[1]+'/'+ap[2]+' '+ap[3]+':'+ap[4]+':'+ap[5]);
		},
		change(e) {
			//滑动后，要动态修改数据。
			let val = e.detail.value;
			let index =0;
			// 找出修改的index项。
			
			let nowD = [this.nowObj.getFullYear(),1,1,0,0,0];
			let nowObj = [this.nowObj.getFullYear(),this.nowObj.getMonth()+1,this.nowObj.getDate(),this.nowObj.getHours(),this.nowObj.getMinutes(),this.nowObj.getSeconds()];
			
			for (var i = 0; i < 6; i++) {
				
				if(this.value_default[i]!==val[i]){
					nowD[i] = this.list_cD[i][val[i]]
				}else{
					
					let idx =  this.list_cD[i].findIndex(el=>el==nowObj[i])
					
					if(idx==-1){
						nowD[i] =  this.list_cD[i][0]
					}else{
						nowD[i] = nowObj[i]
					}
					
				}
			}
			
			const now = nowD[0]+'/'+(nowD[1])+'/'+nowD[2]+' '+nowD[3]+':'+nowD[4]+':'+nowD[5];
			
			this._reInits(now)
			
			let nowVal = val.map(el=>{
				let dsdd = el<=0?0:el;
				return dsdd
			})
		
			this.$nextTick(function () {
				this.value_default = nowVal;
				
				// 发送滚动选中的时间数据。
				this.$emit('change',this.getSelectedValue());
			})
		},
		jswid() {
			let wd = this.gridNum - 1 - 2;
			if (wd <= 0) wd = 1;
			return 100 / wd;
		},
		
		
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
