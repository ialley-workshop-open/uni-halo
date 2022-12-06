<!-- 日期组件 -->
<template>
	<view class="tm-pickersDateView flex-start px-24" :class="[black_tmeme?'grey-darken-5':bgColor]">

		<block v-for="(item_data,index_pub) in listData" :key="index_pub">
			<view v-if="(index_pub==0&&dataCauser.year)
			||(index_pub==1&&dataCauser.month)
			||(index_pub==2&&dataCauser.day)
			||(index_pub==3&&dataCauser.hour)
			||(index_pub==4&&dataCauser.min)
			||(index_pub==5&&dataCauser.sec)
			" class="tm-pickersDateView-wk " :style="{
					height:itemHeight*5+'px',
					width:jswid() + '%',
					marginLeft:index_pub==0?0:1 + '%',
				}">
				<scroll-view 
				@touchstart="setChildreIndex(index_pub)" 
				:show-scrollbar='false' 
				v-if="dataType!==null&&item_data" 
				:scroll-top="listIndex[index_pub]?listIndex[index_pub]['wz']:''" 
				scroll-y 
				@touchend="scrllEnd"
				@scroll="scroll($event,index_pub)" 
				scroll-with-animation class="tm-pickersDateView-showbg"  
				:style="{
					height:itemHeight*5+'px'
				}">
					<!-- #ifdef H5 -->
					<view :id='"_bar_"+(index4)+"_bar_"' v-for="(item4,index4) in 2" :key="index4+'_a'" class="tm-pickersDateView-item "
						:style="{height:itemHeight+'px'}">
						<text class="opacity-1"></text>
					</view>
					<!-- #endif -->
					<!-- #ifndef H5 -->
					<view :id='"_bar_"+(index4)+"_bar_"' v-for="(item4,index4) in 2" :key="index4" class="tm-pickersDateView-item "
						:style="{height:itemHeight+'px'}">
						<text class="opacity-1"></text>
					</view>
					<!-- #endif -->
			
					<view :id='"_bar_"+(index+2)+"_bar_"' v-for="(item,index) in item_data" :key="index"
						class="tm-pickersDateView-item flex-center" :style="{
						height:itemHeight+'px'
					}">
						<view class="text-size-g tm-pickersDateView-item-text" :class="[
							listIndex[index_pub].itemIndex==index? (black_tmeme?'text-white':'text-black'):(black_tmeme?'':'opacity-4'),
							listIndex[index_pub].itemIndex+1==index||listIndex[index_pub].itemIndex-1==index?'textLevel_1':'',
							listIndex[index_pub].itemIndex+2==index||listIndex[index_pub].itemIndex-2==index?'textLevel_2':'',
							
							]">
							<text >{{fullNumber?buqi(item):item}}{{index_pub==0&&mode?'年':''}}{{index_pub==1&&mode?'月':''}}{{index_pub==2&&mode?'日':''}}{{index_pub==3&&mode?'时':''}}{{index_pub==4&&mode?'分':''}}{{index_pub==5&&mode?'秒':''}}</text>
						</view>
					</view>
			
					<!-- #ifdef H5 -->
					<view v-for="(item4,index4) in 2" :key="index4+'_bb'" class="tm-pickersDateView-item"
						:style="{height:itemHeight+'px'}">
						<text></text>
					</view>
					<!-- #endif -->
					<!-- #ifndef H5 -->
					<view v-for="(item4,index4) in 2" :key="index4" class="tm-pickersDateView-item"
						:style="{height:itemHeight+'px'}">
						<text></text>
					</view>
					<!-- #endif -->
				</scroll-view>
				<view class="tm-pickersDateView-fg overflow  round-5 shadow-5 flex-center"
				 :class="[
				 	black_tmeme?'white opacity-1':'grey-darken-1 opacity-1'
				 ]" :style="{
					height:itemHeight+'px',
					top:itemHeight*2+'px'
				}">
			
				</view>
			</view>
		</block>



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
		name: "tm-pickersDateView",
		props: {
			// 行高。
			itemHeight: {
				type: String | Number,
				default: 40
			},
			black:{
				type:String|Boolean,
				default:null
			},
			// 是否禁用
			disabled:{
				type:String|Boolean,
				default:false
			},
			// 背景颜色，主题色名称。
			bgColor:{
				type:String,
				default:'white'
			},
			//要展示的时间。
			showDetail:{
				type:Object,
				default:()=>{
					return {
						year:true,//年
						month:true,//月
						day:true,//天
						hour:false,//小时
						min:false,//分
						sec:false//秒
					}
				}
			},
			start:{
				type:String,
				default:'1900-1-1 00:00:00'
			},
			end:{
				type:String,
				default:''
			},
			defaultValue:'',
			// 是否显示中文年，月后缀
			mode:{
				type:String|Boolean,
				default:true
			},
			// 是否把个位数补齐双位数
			fullNumber:{
				type:String|Boolean,
				default:true
			}
		
		},
		data() {
			return {
				scrollEvent: 0,
				childrenIndex: 0,
				scrollChildrenIndex:0,
				listIndex: [],
				listData: [[],[],[],[],[],[]],
				dataCauser:{
						year:true,//年
						month:true,//月
						day:true,//天
						hour:true,//小时
						min:true,//分
						sec:true//秒
					},
				
				startTime:null,
				endTime:null,

				

			};
		},
		mounted() {
			for(let i =0 ; i <this.listData.length;i++){
				this.listIndex.push({
					itemIndex: 0,
					childrenIndex: 0,
					wz: 0
				})
			}
			this.chulisdata()
			
			this.$nextTick(function(){
				
				this.setDefaultValue();
			})
			
		},
		
		watch:{
			defaultValue:async function(){
				await this.setDefaultValue();
				
			},
			start:async function(){
				await this.setDefaultValue();
				
			},
			end:async function(){
				await this.setDefaultValue();
				
			},
		},
		computed: {
			dataType: function() {
				return 'string';
			},
			gridNum: function() {
				let t = this;
				let d = 0;
				for(let key in this.showDetail){
					if(this.showDetail[key]==true){
						d++
					}
				}
				
				return d;
			},
			black_tmeme: function() {
				if (this.black !== null) return this.black;
				return this.$tm.vx.state().tmVuetify.black;
			}
		},
		methods: {
			buqi(val){
				return (val > 9) ? ("" + val) : ("0" + val);
			},
			// 获取当前选中的数据。
			getSelectedValue(){
				let t = this;
				let ap = [];
				this.listIndex.forEach((item,index)=>{
					ap.push(t.listData[index][item.itemIndex])
				})
				let jg = {
						year:ap[0],//年
						month:ap[1],//月
						day:ap[2],//天
						hour:ap[3],//小时
						min:ap[4],//分
						sec:ap[5]//秒
					}
				let ar  =  Object.keys(this.dataCauser);

				ar.forEach(item=>{
					if(t.dataCauser[item]===false){
						delete jg[item]
					}
				})
				return jg;
			},
			chulisdata() {
				if(typeof this.showDetail === 'object'){
					this.dataCauser = {...this.dataCauser,...this.showDetail};
				}
				this.startTime = new Date(this.start.replace(/-/g,'/'))
				if(isNaN(this.startTime.getFullYear())){
					this.startTime = new Date('1900/1/1 00:00:00')
				}
				this.endTime = new Date(this.end.replace(/-/g,'/'))
				
				if(isNaN(this.endTime.getFullYear()) ){
					this.endTime = new Date()
				}
				// this.dataCauser.year===
				if(true){
					let pyear = [];
					for(let i=this.startTime.getFullYear();i<=this.endTime.getFullYear(); i++){
						pyear.push(i)
					}
					this.listData.splice(0,1,pyear)
				}
				// this.dataCauser.month===
				if(true){
					let pmonth = [];
					let x_year = this.startTime.getFullYear();
					let xz_year= this.listData[0][this.listIndex[0].itemIndex];
					if(xz_year === x_year){
						for(let i=this.startTime.getMonth()+1;i<=12; i++){
							pmonth.push(i)
						}
					}else{
						
						// 不能大于endtime.
						if(xz_year >= this.endTime.getFullYear()){
							for(let i=1;i<=this.endTime.getMonth()+1; i++){
								pmonth.push(i)
							}
							
						}else{
							for(let i=1;i<=12; i++){
								pmonth.push(i)
							}
						}
						
						
					}
					
					this.listData.splice(1,1,pmonth)
				}
				// this.dataCauser.day===
				if(true){
					function monthDay(year, month) {
					  var date = new Date(year, month, 1, 0, 0, 0)
					  var yesterDay = new Date(date - 1000)
					  return yesterDay.getDate()
					}
					let pday = [];
					let year = this.startTime.getFullYear();
					let xzyear = this.listData[0][this.listIndex[0].itemIndex];
					if(xzyear){
						year = xzyear;
					}
					let month = this.startTime.getMonth();
					let xzmonth = this.listData[1][this.listIndex[1].itemIndex]-1;
					if(xzmonth){
						month = xzmonth;
					}
					let months = [31,monthDay(year,month+1),31,30,31,30,31,31,30,31,30,31];
					
					
					
					if(year === this.startTime.getFullYear() && month === this.startTime.getMonth()){
						
						if(year == this.endTime.getFullYear()&&
						month == this.endTime.getMonth()+1 
						
						){
							for(let i=this.startTime.getDate();i<=this.endTime.getDate(); i++){
								pday.push(i)
							}
						}else{
							for(let i=this.startTime.getDate();i<=months[month]; i++){
								pday.push(i)
							}
						}
						
						
					}else{
						
						if(year >= this.endTime.getFullYear()&& month >= this.endTime.getMonth()){
							for(let i=1;i<=this.endTime.getDate(); i++){
								pday.push(i)
							}
							
						}else{
							for(let i=1;i<=months[month]; i++){
								pday.push(i)
							}
						}
						
						
					}
					
					this.listData.splice(2,1,pday)
				}
				// this.dataCauser.hour===
				if(true){
					let phour = [];
					let s_year = this.startTime.getFullYear();
					let o_year = this.listData[0][this.listIndex[0].itemIndex];
					let s_month = this.startTime.getMonth()+1;
					let o_month = this.listData[1][this.listIndex[1].itemIndex];
					let s_day = this.startTime.getDate();
					let o_day = this.listData[2][this.listIndex[2].itemIndex];
					// let s_hour = this.startTime.getMinutes();
					// let o_hour = this.listData[3][this.listIndex[3].itemIndex];

					
					if(s_year===o_year&&s_month===o_month&&s_day===o_day){
						
						if(s_year == this.endTime.getFullYear()&&
						s_month == this.endTime.getMonth()+1 &&
						s_day == this.endTime.getDate()
						){
							for(let i=this.startTime.getHours();i<=this.endTime.getHours(); i++){
								phour.push(i)
							}
						}else{
							for(let i=this.startTime.getHours();i<24; i++){
								phour.push(i)
							}
						}
						
					}else{
						
						if(o_year >= this.endTime.getFullYear() && o_month >= this.endTime.getMonth()&& o_day >= this.endTime.getDate()){
							for(let i=0;i<=this.endTime.getHours(); i++){
								phour.push(i)
							}
							
						}else{
							for(let i=0;i<24; i++){
								phour.push(i)
							}
						}
						
						
					}
					this.listData.splice(3,1,phour)
				}
				// this.dataCauser.min===true
				if(true){
					let pmin = [];
					let s_year = this.startTime.getFullYear();
					let o_year = this.listData[0][this.listIndex[0].itemIndex];
					let s_month = this.startTime.getMonth()+1;
					let o_month = this.listData[1][this.listIndex[1].itemIndex];
					let s_day = this.startTime.getDate();
					let o_day = this.listData[2][this.listIndex[2].itemIndex];
					let s_hour = this.startTime.getHours();
					let o_hour = this.listData[3][this.listIndex[3].itemIndex];
					if(s_year===o_year&&s_month===o_month&&s_day===o_day&&s_hour===o_hour){
						
						
						if(s_year == this.endTime.getFullYear()&&
						s_month == this.endTime.getMonth()+1 &&
						s_day == this.endTime.getDate()&&
						s_hour == this.endTime.getHours()
						){
							for(let i=this.startTime.getMinutes();i<=this.endTime.getMinutes(); i++){
								pmin.push(i)
							}
						}else{
							for(let i=this.startTime.getMinutes();i<60; i++){
								pmin.push(i)
							}
						}
						
						
					}else{
						
						if(o_year >= this.endTime.getFullYear() && o_month >= this.endTime.getMonth()&& o_day >= this.endTime.getDate() && o_hour >= this.endTime.getHours()){
							for(let i=1;i<=this.endTime.getMinutes(); i++){
								pmin.push(i)
							}
							
						}else{
							for(let i=0;i<60; i++){
								pmin.push(i)
							}
						}
						
						
					}
					
					this.listData.splice(4,1,pmin)
				}
				// this.dataCauser.sec===
				if(true){
					let psec = [];
					let s_year = this.startTime.getFullYear();
					let o_year = this.listData[0][this.listIndex[0].itemIndex];
					let s_month = this.startTime.getMonth()+1;
					let o_month = this.listData[1][this.listIndex[1].itemIndex];
					let s_day = this.startTime.getDate();
					let o_day = this.listData[2][this.listIndex[2].itemIndex];
					let s_hour = this.startTime.getHours();
					let o_hour = this.listData[3][this.listIndex[3].itemIndex];
					let s_min = this.startTime.getMinutes();
					let o_min = this.listData[4][this.listIndex[4].itemIndex];
					if(s_year===o_year&&s_month===o_month&&s_day===o_day&&s_hour===o_hour&&s_min===o_min){
						
						if(s_year == this.endTime.getFullYear()&&
						s_month == this.endTime.getMonth()+1 &&
						s_day == this.endTime.getDate()&&
						s_hour == this.endTime.getHours()&&
						s_min == this.endTime.getMinutes()
						){
							for(let i=this.startTime.getSeconds();i<=this.endTime.getSeconds(); i++){
								psec.push(i)
							}
						}else{
							for(let i=this.startTime.getSeconds();i<60; i++){
								psec.push(i)
							}
						}
						
						
					}else{
						
						if(o_year >= this.endTime.getFullYear() && o_month >= this.endTime.getMonth()&& o_day >= this.endTime.getDate() && o_hour >= this.endTime.getHours()&& o_min >= this.endTime.getMinutes()){
							for(let i=1;i<=this.endTime.getSeconds(); i++){
								psec.push(i)
							}
							
						}else{
							for(let i=0;i<60; i++){
								psec.push(i)
							}
						}
						
					}
					this.listData.splice(5,1,psec)
				}
				
				return this.listData;
			},
			async setDefaultValue(date){
				let t = this;
				let mobj;
				if(date){
					mobj = new Date(date.replace(/-/g,'/'));
				}else{
					try{
						 mobj = new Date(this.defaultValue.replace(/-/g,'/'));
					}catch(e){
						mobj = new Date();
					}
					if(!this.defaultValue || isNaN(mobj.getFullYear())){
						mobj = new Date();
					}
				}
				
				await uni.$tm.sleep(20)
				// this.dataCauser.year===
				if(true){
					let pyear = mobj.getFullYear();
					
					if(pyear <= this.startTime.getFullYear()){
						
						pyear = this.startTime.getFullYear()
						
					}else if(pyear >= this.endTime.getFullYear()){
						pyear = this.endTime.getFullYear()
					}
					
					let itemIndex = this.listData[0].indexOf(pyear)
					if(itemIndex>-1){
						this.$set(this.listIndex[0], 'itemIndex', itemIndex);
						this.$set(t.listIndex[0], 'wz', itemIndex * t.itemHeight);
						this.chulisdata();
					}
				}
				await uni.$tm.sleep(20)
				// this.dataCauser.month===
				if(true){
					let pmonth = mobj.getMonth()+1;
					if(mobj.getFullYear() <= this.startTime.getFullYear()&&pmonth <= this.startTime.getMonth()+1){
						pmonth = this.startTime.getMonth()+1
					}else if(mobj.getFullYear() >= this.endTime.getFullYear()&&pmonth >= this.endTime.getMonth()+1){
						pmonth = this.endTime.getMonth()+1
					}
					
					
					let itemIndex = this.listData[1].indexOf(pmonth)
					
					if(itemIndex>-1){
						this.chulisdata();
						this.$set(this.listIndex[1], 'itemIndex', itemIndex);
						this.$set(t.listIndex[1], 'wz', itemIndex * t.itemHeight-0.1);
						setTimeout(function() {
							t.$set(t.listIndex[1], 'wz', itemIndex * t.itemHeight);
						}, 10);
						
					}
				}
				await uni.$tm.sleep(20)
				// this.dataCauser.day===
				if(true){
					let pday = mobj.getDate();
					let pmonth = mobj.getMonth()+1;
					if(mobj.getFullYear() <= this.startTime.getFullYear()&&
					pmonth <= this.startTime.getMonth()+1&&
					pday <= this.startTime.getDate()
					){
						pday = this.startTime.getDate()
					}else if(mobj.getFullYear() >= this.endTime.getFullYear()&&
					pmonth >= this.endTime.getMonth()+1&&
					pday >= this.endTime.getDate()
					){
						pday = this.endTime.getDate()
					}
					
					
					
					let itemIndex = this.listData[2].indexOf(pday)
					
					if(itemIndex>-1){
						this.chulisdata();
						this.$set(this.listIndex[2], 'itemIndex', itemIndex);
						this.$set(t.listIndex[2], 'wz', itemIndex * t.itemHeight);
					}
				}
				await uni.$tm.sleep(20)
				// this.dataCauser.hour===
				if(true){
					let phour = mobj.getHours();
					let pday = mobj.getDate();
					let pmonth = mobj.getMonth()+1;
					
					if(mobj.getFullYear() <= this.startTime.getFullYear()&&
					pmonth <= this.startTime.getMonth()+1&&
					pday <= this.startTime.getDate()&&
					phour <= this.startTime.getHours()
					){
						phour = this.startTime.getHours()
					}else if(mobj.getFullYear() >= this.endTime.getFullYear()&&
					pmonth >= this.endTime.getMonth()+1&&
					pday >= this.endTime.getDate()&&
					phour >= this.endTime.getHours()
					){
						phour = this.endTime.getHours()
					}
					
					
					
					let itemIndex = this.listData[3].indexOf(phour)
					if(itemIndex>-1){
						this.chulisdata();
						
						this.$set(this.listIndex[3], 'itemIndex', itemIndex);
						this.$set(t.listIndex[3], 'wz', itemIndex * t.itemHeight);
						
					}
					
				}
				await uni.$tm.sleep(20)
				// this.dataCauser.min===
				if(true){
					let pmin = mobj.getMinutes();
					let phour = mobj.getHours();
					let pday = mobj.getDate();
					let pmonth = mobj.getMonth()+1;
					
					if(mobj.getFullYear() <= this.startTime.getFullYear()&&
					pmonth <= this.startTime.getMonth()+1&&
					pday <= this.startTime.getDate()&&
					phour <= this.startTime.getHours()&&
					pmin <= this.startTime.getMinutes()
					){
						phour = this.startTime.getMinutes()
					}else if(mobj.getFullYear() >= this.endTime.getFullYear()&&
					pmonth >= this.endTime.getMonth()+1&&
					pday >= this.endTime.getDate()&&
					phour >= this.endTime.getHours()&&
					pmin >= this.endTime.getMinutes()
					){
						phour = this.endTime.getMinutes()
					}
					
					
					let itemIndex = this.listData[4].indexOf(pmin)
					if(itemIndex>-1){
						
						this.$set(this.listIndex[4], 'itemIndex', itemIndex);
						this.$set(t.listIndex[4], 'wz', itemIndex * t.itemHeight);
					}
				}
				await uni.$tm.sleep(20)
				// this.dataCauser.sec===
				if(true){
					let psec = mobj.getSeconds();
					let pmin = mobj.getMinutes();
					let phour = mobj.getHours();
					let pday = mobj.getDate();
					let pmonth = mobj.getMonth()+1;
					
					if(mobj.getFullYear() <= this.startTime.getFullYear()&&
					pmonth <= this.startTime.getMonth()+1&&
					pday <= this.startTime.getDate()&&
					phour <= this.startTime.getHours()&&
					pmin <= this.startTime.getMinutes()&&
					psec <= this.startTime.getSeconds()
					){
						psec = this.startTime.getMinutes()
					}else if(mobj.getFullYear() >= this.endTime.getFullYear()&&
					pmonth >= this.endTime.getMonth()+1&&
					pday >= this.endTime.getDate()&&
					phour >= this.endTime.getHours()&&
					pmin >= this.endTime.getMinutes()&&
					psec >= this.endTime.getSeconds()
					){
						psec = this.endTime.getSeconds()
					}

					
					let itemIndex = this.listData[5].indexOf(psec)
					if(itemIndex>-1){
						
						this.$set(this.listIndex[5], 'itemIndex', itemIndex);
						this.$set(t.listIndex[5], 'wz', itemIndex * t.itemHeight);
					}
				}
				
			},
			setChildreIndex(index){
				this.childrenIndex = index;
			},
			scroll(e, index) {
				console.log(e);
				this.scrollEvent = e;
				this.scrollChildrenIndex = index;
				
			},
			jswid(){
				let wd =(this.gridNum-1)-2
				if(wd<=0) wd = 1;
				return 100/wd;
			},
			scrllEnd(e) {
				
				
				function monthDay(year, month) {
				  var date = new Date(year, month, 1, 0, 0, 0)
				  var yesterDay = new Date(date - 1000)
				  return yesterDay.getDate()
				}
				if (!this.scrollEvent) return;
				let dNum = this.gridNum;
				let d;
				let t = this;
				let idb = 88;
				let idc = 884;
				let srcllTop = this.scrollEvent.detail.scrollTop ;

				if(srcllTop<=0){
					srcllTop = 0;
				}else if(srcllTop >= this.scrollEvent.detail.srcollHeigh){
					srcllTop = this.scrollEvent.detail.srcollHeigh;
				}
				
				d = Math.ceil((srcllTop - (this.itemHeight / 2)) / this.itemHeight);
				
				if(d>= t.listData[t.childrenIndex].length-1){
					d = t.listData[t.childrenIndex].length-1
				}
				
				t.$set(t.listIndex[t.childrenIndex], 'wz', srcllTop)
				let old_index = this.listIndex[this.childrenIndex].itemIndex || 0;
				if(t.disabled){
					clearTimeout(idb)
					idb = setTimeout(function() {
						t.$nextTick(function(){
							t.$set(t.listIndex[t.childrenIndex], 'wz', old_index * t.itemHeight)
						})
					}, 5);
					return;
				}

				this.$set(this.listIndex[t.childrenIndex], 'itemIndex', d)
				t.chulisdata();
			
				clearTimeout(idb);
				idb = setTimeout(function() {
					t.$nextTick(function(){
						t.$set(t.listIndex[t.childrenIndex], 'wz', d * t.itemHeight)
						
						for(let lsindex = t.childrenIndex+1;lsindex<6;lsindex++){
							
							if( t.listData[lsindex][t.listIndex[lsindex].itemIndex] == undefined){
								let pda = t.listData[lsindex].length-1;
								
								if(d>=pda){
									this.$set(this.listIndex[lsindex], 'itemIndex',pda)
									t.$set(t.listIndex[lsindex], 'wz', pda * t.itemHeight)
									
								}else{
									this.$set(this.listIndex[lsindex], 'itemIndex',0)
									t.$set(t.listIndex[lsindex], 'wz', 0)
								}
								
							}else{
								let srcllTop_s = t.listIndex[lsindex].wz;
								const tsdd = t.listIndex[lsindex].itemIndex;
								
								t.$set(t.listIndex[lsindex], 'wz', (tsdd) * t.itemHeight-1)
								this.$nextTick(function(){
									t.$set(t.listIndex[lsindex], 'wz', (tsdd) * t.itemHeight)
								})
								
							}
						}
					})
				}, 10);
				
				
		
				

			}
		},
	}
</script>

<style lang="scss" scoped>
	.tm-pickersDateView {
		.tm-pickersDateView-wk {
			position: relative;
			
			.tm-pickersDateView-showbg {
				position: absolute;
				left: 0;
				height: 0;
				z-index: 5;

				.tm-pickersDateView-item {
					.tm-pickersDateView-item-text {
						text {
							transition: all 0.5s;

						}

						&.textLevel_1 {
							text {
								font-size: 28upx !important;
								
							}
						}

						&.textLevel_2 {
							text {
								font-size: 26upx !important;
							}
						}

					}
				}
			}

			.tm-pickersDateView-fg {
				position: relative;
				z-index: 3;

			}
		}
	}
</style>
