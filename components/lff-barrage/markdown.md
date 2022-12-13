#如何使用
###js
```javascript
import lffBarrage from '@/components/lff-barrage/lff-barrage.vue'
components:{lffBarrage},
methods:{
	colrdo(){ //插入一条弹幕
		this.$refs.lffBarrage.add({item:'你好呀小伙子'});
	}
}
```
###HTML
```html
<lff-barrage ref="lffBarrage"></lff-barrage>
```