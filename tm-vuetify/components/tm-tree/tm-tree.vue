<template>
	<view class="tm-tree ">
		<view v-for="(item, index) in list_c" :key="index">
			<view :class="['text-size-s', 'py-16  ml-32']">
				<view v-if="!item.isDir" class=" flex-start">
					<view v-if="!read" @click.stop="changeCheckboxItem(item)" class="pr-12">
						<tm-checkbox :fllowTheme="fllowTheme" :color="color_tmeme" :disabled="item['disabled']" dense
							v-model="item.checked"></tm-checkbox>
					</view>
					<view class="flex-start">
						<view v-if="item['icon']" class="pr-10">
							<tm-icons :fllowTheme="fllowTheme" :color="color_tmeme" dense :name="item['icon']"
								:size="32"></tm-icons>
						</view>
						<text :class="[`text-${item.checked ? color_tmeme : black_tmeme ? 'grey' : 'black'}`]"
							class="text-size-n">{{ item["title"]||item["text"] }}</text>
					</view>
				</view>
				<view v-if="item.isDir" class="">
					<view @click.stop="groupOpenChange(item)" class="flex-between">
						<view class="flex-start">
							<tm-icons :fllowTheme="fllowTheme" :color="color_tmeme"
								:name="item.openDir ? dirIconList[1] : dirIconList[0]" :size="32"></tm-icons>
							<view v-if="!read && mode=='multi'" @click.stop="changeCheckboxGroupItem(item)" class="px-12">
								<tm-checkbox :icon="item['dirType']==3?'icon-minus':'icon-check'"
									:fllowTheme="fllowTheme" :color="color_tmeme" :disabled="item['disabled']" dense
									v-model="item.checked"></tm-checkbox>
							</view>
							<text
								:class="[`text-${item.checked ? color_tmeme : black_tmeme ? 'grey' : 'black'}`, black_tmeme ? 'bk' : '']"
								class="text-size-n">
								{{ item["title"]||item["text"] }}
							</text>
						</view>
					</view>
					<view v-if="item.openDir && item['children'].length > 0" class="ml-24 flex-shrink border-l-1 "
						:class="[black_tmeme ? 'bk' : '']" style="border-left-style: dotted;">
						<tm-tree :mode="mode" :read="read" :fllowTheme="fllowTheme" :color="color_tmeme"
							:dirOpenIcon="dirIconList[1]" :dirCloseIcon="dirIconList[0]" @changePrarent="changePrarent"
							:list="item['children']" :prarent="item" @praentclear="preantchangClearChecked"></tm-tree>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 树状结构
	 * @property {Array} list = [] 默认数据列表。
	 * @property {Array} defalut-value = [] 默认选中的项，通过id的集合。
	 * @property {String} dirCloseIcon = [] 默认 'icon-caret-right'，关闭后的图标
	 * @property {String} dirOpenIcon = [] 默认 'icon-sort-down'，打开后的图标
	 * @property {String} color = [] 默认 'primary'，主题色
	 * @property {String} mode = [multi|radio] 默认 'multi'，多选或单选模式。
	 * @property {Boolean|String} read = [] 默认 false，是否只读，作为目录展示
	 */
	import tmCheckbox from '@/tm-vuetify/components/tm-checkbox/tm-checkbox.vue';
	import tmIcons from '@/tm-vuetify/components/tm-icons/tm-icons.vue';
	import tmTree from '@/tm-vuetify/components/tm-tree/tm-tree.vue';

	export default {
		name: 'tm-tree',

		components: {
			tmCheckbox,
			tmTree,
			tmIcons
		},
		props: {
			list: {
				type: Array,
				default: () => {
					return [];
				}
			},
			defalutValue: {
				type: Array,
				default: () => []
			},
			dirCloseIcon: {
				type: String,
				default: 'icon-caret-right'
			},
			dirOpenIcon: {
				type: String,
				default: 'icon-sort-down'
			},
			color: {
				type: String,
				default: 'primary'
			},
			//外部不允许使用。
			prarent: {
				type: Object,
				default: () => null
			},
			// 跟随主题色的改变而改变。
			fllowTheme: {
				type: Boolean | String,
				default: true
			},
			// 是否开启暗黑模式
			black: {
				type: String | Boolean,
				default: null
			},
			read: {
				type: Boolean | String,
				default: false
			},
			mode:{
				type:String,
				default:'multi' //radio 单选  multi多选
			}
		},
		watch: {
			list: {
				deep: true,
				handler() {
					this.list_c = this.list;
				}
			}
		},
		computed: {
			black_tmeme: function() {
				if (this.black !== null) return this.black;
				return this.$tm.vx.state().tmVuetify.black;
			},
			color_tmeme: function() {
				if (this.$tm.vx.state().tmVuetify.color !== null && this.$tm.vx.state().tmVuetify.color && this
					.fllowTheme) {
					return this.$tm.vx.state().tmVuetify.color;
				}
				return this.color;
			},
			dirIconList: function() {
				return [this.dirCloseIcon, this.dirOpenIcon];
			},
			list_c: {
				get() {
					return this.listData;
				},
				set(val) {
					this.chulilist(val);
					let rulst = this.getCheckedArray();
					this.$emit('change', rulst);
				}
			}
		},
		data() {
			return {
				showContent: true,
				listData: []
			};
		},
		mounted() {
			this.list_c = this.list;
			this.setDefaultSelectedKey();
		},
		methods: {
			groupOpenChange(item) {
				if (item['disabled'] === true) return;
				this.$nextTick(function() {
					let p = !item.openDir;
					
					this.list_c = this.setChildListData(this.list_c, item, 'openDir', !item.openDir);
				});
			},
			// 子项目点击选中切换。
			changeCheckboxItem(item) {
				if (item['disabled'] === true || this.prarent?.disabled === true) return;
				this.$nextTick(function() {
					this.list_c = this.setChildListData(this.list_c, item, 'checked', item.checked);
					if(this.mode=="radio"){
						this.clearChecked()
						item.checked = true;
						this.$emit('praentclear',item);
						
						if(!this.prarent){
							this.preantchangClearChecked(item)
						}
						return;
					}
					this.$nextTick(function() {
						if (this.prarent) {
							//递归修改父节点。
							let p = {
								...this.prarent
							};
							p.children = [...this.list_c];
							let prenatKeyArray = this.getChildrenKeyToArray(p, 'checked');
							let isAllChecked = true; //是否全部选中。
							let isAllChecked_min = true; //是否半选中。
							let isAllCheckedAr_all_true = prenatKeyArray.filter((el, eindex) => {
								return el == true;
							})
							let isAllCheckedAr_all_false = prenatKeyArray.filter((el, eindex) => {
								return el == false;
							})
							isAllChecked = isAllCheckedAr_all_true.length === prenatKeyArray.length ?
								true : false;
							isAllChecked_min = isAllCheckedAr_all_true.length > 0 &&
								isAllCheckedAr_all_false.length > 0 ? true : false;

							p['children'] = this.checkAllChildren(p['children']);
							if (isAllChecked) {
								p['dirType'] = 2;
							}
							if (isAllChecked_min) {
								p['dirType'] = 3;
							}
							if (isAllCheckedAr_all_true.length == 0) {
								p['dirType'] = 1;
							}
							isAllChecked = isAllChecked_min || isAllChecked ? true : false;
							p['checked'] = isAllChecked;


							// let prenatKeyArray = this.getChildrenKeyToArray(p, 'checked');
							// let isAllChecked = true;
							// for (let i = 0; i < prenatKeyArray.length; i++) {
							// 	if (prenatKeyArray[i] === false) {
							// 		isAllChecked = false;
							// 		break;
							// 	}
							// }
							// p.checked = isAllChecked;

							this.$emit('changePrarent', p);
							
						}else{
							
						}
					});
				});
			},
			//收到子节点修改父节点的请求。
			changePrarent(item) {

				this.$nextTick(function() {
					let index = this.list_c.findIndex(ix => ix.id === item.id);
					this.list_c.splice(index, 1, item);

					if (this.prarent) {
						if (item['disabled'] === true) return;
						if (this.prarent['disabled'] === true) return;
						
						// 再反递归，修改它的上一级，一直类推到第一级。
						let p = {
							...this.prarent
						};
						p.children = [...this.list_c];
						let prenatKeyArray = this.getChildrenKeyToArray(p, 'checked');
						let isAllChecked = true; //是否全部选中。
						let isAllChecked_min = true; //是否半选中。
						let isAllCheckedAr_all_true = prenatKeyArray.filter((el, eindex) => {
							return el == true;
						})
						let isAllCheckedAr_all_false = prenatKeyArray.filter((el, eindex) => {
							return el == false;
						})
						isAllChecked = isAllCheckedAr_all_true.length === prenatKeyArray.length ? true : false;
						isAllChecked_min = isAllCheckedAr_all_true.length > 0 && isAllCheckedAr_all_false.length >
							0 ? true : false;
						p['children'] = this.checkAllChildren(p['children']);
						if (isAllChecked) {
							p['dirType'] = 2;
						}
						if (isAllChecked_min) {
							p['dirType'] = 3;
						}
						if (isAllCheckedAr_all_true.length == 0) {
							p['dirType'] = 1;
						}
						isAllChecked = isAllChecked_min || isAllChecked ? true : false;
						p['checked'] = isAllChecked;

						this.$emit('changePrarent', p);
						
					} else {
						// 第一级。
						let rulst = this.getCheckedArray();
						this.$emit('change', rulst);
						
					}
				});
			},
			//收到子节点请求清空所有选择，并设置某个属性
			preantchangClearChecked(item){
				
				if(!this.prarent){
					
					this.clearChecked();
					if(item){
						let t = this
						if(typeof item == 'object' && !Array.isArray(item)){
							setTimeout(function(){
								t.setDefaultSelectedKey([item.id])
							},150)
						}else if(typeof item == 'object' && Array.isArray(item)){
							setTimeout(function(){
								t.setDefaultSelectedKey([...item])
							},150)
						}
					}
				}else{
					
					this.$emit('praentclear',item);
				}
			},
			//设置某一个key的属性。
			/**
			 * @param {Object} list 目标数组
			 * @param {Object} item 待修改的对象（根据item.id修改）
			 * @param {Object} key 待修改的字段名称
			 * @param {Object} value 待修改的字段变量。
			 */
			setChildListData(list, item, key, value) {
				let parar = [...list];

				function ch(objAr) {
					let p = [];
					if (typeof objAr == 'object' && Array.isArray(objAr)) {
						for (let i = 0; i < objAr.length; i++) {
							p.push(ch(objAr[i]));
						}
						return p;
					} else if (typeof objAr === 'object') {
						let children = objAr['children'];
						if (typeof children === 'object' && Array.isArray(children) && children.length>0) {
							let xg = {};
							if (item.id === objAr.id) {
								
								if(key=='checked'){
									if(objAr['disabled']!==true){
										xg[key] = value;
									}
								}else{
									xg[key] = value;
								}
							}
							return {
								...objAr,
								checked: objAr['checked'] || false,
								isDir: objAr['isDir'] || true,
								openDir: objAr['openDir'] || false,
								dirType: objAr['dirType'] || 1,
								children: ch(children),
								...xg
							};
						} else {
							let xg = {};

							if (item.id === objAr.id) {
								
								if(objAr!='checked'){
									if(item['disabled']!==true){
										xg[key] = value;
									}
								}else{
									xg[key] = value;
								}
							}
							let isDir = false;
							if (typeof objAr['isDir'] === 'boolean') isDir = objAr['isDir'];
							if (typeof objAr['children'] === 'object' && Array.isArray(objAr['children']) && children.length>0) {
								if (objAr['children'].length > 0) {
									isDir = true;
								}
							}
							return {
								...objAr,
								isDir: isDir || false,
								checked: objAr['checked'] || false,
								...xg
							};
						}
					}
				}
				return ch(parar);
			},
			//通过key的唯一属性取得子集。
			/**
			 * @param {Object} item 目标数组
			 * @param {Object} key 筛选的字段名称
			 * @param {Object} value 筛选的的字段变量。
			 */
			getChildren(item, key, value) {
				let parar = [...item];

				function ch(objAr) {
					let p = null;
					if (typeof objAr == 'object' && Array.isArray(objAr) && objAr.length>0) {
						for (let i = 0; i < objAr.length; i++) {
							p = ch(objAr[i]);
							if (p) {
								break;
							}
						}
						return p;
					} else if (typeof objAr === 'object') {
						let children = objAr['children'];
						if (typeof children === 'object' && Array.isArray(children) && children.length>0) {
							if (objAr[key] == value) {
								return objAr;
							}
							p = ch(objAr.children);
							if (p) {
								return p;
							}
							return false;
						} else {
							if (objAr[key] == value) {
								return objAr;
							}
							return false;
						}
					}
				}
				return ch(parar);
			},

			//取得子集下所有相同属性的集合。根据指定key的变量条件取得。
			getChildrenKeyToArrayByvalue(item, quereyKey, key, value) {
				function ch(objAr) {
					let p = [];
					if (typeof objAr == 'object' && Array.isArray(objAr)&& objAr.length>0) {
						for (let i = 0; i < objAr.length; i++) {
							p.push(...ch(objAr[i]));
						}
						return p;
					} else if (typeof objAr === 'object') {
						let children = objAr['children'];
						if (typeof children === 'object' && Array.isArray(children)&& children.length>0) {
							if (objAr[key] === value) {
								return [objAr[quereyKey], ...ch(children)];
							}
							return [];
						} else {
							if (objAr[key] === value) {
								return [objAr[quereyKey]];
							}
							return [];
						}
					}
				}
				let ru = [];
				//添加父节点。
				if (item[key] === value) {
					ru.push(item[quereyKey]);
				}
				
				if(typeof item =='object' && Array.isArray() && item?.children.lenght>0){
					let parar = [...item];
					ru = [...ru, ...ch(parar)];
				}
				if(typeof item =='object' && !Array.isArray()&& Array.isArray(item?.children)){
					
					let parar = [...item?.children];
					ru = [...ru, ...ch(parar)];
				}
				
				if(typeof item?.id == 'underfined'){
					return []
				}
				return ru;
			},
			//取得子集下所有相同属性的集合。
			getChildrenKeyToArray(item, key) {
				let parar = [...item.children];

				function ch(objAr) {
					let p = [];
					if (typeof objAr == 'object' && Array.isArray(objAr)&& objAr.length>0) {
						for (let i = 0; i < objAr.length; i++) {
							p.push(...ch(objAr[i]));
						}
						return p;
					} else if (typeof objAr === 'object') {
						let children = objAr['children'];
						if (typeof children === 'object' && Array.isArray(children)&& children.length>0) {
							return [objAr[key], ...ch(children)];
						} else {
							return [objAr[key]];
						}
					}
				}
				return ch(parar);
			},
			//打开某一项目录。通过id进行控制打开。
			/**
			 * @param {Object} id 目录id,如果不是目录，不会执行。
			 * @param {Object} dirType 打开类型：true,打开，close关闭。
			 */
			__openDir(id, dirType = true) {
				//子节点不允许操作此函数。
				if (this.prarent == null) {
					let children = this.getChildren(this.list_c, 'id', id);
					if (children['isDir']) {
						children['openDir'] = dirType;
						this.setDirListData(children, 'openDir', dirType);
					}
				}
			},
			//打开所有折叠.
			__openAll(){
				// this.setDirListData(this.list_c, 'openDir', true);
				for(let i=0;i<this.list_c.length;i++){
					this.__openDir(this.list_c[i].id,true)
				}
			},
			//获取当前列表数据。子级不能调用。
			__getListdata() {
				if (this.prarent) return [];
				return this.list_c;
			},
			//添加数据。子级不可调用。
			//注意：如果提供的id是dir则在其子集中添加数据。因此如果想在本级添加数据需要提供父级id.
			//如果提供的id不是目录id,那么会自动创建它的子集。
			__addData(id, data = null) {
				if (this.prarent) return [];
				if (!data || typeof data != 'object') return;
				//不提供id默认在根目录添加数据追加。
				if (typeof id === 'undefined' || id == null || id == '') {
					let cp = uni.$tm.deepClone(this.list_c);
					cp.push(...data);

					this.list_c = cp;
				} else {
					let ps = uni.$tm.deepClone(this.list_c);
					for (let i = 0; i < ps.length; i++) {
						let children = this.getChildren(ps, 'id', id);
						//如果是目录，向其子集添加数据。
						if (children['isDir']) {
							children['children'].push(...data);
							this.list_c = this.setChildListData(ps, children, 'children', children['children']);

							//不是目录。它没有子集。创建子集。
						} else {
							children = {
								...children,
								isDir: true,
								children: [...data]
							};

							ps = this.setChildListData(ps, children, 'isDir', true);
							ps = this.setChildListData(ps, children, 'children', children['children']);
							this.list_c = ps;
						}
						if (children) {
							break;
						}
					}
				}
			},
			// 项目父节点击选中切换。
			changeCheckboxGroupItem(item) {
				if (item['disabled'] === true) return;
				let t = this;
				t.setDirListData(item, 'checked', item.checked);
				if (t.prarent) {
					let p = {
						...t.prarent
					};
					p.children = [...t.list_c];

					let prenatKeyArray = this.getChildrenKeyToArray(p, 'checked');
					let isAllChecked = true; //是否全部选中。
					let isAllChecked_min = true; //是否半选中。
					let isAllCheckedAr_all_true = prenatKeyArray.filter((el, eindex) => {
						return el == true;
					})
					let isAllCheckedAr_all_false = prenatKeyArray.filter((el, eindex) => {
						return el == false;
					})
					isAllChecked = isAllCheckedAr_all_true.length === prenatKeyArray.length ? true : false;
					isAllChecked_min = isAllCheckedAr_all_true.length > 0 && isAllCheckedAr_all_false.length > 0 ? true :
						false;

					p['children'] = this.checkAllChildren(p['children']);
					if (isAllChecked) {
						p['dirType'] = 2;
					}
					if (isAllChecked_min) {
						p['dirType'] = 3;
					}
					if (isAllCheckedAr_all_true.length == 0) {
						p['dirType'] = 1;
					}
					isAllChecked = isAllChecked_min || isAllChecked ? true : false;
					p['checked'] = isAllChecked;


					// let prenatKeyArray = t.getChildrenKeyToArray(p, 'checked');
					// let isAllChecked = true;
					// for (let i = 0; i < prenatKeyArray.length; i++) {
					// 	if (prenatKeyArray[i] === false) {
					// 		isAllChecked = false;
					// 		break;
					// 	}
					// }
					// p.checked = isAllChecked;

					t.$emit('changePrarent', p);
				}else{
					
					this.$nextTick(function(){
						this.list_c = this.checkAllChildren(this.list_c)
					})
				}
			},

			//设置dir下，所有子集相同的属性。
			setDirListData(item, key, value, callback) {
				let parar = uni.$tm.deepClone(item);

				function ch(objAr) {
					let p = [];
					if (typeof objAr == 'object' && Array.isArray(objAr)&& objAr.length>0) {
						for (let i = 0; i < objAr.length; i++) {
							p.push(ch(objAr[i]));
						}
						return p;
					} else if (typeof objAr === 'object') {
						let children = objAr['children'];
						if (typeof children === 'object' && Array.isArray(children)&& children.length>0) {
							let xg = {};
							if(key=='checked'){
								if(objAr['disabled']!==true){
									xg[key] = value;
								}
							}else{
								xg[key] = value;
							}
							return {
								...objAr,
								checked: objAr['checked'] || false,
								isDir: objAr['isDir'] || true,
								openDir: objAr['openDir'] || false,
								dirType: objAr['dirType'] || 1,
								children: ch(children),
								...xg
							};
						} else {
							let xg = {};
							
							if(key=='checked'){
								if(objAr['disabled']!==true){
									xg[key] = value;
								}
							}else{
								xg[key] = value;
							}
							return {
								...objAr,
								isDir: objAr['isDir'] || false,
								checked: objAr['checked'] || false,
								...xg
							};
						}
					}
				}

				let ts = ch(parar.children);

				let new_list = this.setChildListData(this.list_c, item, 'children', ts);
				this.list_c = [...new_list];
				if (callback) {
					callback();
				}
			},

			chulilist(list) {
				let parar = [...list];
				//dirType=1，未选中，2选中，3有选中，有未选中的
				function ch(objAr) {
					let p = [];
					if (typeof objAr == 'object' && Array.isArray(objAr)&& objAr.length>0) {
						for (let i = 0; i < objAr.length; i++) {
							p.push(ch(objAr[i]));
						}
						return p;
					} else if (typeof objAr === 'object') {
						let children = objAr['children'];
						if (typeof children === 'object' && Array.isArray(children)&& children.length>0) {
							return {
								...objAr,
								checked: objAr['checked'] || false,
								isDir: objAr['isDir'] || true,
								dirType: objAr['dirType'] || 1,
								openDir: objAr['openDir'] || false,
								children: ch(children)
							};
						} else {
							return {
								...objAr,
								isDir: objAr['isDir'] || false,
								checked: objAr['checked'] || false
							};
						}
					}
				}
				this.listData = ch(parar);
			},
			// 获取所有选中的条目指定条件的属性。id
			/**
			 * @param {Object} key 需要取得的字段名称。 默认是id
			 * @param {Object} quereyKey 条件查询的字段。默认是checked即选中的条目字段
			 * @param {Object} value 条件查询的字段的变量。默认是true即选中的条目值
			 */
			getCheckedArray(key, quereyKey, value) {
				key = typeof key === 'undefined' ? 'id' : key;
				quereyKey = typeof quereyKey === 'undefined' ? 'checked' : quereyKey;
				value = typeof value === 'undefined' ? true : value;
				if (this.prarent) return;
				let ps = uni.$tm.deepClone(this.list_c);
				let rulst = [];
				for (let i = 0; i < ps.length; i++) {
					let idArray = this.getChildrenKeyToArrayByvalue(ps[i], key, quereyKey, value);
					rulst.push(...idArray);
				}

				return rulst;
			},
			setDirListDataBySync(item, key, value) {
				let parar = uni.$tm.deepClone(item);

				function ch(objAr) {
					let p = [];
					if (typeof objAr == 'object' && Array.isArray(objAr)&& objAr.length>0) {
						for (let i = 0; i < objAr.length; i++) {
							p.push(ch(objAr[i]));
						}
						return p;
					} else if (typeof objAr === 'object') {
						let children = objAr['children'];
						if (typeof children === 'object' && Array.isArray(children)&& children.length>0) {
							let xg = {};
							if(key=='checked'){
								if(objAr['disabled']!==true){
									xg[key] = value;
								}
							}else{
								xg[key] = value;
							}
							return {
								...objAr,
								checked: objAr['checked'] || false,
								isDir: objAr['isDir'] || true,
								openDir: objAr['openDir'] || false,
								dirType: objAr['dirType'] || 1,
								children: ch(children),
								...xg
							};
						} else {
							let xg = {};
							if(key=='checked'){
								if(objAr['disabled']!==true){
									xg[key] = value;
								}
							}else{
								xg[key] = value;
							}
							return {
								...objAr,
								isDir: objAr['isDir'] || false,
								checked: objAr['checked'] || false,
								...xg
							};
						}
					}
				}

				let ts = ch(parar.children);

				let new_list = this.setChildListData(this.list_c, item, 'children', ts);
				this.list_c = [...new_list];
			},
			//清空所有选择。
			clearChecked() {
				let ps = uni.$tm.deepClone(this.list_c);
				for (let i = 0; i < ps.length; i++) {
					ps[i].checked = false;
					ps[i].dirType = 1;
					let new_list = this.setChildListData(this.list_c, ps[i], 'checked', ps[i].checked);
					this.list_c = [...new_list];
					this.setDirListDataBySync(ps[i], 'checked', false);
				}
			},
			//选中所有选择。
			seletedAll() {
				let ps = uni.$tm.deepClone(this.list_c);
				for (let i = 0; i < ps.length; i++) {
					ps[i].checked = true;
					let new_list = this.setChildListData(this.list_c, ps[i], 'checked', ps[i].checked);

					this.list_c = [...new_list];
					this.setDirListDataBySync(ps[i], 'checked', true);

				}
				this.$nextTick(function() {
					this.list_c = this.setDirListDataBySyncToDir(this.list_c, 'dirType', 2)
				})
			},
			//给定一个数组设置它下面所有dir目录（只设置目录，不含其子级）相同的属性。
			setDirListDataBySyncToDir(list, key, value) {
				let new_list = uni.$tm.deepClone(list);

				function ch(objAr) {
					let p = [];
					if (typeof objAr == 'object' && Array.isArray(objAr)&& objAr.length>0) {
						for (let i = 0; i < objAr.length; i++) {
							p.push(ch(objAr[i]));
						}
						return p;
					} else if (typeof objAr === 'object') {
						let children = objAr['children'];
						if (typeof children === 'object' && Array.isArray(children)&& children.length>0) {
							let xg = {};
							
							if(objAr!='checked'){
								if(objAr['disabled']!==true){
									xg[key] = value;
								}
							}else{
								xg[key] = value;
							}
							return {
								...objAr,
								checked: objAr['checked'] || false,
								isDir: objAr['isDir'] || true,
								openDir: objAr['openDir'] || false,
								dirType: objAr['dirType'] || 1,
								children: ch(children),
								...xg
							};
						} else {
							let xg = {};
							// xg[key] = value;
							return {
								...objAr,
								isDir: objAr['isDir'] || false,
								checked: objAr['checked'] || false,
								...xg
							};
						}
					}
				}

				for (let i = 0; i < new_list.length; i++) {
					let parar = new_list[i];
					parar[key] = value
					parar['children'] = ch(parar.children);
				}
				return new_list;
			},
			//给定一个数组设置它下面所有项目相同的属性。
			setDirListDataBySyncToItem(list, item, key, value) {
				let parar = uni.$tm.deepClone(item);

				function ch(objAr) {
					let p = [];
					if (typeof objAr == 'object' && Array.isArray(objAr)&& objAr.length>0) {
						for (let i = 0; i < objAr.length; i++) {
							p.push(ch(objAr[i]));
						}
						return p;
					} else if (typeof objAr === 'object') {
						let children = objAr['children'];
						if (typeof children === 'object' && Array.isArray(children)&& children.length>0) {
							let xg = {};
							if(objAr!='checked'){
								if(objAr['disabled']!==true){
									xg[key] = value;
								}
							}else{
								xg[key] = value;
							}
							return {
								...objAr,
								checked: objAr['checked'] || false,
								isDir: objAr['isDir'] || true,
								openDir: objAr['openDir'] || false,
								dirType: objAr['dirType'] || 1,
								children: ch(children),
								...xg
							};
						} else {
							let xg = {};
							if(objAr!='checked'){
								if(objAr['disabled']!==true){
									xg[key] = value;
								}
							}else{
								xg[key] = value;
							}
							return {
								...objAr,
								isDir: objAr['isDir'] || false,
								checked: objAr['checked'] || false,
								...xg
							};
						}
					}
				}

				let ts = ch(parar.children);

				let new_list = this.setChildListData(list, item, 'children', ts);
				return new_list;
			},
			//检查选择情况。
			checkAllChildren(o_item) {
				let t = this;
				// 检查各个子集的选择情况。
				// this.changePrarent(children)
				// 再反递归，修改它的上一级，一直类推到第一级。
				let otem = uni.$tm.deepClone(o_item);
				let ls = [];
				for (let j = 0; j < otem.length; j++) {
					let pr = otem[j];

					if (pr['isDir']) {

						let prenatKeyArray = t.getChildrenKeyToArray(pr, 'checked');

						let isAllChecked = true; //是否全部选中。
						let isAllChecked_min = true; //是否半选中。
						let isAllCheckedAr_all_true = prenatKeyArray.filter((el, eindex) => {
							return el == true;
						})
						let isAllCheckedAr_all_false = prenatKeyArray.filter((el, eindex) => {
							return el == false;
						})
						isAllChecked = isAllCheckedAr_all_true.length === prenatKeyArray.length ? true : false;
						isAllChecked_min = isAllCheckedAr_all_true.length > 0 && isAllCheckedAr_all_false.length > 0 ?
							true : false;

						pr['children'] = t.checkAllChildren(pr['children']);
						if (isAllChecked) {
							pr['dirType'] = 2;
						}
						if (isAllChecked_min) {
							pr['dirType'] = 3;
						}
						if (isAllCheckedAr_all_true.length == 0) {
							pr['dirType'] = 1;
						}
						isAllChecked = isAllChecked_min || isAllChecked ? true : false;
						pr['checked'] = isAllChecked;

					}

					ls.push(pr)
				}
				return ls;

			},
			setDefaultSelectedKey(defaultValue) {
				let t = this;
				if (!defaultValue) {
					defaultValue = this.defalutValue;
				}
				let rulst = defaultValue;
				if (this.prarent == null) {
					//清空所有选择。
					// this.clearChecked();
					let ps = uni.$tm.deepClone(this.list_c);
					for (let i = 0; i < rulst.length; i++) {
						let children = this.getChildren(ps, 'id', rulst[i]);
						children['checked'] = true;
						if (children['isDir']) {
							let index = ps.findIndex(ix => ix.id === children.id);
							// this.list_c.splice(index, 1, children);

							// this.changeCheckboxGroupItem(children)
							ps = this.setDirListDataBySyncToItem(ps, children, 'checked', children.checked);

						} else {
							ps = this.setChildListData(ps, children, 'checked', children.checked);
						}
					}
					let pc = [];

					ps = this.checkAllChildren(ps);

					this.$nextTick(function() {
						this.list_c = ps;
					});
				}
			}
		}
	};
</script>

<style lang="scss"></style>
