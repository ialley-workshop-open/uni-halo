/**
 * 日历库
 * 作者：tmzdy
 * 时间：2021-7-27
 * 联系：zhongjihan@sina.com
 */
class calendar{
	value= new Date();
	now_day_month = new Date();
	start_time = new Date(1900,0,1)
	end_time = new Date(2100,11,31)
	txtdateArray = [];
	/**
	 * value:初始化时间
	 * start:开始始间 ，提供了后，会在返回的日历上标记每个日期是否是在start 和 end之间。
	 * end:结束时间 
	 */
	constructor({value,start,end}) {
		if(arguments.length===1){
			let arg = arguments[0]
			
			if(arg?.value){
				value = value.replace(/-/g,'/');
				let dobj = new Date(value);
				this.value = new Date(dobj.getFullYear(),dobj.getMonth(),dobj.getDate());
				
				this.now_day_month = this.value;
			}
			if(arg?.start){
				let sv = start;
				if(typeof sv ==='string'){
					sv = new Date(sv.replace(/-/g,'/'))
				}else if(typeof sv === 'object'){
					sv = new Date(sv)
				}
				this.start_time = sv;
			}
			if(arg?.end){
				let sv = end;
				if(typeof sv ==='string'){
					sv = new Date(sv.replace(/-/g,'/'))
				}else if(typeof sv === 'object'){
					sv = new Date(sv)
				}
				this.end_time = sv;
			}
		}
	  
	}
	/**
	* 日期转化为字符串， 4位年+2位月+2位日
	*/
	getDateStr(date) {
	    var _year = date.getFullYear();
	    var _month = date.getMonth();    // 月从0开始计数
	    var _d = date.getDate();
	     
	    _month = (_month > 9) ? ("" + _month) : ("0" + _month);
	    _d = (_d > 9) ? ("" + _d) : ("0" + _d);
	    return _year + _month + _d;
	}
	// 设置当前计算的日历的时间 。格式为时间 格式。
	setValue(value){
		if(value){
			let dobj = new Date();
			if(typeof value === 'object'){
				dobj =  new Date(value);
			}else{
				value = value.replace(/-/g,'/');
				dobj =  new Date(value);
			}

			this.value = new Date(dobj.getFullYear(),dobj.getMonth(),dobj.getDate());
			this.now_day_month = this.value;
		}
		return this;
	}
	// 未设置
	setStart(start){
		let sv = start;
		if(typeof sv ==='string'){
			sv = new Date(sv.replace(/-/g,'/'))
		}else if(typeof sv === 'object'){
			sv = new Date(sv)
		}
		
		this.start_time = sv;
		return this;
	}
	setEnd(end){
		let sv = end;
		if(typeof sv ==='string'){
			sv = new Date(sv.replace(/-/g,'/'))
		}else if(typeof sv === 'object'){
			sv = new Date(sv)
		}
		
		this.end_time = sv;
		
		return this;
	}
	// 设置文本数据。携带在对象 中。
	setTimeArrayText(textArray){
		if(!Array.isArray(textArray)) return;
		/**
		 * textArray
		 * {date:"2021-7-1",text:"你好"}
		 */
		this.txtdateArray = textArray;
		return this;
	}
	
	monthDay(year, month) {
	  var date = new Date(year, month, 1, 0, 0, 0)
	  var yesterDay = new Date(date - 1000)
	  return yesterDay.getDate()
	}
	nongli(year,month,day){
		const  calendarobj = {
		    gregorianYear: null,          //公历年
		    gregorianMonth: null,         //公历月
		    gregorianDay: null,           //公历日
		    weekday: null,                //星期
		    hours: null,
		    minutes: null,
		    seconds: null,
		
		    lunarYear: null,              //农历年
		    lunarMonth: null,             //农历月
		    lunarDay: null,               //农历日
		
		    lunarYearCn: '',              //农历天干地支纪年
		    lunarMonthCn: '',             //农历中文月
		    lunarDayCn: '',               //农历中文日
		    zodiacYear: '',               //农历生肖年
		
		    solarTerm: '',                //节气
		    gregorianFestival: '',        //公历节日
		    lunarFestival: ''             //农历节日
		}
		
		let lunarInfo = [
		    0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
		    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
		    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
		    0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
		    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
		    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
		    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
		    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
		    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
		    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
		    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
		    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
		    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
		    0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
		    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0]
		
		let zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
		let Gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
		let Zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
		let weekday = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
		let now = new Date()
		
		//用于计算农历年月日的数据
		let GY = year
		let GM = month
		let GD = day
		
		
		//==== 传入 offset 传回干支, 0=甲子
		function cyclical(num) {
		    return(Gan[num % 10] + Zhi[num % 12])
		}
		
		//==== 传回农历 year年的总天数
		function lYearDays(year) {
		    let i, sum = 348
		    for(i = 0x8000; i > 0x8; i >>= 1) {
		        sum += (lunarInfo[year - 1900] & i) ? 1: 0
		    }
		    return(sum + leapDays(year))
		}
		
		//==== 传回农历 year年闰月的天数
		function leapDays(year) {
		    if(leapMonth(year)) {
		        return((lunarInfo[year-1900] & 0x10000)? 30: 29)
		    }
		    else {
		        return 0
		    }
		}
		
		//==== 传回农历 year年闰哪个月 1-12 , 没闰传回 0
		function leapMonth(year) {
		    return(lunarInfo[year - 1900] & 0xf)
		}
		
		//==== 传回农历 year年month月的总天数
		function monthDays(year, month) {
		    return( (lunarInfo[year - 1900] & (0x10000 >> month))? 30: 29 )
		}
		
		//==== 算出农历, 传入日期对象, 传回农历日期对象
		//     该对象属性有 农历年year 农历月month 农历日day 是否闰年isLeap yearCyl dayCyl monCyl
		function Lunar(objDate) {
		    let i, temp = 0
		    let baseDate = new Date(1900,0,31)
		    let offset   = Math.floor((objDate - baseDate)/86400000)
		
		    let dayCyl = offset + 40
		    let monCyl = 14
		
		    for(i = 1900; i < 2050 && offset > 0; i++) {
		        temp = lYearDays(i)
		        offset -= temp
		        monCyl += 12
		    }
		    if(offset < 0) {
		        offset += temp;
		        i--;
		        monCyl -= 12
		    }
		    //农历年
		    let year = i
		    let yearCyl = i-1864
		
		    let leap = leapMonth(i) //闰哪个月
		    let isLeap = false  //是否闰年
		
		    for(i=1; i<13 && offset>0; i++) {
		        //闰月
		        if(leap>0 && i === (leap+1) && isLeap === false) {
		            --i; isLeap = true; temp = leapDays(year);
		        }
		        else {
		            temp = monthDays(year, i);
		        }
		
		        //解除闰月
		        if(isLeap === true && i === (leap + 1)) {
		            isLeap = false
		        }
		
		        offset -= temp
		        if(isLeap === false) {
		            monCyl ++
		        }
		    }
		
		    if(offset === 0 && leap>0 && i===leap+1)
		        if(isLeap) {
		            isLeap = false
		        }
		        else {
		            isLeap = true
		            --i
		            --monCyl
		        }
		
		    if(offset<0){
		        offset += temp
		        --i
		        --monCyl
		    }
		    //农历月
		    let month = i
		    //农历日
		    let day = offset + 1
		
		    return {
		        year: year,
		        month: month,
		        day: day,
		        isLeap: isLeap,
		        leap: leap,
		        yearCyl: yearCyl,
		        dayCyl: dayCyl,
		        monCyl: monCyl
		    }
		}
		
		//==== 中文日期 m为传入月份，d为传入日期
		function cDay(m, d){
		    let nStr1 = ['日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
		    let nStr2 = ['初', '十', '廿', '卅', '']
		    //农历中文月
		    let lunarMonthCn
		    //农历中文日
		    let lunarDayCn
		    if (m > 10){
		        lunarMonthCn = '十' + nStr1[m - 10]
		    } else {
		        lunarMonthCn = nStr1[m]
		    }
		    lunarMonthCn += '月'
		
		    switch (d) {
		        case 10: lunarDayCn = '初十'; break;
		        case 20: lunarDayCn = '二十'; break;
		        case 30: lunarDayCn = '三十'; break;
		        default: lunarDayCn = nStr2[Math.floor(d/10)] + nStr1[d % 10]
		    }
		    return {
		        lunarMonthCn: lunarMonthCn,
		        lunarDayCn: lunarDayCn
		    }
		}
		
		//节气
		function getSolarTerm() {
		    let sTermInfo = [
		        0, 21208, 42467, 63836, 85337, 107014,
		        128867, 150921, 173149, 195551, 218072, 240693,
		        263343, 285989, 308563, 331033, 353350, 375494,
		        397447, 419210, 440795, 462224, 483532, 504758
		    ]
		    let solarTerm = [
		        '小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
		        '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
		        '小暑', '大暑', '立秋', '处暑', '白露', '秋分',
		        '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'
		    ]
		
		    let solarTerms = ''
		    let tmp1 = new Date(
		        (31556925974.7 * (GY - 1900) + sTermInfo[(GM-1) * 2 + 1] * 60000) + Date.UTC(1900,0,6,2,5)
		    )
		    let tmp2 = tmp1.getUTCDate()
		    if (tmp2 === GD) solarTerms = solarTerm[(GM-1) * 2 + 1]
		    tmp1 = new Date(
		        (31556925974.7 * (GY - 1900) + sTermInfo[(GM-1) * 2] * 60000) + Date.UTC(1900,0,6,2,5)
		    )
		    tmp2= tmp1.getUTCDate()
		    if (tmp2 === GD) solarTerms = solarTerm[(GM-1) * 2]
		
		    return solarTerms
		}
		
		//==== 中文日期 m为传入月份，d为传入日期
		function cDay(m  ,d ){
		    let nStr1 = ['日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
		    let nStr2 = ['初', '十', '廿', '卅', '']
		    //农历中文月
		    let lunarMonthCn
		    //农历中文日
		    let lunarDayCn
		    if (m > 10){
		        lunarMonthCn = '十' + nStr1[m - 10]
		    } else {
		        lunarMonthCn = nStr1[m]
		    }
		    lunarMonthCn += '月'
		
		    switch (d) {
		        case 10: lunarDayCn = '初十'; break;
		        case 20: lunarDayCn = '二十'; break;
		        case 30: lunarDayCn = '三十'; break;
		        default: lunarDayCn = nStr2[Math.floor(d/10)] + nStr1[d % 10]
		    }
		    return {
		        lunarMonthCn: lunarMonthCn,
		        lunarDayCn: lunarDayCn
		    }
		}
		//去掉时分秒的日期
		let sDObj = new Date(GY, GM-1, GD);
		let lDObj = new Lunar(sDObj);
		
		
		//节气
		// calendar.solarTerm = getSolarTerm()
		let n = cDay(lDObj.month,lDObj.day);
		let y = cyclical( GY - 1900 + 36);
		return {
			year:y,
			month:n.lunarMonthCn,
			day:n.lunarDayCn,
			shengxiao:zodiacs[(GY - 4) % 12],
			jieqi:getSolarTerm()
		};
	}
	//下个月，可以一直操作
	nextMonth(){
		this.value = new Date(this.value.getFullYear(),this.value.getMonth()+1,1);
		return this;
	}
	//上个月，可以一直操作
	prevMonth(){
		this.value = new Date(this.value.getFullYear(),this.value.getMonth()-1,1);
		return this;
	}
	//下一年
	nexYear(){
		this.value = new Date(this.value.getFullYear()+1,this.value.getMonth(),this.value.getDate());
		return this;
	}
	//上一年
	prevYear(){
		this.value = new Date(this.value.getFullYear()-1,this.value.getMonth(),this.value.getDate());
		return this;
	}
	// 把之前设置的上一年，下一年，上一月下一月等数据清除，恢复 到最原始的月份年份数据。
	setInit(){
		this.value = this.now_day_month;
		return this;
	}
	// 返回初始化时的月份
	getNowData(){
		// 当前时间 。
		let week = [7,1,2,3,4,5,6]
		let text_week = ['周日','周一','周二','周三','周四','周五','周六']
		let _thisdateStr = this.now_day_month.toLocaleString();
		let _thisMothn = this.now_day_month.getMonth();//当前月
		let _thisDay = this.now_day_month.getDate();//当前日
		let _thisYear = this.now_day_month.getFullYear();//当前年
		let _thisWeek = this.now_day_month.getDay();//当前周
		let _thisMothn_day = new Date(_thisYear,_thisMothn,1) ; ///当月第一天数据。
		let _thisDayDate = new Date(_thisYear,_thisMothn,_thisDay);
		let months = [31,this.monthDay(_thisYear,_thisMothn),31,30,31,30,31,31,30,31,30,31];
		let _thisMothn_lastDay = new Date(_thisYear,_thisMothn,months[_thisMothn]) ; ///当月最后数据。
		let dateArray = [];//当前日历表数据。
		let llineDate = [];//行数据。
		let j=1;
		let ishs = true //如果第一排没有本月数据需要切换模式。把本月放第一位。
		for(let i=1 ;i <8;i++){
			let tdy = new Date(_thisYear, _thisMothn, i - 6 - _thisMothn_day.getDay()); //当前循环日期。
			if(i==7){
				
				let tf =  tdy.getTime()>= _thisMothn_day.getTime() && tdy.getTime() <= _thisMothn_lastDay.getTime() ?true:false;
				if(!tf){
					ishs = false;
					break;
				}
			}
		}
		for(let i=1 ;i <43;i++){
			var Day = null;
			if(!ishs){
				Day = new Date(_thisYear, _thisMothn, i + 1 - _thisMothn_day.getDay()); //当前循环日期。
			}else{
				Day = new Date(_thisYear, _thisMothn, i - 6 - _thisMothn_day.getDay()); //当前循环日期。
			}
			dateArray.push({
				year:Day.getFullYear(),//年
				month:Day.getMonth()+1,//月1-12
				week:week[Day.getDay()],//周的数字1~7
				week_text:text_week[Day.getDay()],//周的中文
				day:Day.getDate(),//几号
				prevMoth: Day.getTime() < _thisMothn_day.getTime() ?true:false,//是否是上月。
				nowMonth: Day.getTime()>= _thisMothn_day.getTime() && Day.getTime() <= _thisMothn_lastDay.getTime() ?true:false,//是否当月
				nowDay:Day.getTime() == _thisDayDate.getTime() ?true:false,//是否是当天。
				nowYear:0,//是否当年
				nextMoth: Day.getTime() > _thisMothn_lastDay.getTime()?true:false,//是否下月
				beginEnd: Day.getTime() >= this.start_time.getTime() && Day.getTime() <= this.end_time.getTime()?true:false,//是否在开始和结束区间范围内。
				nongli:this.nongli(Day.getFullYear(),Day.getMonth()+1,Day.getDate()) 
			})
			
		}
		
		return dateArray;
	}
	// 返回当前选中月的日历数组。如果你不设置value和数据getNowData和getData相等。
	/**
	 * 返回当前月数据。
	 * @return {
		 beginEnd: false,//是否在规定范围时间内
		 day: 16,//日
		 month: 7,//月
		 nextMoth: false,//是否下月
		 nowDay: false,//是否当天
		 nowMonth: true,//是否当月
		 prevMoth: false,/是否下月
		 week: 5,//周1-7
		 week_text: "周五",//同上
		 year: 2021,//年
		 nongli:{ //农历
			 day: "初七",//日
			 jieqi: "",//节气
			 month: "六月",//月
			 shengxiao: "牛",//生肖
			 year: "辛丑" //农历年
		 }
	 }
	 */
	getData(){
		// 当前时间 。
		let week = [7,1,2,3,4,5,6]
		let text_week = ['周日','周一','周二','周三','周四','周五','周六']
		let _thisdateStr = this.value.toLocaleString();
		let _thisMothn = this.value.getMonth();//当前月
		let _thisDay = this.value.getDate();//当前日
		let _thisYear = this.value.getFullYear();//当前年
		let _thisWeek = this.value.getDay();//当前周
		let _thisMothn_day = new Date(_thisYear,_thisMothn,1) ; ///当月第一天数据。
		let _thisDayDate = new Date(_thisYear,_thisMothn,_thisDay);
		let months = [31,this.monthDay(_thisYear,_thisMothn),31,30,31,30,31,31,30,31,30,31];
		let _thisMothn_lastDay = new Date(_thisYear,_thisMothn,months[_thisMothn]) ; ///当月最后数据。
		let dateArray = [];//当前日历表数据。
		let llineDate = [];//行数据。
		let j=1;
		let ishs = true //如果第一排没有本月数据需要切换模式。把本月放第一位。
		for(let i=1 ;i <8;i++){
			let tdy = new Date(_thisYear, _thisMothn, i - 6 - _thisMothn_day.getDay()); //当前循环日期。
			if(i==7){
				
				let tf =  tdy.getTime()>= _thisMothn_day.getTime() && tdy.getTime() <= _thisMothn_lastDay.getTime() ?true:false;
				if(!tf){
					ishs = false;
					break;
				}
			}
		}
	
		for(let i=1 ;i <43;i++){
			var Day = null;
			if(!ishs){
				Day = new Date(_thisYear, _thisMothn, i + 1 - _thisMothn_day.getDay()); //当前循环日期。
			}else{
				Day = new Date(_thisYear, _thisMothn, i - 6 - _thisMothn_day.getDay()); //当前循环日期。
			}
			let dstr = Day.getFullYear() + "-" + (Day.getMonth()+1) + "-" + Day.getDate();
			let TxtIndex = this.txtdateArray.findIndex(item=>{
			
				return item.date == dstr
			})
			
			
			dateArray.push({
				year:Day.getFullYear(),//年
				month:Day.getMonth()+1,//月1-12
				week:week[Day.getDay()],//周的数字1~7
				week_text:text_week[Day.getDay()],//周的中文
				day:Day.getDate(),//几号
				prevMoth: Day.getTime() < _thisMothn_day.getTime() ?true:false,//是否是上月。
				nowMonth: Day.getTime()>= _thisMothn_day.getTime() && Day.getTime() <= _thisMothn_lastDay.getTime() ?true:false,//是否当月
				nowDay:Day.getTime() == _thisDayDate.getTime() ?true:false,//是否是当天。
				nextMoth: Day.getTime() > _thisMothn_lastDay.getTime()?true:false,//是否下月
				beginEnd: Day.getTime() >= this.start_time.getTime() && Day.getTime() <= this.end_time.getTime()?true:false,//是否在开始和结束区间范围内。
				nongli:this.nongli(Day.getFullYear(),Day.getMonth()+1,Day.getDate()),
				text:TxtIndex>-1? this.txtdateArray[TxtIndex]['text']:""
			})
			
		}
		
		return dateArray;
	}


}

export default calendar;