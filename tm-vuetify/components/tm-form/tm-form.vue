<template>
	<view class="tm-form fulled">
		<slot></slot>
	</view>
</template>

<script>
	/**
	 * 表单组件
	 * @property {String} url = [] 提交时的网址。
	 * @property {String} method = [POST | GET] 提交时的的方法
	 * @property {Object} header = [] 提交时的头部对象数据
	 * @property {Function} submit 验证成功会返回数据集合，验证失败返回false,点击提交按钮时触发。表单内部一定放一个tm-button，注意navtie-type="form"表单专用属性,<tm-button navtie-type="form">提交/tm-button>
	 * @property {Function} request 请求成功触发的事件，返回请求的数据。
	 * 
	 */
	export default {
		name:"tm-form",
		props:{
			//提交时的网址。如果填写提交时，不会请求数据。
			url:{
				type:String,
				default:''
			},
			//请求方法
			method:{
				type:String,
				default:'POST' //POST | GET
			},
			//头部数据
			header:{
				type:Object,
				default:()=>{
					return {};
				}
			}
		},
		data() {
			return {
				
			};
		},
		mounted() {
			this.$nextTick(async function(){
				//#ifdef APP-VUE || APP-PLUS
				
				await uni.$tm.sleep(50);
				
				//#endif
				this.init()
			})
		},
		methods: {
			findeChildren(cl){
				let t = this;
				let mubiao = ['tm-input','tm-button','tm-groupradio','tm-groupcheckbox','tm-upload','tm-rate','tm-slider','tm-stepper','tm-switch']
				let jg = [];
				
				function start(item){
					let tag = item.$options?.name;
					
					let index = mubiao.findIndex(citem=>{
						return tag == citem;
					})
					if(index>-1){
						
						if(tag=='tm-button'&&item.$props.navtieType=='form'){
							
							item.onclick = function(){
								
								t.$nextTick(function(){
									t.formSub(jg);
								})
							}
							
						}else{
							if(tag!='tm-button'&&item.$props.name!=''){
								jg.push(item)
							}
						}
					}else{
						if(Array.isArray(item.$children)){
							item.$children.forEach(zcl=>{
								start(zcl)
							})
						}
					}
					
				}
				start(cl);
				
			},
			init() {
				let cl = this;
				//#ifdef H5 || APP-VUE || APP-PLUS
				cl = this.$children[0];
				//#endif
				
				this.$nextTick(function(){
					this.findeChildren(cl);
				})
			},
			async formSub(cl){
				
				let bdData={};
				let verify=true;
				for(let i=0;i<cl.length;i++){
					let item = cl[i];
					let tagname = item.$options?.name;
					if(tagname=='tm-upload'){
						bdData[item.$props.name] = item.getFile();
					}else if(tagname=='tm-input'){
						if(item.$props.required){
							
							if(!item.verifyInput()){
								verify=false;
								break;
								return;
							}
						}
						bdData[item.$props.name] = item.$props.value;
					}else if(tagname=='tm-groupradio' || tagname== 'tm-groupcheckbox'){
						
						bdData[item.$props.name] = item.getVal();
					}else if(tagname=='tm-slider' || tagname=='tm-stepper' ||  tagname=='tm-rate' ||  tagname=='tm-switch'){
						
						bdData[item.$props.name] = item.$props.value;
					}
				}
				
				if(verify===true){
					this.$emit('submit',bdData)
					if(this.url!==""){
						let rulst = null;
						if(this.method.toLocaleLowerCase()=='get'){
							rulst = await uni.$tm.request.get(this.url,bdData,this.header)
						}else if(this.method.toLocaleLowerCase()=='post'){
							rulst = await uni.$tm.request.post(this.url,bdData,this.header)
						}
						this.$emit('request',rulst)
					}
				}else{
					this.$emit('submit',false)
				}
			},
			findeChildren_off(cl){
				let t = this;
				let mubiao = ['tm-input','tm-button','tm-groupradio','tm-groupcheckbox','tm-upload','tm-rate','tm-slider','tm-stepper','tm-switch']
				let jg = [];
				
				function start(item){
					let tag = item.$options?.name;
					
					let index = mubiao.findIndex(citem=>{
						return tag == citem;
					})
					if(index>-1){
						
						if(tag=='tm-button'&&item.$props.navtieType=='form'){
							
						}else{
							if(tag!='tm-button'&&item.$props.name!=''){
								jg.push(item)
							}
						}
					}else{
						if(Array.isArray(item.$children)){
							item.$children.forEach(zcl=>{
								start(zcl)
							})
						}
					}
					
				}
				start(cl);
				return jg;
				
			},
			//手动获取当前表单对象数据，Promise风格。
			getFormData(){
				let t = this;
				return new Promise((su,fl)=>{
					t.$nextTick(function(){
						let clPren = t.$children[0];
						//#ifdef H5
						clPren = t.$children[0].$children[0].$children[0];
						//#endif
						let cl = t.findeChildren_off(clPren);
						let bdData={};
						let verify=true;
						for(let i=0;i<cl.length;i++){
							let item = cl[i];
							let tagname = item.$options?.name;
							if(tagname=='tm-upload'){
								bdData[item.$props.name] = item.getFile();
							}else if(tagname=='tm-input'){
								bdData[item.$props.name] = item.$props.value;
							}else if(tagname=='tm-groupradio' || tagname== 'tm-groupcheckbox'){
								
								bdData[item.$props.name] = item.getVal();
							}else if(tagname=='tm-slider' || tagname=='tm-stepper' ||  tagname=='tm-rate' ||  tagname=='tm-switch'){
								
								bdData[item.$props.name] = item.$props.value;
							}
						}
						su(bdData);
					})
				})
				
			}
		},
	}
</script>

<style lang="scss">

</style>
