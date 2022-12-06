function hsvtoRgb(h, s, v) {
	var r;
	var g;
	var b;
	var i;
	var f;
	var p;
	var q;
	var t;
	i = Math.floor(h * 6);
	f = h * 6 - i;
	p = v * (1 - s);
	q = v * (1 - f * s);
	t = v * (1 - (1 - f) * s);
	switch (i % 6) {
		case 0:
			r = v;
			g = t;
			b = p;
			break;
		case 1:
			r = q;
			g = v;
			b = p;
			break;
		case 2:
			r = p;
			g = v;
			b = t;
			break;
		case 3:
			r = p;
			g = q;
			b = v;
			break;
		case 4:
			r = t;
			g = p;
			b = v;
			break;
		case 5:
			r = v;
			g = p;
			b = q;
			break;
		default:
			break;
	}
	return [r,
		g,
		b
	];
}

function rgbtoHsv(r, g, b) {
	var max = Math.max(r, g, b);
	var min = Math.min(r, g, b);
	var d = max - min;
	var h;
	var s = (max === 0 ? 0 : d / max);
	var v = max / 255;

	switch (max) {
		case min:
			h = 0;
			break;
		case r:
			h = (g - b) + d * (g < b ? 6 : 0);
			h /= 6 * d;
			break;
		case g:
			h = (b - r) + d * 2;
			h /= 6 * d;
			break;
		case b:
			h = (r - g) + d * 4;
			h /= 6 * d;
			break;
		default:
			break;
	}

	return [
		h,
		s,
		v,
	];
}

function addSaturationToRgb(color, offset) {
	var hsv = rgbtoHsv(color[0] * 255, color[1] * 255, color[2] * 255);
	hsv[1] += offset;
	if (hsv[1] > 1) {
		hsv[1] = 1;
	} else if (hsv[1] <= 0) {
		hsv[1] = 0;
	}
	return hsvtoRgb(hsv[0], hsv[1], hsv[2]);
}

function addBrightnessToRgb(color, offset) {
	var hsv = rgbtoHsv(color[0] * 255, color[1] * 255, color[2] * 255);
	hsv[2] += offset;
	if (hsv[2] > 1) {
		hsv[2] = 1;
	} else if (hsv[2] < 0) {
		hsv[2] = 0;
	}
	return hsvtoRgb(hsv[0], hsv[1], hsv[2]);
}

function addHueToRgb(color, offset) {
	var hsv = rgbtoHsv(color[0] * 255, color[1] * 255, color[2] * 255);
	hsv[0] += offset / 360;
	if (hsv[0] > 1) {
		hsv[0] -= 1;
	} else if (hsv[0] < 0) {
		hsv[0] += 1;
	}
	return hsvtoRgb(hsv[0], hsv[1], hsv[2]);
}

function rgbToHex() {
	var colorMap = [];
	var i;
	var hex;
	for (i = 0; i < 256; i += 1) {
		hex = i.toString(16);
		colorMap[i] = hex.length === 1 ? '0' + hex : hex;
	}

	return function(r, g, b) {
		if (r < 0) {
			r = 0;
		}
		if (g < 0) {
			g = 0;
		}
		if (b < 0) {
			b = 0;
		}
		return '#' + colorMap[r] + colorMap[g] + colorMap[b];
	};
}

function hexToRgb(sColor, str = true) {
	let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
	sColor = sColor.toLowerCase();
	if (sColor && reg.test(sColor)) {
		if (sColor.length === 4) {
			let sColorNew = "#";
			for (let i = 1; i < 4; i += 1) {
				sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
			}
			sColor = sColorNew;
		}
		//处理六位的颜色值
		let sColorChange = [];
		for (let i = 1; i < 7; i += 2) {
			sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
		}
		if(!str) {
			return sColorChange;
		} else {
			return `rgb(${sColorChange[0]},${sColorChange[1]},${sColorChange[2]})`;
		}
	} else if (/^(rgb|RGB)/.test(sColor)) {
		let arr = sColor.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",")
		return arr.map(val => Number(val));
	} else {
		return sColor;
	}
};

function rgbToHsl(r,g,b){
	r=r/255;
	g=g/255;
	b=b/255;

	var min=Math.min(r,g,b);
	var max=Math.max(r,g,b);
	var l=(min+max)/2;
	var difference = max-min;
	var h,s,l;
	if(max==min){
		h=0;
		s=0;
	}else{
		s=l>0.5?difference/(2.0-max-min):difference/(max+min);
		switch(max){
			case r: h=(g-b)/difference+(g < b ? 6 : 0);break;
			case g: h=2.0+(b-r)/difference;break;
			case b: h=4.0+(r-g)/difference;break;
		}
		h=Math.round(h*60);
	}
	s=Math.round(s*100);//转换成百分比的形式
	l=Math.round(l*100);
	return [h,s,l];
}
function hslToRgb(h,s,l){
	var h=h/360;
	var s=s/100;
	var l=l/100;
	var rgb=[];

	if(s==0){
		rgb=[Math.round(l*255),Math.round(l*255),Math.round(l*255)];
	}else{
		var q=l>=0.5?(l+s-l*s):(l*(1+s));
		var p=2*l-q;
		var tr=rgb[0]=h+1/3;
		var tg=rgb[1]=h;
		var tb=rgb[2]=h-1/3;
		for(var i=0; i<rgb.length;i++){
			var tc=rgb[i];
			console.log(tc);
			if(tc<0){
				tc=tc+1;
			}else if(tc>1){
				tc=tc-1;
			}
			switch(true){
				case (tc<(1/6)):
					tc=p+(q-p)*6*tc;
					break;
				case ((1/6)<=tc && tc<0.5):
					tc=q;
					break;
				case (0.5<=tc && tc<(2/3)):
					tc=p+(q-p)*(4-6*tc);
					break;
				default:
					tc=p;
					break;
			}
			rgb[i]=Math.round(tc*255);
		}
	}
	
	return rgb;
}

/**
 * 求两个颜色之间的渐变值
 * @param {string} startColor 开始的颜色
 * @param {string} endColor 结束的颜色
 * @param {number} step 颜色等分的份额
 * */
function colorGradient(startColor = 'rgb(0, 0, 0)', endColor = 'rgb(255, 255, 255)', step = 10) {
	let startRGB = hexToRgb(startColor, false); //转换为rgb数组模式
	let startR = startRGB[0];
	let startG = startRGB[1];
	let startB = startRGB[2];

	let endRGB = hexToRgb(endColor, false);
	let endR = endRGB[0];
	let endG = endRGB[1];
	let endB = endRGB[2];

	let sR = (endR - startR) / step; //总差值
	let sG = (endG - startG) / step;
	let sB = (endB - startB) / step;
	let colorArr = [];
	for (let i = 0; i < step; i++) {
		//计算每一步的hex值 
		let hex = rgbToHex('rgb(' + Math.round((sR * i + startR)) + ',' + Math.round((sG * i + startG)) + ',' + Math.round((sB *
			i + startB)) + ')');
		colorArr.push(hex);
	}
	return colorArr;
}
