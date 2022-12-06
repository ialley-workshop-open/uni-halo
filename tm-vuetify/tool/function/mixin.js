export function setVueTiflyThemeBlack() {
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
}
// ...mapMutations(['setTmVuetifyColor', 'setTmVuetifyBlack']),
// 检测提供的字符串是否是颜色值还是颜色主题。true，表示颜色主题名称。否则为false.
export function $TestColor(color) {
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
}
// 检查给定的值。如果是带有vw,vh,rem,em,upx,rpx,%则返回.如果是px,或者45数字，则转换为upx单位的数值。
export function $TestUnit(n) {
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

}
