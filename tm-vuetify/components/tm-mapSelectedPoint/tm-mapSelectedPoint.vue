<template>
	<view class="tm-mapSelectedPoint" :class="[black_tmeme?'grey-darken-5':'']">
		<map :scale="mapscale" id="MapTm" ref="MapTm" @regionchange="moveMapChange" :markers="markers" :latitude="mapCenter.lat" :longitude="mapCenter.lng" :style="{width:`${width}rpx`,height:`400rpx`}"></map>
		<view class=" pa-32 ">
			<view class="tm-mapSelectedPoint-contr">
				<view class="pb-32"><text class=" text-size-n fulled text-overflow-1">当前:{{adress.adress||"获取失败，请移动地图选择"}}</text></view>
				<view class="flex-between pb-10">
					<tm-button @click="confirm" block height="80" style="width:60%">确认位置</tm-button>
					<view style="width:35%" class="flex-shrink">
						<tm-button :black="black_tmeme" :fllowTheme="fllowTheme" :theme="color_tmeme" @click="getLocation" text block height="80"  icon="icon-position-fill">定位当前</tm-button>
					</view>
				</view>
			</view>
			<view v-if="adressList.length>0" class="grey-lighten-5 px-24 round-6 mt-32" :class="[black_tmeme?'bk grey-darken-4':'']">
				<scroll-view scroll-y :style="{height: scrollHeight+'px'}">
					<view @click="selecListitem(item)" v-for="(item,index) in adressList" :key="index" :class="[black_tmeme?'bk':'']" class="py-24 border-b-1 flex-between">
						<view class="mr-32">
							<view class="pb-12">  {{item.name}}</view>
							<view class="text-size-s text-grey">{{item.address}}</view>
						</view>
						<view class="flex-shrink">
							<tm-icons :black="black_tmeme" :fllowTheme="fllowTheme" :color="color_tmeme" size="40" v-if="activeId == item.id" name="icon-check-circle"></tm-icons>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 地图选点
	 * @property {Boolean|String} black = [true|false] 默认null,是否开启暗黑模式
	 * @property {String} color = [] 主题默认:primary，提供是请写主题色名称
	 * @property {String} map-key = [] 地图key:默认为作者测试的，用户不要使用我的，否则会被限制，key作废。
	 * @property {String} map-type = [] 地图类型:qq，qq,baidu,amp高德。
	 * @property {Number} scale = [] 默认:14，地图绽放级别5-18
	 * @property {Number} width = [] 默认:700，组件的宽度。
	 * @property {Number} height = [] 默认:1200，组件的高度。
	 * @property {Object} location = [] 默认:{latitude:39.908823,longitude:116.39747}，默认的定位点，北京。
	 * @property {Function} confirm 点击确认位置按钮时返回当前定位资料信息。
	 * @property {Function} change 当移动地图时的位置信息，返回的结构同confirm
	 */
	import tmButton from '@/tm-vuetify/components/tm-button/tm-button.vue';
	import tmIcons from '@/tm-vuetify/components/tm-icons/tm-icons.vue';
	export default {
		name:"tm-mapSelectedPoint",
		components:{tmButton,tmIcons},
		props:{
			width:{
				type:Number|String,
				default:700
			},
			height:{
				type:Number|String,
				default:1200
			},
			location:{
				type:Object,
				default:()=>{
					return {
						latitude:0,
						longitude:0
					}
				}
			},
			scale:{
				type:Number,
				default:14
			},
			// 是否开启暗黑模式
			black: {
				type: String | Boolean,
				default: null
			},
			color: {
				type: String | Array,
				default: 'primary'
			},
			// 跟随主题色的改变而改变。
			fllowTheme: {
				type: Boolean | String,
				default: true
			},
			mapKey:{
				type:String,
				default:'U3QBZ-3YIKI-YBEGX-5WURG-5ZQE6-ZGFME'
			},
			mapType:{
				type:String,
				default:'qq' //qq,baidu,amp
			}
		},
		watch: {
			location:{
				deep:true,
				async handler(newValue, oldValue) {
					this.moveMap(newValue.latitude,newValue.longitude)
					await this.moveMarkes(newValue.latitude,newValue.longitude)
				}
			}
		},
		data() {
			return {
				now_latitude:0,
				now_longitude:0,
				mapCenter:{
					lat:0,
					lng:0
				},
				markers:[],
				timeid:9566555566,
				adressList:[],
				adress:{
					adress:'',
					city:[]
				},
				scrollHeight:0,
				activeId:'',
				map:null,
			};
		},
		
		computed:{
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
			mapscale:function(){
				return this.scale;
			}
		},
		created() {
			this.now_latitude = this.location.latitude;
			this.now_longitude = this.location.longitude;
			this.mapCenter = {
				lat:this.location.latitude,
				lng:this.location.longitude
			}
		},
		async mounted() {
			let t = this;
			this.map = uni.createMapContext("MapTm", this)
			let q = await this.$Querey('.tm-mapSelectedPoint-contr',this).catch(e=>{});
			let h = q[0].height||80;
			this.scrollHeight = uni.upx2px(this.height) - uni.upx2px(400) - h;
			// #ifdef MP
			uni.authorize({
			    scope: 'scope.userLocation',
			    success() {
			        t.mapready();
			    }
			})
			// #endif
			// #ifndef MP
			this.$nextTick(async function(){
				await uni.$tm.sleep(200)
				await this.mapready();
			})
			// #endif
		},
		methods: {
			moveMap(latitude,longitude){
				this.map.moveToLocation({
					  latitude:latitude,
					  longitude:longitude
				})
			},
			async mapready(){
				
				let t = this;
				// #ifndef H5
				uni.getSetting({
					success: async (res) => {
						if(!res.authSetting['scope.userLocation']){
							uni.showModal({
								title:"权限受限",
								content:"你禁止了位置受限，请打开设置，允许访问地址！否则功能无法使用。",
								cancelText:"我已允许",
								confirmText:"前往设置",
								success: async (rks) => {
									if(rks.cancel==true){
										 await t.getLocation();
										 return
									}
									uni.openSetting({})
								}
							})
							return;
						}
						if(t.mapCenter.lat !==0 && t.mapCenter.lng!==0){
							t.markers = [t.createMarker( t.mapCenter.lat ,t.mapCenter.lng)]
							await t.poiSidel_byTencentMap(t.mapCenter.lat ,t.mapCenter.lng)
							return;
						}
						await t.getLocation();
					},
					fail: (res) => {
						uni.$tm.toast("系统错误")
					}
				})
				// #endif
				
				// #ifdef H5
				if(t.mapCenter.lat !==0 && t.mapCenter.lng!==0){
					t.markers = [t.createMarker( t.mapCenter.lat ,t.mapCenter.lng)]
					await t.poiSidel_byTencentMap(t.mapCenter.lat ,t.mapCenter.lng)
					return;
				}
				await this.getLocation();
				// #endif
			},
			confirm(){
				this.$emit('confirm',{...this.adress,latitude:this.now_latitude,longitude:this.now_longitude})
			},
			async getLocation() {
				let t = this;

				//非h5通过GPS定位 。
		
				// #ifndef H5
				uni.getSetting({
					success: async (res) => {
						if(!res.authSetting['scope.userLocation']){
							uni.showModal({
								title:"权限受限",
								content:"你禁止了位置受限，请打开设置，允许访问地址！否则功能无法使用。",
								cancelText:"我已允许",
								confirmText:"前往设置",
								success: async (rks) => {
									if(rks.cancel==true){
										 await t.getLocation();
										 return
									}
									uni.openSetting({})
								}
							})
							return;
						}
						
						uni.getLocation({
						    type: 'gcj02', //返回可以用于uni.openLocation的经纬度
						    success:async function (res) {
						        const latitude = res.latitude;
						        const longitude = res.longitude;
						       t.now_latitude = latitude;
						       t.now_longitude = longitude;
							   t.mapCenter = {
							   	lat:latitude,
							   	lng:longitude
							   }
							  
							   t.moveMap(t.mapCenter.lat,t.mapCenter.lng)
							   await t.moveMarkes(latitude,longitude)
							   //缓存定位点。否则失败，间隔15s小于15秒。不允许调用。
								uni.setStorageSync('tmvue_map_selectePoint',{latitude:latitude,longitude:longitude})
						    },
							fail: async (err) => {
								let p = uni.getStorageSync('tmvue_map_selectePoint');
								
								try{
									
									if(typeof p == 'object'){
										const latitude = p .latitude;
										const longitude = p .longitude;
										t.now_latitude = latitude;
										t.now_longitude = longitude;
										t.mapCenter = {
											lat:latitude,
											lng:longitude
										}						  
										t.moveMap(t.mapCenter.lat,t.mapCenter.lng)
										await t.moveMarkes(latitude,longitude)
									}
								}catch(e){
									uni.$tm.toast('请间隙至少15s调用，不可频繁定位。')
								}
								
							}
						});
						
					},
					fail: (res) => {
						uni.$tm.toast("系统错误")
					}
				})
				// #endif
				
				
				//h5通过ip定位 
				// #ifdef H5
				
				uni.showLoading({
					mask:true,title:'...'
				})
				
				//没有获取到地址资料。通过Ip尝试定位 。
				let adressPoiObj = await uni.$tm.request.get("https://apis.map.qq.com/ws/location/v1/ip?key="+this.mapKey).catch(e=>{
					uni.hideLoading();
					uni.$tm.toast("地址解析错误")
				})
				
				if(adressPoiObj['status']==0){
					t.now_latitude = adressPoiObj.result.location.lat;
					t.now_longitude = adressPoiObj.result.location.lng;
					t.map.moveToLocation({
						  latitude:t.now_latitude,
						  longitude:t.now_longitude
					})
					t.moveMap(t.mapCenter.lat,t.mapCenter.lng)
					t.markers = [t.createMarker( adressPoiObj.result.location.lat,adressPoiObj.result.location.lng)]
					await t.poiSidel_byTencentMap(adressPoiObj.result.location.lat,adressPoiObj.result.location.lng)
				}
				
				// #endif
			},
			createMarker(latitude,longitude){
				
				let id = 636598;
				let label = {
					content:'',
					color:'#000000',
					fontSize:12,
					bgColor:'red',
					padding:5,
					textAlign:'center',
					
				}
				return {
					id:id,
					iconPath:'/static/posiimg.png',
					width:45,
					height:45,
					latitude:latitude,
					longitude:longitude,
					label:label,
					
				}
			},
			moveMapChange(e){
				var etype = ''
				// #ifdef APP-PLUS
				etype = 'end'
				// #endif
				// #ifdef MP-WEIXIN
				etype = e.type
				// #endif
				clearTimeout(this.timeid);
				if(etype ==='end'){

					let t = this;
					this.timeid = setTimeout(function() {
						
						t.map.getCenterLocation({
							success:async (res)=>{
								await t.moveMarkes(res.latitude,res.longitude)
							}
						})
					}, 350);
				}
				
				
			},
			async selecListitem(item){
				let t = this;
				this.$set(this.adress,'adress',item.address)
				await this.moveMarkes(item.location.latitude,item.location.longitude)
				this.activeId = item.id;
			},
			async moveMarkes(latitude,longitude,callback){
				let t = this;
				t.markers = []
				await uni.$tm.sleep(50)
				if(t.markers.length==0){
					t.markers = [t.createMarker( latitude,longitude)]
				}
				t.now_latitude = latitude;
				t.now_longitude = longitude;
				t.poiSidel_byTencentMap(latitude,longitude)
			},
			//mp腾讯地址获取当前地址资料。
			async poiSidel_byTencentMap(latitude,longitude){
				let t = this;
				uni.showLoading({
					mask:true,title:'...'
				})
				let lot=`location=${latitude},${longitude}&get_poi=1&key=${this.mapKey}`
				let adressPoiObj = await uni.$tm.request.get("https://apis.map.qq.com/ws/geocoder/v1/?"+lot).catch(e=>{
					uni.hideLoading();
					uni.$tm.toast("地址解析错误")
				})
				uni.hideLoading();
				if(adressPoiObj.status!==0){
					uni.$tm.toast(adressPoiObj.message)
					return;
				}
				let adress = adressPoiObj.result;
				this.$set(this.adress,'adress',adress.address)
				this.$set(this.adress,'city',[adress.address_component.province,adress.address_component.city,adress.address_component.district]);
				this.$emit('change',{...this.adress,latitude:this.now_latitude,longitude:this.now_longitude})
				let pos  =  adress.pois;
				if(pos.length==0) return;
				let list = [];
				for(let i=0;i<pos.length;i++){
					list.push({
						address:pos[i].address,
						name:pos[i].title,
						id:pos[i].id,
						location:{
							latitude:pos[i].location.lat,
							longitude:pos[i].location.lng
						}
					})
				}
				
				this.adressList = list;
			}
		},
	}
</script>

<style lang="scss">

</style>
