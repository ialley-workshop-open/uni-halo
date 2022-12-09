<template>
	<view class="tm-weekbar">
		<tm-sheet :color="color" :black="black_tmeme" :round="8" :shadow="0" :margin="[0,0]" :padding="[0,0]">
			<view class="flex-between ">
				
				<tm-button :fllowTheme="false" @click="timeNextPre(false)" :black="black_tmeme" :theme="btnColor" :font-color="fontColor" icon="icon-angle-left"  block width="44" :round="10" :shadow="0"></tm-button>
				<view  class="flex-shrink flex-start" style="width: calc(100% - 88rpx);">
					<view @click="weekClick(index,item.dateFull)" v-for="(item,index) in timeList" :key="index" class="flex-center flex-col px-5" style="width:14.28%">
						<view :class="[fontColor?(d_time==item.dateFull?`text-${activeColor_tmeme}`:(black_tmeme?'text-grey':`text-${fontColor}`)):color,d_time==item.dateFull?'text-weight-b':'',black_tmeme?'bk':'']"  class=" text-size-s text-weight-b">{{item.weekCN}}</view>
						<view :class="[dateColor?(d_time==item.dateFull?`text-${activeColor_tmeme}`:(black_tmeme?'text-grey':`text-${dateColor}`)):color,d_time==item.dateFull?'text-weight-b':'',black_tmeme?'bk':'']" class=" text-size-xs">{{item.date}}</view>
					</view>
				</view>
				<tm-button :fllowTheme="false" :black="black_tmeme" @click="timeNextPre(true)" :theme="btnColor" :font-color="fontColor"  icon="icon-angle-right"  block width="44" :round="10" :shadow="0"></tm-button>
			</view>

		</tm-sheet>
	</view>
</template>

<script>
	/**
	 * 时间周切换组件
	 * @property {String} default-value = [] ,默认：'',建议使用.sync双向绑定，默认显示的日期，格式为"2021-9-21"。
	 * @property {String} color = [] ,默认：'white',背景色
	 * @property {String} font-color = [] ,默认：'black',默认的标题字体颜色
	 * @property {String} date-color = [] ,默认：'grey',默认的日期字体颜色
	 * @property {String} active-color = [] ,默认：'primary',激活后的文字颜色
	 * @property {String} btn-color = [] ,默认：'grey-lighten-4',两按钮的背景主题色
	 * @property {Function} change 点击时间时触发，返回当前选中的日期。
	 */

	import tmSheet from "@/tm-vuetify/components/tm-sheet/tm-sheet.vue"
	import tmButton from "@/tm-vuetify/components/tm-button/tm-button.vue"
	import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
	export default {
		components:{tmSheet,tmButton,tmIcons},
		name:"tm-weekbar",
		props:{
			defaultValue:{
				type:String,
				default:''
			},
			color:{
				type:String,
				default:'white'
			},
			fontColor:{
				type:String,
				default:'black'
			},
			dateColor:{
				type:String,
				default:'grey'
			},
			activeColor:{
				type:String,
				default:'primary'
			},
			btnColor:{
				type:String,
				default:'grey-lighten-4'
			},
			black:{
				type:Boolean,
				default:null
			},
			// 跟随主题色的改变而改变。
			fllowTheme:{
				type:Boolean|String,
				default:true
			}
		},
		data() {
			return {
				nowDate:"",
				timeList:[],
			};
		},
		watch:{
			defaultValue:function(nval,oval){
				if(nval!=oval){
					let p = nval;
					if(typeof p==='string'){
						p = p.replace(/-/g,'/')
					}
					this.d_time = new Date(p).toLocaleDateString()
				}
			}
		},
		computed:{
			black_tmeme: function() {
				if (this.black !== null) return this.black;
				return this.$tm.vx.state().tmVuetify.black;
			},
			activeColor_tmeme:function(){
				if(this.$tm.vx.state().tmVuetify.color!==null&&this.$tm.vx.state().tmVuetify.color && this.fllowTheme){
					return this.$tm.vx.state().tmVuetify.color;
				}
				return this.activeColor;
			},
			d_time:{
				get:function(){
					return this.nowDate;
				},
				set:function(val){
					this.nowDate = val;
					this.$emit("update:defaultValue",val)
					this.$emit("change",val)
				},
			}
		},
		mounted() {
			let nDate = new Date();
			const  dte = nDate.getFullYear()+"/"+ (nDate.getMonth()+1) + "/" + nDate.getDate();
			let p =  this.defaultValue;
			if(typeof p==='string'){
				p = p.replace(/-/g,'/')
			}
			
			this.nowDate =  new Date(p||dte).toLocaleDateString();
			this.getTimeList(this.d_time)
		},
		methods: {
			weekClick(eindex,nowdefault){
				this.d_time = nowdefault
			},
			getTimeList(nwd){
				if(!nwd){
					nwd = this.nowDate;
				}
				let nwod = new Date(nwd);
				let year = nwod.getFullYear();
				let month = nwod.getMonth();
				let day = nwod.getDate();
				let week = nwod.getDay();
				let new_weekDay = [nwod];
				
				let timcha = Math.abs(week-7);
				let zcha = Math.abs(7-timcha);
				
				let weekCn=["周日","周一","周二","周三","周四","周五","周六"];
				for(let i=1;i<zcha;i++){
					let d = new Date(year,month,day-i);
					new_weekDay.push(d);
				}
				for(let i=1;i<=timcha;i++){
					let d = new Date(year,month,day+i);
					new_weekDay.push(d);
				}
				let weekDay = [];
				for(let i=0;i<new_weekDay.length;i++){
					let ide = new_weekDay[i];
					let sc = {
						week:ide.getDay(),
						dateFull:ide.getFullYear()+"/"+ (ide.getMonth()+1) + "/" + ide.getDate(),
						date:(ide.getMonth()+1) + "-" + ide.getDate(),
						index:i,
						weekCN:weekCn[ide.getDay()]
					}
					weekDay.push(sc);
				}
				
				weekDay.sort(function(a, b){return a.week - b.week}); 
				
				weekDay.push(weekDay[0])
				weekDay.splice(0,1)
				if(weekDay.length==8){
					weekDay.splice(0,1)
					weekDay.unshift(weekDay[weekDay.length-1])
					weekDay.splice(weekDay.length-1,1)
				}
				
				let t=  this;
				this.timeList = [];
				this.$nextTick(function(){
					this.timeList = weekDay;
				})
			},
			timeNextPre(typeV){
				if(typeV){
					let nd = this.timeList[this.timeList.length-1];
					let enx = new Date(nd.dateFull.replace(/-/g,'/'));
					enx.setDate(enx.getDate()+1)
					this.getTimeList(enx.getFullYear()+"/"+ (enx.getMonth()+1) + "/" + enx.getDate())
				}else{
					let nd = this.timeList[0];
					let enx = new Date(nd.dateFull.replace(/-/g,'/'));
					enx.setDate(enx.getDate()-7)
					this.getTimeList(enx.getFullYear()+"/"+ (enx.getMonth()+1) + "/" + enx.getDate())
				}
			},
		},
	}
</script>

<style lang="scss">

</style>
