import sharebywx from "../function/wxshare.js"
module.exports = {
	...sharebywx.sharebywx,
	data() {
		return {
			tmVueTifly_pages: '',
		}
	},
	created() {
		this.setVueTiflyThemeBlack();
	},
	onShow() {
		let urls = getCurrentPages();
		if(urls.length>0){
			let url = urls[urls.length-1].$page.fullPath
			if(url[0]!='/') url = '/'+url;
			url = url.split('?')[0];
			uni.$tm.vx.commit('setPageNow', url)
		}
		this.setVueTiflyThemeBlack();
	},
	onLoad() {
		// this.$tm.vx.commit('setWxShare',{title:'hhhhh'})
	},
	
	methods: {
		setVueTiflyThemeBlack() {
			let vueTifly_black = this.$tm.vx.state().tmVuetify.black
			if (vueTifly_black === true) {
				uni.setTabBarStyle({
					backgroundColor: "#212121"
				})
			} else {
				uni.setTabBarStyle({
					backgroundColor: "#FFFFFF"
				})
			}
		},
		// ...mapMutations(['setTmVuetifyColor', 'setTmVuetifyBlack']),
		// 检测提供的字符串是否是颜色值还是颜色主题。true，表示颜色主题名称。否则为false.
		$TestColor(color) {
			if (typeof color !== 'string') return false;

			if (color.indexOf('rgb') > -1 || color.indexOf('rgba') > -1 || color.indexOf('#') > -1) {
				return {
					theme: false,
					color: color
				};
			} else {
				return {
					theme: true,
					color: color
				};
			}
		},
		// 检查给定的值。如果是带有vw,vh,rem,em,upx,rpx,%则返回.如果是px,或者45数字，则转换为upx单位的数值。
		$TestUnit(n) {
			if (typeof n !== 'string' && typeof n !== 'number') return 0;
			if (typeof n === 'number') return {
				type: 'number',
				value: uni.upx2px(n)
			};
			let reg = /(vw|vh|rem|em|\%|upx|rpx|auto|px)/g;

			if (reg.test(n)) {

				return {
					type: 'string',
					value: n
				};
			}
			let num = parseFloat(n);
			if (isNaN(n)) return 0;
			return {
				type: 'number',
				value: uni.upx2px(n)
			};

		},
		$Querey(clsaaName, t, ycnum = 50,isAll) {

			return new Promise((rs, rj) => {

				if(isAll==true){
					
					// #ifdef APP-VUE || APP-PLUS
					ycnum = 60
					uni.$tm.sleep(ycnum).then(r=>{
						uni.createSelectorQuery().in(t ? t : this).select(clsaaName)
							.boundingClientRect().exec(
								function(res) {
									rs(res)
								})
					})
					
					// #endif
					// #ifdef MP
					uni.$tm.sleep(ycnum).then(r=>{
						uni.createSelectorQuery().in(t ? t : this).selectAll(clsaaName)
							.boundingClientRect().exec(
								function(res) {
									rs(res)
								})
					})
					
					// #endif
					// #ifdef H5
					
						uni.createSelectorQuery().in(t ? t : this).selectAll(clsaaName)
							.boundingClientRect().exec(
								function(res) {
									rs(res)
								})
					
					// #endif
				}else{
					
					// #ifdef APP-VUE || APP-PLUS
					ycnum = 60
					uni.$tm.sleep(ycnum).then(r=>{
						uni.createSelectorQuery().in(t ? t : this).select(clsaaName)
							.boundingClientRect().exec(
								function(res) {
									rs(res)
								})
					})
					
					// #endif
					// #ifdef MP
					uni.$tm.sleep(ycnum).then(r=>{
						uni.createSelectorQuery().in(t ? t : this).select(clsaaName)
							.boundingClientRect().exec(
								function(res) {
									rs(res)
								})
					})
					
					// #endif
					// #ifdef H5
					
						uni.createSelectorQuery().in(t ? t : this).select(clsaaName)
							.boundingClientRect().exec(
								function(res) {
									rs(res)
								})
					
					// #endif
				}
				// console.log(ycnum);

			})
		}

	},
	onPageScroll(e) {
		/**
		 * 此全局注册用于在组件顶部，监听下拉状况以解决渐变透明的功能。
		 * 组件：tm-menubars能用到。
		 */
		uni.$emit('onPageScroll', e)
	},
	onReachBottom() {

	},
	beforeDestroy() {

	}
}
