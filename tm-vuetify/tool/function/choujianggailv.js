function choujiang(prizes) {
    var prizeList = [] //按照权重分解后的奖品数组
    prizes.map(function(item){
        prizeList.push({
            
			...item
        })
        for(var i=0; i< item.gailv; i++) {
            prizeList.push({
               
               ...item
            })
        }
    });
    prizeList = reset(prizeList);
    // 范围随机数
    function randomFrom(lowerValue, upperValue) {
        return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
    };
    // 随机打乱数组
    function reset(arr) {
        var eachArr = arr.concat([])
        var lastArr = []
        function deepEach(deepArr) {
            if (deepArr.length) {
                var randomIndex = randomFrom(0, eachArr.length - 1)
                lastArr.push(eachArr[randomIndex])
                eachArr.splice(randomIndex, 1)
                deepEach(eachArr)
            }
        }
        deepEach(eachArr)
        return lastArr
    }
    this.getResult = function() {
        var random = randomFrom(0, prizeList.length - 1);
        return prizeList[random]
    }
}

export default choujiang;