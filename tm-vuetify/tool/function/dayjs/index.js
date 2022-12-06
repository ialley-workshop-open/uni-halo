var pc = require('./zh-cn.min')
var relativeTime = require('./relativeTime.min')
var isBetween = require('./isBetween.min')
var toObject = require('./toObject.min')
var dayjs = require('./dayjs.min')
dayjs.locale(pc)
// dayjs.locale('zh-cn')
dayjs.extend(relativeTime)
dayjs.extend(isBetween)
dayjs.extend(toObject)

export default {dayjs};