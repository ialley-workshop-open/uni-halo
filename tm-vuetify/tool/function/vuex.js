/*
 * 操作全局Vuex。
 * 作者：tmzdy
 * 时间：‎2021‎年‎10‎月‎14‎日
 * 联系：zhongjihan@sina.com
 * 
 */

class vuex {
	constructor(store) {
	    this.store = store;
	}
	//链式调用
	state(){
		return this.store.state;
	}
	//链式调用
	getters(){
		let t = this;
		const g = this.store.getters
		let keys = Object.keys(g);
		console.log(keys)
		let k = keys.map((el,index)=>{
			let f = el.split('/');
			let tst = {}
			if(f.length==1){
				tst[el]=g[el]
			}else{
				tst[f[1]]=g[el]
				// tst[f[0]+'_'+f[1]]=g[el]
				// tst[f[0]][f[1]] = g[el]
				
			}
			return tst
		})
		let rulst = {};
		k.forEach(el=>{
			rulst = {...rulst,...el}
		})
		return rulst;
	}
	commit(funName,arg){
		try{
			this.store.commit(funName,arg);
		}catch(e){
			console.error("未发现函数方法:"+funName)
		}
	}
	actions(funName,arg){
		try{
			return this.store.dispatch(funName,arg);
		}catch(e){
			console.error("未发现函数方法:"+funName)
		}
	}
	//获得原始vuex对象。
	getVuex(){
		return this.store;
	}
}


export default vuex;