

/**
 * 签名版，钢笔效果
 * 源参考：https://www.cnblogs.com/fangsmile/p/14324460.html
 */



class Point {
    constructor(x, y, time) {
        this.x = x;
        this.y = y;
        this.isControl = false;
        this.time = Date.now();
        this.lineWidth = 0;
        this.isAdd = false;
    }
}

class Line {
    constructor() {
        this.points = new Array();
        this.changeWidthCount = 0;
        this.lineWidth = 10;
    }
}
class HandwritingSelf {

    constructor(canvas,w,h,line_w=8,line_color='#ff0000') {
		
        this.canvas = {width:w,height:h};
        this.ctx = canvas
		var context = this.ctx;
		this.ctx.ellipse = function( x, y, a, b){
		    // ----
		}
        // this.points = new Array();
        this.line = new Line();
        this.pointLines = new Array();//Line数组
        this.k = 0.5;
        this.begin = null;
        this.middle = null;
        this.end = null;
        this.preTime = null;
        this.lineWidth = line_w;
        this.lineColor = line_color;
        this.isDown = false;
    }
    down(x, y) {
        this.isDown = true;
        this.line = new Line();
        this.line.lineWidth = this.lineWidth;
        let currentPoint = new Point(x, y, Date.now());
        this.addPoint(currentPoint);

        this.preTime = Date.now();
    }
    move(x, y) {
        // console.log("move:",x,y)
        if (this.isDown) {
            let currentPoint = new Point(x, y, Date.now())
            this.addPoint(currentPoint);
            this.draw();
        }
    }
    up(x, y) {
        // if (e.touches.length > 0) {
        let currentPoint = new Point(x, y, Date.now())
        this.addPoint(currentPoint);
        // }
        this.draw(true);

        this.pointLines.push(this.line);

        this.begin = null;
        this.middle = null;
        this.end = null;
        this.isDown = false;
    }
    draw(isUp = false) {
        // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.setStrokeStyle(this.lineColor)


        //绘制不包含this.line的线条
        this.pointLines.forEach((line, index) => {
            let points = line.points;
            this.ctx.beginPath();
            this.ctx.ellipse(points[0].x - 1.5, points[0].y, 6, 3, Math.PI / 4, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.moveTo(points[0].x, points[0].y);
            let lastW = line.lineWidth;
            this.ctx.setLineWidth(line.lineWidth);
            this.ctx.setLineJoin("round");
            this.ctx.setLineCap( "round");
            let minLineW = line.lineWidth / 4;
            let isChangeW = false;

            let changeWidthCount = line.changeWidthCount;
            for (let i = 1; i <= points.length; i++) {
                if (i == points.length) {
                    this.ctx.stroke();
                    break;
                }
                if (i > points.length - changeWidthCount) {
                    if (!isChangeW) {
                        this.ctx.stroke();//将之前的线条不变的path绘制完
                        isChangeW = true;
                        if (i > 1 && points[i - 1].isControl)
                            continue;
                    }
                    let w = (lastW - minLineW) / changeWidthCount * (points.length - i) + minLineW;
                    points[i - 1].lineWidth = w;
                    this.ctx.beginPath();//为了开启新的路径 否则每次stroke 都会把之前的路径在描一遍
                    // this.ctx.strokeStyle = "rgba("+Math.random()*255+","+Math.random()*255+","+Math.random()*255+",1)";
                    this.ctx.setLineWidth(w);
                    this.ctx.moveTo(points[i - 1].x, points[i - 1].y);//移动到之前的点
                    this.ctx.lineTo(points[i].x, points[i].y);
                    this.ctx.stroke();//将之前的线条不变的path绘制完
                } else {
                    if (points[i].isControl && points[i + 1]) {
                        this.ctx.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
                    } else if (i >= 1 && points[i - 1].isControl) {//上一个是控制点 当前点已经被绘制
                    } else
                        this.ctx.lineTo(points[i].x, points[i].y);
                }
            }
        })

      //绘制this.line线条
        let points;
        if (isUp)
            points = this.line.points;
        else
            points = [...this.line.points];
        //当前绘制的线条最后几个补点 贝塞尔方式增加点
        let count = 0;
        let insertCount = 0;
        let i = points.length - 1;
        let endPoint = points[i];
        let controlPoint;
        let startPoint;
        while (i >= 0) {
            if (points[i].isControl == true) {
                controlPoint = points[i];
                count++;
            } else {
                startPoint = points[i];
            }
            if (startPoint && controlPoint && endPoint) {//使用贝塞尔计算补点
                let dis = this.z_distance(startPoint, controlPoint) + this.z_distance(controlPoint, endPoint);
                let insertPoints = this.BezierCalculate([startPoint, controlPoint, endPoint], Math.floor(dis / 6) + 1);
                insertCount += insertPoints.length;
                var index = i;//插入位置
                // 把insertPoints 变成一个适合splice的数组（包含splice前2个参数的数组） 
                insertPoints.unshift(index, 1);
                Array.prototype.splice.apply(points, insertPoints);

                //补完点后
                endPoint = startPoint;
                startPoint = null;
            }
            if (count >= 6)
                break;
            i--;
        }
        //确定最后线宽变化的点数
        let changeWidthCount = count + insertCount;
        if (isUp)
            this.line.changeWidthCount = changeWidthCount;
      
        //制造椭圆头
        this.ctx.fillStyle = "rgba(255,20,87,1)"
        this.ctx.beginPath();
        this.ctx.ellipse(points[0].x - 1.5, points[0].y, 6, 3, Math.PI / 4, 0, Math.PI * 2);
        this.ctx.fill();
		this.ctx.draw(true);
		
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        let lastW = this.line.lineWidth;
        this.ctx.setLineWidth(this.line.lineWidth);
        this.ctx.setLineJoin("round");
        this.ctx.setLineCap( "round");
        let minLineW = this.line.lineWidth / 4;
        let isChangeW = false;
        for (let i = 1; i <= points.length; i++) {
            if (i == points.length) {
                this.ctx.stroke();
                break;
            }
            //最后的一些点线宽变细
            if (i > points.length - changeWidthCount) {
                if (!isChangeW) {
                    this.ctx.stroke();//将之前的线条不变的path绘制完
                    isChangeW = true;
                    if (i > 1 && points[i - 1].isControl)
                        continue;
                }

                //计算线宽
                let w = (lastW - minLineW) / changeWidthCount * (points.length - i) + minLineW;
                points[i - 1].lineWidth = w;
                this.ctx.beginPath();//为了开启新的路径 否则每次stroke 都会把之前的路径在描一遍
                // this.ctx.strokeStyle = "rgba(" + Math.random() * 255 + "," + Math.random() * 255 + "," + Math.random() * 255 + ",0.5)";
                this.ctx.setLineWidth(w);
                this.ctx.moveTo(points[i - 1].x, points[i - 1].y);//移动到之前的点
                this.ctx.lineTo(points[i].x, points[i].y);
                this.ctx.stroke();//将之前的线条不变的path绘制完
            } else {
                if (points[i].isControl && points[i + 1]) {
                    this.ctx.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
                } else if (i >= 1 && points[i - 1].isControl) {//上一个是控制点 当前点已经被绘制
                } else
                    this.ctx.lineTo(points[i].x, points[i].y);
            }
        }
		this.ctx.draw(true);
    }

    addPoint(p) {
        if (this.line.points.length >= 1) {
            let last_point = this.line.points[this.line.points.length - 1]
            let distance = this.z_distance(p, last_point);
            if (distance < 10) {
                return;
            }
        }

        if (this.line.points.length == 0) {
            this.begin = p;
            p.isControl = true;
            this.pushPoint(p);
        } else {
            this.middle = p;
            let controlPs = this.computeControlPoints(this.k, this.begin, this.middle, null);
            this.pushPoint(controlPs.first);
            this.pushPoint(p);
            p.isControl = true;

            this.begin = this.middle;
        }
    }

    addOtherPoint(p1, p2, w1, w2) {

        let otherPoints = new Array();
        let dis = this.z_distance(p1, p2);
        if (dis >= 25) {
            otherPoints.push(p1);
            let insertPCount = Math.floor(dis / 20);
            for (let j = 0; j < insertPCount; j++) {
                let insertP = new Point(p1.x + (j + 1) / (insertPCount + 1) * (p2.x - p1.x), p1.y + (j + 1) / (insertPCount + 1) * (p2.y - p1.y))
                insertP.isAdd = true;
                otherPoints.push(insertP);
            }
            otherPoints.push(p2);
        }
        let count = otherPoints.length;
        if (count > 0) {
            console.log("addOtherPoint")
            debugger
            let diffW = (w2 - w1) / (count - 1);
            for (let i = 1; i < count; i++) {
                let w = w1 + diffW * i;
                this.ctx.beginPath();
                this.ctx.setLineWidth(w);
                this.ctx.moveTo(otherPoints[i - 1].x, otherPoints[i - 1].y);
                this.ctx.lineTo(otherPoints[i].x, otherPoints[i].y)
                this.ctx.stroke();
            }
        }
        return otherPoints
    }
    pushPoint(p) {
        //排除重复点
        if (this.line.points.length >= 1 && this.line.points[this.line.points.length - 1].x == p.x && this.line.points[this.line.points.length - 1].y == p.y)
            return;
        this.line.points.push(p);
    }
    computeControlPoints(k, begin, middle, end) {
        if (k > 0.5 || k <= 0)
            return;

        let diff1 = new Point(middle.x - begin.x, middle.y - begin.y)
        let diff2 = null;
        if (end)
            diff2 = new Point(end.x - middle.x, end.y - middle.y)

        // let l1 = (diff1.x ** 2 + diff1.y ** 2) ** (1 / 2)
        // let l2 = (diff2.x ** 2 + diff2.y ** 2) ** (1 / 2)

        let first = new Point(middle.x - (k * diff1.x), middle.y - (k * diff1.y))
        let second = null;
        if (diff2)
            second = new Point(middle.x + (k * diff2.x), middle.y + (k * diff2.y))
        return { first: first, second: second }
    }
    // W_current = 
    // 　　W_previous + min( abs(k*s - W_previous), distance * K_width_unit_change) (k * s-W_previous) >= 0
    // 　　W_previous - min( abs(k*s - W_previous), distance * K_width_unit_change) (k * s-W_previous) < 0
    // 　　W_current 　　　　  当前线段的宽度
    // 　　W_previous　　　　与当前线条相邻的前一条线段的宽度
    // 　　distance 　　	　　    当前线条的长度
    // 　　w_k 　　　　　　　	设定的一个固定阈值,表示:单位距离内, 笔迹的线条宽度可以变化的最大量. 
    // 　　distance * w_k 　　  即为当前线段的长度内, 笔宽可以相对于前一条线段笔宽的基础上, 最多能够变宽或者可以变窄多少.
    z_linewidth(b, e, bwidth, step) {

        if (e.time == b.time)
            return bwidth;

        let max_speed = 2.0;
        let d = this.z_distance(b, e);
        let s = d / (e.time - b.time);//计算速度
        console.log("s", e.time - b.time, s)
        s = s > max_speed ? max_speed : s;

        // let w = (max_speed - s) / max_speed;
        let w = 0.5 / s;

        let max_dif = d * step;
        console.log(w, bwidth, max_dif)
        if (w < 0.05) w = 0.05;
        if (Math.abs(w - bwidth) > max_dif) {
            if (w > bwidth)
                w = bwidth + max_dif;
            else
                w = bwidth - max_dif;
        }
        // printf("d:%.4f, time_diff:%lld, speed:%.4f, width:%.4f\n", d, e.t-b.t, s, w);
        return w;
    }
    z_distance(b, e) {
        return Math.sqrt(Math.pow(e.x - b.x, 2) + Math.pow(e.y - b.y, 2));
    }
    BezierCalculate(poss, precision) {

        //维度，坐标轴数（二维坐标，三维坐标...）
        let dimersion = 2;

        //贝塞尔曲线控制点数（阶数）
        let number = poss.length;

        //控制点数不小于 2 ，至少为二维坐标系
        if (number < 2 || dimersion < 2)
            return null;

        let result = new Array();

        //计算杨辉三角
        let mi = new Array();
        mi[0] = mi[1] = 1;
        for (let i = 3; i <= number; i++) {

            let t = new Array();
            for (let j = 0; j < i - 1; j++) {
                t[j] = mi[j];
            }

            mi[0] = mi[i - 1] = 1;
            for (let j = 0; j < i - 2; j++) {
                mi[j + 1] = t[j] + t[j + 1];
            }
        }

        //计算坐标点
        for (let i = 0; i < precision; i++) {
            let t = i / precision;
            let p = new Point(0, 0);
            p.isAdd = true;
            result.push(p);
            for (let j = 0; j < dimersion; j++) {
                let temp = 0.0;
                for (let k = 0; k < number; k++) {
                    temp += Math.pow(1 - t, number - k - 1) * (j == 0 ? poss[k].x : poss[k].y) * Math.pow(t, k) * mi[k];
                }
                j == 0 ? p.x = temp : p.y = temp;
            }
        }

        return result;
    }
}


export default HandwritingSelf;