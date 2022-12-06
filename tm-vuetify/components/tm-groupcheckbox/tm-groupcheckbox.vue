<template>
	<view class="tm-groupcheckbox " :class="[customClass]">
		<slot></slot>
	</view>
</template>

<script>
	/**
	 * 复选框组
	 * @description 此组件必须，配合tm-checkbox组件使用，不可单独使用。
	 * @property {Number} max = [999] 最大选择数量
	 * @property {String} name = [] 默认：''，提交表单时的的字段名称标识
	* @property {String} customClass = [] 默认：''，自定义class
	 * @property {Function} change 任何一个checkekBox改变将会触发此事件，并携带选中的数组数据。
	 * @property {Function} error 如果超过最大选择数量将会触发此事件。
	 * @example <tm-groupcheckbox><tm-checkbox  v-model="checked" label="苹果"></tm-checkbox></tm-groupcheckbox>
	 * 
	 */
	export default {
		name:'tm-groupcheckbox',
		props:{
			// 最大选择数量
			max:{
				type:Number,
				default:9999
			},
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
		mounted() {
			this.$nextTick(function(){
				
				this.$emit('change',this.getVal())
			})
		},
		methods: {
			change(e) {
				
				this.$emit('change',e)
			},
	
			// 获取选中的结果 。
			getVal(){
				let box = [];
				function findchild(p,index){
					let preat = p;
					if(preat.$options?.name==='tm-checkbox'){
						
						if(preat.changValue){
							box.push({index:index,value:preat.name,checked:preat.changValue})
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
			// 反选。如果一个都没选择。反选就相当于全选。如果是全选，则结果是全部不选。
			// 执行完毕后。不能立即使用getVal获取结果需要this.$nextTick
			reverseVal(){
				function findchild(p,index){
					let preat = p;
					if(preat.$options?.name==='tm-checkbox'){
						
						preat.changValue = !preat.changValue;
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
			// 清除选中。
			clear(){
				function findchild(p,index){
					let preat = p;
					if(preat.$options?.name==='tm-checkbox'){
						
						preat.changValue = false;
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
			// 只有当超过最选选项时才会发出错误。
			error(){
				uni.showToast({
					title:"超过选择限制",icon:'none'
				})
				this.$emit('error',"超过选择限制")
			}
		},
	}
</script>

<style lang="scss">

</style>
