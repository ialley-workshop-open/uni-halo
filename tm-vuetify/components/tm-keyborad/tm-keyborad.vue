<template>
	<view class="tm-keyborad ">
		<tm-poup isClickbled :isFilter="false" over-color='none'
		:height="530" ref="pop" 
		:bg-color="black_tmeme?'grey-darken-5':'grey-lighten-5'" 
		v-model="showOpen">
			<view>
				<view v-if="model_code=='number'||model_code=='code'" class="tm-keyborad-html">
					<view class=" py-10" :class="[black_tmeme?'grey-darken-5':'grey-lighten-5']">
						<view class="text-size-xs text-align-center pb-20 pt-10 text-weight-b">
							<slot>
								<text>{{title}}</text>
							</slot>
						</view>
						<tm-row custom-class="px-5">
							<tm-col  grid="3" padding="5" color="none">
								<tm-button :fontSize="42" :fllowTheme="false" item-class="text-weight-b"  @click="clickNumo(1,'num')" :black="black_tmeme" :round="round"  block :shadow="shadown" :theme="black_tmeme?'grey-darken-4':color"  height="100">1</tm-button>
							</tm-col>
						
							<tm-col grid="3" padding="5" color="none">
								<tm-button :fontSize="42" :fllowTheme="false" item-class="text-weight-b" @click="clickNumo(2,'num')" :black="black_tmeme" :round="round" block :shadow="shadown" :theme="black_tmeme?'grey-darken-4':color" height="100">2</tm-button>
							</tm-col>
							<tm-col grid="3" padding="5" color="none">
								<tm-button :fontSize="42" :fllowTheme="false" item-class="text-weight-b" @click="clickNumo(3,'num')" :black="black_tmeme" :round="round" block :shadow="shadown" :theme="black_tmeme?'grey-darken-4':color" height="100">3</tm-button>
							</tm-col>
							<tm-col grid="3" padding="5" color="none">
								<tm-button :fontSize="42" :iconSize="42" :fllowTheme="false" item-class="text-weight-b" @click="clickNumo(null,'del')" icon="icon-caret-left" :black="black_tmeme" :round="round" block :shadow="shadown" :theme="black_tmeme?'grey-darken-4':color" :font-color="black?'grey':'black'" height="100"></tm-button>
							</tm-col>
						</tm-row>
						<tm-row align="flex-start">
							<tm-col grid="9"  color="none" custom-class="px-5">
								<tm-row>
									<tm-col grid="4" padding="5" color="none"><tm-button :fontSize="42" :fllowTheme="false" item-class="text-weight-b" @click="clickNumo(4,'num')" :black="black_tmeme" :round="round" block :shadow="shadown" :theme="black_tmeme?'grey-darken-4':color" height="100">4</tm-button></tm-col>
									<tm-col grid="4" padding="5" color="none"><tm-button :fontSize="42" :fllowTheme="false" item-class="text-weight-b" @click="clickNumo(5,'num')" :black="black_tmeme" :round="round" block :shadow="shadown" :theme="black_tmeme?'grey-darken-4':color" height="100">5</tm-button></tm-col>
									<tm-col grid="4" padding="5" color="none"><tm-button :fontSize="42"  :fllowTheme="false" item-class="text-weight-b" @click="clickNumo(6,'num')" :black="black_tmeme" :round="round" block :shadow="shadown" :theme="black_tmeme?'grey-darken-4':color" height="100">6</tm-button></tm-col>
								</tm-row>
								<tm-row>
									<tm-col grid="4" padding="5" color="none"><tm-button :fontSize="42" :fllowTheme="false" item-class="text-weight-b" @click="clickNumo(7,'num')" :black="black_tmeme" :round="round" block :shadow="shadown" :theme="black_tmeme?'grey-darken-4':color" height="100">7</tm-button></tm-col>
									<tm-col grid="4" padding="5" color="none"><tm-button :fontSize="42" :fllowTheme="false" item-class="text-weight-b" @click="clickNumo(8,'num')" :black="black_tmeme" :round="round" block :shadow="shadown" :theme="black_tmeme?'grey-darken-4':color" height="100">8</tm-button></tm-col>
									<tm-col grid="4" padding="5" color="none"><tm-button :fontSize="42" :fllowTheme="false" item-class="text-weight-b" @click="clickNumo(9,'num')" :black="black_tmeme" :round="round" block :shadow="shadown" :theme="black_tmeme?'grey-darken-4':color" height="100">9</tm-button></tm-col>
								</tm-row>
								<tm-row v-if="model_code=='number'">
									<tm-col :grid="decimal?4:8" padding="5" color="none"><tm-button :fontSize="42" :fllowTheme="false" item-class="text-weight-b" @click="clickNumo(0,'num')" :black="black_tmeme" :round="round" block :shadow="shadown" :theme="black_tmeme?'grey-darken-4':color" height="100">0</tm-button></tm-col>
									<tm-col v-if="decimal" grid="4" padding="5" color="none"><tm-button :fontSize="42" :fllowTheme="false" item-class="text-weight-b" @click="clickNumo('.','dian')" :black="black_tmeme" :round="round" block :shadow="shadown" :theme="black_tmeme?'grey-darken-4':color" height="100">.</tm-button></tm-col>
									<tm-col  grid="4" padding="5" color="none"><tm-button :fontSize="42" :fllowTheme="false" item-class="text-weight-b" @click="clickNumo(null,'cancel')" :black="black_tmeme" :round="round" block :shadow="shadown" :theme="black_tmeme?'grey-darken-4':color" height="100">??????</tm-button></tm-col>
								</tm-row>
								<tm-row v-if="model_code=='code'">
									<tm-col grid="4" padding="5" color="none"><tm-button :fontSize="42" :fllowTheme="false" item-class="text-weight-b" @click="clickNumo(0,'num')" :black="black_tmeme" :round="round" block :shadow="shadown" :theme="black_tmeme?'grey-darken-4':color" height="100">0</tm-button></tm-col>
									<tm-col grid="4" padding="5" color="none"><tm-button :fontSize="42" :fllowTheme="false" item-class="text-weight-b" @click="clickNumo('x','code-x')" :black="black_tmeme" :round="round" block :shadow="shadown" :theme="black_tmeme?'grey-darken-4':color" height="100">X</tm-button></tm-col>
									<tm-col grid="4" padding="5" color="none"><tm-button :fontSize="42" :fllowTheme="false" item-class="text-weight-b" @click="clickNumo(null,'cancel')" :black="black_tmeme" :round="round" block :shadow="shadown" :theme="black_tmeme?'grey-darken-4':color" height="100">??????</tm-button></tm-col>
									
								</tm-row>
							</tm-col>
							<tm-col grid="3"  color="none" custom-class="mt-5 mr-5">
								<tm-button :fontSize="42"  item-class="text-weight-b" :round="round"  label="??????" :theme="okColor" @click.stop="clickNumo(null,'confirm')" block :shadow="shadown"  height="312"></tm-button>
							</tm-col>
						</tm-row>
					</view>
					
				</view>
				
				<view v-if="model_code=='car'" class="tm-keyborad-html">
					<view class=" py-10" :class="[black_tmeme?'grey-darken-5':'grey-lighten-5']">
						<view class="text-size-xs text-align-center pb-20 pt-10  text-weight-b">
							<slot>
								<text>{{title}}</text>
							</slot>
						</view>
						<tm-row  custom-class="px-5">
							<tm-col  grid="10" color="none">
								<tm-row >
									<block v-for="(item,index) in chepai[enIndex]" :key="index">
										
										<tm-col width="12.5%" padding="5" color="none">
											<tm-button :fontSize="32" :iconSize="32" :fllowTheme="false" item-class="text-weight-b"  
											@click="clickNumo(item,'car')" 
											:black="black_tmeme" :round="round"  
											block :shadow="shadown" 
											:theme="black_tmeme?'grey-darken-4':color"
											height="80">
												{{item}}
											</tm-button>
										</tm-col>
									</block>
									
								</tm-row>
							</tm-col>
							<tm-col grid="2" color="none">
								<tm-row>
									<tm-col grid="12" padding="5" color="none">
										<tm-button :fontSize="32" :iconSize="32" :fllowTheme="false" item-class="text-weight-b"  
										@click="clickNumo(null,'del')" icon="icon-caret-left"
										:black="black_tmeme" :round="round"  
										block shadow="0" 
										theme="red"  
										font-color="red"
										text
										height="80">
										</tm-button>
									</tm-col>
									<tm-col grid="12" padding="5" color="none">
										<tm-button item-class="text-weight-b"  
										@click="clickNumo(null,'cancel')" 
										:black="black_tmeme" :round="round"  
										block shadow="0" 
										:theme="okColor"
										:fontSize="32" :iconSize="32"
										text
										height="80">
											??????
										</tm-button>
									</tm-col>
									<tm-col grid="12" padding="5" color="none">
										<tm-button  item-class="text-weight-b"  
										@click="clickNumo(null,'car-zh')" 
										:black="black_tmeme" :round="round"  
										block :shadow="0" 
										:theme="okColor" 
										text
										:fontSize="32" :iconSize="32"
										height="80">
											???/???
										</tm-button>
									</tm-col>
									<tm-col grid="12" padding="5" color="none">
										<tm-button item-class="text-weight-b"  
										@click="clickNumo(null,'confirm')" 
										:round="round"  
										block :shadow="shadown" 
										:theme="okColor" 
										:fontSize="32" :iconSize="32"
										height="133">
											??????
										</tm-button>
									</tm-col>
								</tm-row>
							</tm-col>
						</tm-row>
					</view>
				</view>
				<view v-if="model_code=='password'" class="tm-keyborad-html">
					<view class=" py-10" :class="[black_tmeme?'grey-darken-5':'grey-lighten-5']">
						<view class="text-size-xs text-align-center pb-20 pt-10  text-weight-b">
							<slot>
								<text>{{title}}</text>
							</slot>
						</view>
						<tm-row  custom-class="px-5">
							<tm-col  grid="10" color="none">
								<tm-row >
									<block v-for="(item,index) in password[enIndex]" :key="index">
										
										<tm-col width="12.5%" padding="5" color="none">
											<tm-button :fllowTheme="false" item-class="text-weight-b"  
											@click="clickNumo(item,'password')" 
											:black="black_tmeme" :round="round"  
											block :shadow="shadown" 
											:fontSize="32" :iconSize="32"
											:theme="black_tmeme?'grey-darken-4':color"
											height="80">
												{{item}}
											</tm-button>
										</tm-col>
									</block>
									
								</tm-row>
							</tm-col>
							<tm-col grid="2" color="none">
								<tm-row>
									<tm-col grid="12" padding="5" color="none">
										<tm-button :fllowTheme="false" item-class="text-weight-b"  
										@click.stop="clickNumo(null,'del')" icon="icon-caret-left"
										:black="black_tmeme" :round="round"  
										block shadow="0" 
										theme="red" 
										font-color="red"
										text
										:fontSize="32" :iconSize="32"
										height="80">
										</tm-button>
									</tm-col>
									<tm-col grid="12" padding="5" color="none">
										<tm-button  item-class="text-weight-b"  
										@click.stop="clickNumo(null,'cancel')" 
										:black="black_tmeme" :round="round"  
										block shadow="0" 
										:theme="okColor"
										:fontSize="32" :iconSize="32"
										text
										height="80">
											??????
										</tm-button>
									</tm-col>
									<tm-col grid="12" padding="5" color="none">
										<tm-button  item-class="text-weight-b"  
										@click.stop="clickNumo(null,'password-fh')" 
										:black="black_tmeme" :round="round"  
										block :shadow="0" 
										:theme="okColor" 
										text
										:fontSize="32" :iconSize="32"
										height="80">
											???/???
										</tm-button>
									</tm-col>
									<tm-col grid="12" padding="5" color="none">
										<tm-button item-class="text-weight-b"  
										@click.stop="clickNumo(null,'confirm')" 
										:round="round"  
										block :shadow="shadown" 
										:theme="okColor" 
										:fontSize="32" :iconSize="32"
										height="133">
											??????
										</tm-button>
									</tm-col>
								</tm-row>
							</tm-col>
						</tm-row>
					</view>
				</view>
				<!-- #ifdef H5 -->
				<view style="height: var(--window-bottom);"></view>
				<!-- #endif -->
			</view>
		</tm-poup>
	</view>
</template>

<script>
	/**
	 * ????????????
	 * @description ?????????????????????????????????????????????????????????????????????????????????
	 * @property {String|Number} value = [] ?????????'',????????????v-model,????????????value.sync????????????.
	 * @property {Boolean} show = [] ?????????false,????????????????????????show.sync????????????
	 * @property {String} color = [] ?????????white,????????????????????????
	 * @property {String} title = [] ?????????'????????????????????????',???????????????????????????
	 * @property {String} ok-color = [] ?????????primary, ????????????????????????
	 * @property {Number} round = [] ?????????2,  ???????????????
	 * @property {Number} shadown = [] ?????????5,  ??????????????????
	 * @property {Boolean} black = [] ?????????false,  ???????????????
	 * @property {Boolean} decimal = [] ?????????true,  ????????????????????????
	 * @property {String} model = [number|code|car|password] ?????????'number',  ??????????????????????????????????????????????????????number|code|car|password
	 * @property {Function} confirm ????????????????????????????????????
	 * @example <tm-keyborad v-model="num" :show.sync="show"></tm-keyborad>
	 */
	import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue"
	import tmButton from "@/tm-vuetify/components/tm-button/tm-button.vue"
	import tmRow from "@/tm-vuetify/components/tm-row/tm-row.vue"
	import tmCol from "@/tm-vuetify/components/tm-col/tm-col.vue"
	import tmPoup from "@/tm-vuetify/components/tm-poup/tm-poup.vue"
	export default {
		components:{tmIcons,tmButton,tmRow,tmCol,tmPoup},
		name:"tm-keyborad",
		model:{
			prop:'value',
			event:'input'
		},
		props:{
			value:{
				type:String|Number,
				default:''
			},
			// ???????????????????????????
			title:{
				type:String,
				default:'????????????????????????'
			},
			show:{
				type:Boolean,
				default:false
			},
			// ????????????????????????
			color:{
				type:String,
				default:'white'
			},
			// ????????????????????????
			okColor:{
				type:String,
				default:'primary'
			},
			// ???????????????
			round:{
				type:Number,
				default:3
			},
			// ????????????
			shadown:{
				type:Number,
				default:5
			},
		
			black:{
				type:Boolean,
				default:null
			},
			// ????????????????????????
			decimal:{
				type:Boolean,
				default:true
			},
			// ??????????????????????????????????????????????????????
			model:{
				type:String,
				default:'number' //number|code|car|password
			},
			
		},
		computed:{
			black_tmeme: function() {
				if (this.black !== null) return this.black;
				return this.$tm.vx.state().tmVuetify.black;
			},
			model_code:function(){
				return this.model;
			}
		},
		watch:{
			show:function(val){
				this.showOpen = val;
				
			}
		},
		created() {
			this.showOpen = this.show
		},
		mounted() {

		},
		data() {
			return {
				showOpen:false,
				enIndex:0,
				chepai:[
					[
						'???','???','???','???','???','???','???','???','???','???','???','???','???',
						'???','???','???','???','???','???','???','???','???','???','???','???','???',
						'???','???','???','???','???','???','???','???','???','???','???'
					],
					[
					'1','2','A','B','C','D','E','F',
					'3','4','G','H','I','J','K','L',
					'5','6','M','N','O','P','Q','R',
					'7','8','S','T','U','V','W','X',
					'9','0','Y','Z'
					]
					
				],
				password:[
					[
					'1','2','A','B','C','D','E','F',
					'3','4','G','H','I','J','K','L',
					'5','6','M','N','O','P','Q','R',
					'7','8','S','T','U','V','W','X',
					'9','0','Y','Z'
					],
					[
						'\"',"\'",'.','/',"\\",']','[','!','?','_','<','>','%',';',')','(','&','+','=','~','*','#','@'
					]
				],
			};
		},

		methods: {
			clickNumo(val,type){
				let oval = this.value;
				if(type=='del'){
					oval = oval.length<=0?'':oval.substring(0,oval.length-1)
				}else if(type=='num' || type=='code-x'|| type=='car' || type == 'password'){
					oval= oval +'' + val;
				}else if(type=='dian'){
					if(oval.indexOf('.')>-1 || !oval || oval.length==0){
						return;
					}
					oval= oval +'' + val;
				}else if(type=='car-zh'||type=='password-fh'){
					this.enIndex= this.enIndex?0:1
				}
				if(type == 'confirm' || type=='cancel'){
					if(this.model_code=='number'){
						if(oval.substring(oval.length-1)=='.'){
							oval = oval.substring(0,oval.length-1);
						}
					}
					this.$emit('update:show',false);
					if(type=='confirm'){
						this.$emit('input',oval.toUpperCase())
						this.$emit('update:value',oval.toUpperCase())
						this.$emit('confirm',this.value);
					}
					
					return;
				}
				this.$emit('input',oval.toUpperCase())
				this.$emit('update:value',oval.toUpperCase())
				// #ifdef MP || APP
				uni.vibrateShort({})
				// #endif
			},
			
		},
	}
</script>

<style lang="scss" scoped>

</style>
