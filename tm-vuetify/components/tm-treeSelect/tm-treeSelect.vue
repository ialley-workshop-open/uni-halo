<template>
	<view class="tm-treeSelect fulled-height">
		<view class="tm-treeSelect-slide ">
			<scroll-view scroll-y
			:style="{
				height:activeHeight+'px'
			}"
			>
				<tm-listitem :disabled="item['disabled']?true:false" 
				:black="black_tmeme" @click="activeIndex=index" 
				:disabled-color="bgColor"
				v-for="(item,index) in formaData" :key='index' 
				:color="activeIndex==index?(text?' text ' + color:'white'):bgColor" 
				:show-right-icon="false" 
				:margin="[0,0]"
				fontSize="26"
				:class-style="activeIndex==index?`border-${color_tmeme}-l-2`:'border-grey-lighten-5-l-2'"
				round="0" shadow="0"
				>
				<tm-badges color='red' :fllowTheme="false" :offset="[12,-10]" v-if="item.dot>0&&dot" :dot="false" :label="item.dot"></tm-badges>
				<view class="mr-10">
					<text  :class="[`text-${activeIndex==index?color_tmeme:fontColor}`,item['disabled']?'opacity-3':'']">{{item[rangKey]}}</text>
				</view>
				</tm-listitem>
			</scroll-view>
		</view>
		<view class="tm-treeSelect-slideitem" > 
			<scroll-view  scroll-y
			:style="{
				height:activeHeight+'px'
			}"
			>
				<tm-groupcheckbox  v-if="formaData[activeIndex]" :max="max" @change="changeOk">
					<block v-for="(item,index) in formaData[activeIndex].children" :key='index'>
						<tm-checkbox dense
						:disabled="item['disabled']||formaData[activeIndex]['disabled']?true:false" 
						:color="color_tmeme" round="2" @change="itemChange"  
						:name="item" 
						v-model="item.checked">
						<tm-listitem  fontSize="28" :black="black_tmeme" :padding="[24,24]" :margin="[0,0]" :border-bottom="true" round="0" shadow="0" 
						:title="item[rangKey]"  >
						<template #default>
							<text :class="[item.checked?'text-'+color_tmeme:'']">{{item[rangKey]}}</text>
						</template>
							<template v-slot:rightIcon>
								<view style="line-height: 0;vertical-align: middle;min-width: 40rpx;" class="fulled">
									<view v-if="item.checked" class="rounded flex-center" :class="[color_tmeme,`shadow-${color_tmeme}-4`]" style="width: 34rpx;height: 34rpx;">
										<text class="iconfont icon-check text-size-xs"></text>
									</view>
									<!-- <tm-icons dense v-if="item.checked" name="icon-check-circle"></tm-icons> -->
									<!-- <tm-button v-if="item.checked" icon="icon-check" fab size="xs"></tm-button> -->
								</view>
							</template>
						</tm-listitem>
						</tm-checkbox>
					</block>
					
				</tm-groupcheckbox>
			</scroll-view>
		</view>
		
	</view>
</template>

<script>
	/**
	 * 分类选择
	 * @property {Number|String} height = [] 默认0，单位upx,自动使用父组件的高度。
	 * @property {Array} default-selected = [] 默认[]，可以是id索引也可以是对象数组,可以混着来。[1]
	 * @property {Array} list = [] 默认[]，数据结构对象，必须需要含有唯一标识符id即可。[{title:'苏州',id:1}],每一个类目和子类可以含有disabled值，用来禁用类目或者选项。
	 * @property {String} rang-key = [] 默认'title'，数据结构对象中，需要展示标签的key
	 * @property {Number} max = [] 默认999，每一项目最大选择数量，1可以实现单选。
	 * @property {String} color = [] 默认 primary，主题色名
	 * @property {String} bg-color = [] 默认 grey-lighten-5，主题色名未选择时的背景色。
	 * @property {String} font-color = [] 默认 grey，未选中时的文字颜色
	 * @property {Boolean} text = [] 默认 false，使用主题文本色为高亮色。
	 * @property {Boolean} black = [] 默认 false，是否暗黑模式。
	 * @property {Boolean} dot = [] 默认 false，是否显示角标数字,当前选中的数量。
	 * @property {Function} children-change 选中单个选项时触发。返回选中的数据。
	 * @property {Function} change 每次选择变化都会触发全局change,返回当前类目和所有类目选中的数据。
	 * @example <tm-treeSelect  color="green" ></tm-treeSelect>
	 */
	import tmListitem from "@/tm-vuetify/components/tm-listitem/tm-listitem.vue"
	import tmGrouplist from "@/tm-vuetify/components/tm-grouplist/tm-grouplist.vue"
	import tmBadges from "@/tm-vuetify/components/tm-badges/tm-badges.vue"
	import tmGroupcheckbox from "@/tm-vuetify/components/tm-groupcheckbox/tm-groupcheckbox.vue"
	import tmCheckbox from "@/tm-vuetify/components/tm-checkbox/tm-checkbox.vue"
	export default {
		components:{tmListitem,tmGrouplist,tmBadges,tmGroupcheckbox,tmCheckbox},
		name:"tm-treeSelect",
		props:{
			// 高度，默认为0时，自动使用父组件的高度.
			height: {
				type: String | Number,
				default: 0
			},
			// 可以是id索引也可以是对象数组,可以混着来。
			defaultSelected:{
				type:Array,
				default:()=>{
					return []
				}
			},
			// 对象数组
			list:{
				type:Array,
				default:()=>{
					return [];
				}
			},
			// 显示标签的key.
			rangKey:{
				type:String,
				default:'title'
			},
			// 每一项目最大选择数量，1可以实现单选。
			max:{
				type:Number,
				default:999
			},
			// 主题色名
			color:{
				type:String,
				default:'primary'
			},
			// 未选择时的背景色。
			bgColor:{
				type:String,
				default:'grey-lighten-5'
			},
			//未选择时的文字色。
			fontColor:{
				type:String,
				default:'grey-darken-1'
			},
			// 使用主题文本色为高亮色。
			text:{
				type:Boolean,
				default:false
			},
			black:{
				type:Boolean,
				default:null
			},
			// 是否显示角标数字当前选中的数量。
			dot:{
				type:Boolean,
				default:false
			},
			// 跟随主题色的改变而改变。
			fllowTheme:{
				type:Boolean|String,
				default:true
			}
		},
		data() {
			return {
				activeHeight: 0,
				activeIndex:0,
				formaData:[]
			};
		},
		watch:{
			list:{
				deep:true,
				handler:function(){
					this.formaData = [...this.dataList];
				}
			},
			defaultSelected:{
				deep:true,
				handler:function(){
					this.clear()
					this.formaData = [...this.clear()]
					this.formaData = [...this.dataList];
				}
			}
		},
		computed:{
			black_tmeme: function() {
				if (this.black !== null) return this.black;
				return this.$tm.vx.state().tmVuetify.black;
			},
			color_tmeme:function(){
				if(this.$tm.vx.state().tmVuetify.color!==null&&this.$tm.vx.state().tmVuetify.color && this.fllowTheme){
					return this.$tm.vx.state().tmVuetify.color;
				}
				return this.color;
			},
			dataList(){
				let t = this;
				let p = this.$tm.deepClone(this.list)
				for(let j=0;j<p.length;j++){
					p[j]['dot'] = 0;
					if(p[j].children){
						let ic = p[j].children;
						for(let k=0;k<ic.length;k++){
							if(!ic[k].hasOwnProperty('checked')){
								ic[k]['checked'] = false;
							}
							
							for(let i=0 ;i < t.defaultSelected.length;i++){
									let lsitem = t.defaultSelected[i];
									if(typeof lsitem === 'object'){
										if(lsitem['id'] == ic[k]['id']){
											ic[k]['checked'] = true;
										}
									}else{
										if(lsitem == ic[k]['id']){
											ic[k]['checked'] = true;
											
										}
									}
				
								}
							if(ic[k]['checked']===true){
								p[j]['dot'] +=1
							}
						}
					}
				}
				return p;
			},
		},
		mounted() {
			
			let t = this;
			this.$nextTick(async function() {
				this.activeHeight = uni.upx2px(this.height);
				if (!this.activeHeight) {
					let wsz = await this.$Querey(".tm-treeSelect",this).catch(e=>{})
					this.activeHeight = wsz[0].height||250;
				}
				this.formaData = [...this.dataList];
			});
		},
		methods: {
			clear(){
				let t = this;
				let p = this.$tm.deepClone(this.list)
				for(let j=0;j<p.length;j++){
					p[j]['dot'] = 0;
					if(p[j].children){
						let ic = p[j].children;
						for(let k=0;k<ic.length;k++){
							if(!ic[k].hasOwnProperty('checked')){
								ic[k]['checked'] = false;
							}else{
								ic[k]['checked'] = false;
							}
						}
					}
				}
				return p;
			},
			// 所有选项。
			changeOk(e) {
				
				let p = [];
				function ts(obj){
					if(Array.isArray(obj)){
						obj.forEach(item=>{
							if(item.children){
								ts(item.children);
							}else{
								if(item.checked===true){
									p.push(item)
								}
							}
							
						})
					}
					
					
				}
				
				ts(this.dataList);
				this.$emit('change',{
					all:p,//所有选择项
					index:this.activeIndex,//当前数目索引
					children:e//当前类目的选中的选择项
				});
				if(this.formaData.length>0){
					this.$set(this.formaData[this.activeIndex],'dot',e.length)
				}
				
			},
			// 单个数组点击切换产生的选项。
			itemChange(e){
				let t = this;
				//返回的格式： {"index":4,"checked":true,"value":推荐的数据}
				this.$emit('children-change',e)
				
			}
		},
	}
</script>

<style lang="scss" scoped>
.tm-treeSelect{
	height: 100%;
	display: flex;
	justify-content: flex-start;
	.tm-treeSelect-slide{
		width: 190upx;
	}
	.tm-treeSelect-slideitem{
		width: calc(100% - 190upx);
	}
}
</style>
