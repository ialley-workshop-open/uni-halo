// 使用时，node =  this.$parent;
export default function getParentAttr(name, keys,node) {
	
	let parent = node;
	while (parent) {
		// 父组件
		if (parent.$options?.name !== name) {
			// 如果组件的name不相等，继续上一级寻找
			parent = parent.$parent;
		} else {
			
			return parent[keys];
		}
	}
	return undefined;

	
}