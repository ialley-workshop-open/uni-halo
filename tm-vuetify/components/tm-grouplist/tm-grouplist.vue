<template>
	<view>
		
		<view class="tm-grouplist  overflow  " 
		:class="['ma-' + margin, ' round-' + round, 'shadow-' + shadow, black_tmeme ? 'bk' : '']">
			<view v-if="title&&title!='true'" class="px-32 py-16  text-weight-b " :class="[`text-size-${fontSize}`,titleTheme, black_tmeme ? 'bk' : '']">
				<slot name="title" :title="title">{{ title }}</slot>
			</view>
			<view  >
				<slot></slot>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 列表组
	 * @description (可嵌套使用)需要配合tm-listitem使用
	 * @property {Boolean} black = [true|false] 默认：null，暗黑模式 
	 * @property {Number} margin = [] 默认：32，单位upx,外间距。
	 * @property {Number} shadow = [] 默认：10，单位upx,投影
	 * @property {Number} round = [] 默认：4，单位upx, 外部圆角
	 * @property {String} title = [] 默认：''，标题。
	 * @property {String} font-size = [xxs|xs|s|n|g|lg|xl] 默认：'n'，标题大小，注意是css库中的xxs,xs,s,n,g,lg,xl
	 * @property {Boolean} border-bottom = [] 默认：true ,是否显示底边线。
	 * @property {String} title-theme = [] 默认：primary，标题的主题色彩名。
	 * @property {Function} change 点击了列表那一个元素。并返回Index
	 * @example <tm-grouplist title="配置">
			<tm-listitem  title="应用栏"  v-for="(item,index) in 4" :key="index"></tm-listitem>
		</tm-grouplist>
	 */
export default {
	name: 'tm-grouplist',
	props: {
		black: {
			type: String | Boolean,
			default: null
		},
		borderBottom: {
			type: String | Boolean,
			default: true
		},
		// 单位upx
		margin: {
			type: String | Number,
			default: 32
		},
		// 外部圆角
		round: {
			type: String | Number,
			default: 3
		},
		// 投影
		shadow: {
			type: String | Number,
			default: 4
		},
		// 组标题。
		title: {
			type: String,
			default: ''
		},
		// 标题的主题色彩名。
		titleTheme: {
			type: String,
			default: 'primary'
		},
		fontSize:{
			type:String,
			default:'n'
		}
	},
	computed:{
		black_tmeme:function(){
			if(this.black!==null) return this.black;
			return this.$tm.vx.state().tmVuetify.black;
		}
	},
	provide(){
		let t = this;
		return {
			GroupListStyles:()=>{
				return {
					margin: [0,0],
					padding: [32,24],
					shadow: 0,
					round: 0,
					borderBottom: true
				}
			}
		}
	},
	data() {
		return {
			targ:'tm-grouplist',
			chuliWsok:false,//处理完宽度计算信息再进行显示内部内容。
		};
	},
	created() {
		// #ifdef H5
			this.chuliWsok = true;
		// #endif
	},
	mounted() {
		this.inits();
	},
	watch:{
		
	},
	updated(){
		this.inits();
	},
	methods: {
		inits(){
			
		},
		// 事件一定是子项目tm-listitem为group模式时，才会触发。
		change(vue_uid) {
			// 具体点了哪一个项目，并展开了。
			let t = this;
			let ch = this.$children;
			// #ifdef H5
				ch = this.$children[0].$children[0].$children;
				ch = ch[1].$children;
			// #endif
			// 在H5下无法找到$children。因此始终是-1
			let index = ch.findIndex(item => {
				return vue_uid == item._uid;
			});
			this.$emit('change', index);
		}
	}
};
</script>

<style lang="scss" >
	

</style>
