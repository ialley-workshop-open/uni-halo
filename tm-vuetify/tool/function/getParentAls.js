// 使用时，node =  this.$parent;
// 根据给定的父组件名，寻找它的上一级。
export default function getParentAls(name,node) {
	
	let parent = node;
	while (parent) {
		// 父组件
		if (parent.$options?.name !== name) {
			// 如果组件的name不相等，继续上一级寻找
			parent = parent.$parent;
		} else {
			
			return parent;
		}
	}
	return undefined;

	
}