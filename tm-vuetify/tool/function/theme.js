const theme = {
	getTheme(){
		return {
			color:uni.$tm.vx.state().tmVuetify.color,
			black:uni.$tm.vx.state().tmVuetify.black
		}
	},
	setBlack(arg){
		let p = arg;
		if(typeof arg !=='undefined'){
			uni.$tm.vx.commit("setTmVuetifyBlack",arg)
		}else{
			p = !uni.$tm.vx.state().tmVuetify.black;
			uni.$tm.vx.commit("setTmVuetifyBlack",!uni.$tm.vx.state().tmVuetify.black)
			
		}
		uni.setStorageSync('setTmVuetifyBlack',p)

	},
	setTheme(arg){
		let p = arg||"primary";
		uni.$tm.vx.commit("setTmVuetifyColor",p)
		uni.setStorageSync('setTmVuetifyColor',p)
	},
	clear(){
		uni.$tm.vx.commit("setTmVuetifyColor",'')
		uni.removeStorageSync('setTmVuetifyColor')
	}
}

export default theme;

