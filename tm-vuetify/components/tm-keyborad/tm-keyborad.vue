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
									<tm-col  grid="4" padding="5" color="none"><tm-button :fontSize="42" :fllowTheme="false" item-class="text-weight-b" @click="clickNumo(null,'cancel')" :black="black_tmeme" :round="round" block :shadow="shadown" :theme="black_tmeme?'grey-darken-4':color" height="100">关闭</tm-button></tm-col>
								</tm-row>
								<tm-row v-if="model_code=='code'">
									<tm-col grid="4" padding="5" color="none"><tm-button :fontSize="42" :fllowTheme="false" item-class="text-weight-b" @click="clickNumo(0,'num')" :black="black_tmeme" :round="round" block :shadow="shadown" :theme="black_tmeme?'grey-darken-4':color" height="100">0</tm-button></tm-col>
									<tm-col grid="4" padding="5" color="none"><tm-button :fontSize="42" :fllowTheme="false" item-class="text-weight-b" @click="clickNumo('x','code-x')" :black="black_tmeme" :round="round" block :shadow="shadown" :theme="black_tmeme?'grey-darken-4':color" height="100">X</tm-button></tm-col>
									<tm-col grid="4" padding="5" color="none"><tm-button :fontSize="42" :fllowTheme="false" item-class="text-weight-b" @click="clickNumo(null,'cancel')" :black="black_tmeme" :round="round" block :shadow="shadown" :theme="black_tmeme?'grey-darken-4':color" height="100">关闭</tm-button></tm-col>
									
								</tm-row>
							</tm-col>
							<tm-col grid="3"  color="none" custom-class="mt-5 mr-5">
								<tm-button :fontSize="42"  item-class="text-weight-b" :round="round"  label="确认" :theme="okColor" @click.stop="clickNumo(null,'confirm')" block :shadow="shadown"  height="312"></tm-button>
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
											关闭
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
											中/英
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
											确认
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
											关闭
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
											英/符
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
											确认
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
	 * 输入键盘
	 * @description 输入键盘分为：数字键盘，身份键盘，车牌键盘，密码键盘。
	 * @property {String|Number} value = [] 默认：'',推荐使用v-model,也可使用value.sync双向绑定.
	 * @property {Boolean} show = [] 默认：false,显示键盘，请使用show.sync双向绑定
	 * @property {String} color = [] 默认：white,通用按钮主题色。
	 * @property {String} title = [] 默认：'安全键盘放心输入',键盘顶部标题文字。
	 * @property {String} ok-color = [] 默认：primary, 确认按钮的主题色
	 * @property {Number} round = [] 默认：2,  按钮圆角。
	 * @property {Number} shadown = [] 默认：5,  按钮按钮投影
	 * @property {Boolean} black = [] 默认：false,  暗黑模式。
	 * @property {Boolean} decimal = [] 默认：true,  是否显示小数点。
	 * @property {String} model = [number|code|car|password] 默认：'number',  键盘类型数字键盘，身份证，车牌，密码number|code|car|password
	 * @property {Function} confirm 点击确认或者返回时触发。
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
			// 键盘顶部标题文字。
			title:{
				type:String,
				default:'安全键盘放心输入'
			},
			show:{
				type:Boolean,
				default:false
			},
			// 通用按钮主题色。
			color:{
				type:String,
				default:'white'
			},
			// 确认按钮的主题色
			okColor:{
				type:String,
				default:'primary'
			},
			// 按钮圆角。
			round:{
				type:Number,
				default:3
			},
			// 按钮投影
			shadown:{
				type:Number,
				default:5
			},
		
			black:{
				type:Boolean,
				default:null
			},
			// 是否显示小数点。
			decimal:{
				type:Boolean,
				default:true
			},
			// 键盘类型数字键盘，身份证，车牌，密码
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
						'京','沪','津','渝','鲁','冀','晋','蒙','辽','吉','黑','苏','浙',
						'皖','闽','赣','豫','湘','鄂','粤','桂','琼','川','贵','云','藏',
						'陕','甘','青','宁','新','港','澳','台','新','使','学'
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
