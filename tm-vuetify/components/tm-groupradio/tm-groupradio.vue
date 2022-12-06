<template>
	<view class="tm-groupradio" :class="[customClass]">
		<slot></slot>
	</view>
</template>

<script>
	/**
	 * 单选框组
	 * @description 此组件必须，配合tm-radio组件使用，不可单独使用。
	 * @property {Function} change 任何一个tm-radio改变将会触发此事件，并携带选中的数组数据。
	 * @property {String} name = [] 默认：''，提交表单时的的字段名称标识
	 * @property {String} customClass = [] 默认：''，自定义class
	 */
	export default {
		name:'tm-groupradio',
		props:{
			//提交表单时的的字段名称
			name:{
				type:String,
				default:''
			},
			customClass:{
				type:String,
				default:''
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			change(e) {
				this.$emit('change',e)
			},
			// 获取选中的结果。
			getVal(){
				let box = [];
				function findchild(p,index){
					let preat = p;
					if(preat.$options?.name==='tm-radio'){
						
						if(preat.value){
							box.push({index:index,value:preat.value,checked:preat.value})
						}
					}else{
						if(preat.$children.length>0){
							preat.$children.forEach(item=>{
								findchild(item,index++);
							})
						}
					}
				};
				findchild(this,0);
				return box;
			},
			// 清除选中。
			clear(){
				console.log(9)
				function findchild(p,index){
					let preat = p;
					if(preat.$options?.name==='tm-radio'){
						if(preat.value===true){
							preat.changValue = false;
						}
						
					}else{
						if(preat.$children.length>0){
							preat.$children.forEach(item=>{
								findchild(item,index++);
							})
						}
					}
				};
				findchild(this,0);
			},
		},
	}
</script>

<style lang="scss">

</style>
