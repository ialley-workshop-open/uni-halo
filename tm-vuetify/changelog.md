## 2.0.1（2022-12-8）
* 修复 tm-icons在小程序下可能图标与文字无法对齐
* 优化 tm-album性能,修复可能在嵌套组件中,无法计算宽高信息.
* 优化 tm-dragList性能
* 优化 tm-row性能
* 优化 tm-segTabs性能
* 优化 tm-sheet性能
* 优化 tm-slider,tm-sliders性能
* 优化 tm-more性能
* 优化 tm-propress性能,修复可能在嵌套组件中,无法计算宽高信息.
* 优化 tm-dialog，tm-poup,动效及样式
* 微调 tm-button
* 美化了tm-calendar，tm-calendar-view，选中改成圆形，范围改成椭圆形。
* 修复 tm-countdown 完成的时机逻辑有误，修改后默认为完成状态。
* 增强 tm-upload 新增showSort属性，用于上传的文件排序功能。
* 修复 tm-swiper圆角失效。
* 修复 tm-weekbar日期问题。
* 修复 tm-dragGrid 动态修改数据后的判断逻辑问题。
* 优化 tm-grouplist 渲染性能，现在已经是秒渲染。
* 修复$tm.vx.getters()下的属性丢失。
## 2.0.0（2022-6-7）
* tm-card修复点击操作按钮时返回的参数非index，而是项目标题。修复动态配置一些属性不生效的问题。
* tm-dropDownMenu 优化，当重置项时，默认将使用你初始的选中数据来进行填充，默认选中。
* tm-slider，tm-sliders修复当默认初次使用值等于最大值时，功能失效。
* tm-album 添加了model模式，以便自定图片缩放模式

## 1.2.30 (2022-3-27)
* tm-images增加出错插槽error，修改出错时提示的样式。
* 修复tm-tree设置为单选模式后，第一级项目（非dir)单选失败。
* tm-search新增点击整个组件发出的click事件。
* tm-pickerView修复子级出现空数组时被计算为有效的三级。
* 修复tm-listitem自定背景色失败，优化tm-sheet自定背景的逻辑。我不赞成使用这bgColor两个属性。
* 修复tm-flotbutton在不同位置时，由于渲染的延迟，导致位置的闪现，影响美观。
* [新增]tm-uploadfile文件上传组件，用于任意文件的上传和预览，仅支持小程序和h5。
* tm-upload新增width属性，以便更好的控制组件宽度。
* tm-slider和tm-sliders新增了width宽度属性。
* 修复tm-monthCalendar在ios系统获取日期错误。
* 修改tm-card插槽数据返回方式为对象。
## 1.2.299 (2022-3-6)
* tm-setpper调整后删除最小宽度
* css库增加flex-[x]伸缩布局的盒子。
* tm-upload新增model，图片缩放模式。
* tm-images修复不支持临时文件路径的问题
* tm-dropDownMenu修复重置的情况下对：单选列表，多选列表，级联，日期选择等失效的bug.
* tm-swiper当有视频播放时，轮播将强制停止。等视频结束时如果启用了自动轮播，将继续轮播。
* tm-listitem调整了默认的样式属性。
* 修复了一些文档上的描述错误
* tm-calendar修复一个样式上的判断错误。
* tm-switch新增一些特性，允许修改组件的宽和高、以及关闭和开启的主题色。
* tm-button新增在微信端授权失败的显示的属性，userProfileError，具体见文档。
* 修复tm-pickersDateView未正常显示时间的中文后缀。
* 修复tm-calendarView在范围选择状态下的bug
* tm-icons图标修改了样式。
* tm-checkbox和tm-radio修改了样式。
* tm-countdown新增精确到毫秒
* demo示例大量更新，及大量组件样式的优化
* 主题库更新以支持上下渐变主题类，原有渐变如：bg-gradient-orange-accent，加了-b:bg-gradient-orange-accent-b即为上下渐变。
* 主题工具更新以支持生成上下渐变的主题类[主题工具](https://jx2d.cn/themetool/#/)
* 模板库正式上线[模板库](https://jx2d.cn/themetool/#/templete)
## 1.2.298 (2022-2-25)
* tm-grid调整了下划线的出现逻辑。
* tm-button完整的添加了原生的属性，之前版本有些属性被精简了
* tm-bottomnavigation 修复当使用自定16进制颜色背景时，底部安全距离的颜色未跟随tabar颜色。
* tm-tabs修复在超过一屏时，第一个元素在左侧时，点击第一个底部条会有不同程序的偏移
* tm-upload优化，当图片加载出错时，提示感叹号，以便感知当前加载状况。
* tm-tree树状组件，新增了一个单选模式，默认为多选详见文档。
* tm-album优化了组件在其它子组件内获取宽度失败的bug.
* tm-weekbar修复日期带10进制和不带10进制时，选中失败的问题。
* tm-steppe调整了步进器的禁用状态和宽高设置，以及一个兼容性的异步回调问题。
* tm-input调整优化了样式
* tm-radio和tm-checkbox调整优化了禁用下的样式状态
* tm-button调整优化了样式
* tm-groupButton调整了按钮组的样式
* tm-card优化了卡片组件在暗黑模式的表现样式。
* 其它更多组件的优化。
## 1.2.297 (2022-2-12)
* [新增]tm-card卡片组件。
* 修复tm-propressRound当模式为半圆进度条时减少到0（含）以下时变成了全圆
* tm-actionSheetMenu调整了默认圆角的样式，修复了某些问题。
* tm-flotbutton修复了上两个版本引出的定位问题（居中）
* tm-dialog优化了样式，默认不显示标题边线，间距调小，圆角默认改为8
* tm-keyborad优化了默认字号样式，加大了字号。
* 修复tm-bottomnavigation因测试red未删除，导致自定颜色主题被覆盖。
* tm-images增加加载错误时的提醒占位符
* 文档网站组件库进行了字母排序a-Z排序。
* tm-menubars修改标题为超出一行自动省略
* tm-stepper新增了相关属性功能：圆角分离按钮，小数位支持，整数支持，范围输入，长按增减，异步增减。
* tm-swiper新增标题显示，视频轮播显示，详细请阅读文档。
## 1.2.296 (2022-1-28)
* 优化tm-flowLayout瀑布流组件的宽高计算的准确度。避免偶尔的计算错误，导致左右列不致。
* tm-actionSheetMenu修复在弹出后如果在原生tabar模式下，h5中会被遮挡部分按钮的问题。
* tm-echarts图表，新增一个ref函数resize如果外围改变了父元素宽度后，可调用 此函数进行重新绘制图表。
* tm-upload新增：responseStu服务器响应数据的字段映射表，见文档说明
* tm-treeSelete修复了一个错误
* tm-dragGrid修复返回变化的列表数据，没有按照排序时的顺序返回。
* 修复文档说明中的问题
* css库增加一个flex-reverse，用于行内容的反转（对聊天对话作用较大）。
* tm-input因hbx更新导致默认校验函数异常。现已修复。
## 1.2.295 (2022-1-20)
* tm-stepper增加了change事件
* tm-signBoard修复在h5下面保存失败的问题。
* tm-grouplist修复在h5平台下，当列表设置为group模式时，点击展开列表内容的index有误。
* tm-dialog修复返回事件的拼写错误，老的不影响，错误的拼写也会正常工作。原concel改成了cancel。两个都会正常触发事件（兼容旧版本）
* tm-propressRound圆环进度，现在在appvue，h5,微信，支付宝下面是同层渲染，可以被其它元素覆盖。
* tm-calendar对属性变量以及范围属性变更为双向绑定，使用时记得添加.sync
* tm-propressRound 新增属性：semicircle是否显示半圆进度圈
## 1.2.294 (2022-1-14)
* tm-poup修复关闭时会触发两次change事件。
* 优化了部分组件暗黑模式下的配色表现。
* tm-album优化了在appvue和浏览器模拟下断行的问题。（真机无此问题）
* 优化tm-switch在appvue上的表现。
* 修复tm-message组件被注销后，定时器未被跟随注销。
* tm-calendar和tm-monthCalendar增加了inline属性（是否内联，默认true)，方便独占一行或者内联表单布局展示日历。
* 修复tm-bottomnavigation，如果在同一页时，点击图标重复跳转，修复后，如果同一页面点击图标将不再跳转，也不触发事件。
* tm-groupcheckbox和tm-groupradio新增了customClass属性，方便定义子选择项的布局。
* tm-echarts版本为5.2.1，优化同层渲染显示，默认为2d渲染，现在如果在h5,weixin,alipay端下，默认是同层渲染，即渲染的图表不会跑到其它元素的上方。
* tm-calendar和tm-calendarView范围选择，确认触发的回调函数中，返回的参数，调整为数组即开始和结束的日期，不再返回所有日期。
* 优化,tm-table,tm-grid增加了maxGrid用于特殊列布局数量，比如一行5个，一行7个。maxGrid是指布局的最大列数默认是12列布局。想要一行5个可以设置为10
* 优化,tm-col增加了maxCol作用同上。
* tm-table,新增 fixedHeader，是否固定表头，默认不固定。注意能不开启尽量不开启，体验不是很好，但勉强可用,同时新增了：rowHeight单元格高，rowAlign单元格对齐，也可通过头统一设置，具体看文档。
* 修复tm-segTabs变动时触发两次change事件的问题。
* 优化tm-radio,tm-checkbox对齐表现。
* 修复tm-dialog在应用内浏览器中计算了顶部高度，导致上下不居中。
* tm-quickCity修复位置
* tm-flowLayout新增了一个clear，清空所有列表数据的方法。
* 单向tm-slider和双向tm-sliders滑块新增了start和end事件，即开始拖动和拖动时的触发事件。
* 优化tm-input校验函数。
* tm-bottomnavigation新增activeIndex属性，用于指定选择项，使用前必须设置autoSelected为false。如果切换页面时，将会被初始为0，请自行配置选项项。如果想夸页面自动选中项，请使用正常的tabar模式，而不是指定式。

## 1.2.293 (2021-12-31)
* 三个抽奖类游戏增加了disabledCenter属性，用于控制是否禁用点击图片中心能开始游戏的功能。
* tm-dragList重构了，现在拖动更为流畅顺滑，动画稍微加长，看起来更好。
* [新增]tm-dragGrid宫格拖动排序，为了大家方便，开发此组件，主要应用场景：主页功能模块编辑（类似ios桌面应用，支付宝首页模块拖动排序），新闻资讯分类（排序和编辑，类似头条）
* [优化]tm-button,为微信授权专门定制了更为简单的逻辑，具体请看文档，如何使用微信登录授权事宜。
* tm-choujiang修复圈数问题。现在新增了turns指定圈数。
* tm-switchList修复，在动态更新actions按钮数量时，导致位置计算错误。
* tm-badges新增了iconSize和iconWidth,只有为角标图标时才可以使用。
* tm-dropDownMenu优化，并且新增了两个可选组件，多选列表，下拉选择器的数据选择。新增了禁用时的颜色区分。
  优化了渲染性能。当下拉条件超大量时，下面选项页面渲染过长（1秒）。因此新的组件采用了渐进式渲染。因此批量条件渲染也不在卡，而是秒开。
* tm-tabs增加了font-color
* tm-input新增，输入框和标题字号大小的控制允许输入内置的xxs,s,n或者任意数字。
* tm-menubars修复flat属性，忘记加''引号，导致扁平化样式失效。
* tm-avatarCrop新增quality和fileType方便压缩质量和导出图片格式。[修复]在appvue异常的情况
* tm-upload增加了一个清除所有文件的ref函数。
* tm-input新增了后缀图标和前缀图标颜色的主题色控制。
* 修复一css库的一些错误。
## 1.2.292 (2021-12-17)
* tm-listitem修改了判断url逻辑。
* tm-bottomnavigation添加了切换时的振动提醒（H5没有该效果）。
* tm-abs修复一个已知，当你手动去赋值切换tabs索引时，导致下划线未跟随。
* 修复tm-pagination未触发change事件，以及一个已知的问题。
* tm-verificationImg新增了一个禁用属性，用来禁用使用。
* tm-pullBottom增加了一个属性，用来控制不允许下拉，但允许上拉触底刷新数据。
* tm-calendar和tm-calendarView日历组件现已全部兼容了暗黑模式。
* tm-pickerDate和tm-pickerDateView进行了重构。
* tm-imags组件，由于测试代码未删除，导致上个版本，如果不设置宽度无法自动宽高。
* tm-switch更新了触发逻辑，代码控制不触发change事件，只有用户操作才会触发change
* tm-flotbutton主按钮（非子菜单）放开了原生的所有功能，具体参数，请对比tm-button
* render渲染引擎，增加了一个褐色Sepia图片风格滤镜。同时图片图形模块增加了一个load事件，只有图形name="image"时，图片加载成功触发该事件。
   新增了HorizontalFlip，VerticallyFlip水平，垂直翻转。HorizontalMirror，VerticallyMirror水平，垂直居中镜像对称。
* 修复主题库的样式在appvue真机下，不支持颜色值hex的16进制透明颜色值。现已修正为rgba模式，不使用hex模式。
## 1.2.291 (2021-12-13)
* **这是1.2.29的临时修订版本，上个版本测试不严谨，临时发个版本修正下**
* tm-switchList 调整了角标样式位置。
* tm-slider和tm-slider 修复信息在appvue下不居中的差异。
* 修正tm-pickers上个版本引出的不符合预期的动画效果
* 修复tm-stepper如果自己设定值时，无法赋值。
* tm-switchList的icon属性，现在支持自定图标，以及图片地址。
* tm-bottomnavigation修改了计算底部安全区域的值。
* tm-tree未过滤禁用项的选择。
* tm-upload，我变量写错了，导致1.2.29版本上传一直提示上传失败。
* tm-dialog层级过高。
* tm-poup重新编写了动画，过渡时间调整为240ms
## 1.2.29 (2021-12-13)
* **tm-render渲染引擎得到了重大更新，兼容微信小程序，性能翻倍。可用于生产啦。**
* tm-pickers,tm-tm-mapSelectedPoint,tm-poup,tm-slider,tm-sliders等相关组件，优化和修复了一些错误
* tm-dialog增加了最大高度的限制。同时新增了一个disabled属性，以控制是否允许点击按钮关闭窗体。true表示点击窗体任意位置也无法关闭窗体，只能通过v-model来控制
* tm-alerts修改了文档错误。同时新增了轮播的间隙。
* 文档错误的描述修复。
* 修复tm-tree在上个版本新加的允许子级中出现父级功能时，引出的bug。
* tm-timeline添加list监听，修改数据后动态更改。
* tm-maskFlow新增了blur是否显示模糊背景。
* tm-menu添加了点击任意位置关闭菜单的功能。
* tm-helpTips添加了点击任意位置关闭弹出层的功能。
* tm-tabs的model新增了一个可选项：fill的模式。显示背景主题样式。
* tm-dropDownMenu下拉选项新增了下拉，列表式菜单单选模式，具体见演示demo。同时美化了标题项图标。新增了一个shadow投影属性，你现在可以自己控制投影了。
* tm-timeline修复节点标题颜色，不会跟随自定主题更改，而是被默认主题覆盖的问题。
* tm-flop使用了新的库和效果。详见文档和示例。
* tm-avatarCrop优化了细节，兼容pc端
* 优化了tm-badges显示效果。
* tm-bottomnavigation数据格式dot中新增了color属性，以便更改角标的背景主题色，不提供使用自身的icon-color主题。
* tm-upload新增了一个code属性，用于标识服务上传返回数据中是否成功的代码。默认为0表示成功 。同时修复了一个判断上传成功与否的逻辑。
* [themetool主题生成工具](https://jx2d.cn/themetool/)更新了一个已知问题，当生成的主题使用背景作为文字颜色时，无法显示文字色。
  theme->下的所有主题包已修正了此问题。主样式库也修正了此问题。
* tm-button修复一个已知的宽度计算的问题，因之前的版本怕宽度为rpx时，没有注意到，后期改的时候又rpx一次，相当于宽度被减半了。（只有使用width属性时出现问题）
* tm-pagination分页组件优化了性能，重新编写了计算页码函数，并且设置了最小可见页数为5。
* tm-menubars修正了一个已知的透明度问题。
* tm-listitem列表新增了下right-icon-size属性，可以修改右图标大小。
## 1.2.28 (2021-12-01)
* tm-more新增showMask属性，用于显示内容遮罩，默认不显示。
* tm-translate优化了动画组件。
* tm-tree修复了一个bug,当第一级为子级为子级时，无法选中。另外应网友建议。现在第一级允许出现子级字段。只要为空就可正常作为子级而不会被识别为父级。
* 优化了个别组件在安卓平台下的表现性能，建议大家及时更新新的版本
* tm-bottomnavigation底部导航工具现在角标可以添加图标角标，具体见文档示例。
## 1.2.27 (2021-11-30)
* [新增]tm-render，cavans渲染引擎，目前是测试版，应用场景：海报自绘，图表自绘，界面自绘，游戏动画等场景。
* tm-tabs添加了model="none"，如果为none边框和下划线的样式将被去除不显示。同时新增了：active-border-color现在可以单独设置指示的颜色，渐变等，默认为空，如果不填写则默认使用主题color的主题色。更新了动画速率
* 优化tm-icons,现在开始你也不用图标定义前缀，变得更为简单，只需要设置图标字体名称和图标名称前缀相同即可，
  自定义扩展图标，详情见自定图标.新增了几个品牌支付类图标，和品牌图标。同时新加了两套字体以便兼容安卓手机的支付宝显示不了图标的问题。
* tm-dialog增加属性bottom-border，是否显示标题底部边线，默认显示。
* tm-countdown更新了文档，之前文档漏写了插槽数据。
* tm-album相册集新增了自定义高度的属性
* tm-pickers和tm-pickersView增加了一个事件@change，当前选项在滚动时，会触发滚动选中的索引数组（非真正意义上的选中，只代表滚动时的选中项）
* tm-password新增了round,width,height,bg-color,shadow属性，以控制项目输入框的宽和高以及圆角的等相关属性。现在可以设置时尚的圆角输入框啦~
* tm-segTabs新增gutter属性，允许你设置四边的间隙大小。默认4，新增了个性化示例，以便大家知道它的设计亮点。重新优化了设计样式，紧贴未来设计趋势
* 优化了tm-sheet和tm-fullView初次加载时的宽度设置问题。
* tm-poup修复圆角对居中不起作用的bug，优化了tm-poup的动画效果。
* 修复tm-tree，子级被手动选中时父级未被选中。新增了半选中状态。
* 调整了tm-search清除图标和后缀图片同时显示时的位置，清除图标在前面。其它图标靠后。
* tm-steps完善了相关文档说明，新增了节点间连线的类型属性（可选css边线的标准类型）,以及节点间连线内的中间图标属性，填写显示，不填写不显示。连线的厚度，也可以调整啦
* [新增]tm-avatarCrop图像裁剪，主要场景有：头像、文章图片，产品图片，海报图片尺寸等的调整和裁剪功能。
* tm-alerts文档描述错误。
* tm-row新增了一个click事件。tm-col不再阻止冒泡事件。
* 调整了tm-input前缀图片和清除图标与输入框的间距对齐的问题。（关于点击输入框时弹起键盘，紧接着点下一个禁用的输入框来选择下拉时，键盘不收起，这时uniapp的bug。我是无法修复。但使用了一个巧妙的方法解决，那就是在输入框禁用时，在覆盖一个view来失去焦点，以此来关闭键盘。)
* 修复tm-dropDownMenu因为拼错，导致样式错误
* tm-table表头新增了排序功能（仅对该列为数字时有升降，如果为字母或者其它字符则为反转和正常两种排序）,现在表格内容自动断行。详见文档。
* 新加了font awmeson图标库在本库下，具体请查阅[拓展图标库的使用方法](https://jx2d.cn/guid/css/%E6%8B%93%E5%B1%95%E5%9B%BE%E6%A0%87.html)
* 修缮了官网文档中的一些组件参数错误的描述。其它组件的完善和优化。
## 1.2.26 (2021-11-18)
* tm-swiper修复修改list时没有变化，新增加了3d卡片动画效果。
* 优化tm-switchList滑动单元格
* [新增]tm-avatarGroup头像组件。偏移可自行设置。内部只能放置tm-avatar头像组件。
* tm-switch新增loadding，是否加载中的属性。
* 修复tm-input在文本域时下方的输入数字遮挡文本的情况
* 优化了tm-dialog对话框的错误和禁止穿透时提示动效反馈，让用户理解当前的操作。
* tm-upload新增了maxsize属性，以控制上传的图片大小限制。
* tm-images新增了待加载的动效效果，以便让用户知道图片的加载情况
* tm-tabs优化了其性能，更为流畅。
* tm-tags新增了抖动动画ani-on,默认false,同时新添加了关闭动画
* tm-quickCity优化了细节,新增了热门城市可供选择。
* tm-menu添加了显示动画。
* tm-password添加了当前输入位置的呼吸效果,以便让用户知道当前输入位置。
* tm-keyborad添加了按钮点按振动反馈效果（app和小程序有效）。优化底层可穿透，就是可以连续点击输入框输入内容，而不必来回切换关闭和弹出。
* tm-button自定义类属性拼写错误为itemeClass。正确的是：itemClass,
* tm-radio和tm-checkbox单选和复选增加了选中动效，同时调整了默认大小比之前更大之前为32.现在为38.
* tm-sliders和tm-slider单/双滑块新增了点击按钮时触发显示信息的动画，同时提高了其高度，方便手机用户。
* [新增]tm-groupButton按钮组，主要应用于app应用的按钮组合快捷操作使用，点击选中的效果。
* [新增]tm-segTabs分段器选项卡
* [新增]tm-album相册集，以便展示图片列表，随意控制间隙，列数。
* [新增]tm-gap间隙槽，横竖向，方便元素间加间距，特定场景布局时，不方便使用类ma,pa这样的类的一个补充。
* tm-input,新增了设置标题字号的属性：title-font-size，同时新增了聚焦状态属性，默认禁用，打开后，可以让用户更加直观知道当前的操作状态。优化了暗模式下的边线颜色搭配，使其更美观。
* [新增]tm-message提示框，主要用于操作反馈，含有丰富的动效反馈（亮点），以便让用户察觉所操作的含义。
* 上个版本，在尝试兼容nvue时，button和icon测试代码没有删除，导致不能适应暗黑和主题。
* nvue因为样式与标准的css3样式改动较大，所以本版暂时未发布nvue版本，请期待后续的兼容。
## 1.2.25 (2021-11-10)
* 从1.2.25开始已全面兼容app端（nvue计划在1.2.26中兼容）
* 优化了tm-choujiangGrid九宫格抽奖游戏。
* 修复tm-bottomnavigation历史遗留问题，导致角标不显示的问题，感谢网友的指出。
* tm-calendar现在允许动态更新范围选中日期。
* tm-choujiangGrid九宫格抽奖，新增转圈数和指定中奖位置。
* 修复tm-checkbox和tm-radio组件在使用超长文本时造成的挤压。
* tm-sticky现在自动吸顶支持小程序和appvue因为是使用onpagescroll模拟（非h5端）所以尽量内容不要过于复杂。
* [新增]tm-switchList滑动单元格，常用于，聊天列表，通讯录列表的左滑动操作等场景。
* [新增]tm-dragList拖放排序列表，常用于，支付顺序，工具选择等排序场景。
* [新增]tm-tree树状结构组件，用于：组织架构，目录，文件夹，筛选等类目较多的场景。
* [配套的主题生成工具已更新，兼容appvue主题](https://jx2d.cn/themetool/)
## 1.2.24 (2021-11-5)
* 本次更新重大：重新调整了主题库。现在所有主题（含渐变）都已经能够适应所有组件的
  暗黑，text,outlined模式，得于此次重大的调整。现在样式主题库不再集成数十个主题，而是分别提供，单独按需引入，你需要
  那个主题，就引用哪个主题。细节方面比之前更完整（不用担心大小问题）。现在基本样式库为152kb(原有387kb),拆分后每个主题css
  大小约为20kb。并且我已经开发了主题生成工具（自动生成对应的渐变主题bg-gra开头-主题名）。
  [配套的主题生成工具,已为你准备好](https://jx2d.cn/themetool/)
* tm-propress进度条优化，现在宽高可以随意输入数字或者带单位的数字比如5px,5rpx,10vw,50%；
* tm-propressRound环形进度条优化在小程序上的显示，避免锯齿。
* 优化兼容tm-grouplist。
* 关闭了导入用户vuex目录，不存在时的错误提示（并不影响使用，只做为调试，给用户造成了困扰）
* tm-timeline修复了变换数据时，未响应。优化了细节
* tm-input增加了，点按清除图标的事件。
* tm-search增加了，点按清除图标的事件。
* tm-stepper新增，最大，最小值，宽度，高度的设置，同时长按增加或者减少按钮会持续+或者-
* tm-flowLayout优化了瀑布流组件【说明下，本站很多模拟数据，包括图标，图片使用的是外网的，导致加载过慢，看起来像是左边先出来或者右边，其实内部是已经排好了，之所以，有的占了坑却没显示，是卡。才造成你们的错觉。】
* 细调了主题库参数比例,优化了暗黑模式下的配色。现在的所有组件都支持暗黑模式
* 调整了tm-lottie动画url可以是地址，也可以是json对象数据。
* tm-menubars导航工具栏进行了优化。防止事件穿透，现在更加的与主题整合在一起。删除了iconColor和fontColor两个属性。
* tm-images现在支持base64图片。
* tm-divider修复了一个历史遗留问题。
* 优化了tm-menubars菜单工具栏，修复了右插槽多打了个空格的问题。
* [新增]tm-scroll横向滚动，主要应用横向滚动场景。比如横向产品展示，横向图标展示等。
* [新增]tm-coupon优惠券
* [新增]tm-skeleton骨架加载器
* css库新增内联对齐类：vertical-align-[top/center/bottom]方便内联上中下对齐。
* css库，外边距新增负数表达方式原有mt-10，写成负数方式为:mt--10。
* css库，新增位置控制t,l,r,b四个方向t-10表示top:10rpx。t--10表示top:-10rpx负数
* css库，新增wrap断行,nowrap不断行
* tm-cartCellListFood和tm-cartBarFood以及demo示例更改，之前在ios下有时数据触发购物车数据不同步的情况（当在加载新数据时，新数据与购物车数据不匹配和已有匹配数据）的同步和计算的问题。
  这个列表数据，是可以异步加载，不需要美团或者饿了么一次把产品加载完成。购物车放到任意一页面都会同步数据。（适合在新的页面查看，或者搜索产品同步列表购买数据与购物车的打通）
* 其它更多组件的细微调节不一一写出。
## 1.2.23 (2021-10-28)
* tm-pickersDate日期下拉组件，已经更新了计算方式。比之前更流畅。
* 修复tm-bottomnavigation在真机上，未能隐藏原生底部bar，安全距离各个平台的差异。
* 修改了tm-flotbutton位置的计算方式。
* tm-signBoard签名版，现在已支持电脑版。
* tm-alerts,更新了新的功能，当提供数组为消息轮动时，提供了vertical属性，纵向还是横向的属性。
* 文档示例已经更新，文档库增加了组件搜索功能。[访问](https://jx2d.cn/)
## 1.2.22 (2021-10-26)
* 修复tm-alerts组件页面渲染中多写了个变量，已删除。
* tm-grid修改了默认样式。
* tm-calendarView和tm-calendar两个日历组件新增了formart分割数组，方便显示不同的分割符号，比如把年改成'-'或者'/'，同时修复设置title时，顶部标题没有变化（忘记变量写上去了。）
* tm-pagination美化了样式
* tm-icons优化了关闭按钮的样式
* tm-timeline优化了图标样式
* tm-flotbutton增加了一个属性。safe：是否开启底部安全区域,当设置为bottom时（fixed模式下生效）会自动加上安全区域的高度
* 修复tm-bottomnavigation在与原生tabar共用时，出现计算当前页面的错误，概率性无法隐藏原生tabar,修改了底部安全区域的计算方法，现在兼容：应用内浏览器（比如微信，qq内的浏览器），小程序，app等。
* 修复tm-button，当配置url并未跳转（因为1.0.0版本遗留的问题，此功能后面给忘记加上去了。），同时修改了样式美观度，当模式在titl和text模式下，自动隐藏投影属性。
* 修复tm-search在H5端，运行在ios下，输入框中会默认显示ios特有的搜索图标，现已清除。不再双重图标。
* tm-helpTips修改了默认布局，关闭图标和文字形成水平左右布局。不再上下布局。
* 修复tm-actionSheetMenu，因主题切换引申出来的主题样式错乱。
* 修复tabs在重新赋值列表数据时，样式未触发重新计算。tabs首次加载，将不再执行焦点动画，只有操作后才会执行动画。
* [所有端]修复tm-pickers因切换到原生组件渲染时引出的bug，在改变列表长度时不会更新底层有index导致界面滚动不了。
* 修复tm-pickersDate在限制日期范围选择时，因我类型判断错误，1月份索引是0，属正常，但我判断成了假，导致在1月份时，天数被限制，显示不全。
  现在解决方案是注销(v-if，数据多时，每次打卡有200ms左右延迟)来控制，而不是之前的v-show(可以减少初始化的次数，数据多时优势明显。打开不卡)
* [appvue]修复tm-echarts在appvue在安卓下报error.现已修复，同时新增了error事件，当渲染出错时可以捕获。
* [appvue]修复tm-quickIndex和tm-quickCity在appvue，无法显示的问题。
* [appvue]修复tm-pickers在appvue下报警告的提醒。
* [appvue]修复tm-input和tm-form在appvue下执行校验失败和获取数据失败的问题。
* [appvue]修复tm-grouplist在appvue下不起作用的bug.
* [appvue]修复tm-slider和tm-sliders在模拟器和真机上不可用的问题，在app上本组件需要你设定样式宽度或者它父组件定个宽度。

## 1.2.21 (2021-10-22)
* 修复tm-menubars在多个级联器下的布局概率下出现错位现象。
* 美化了tm-calendar日历选中和范围选择下的样式。
* 修改了说明文档和示例更新。
* 修复样式库round-bt的描述错误，正确的写法应该为round-bl（底左圆角而非bt），相应的文档也更新。
同时修复了，主题库中对色值明度提高了边界范围，使得稍微明亮主题下文本颜色仍然为白色，而非自身颜色暗黑的比例（影响中性颜色范围扩大）。
减淡了text模式下的颜色背景比之前少了1%。
* 为了让使用暗黑模式，tm-fullView组件修改了结构，不再使用内部的滚动（影响性能），而是超出不隐藏，默认为最小高度为屏高。同时增加了相关属性。
* tm-bottomnavigation现在修改为根据页面路径自动选中底部按钮。参数路径前面一定要加：/ ,比如：/pages/index/index（你可以使用系统的tabar以达到原生性能，当此组件在给定的tabar页面时，会自动隐藏原生的tabar)
* tm-pickers系列组件（共6个）进行了全部的重构，以支持电脑端(以及未来的nvue)。(原tm-pickers为自渲染，比原生的选中更流畅（无延迟），但不支持电脑端以及nvue,无奈放弃)。
* tm-slider单滑块和tm-sliders双滑块现开始支持电脑端(以及未来的nvue)（刻度尺模式不支持电脑端）
* tm-monthCalendar月份日历更改了默认样式。
## 1.2.0 (2021-10-20)
* 全新主题动态切换，一秒换新app主题（预览图在下方）
* 全新暗黑模式（预览图在下方）
* 新增[tm-lottie组件](https://jx2d.cn/guid/components/lottie动画.md)，（预览图在下方）可执行动画的播放，暂停，停止等常用功能动画，具体见文档。
* 修复tm-pickersDate，单独设置年，和月，日选择时，不显示列表的错误。
* tm-grid数据结构新增了右角标可显示图标，而不局限红点，具体见文档示例。
* tm-tags修改了关闭图标样式对齐问题（小程序端），tm-tags新增了dense属性，是否去除边距间隙
* 修复tm-bottomnavigation点击事件返回参数错误，现已修正,并且修复了提供path未打开链接的bug,同时数据格式中，要求提供openType打开方式，同正常路由方式,完善了相关操作方法，自动隐藏系统tab
* 新增[瀑布流组件tm-flowLayout](https://jx2d.cn/guid/components/瀑布流.md)。
* 修改了签名板js库（和官方组件冲突的命名）和示例
* 头像组件tm-avatar文档，更新了一个示例，利用内置的js函数库快速的上传更改头像（只需要一个函数非常方便）
* tm-dropDownMenu组件的样式得到了较大更新，样式更为美观。
* tm-sliderNav和tm-treeSelect得到了样式上的较大更新更为美观，同时选中模式也更改为了点击整个选择。
* tm-input增加了padding属性，用于改变，左右上下的间距。
* tm-upload修复了一个错误，header没有传导进内部，导致上传时，无法传递header参数到服务器，同时新增了对返回参数的code校验，如果code!=0也会发出上传错误。新增了，项目圆角属性 round,默认3，方便修改圆角。
* tm-form修复了一个兼容性的问题，不知道什么原因，升级后的版本，对于取子childer发生了改变，现在只能更新修复了。修复在小程序下取不到表单数据的问题。
* tm-button新增了一个dense属性，为真是去除外边距。
* tm-images组件现已修复了，大小自动设置时的计算错误。
* tm-badges修复样式计算错误,由之前样式在1.0.0版本中遗留的bug。
* tm-cartBarFood组件，新增了一个ref函数getData,用于获取当前购物车的统计，应用场景为跨页面的数据同步，需要用到。
* tm-pickersDate日期选择组件修复了一个时间范围的bug问题。
* 新增了tm-echarts图表组件，版本号为5.2.1同百度官方版本，使用方法见文档，如果想要了解图表样式，请查看百度官方文档。
* 修复了日历,默认值空时，延时赋值，会被组件内部默认选中的数据覆盖的问题。
* css样式库，新增了渐变类的边线等等主题类的整体样式，因此增加了100kb大小。目前整个样式库为386kb。有些预设样式不得不增加大小。
* tm-tabs组件，修复如果把选中值设置为不存在（-1或者大于当前选项长度）的索引值，会出现警告。不再警告报错。
* tm-dialog增加了over-close属性，指示是否点击遮罩关闭窗体。
* 修改了tm-pagination分页组件的，分页策略，并修正了一些问题。
* 修改了其它组件一些样式及bug，就不一一列出了。
## 1.1.9（2021-09-28）
* （紧急）关于HBuilder X编译器的BUG对我的组件影响如下：
  3.2.9.20210927，编译后，使用所有插槽的组件，开发中热更新，经常丢失样式，严重影响开发；但发布后却不受影响。（影响热更新的开发）
  3.2.9.20210927，3.2.3.20210825 版本，更新后编译后在（h5端）插槽中（tounch开头事件）失效，但click等事件不受影响（影响我的签名板组件示例demo）。
  3.2.3.20210825编译版本，编译后插槽中的如果使用页面的变量，导致编译bug一堆，且必失败。（小程序和h5都有，影响我所有插槽组件）
  3.2.2.20210818 （截止2021-9-28,是我认可且推荐的编译版本）
  3.2.2.20210818之前的版本，插槽中的变量和事件直接变为子组件的变量和事件，导致所有插槽失败（所有端，影响所有我插槽组件）
  
* [tm-tabs选项卡切换](https://jx2d.cn/guid/components/%E9%80%89%E9%A1%B9%E5%8D%A1%E5%88%87%E6%8D%A2.html) bg-color='white'时导致背景丢失（此bug来自暗黑模式导致。）,同时修复，在使用双向绑定激活项时，如果通过js改变激活项时，下面的指示条位置未改变。
* 修复多[级联选择器](https://jx2d.cn/guid/components/%E6%99%AE%E9%80%9A%E7%BA%A7%E8%81%94%E6%8B%89%E9%80%89%E6%8B%A9%E5%99%A8.html)，在默认选中级级时，出现了位置不正确的问题。
  现在可以通过id进行赋值，城市选择器同样适用，id（城市编码），名称，索引三种方式赋值。
* [tm-calendar日历组件](https://jx2d.cn/guid/components/%E6%97%A5%E5%8E%86.html)，现在新增了选择开始和结束时触发相应的事件，同时，开始和结束下标文本会进行提示：开始和结束
* [tm-search搜索框](https://jx2d.cn/guid/components/%E6%90%9C%E7%B4%A2%E6%A1%86.html)组件新增了输入框后缀图标插槽suffixIcon，以便自定义个性化输入框。
* [tm-loadding组件](https://jx2d.cn/guid/components/%E5%8A%A0%E8%BD%BD%E7%8A%B6%E6%80%81.html)现在可以自定义文本，图标，主题色了。
* 新增[tm-weekbar时间周组件](https://jx2d.cn/uniapp/#/pages/comtwo/weekbar)，主要应于场景有：根据时间快捷栏，快速选择时间来刷新数据，打卡，签到等应用场景。
* 新增[tm-verificationImg图片安全校验](https://jx2d.cn/uniapp/#/pages/comtwo/verificationImg)，主要应于场景，用于多防刷流量的验证，或者多次密码错误，多次发送验证码时的一种安全验证。
* [tm-quickIndex索引组件](https://jx2d.cn/guid/components/%E5%BF%AB%E9%80%9F%E7%B4%A2%E5%BC%95.html)，迎来了重大更新。优化了使用性能，现在可以快速的滑动快捷栏来选择组，同时提供了滑动时提示当前所在的组位置。
  并且，新增了一个插槽cell,通过cell插槽，你现在可以完全定义每一项的内容，并且自己个性化布局内容。默认数据list结构现在开放了图标、头像展示在列表中。
  同时也进行了美化快捷栏。具体请前往文档查看更新细节，手机可预览。
* [tm-input输入框](https://jx2d.cn/uniapp/#/pages/com/input)新增了输入框内前缀文字属性prefixp-text。
* 新增[tm-quickCity城区索引](https://jx2d.cn/uniapp/#/pages/comtwo/quickCity)选择组件。
* tm-tags新增事件click,点击组件时触发。
* css库细化了暗黑模式的颜色搭配,现在暗黑模式更为一体。
* tm-upload新增了一个ref函数pushFile,添加已上传图片至列表。新增了一个事件@def，当删除上传文件时触发。
* tm-stepper组件最小值时，将会出现禁用减少按钮的状态。
## 1.1.8（2021-09-17）
* tm-images修复在引用静态路径时，报告路径错误。现在引用前已经设置为根路径。
  因为在引用图片路径时，直接引用就可以比，如想引用static/a.jpg。那么在【任何页面，不分层级】里面只要src="static/a.jpg"即可，不需要再去./或者../../之类。
  同时修复了单位问题，现在统一为rpx单位。
* tm-input新增了输入框内suffixIcon后缀图标字段属性，以便实现更多的功能样式。和右图标相似，但不同的是suffixIcon是在输入框内部。同时把height字段也应用到了输入框，而不是只应用于常规输入框
  每个人设计的输入框可能高度不一致，因此放开了高度选项。（升级后不影响现有项目，已做兼容），文档中少写了一个属性：placeholder-class点位符自定义类，这个属性一直有，文档中漏掉了。
* tm-avatar新增了border属性字段，用于开启边框，控制头像边框大小。默认为0，颜色为字段color的颜色。
* tm-grouplist新增fontSize标题大小的设置，标题大小，注意是css库中的xxs,xs,s,n,g,lg,xl
* 优化了tm-row和tm-grouplist组件在appvue和小程序端的显示
#### 使用的tm-images的宽度会影响现有宽和高。因为这个组件之前的宽和高我忘记把rpx转换成px,所以之前的宽度如果是100实际是100px,升级后会变为50px(750的比例)。
#### 因此如果你使用了大量的tm-images请不要升级吧。如果只是少量，麻烦大家更正下，非常抱歉。！！！
* 很多组件，样式细节被我调整了（对现有项目不影响）。
## 1.1.7（2021-09-16）
* 调整当tm-input组件当input-type=number,或者digit将会根据类型格式对应的整数和小数点数据，而不是原生的字符串格式。因1.1.6更新时，不小心删除了sync绑定方法，导致value.sync不双向绑定
  v-model方式不受影响。调整了tm-input样式，右边如果超出了已定宽度断行，现在不允许断行，保证不受挤压。
* 调整了tm-dialog的高度和宽度（设为响应式宽度了，不再固定宽度）,调整了对话框文档说明，呃，我写错了文档
* 修复tm-upload，当不提供url上传地址或者url上传报404或者301等不为200时，可能造成无限自动重试上传（设置了自动上传时）的bug,现已修复，建议及时更新版本。
* tm-pickersCity组件，default-value现已支持双向绑定请使用:default-value.sync,同时调整宽度为自动100%，之前是内联
* tm-pickers组件，default-value现已支持双向绑定请使用:default-value.sync,同时调整宽度为自动100%，之前是内联。
  修复在滚动时，如果行数没有变化，也会触发下级数据更新。现在同位置滚动时将不再触发，级联变动数据。微调了样式。
* 调整了tm-stepper属性，新增了fontColor中间数字文字颜色主题，兼容之前版本。并修复当暗黑模式时，文字颜色还是为黑色，未变白色。
  修复tm-stepper步进器，内部属性类型，标识错误的问题
* 修复了css库中，当border-b-1类库暗黑模式下与其它组件颜色不一致的问题。
* 新增[表单组件](https://jx2d.cn/uniapp/#/pages/comtwo/form)，使用方法和注意事项请详见文档。内部会对Input组件的必填项进行校验。
  以下是关于表单对相关组件的更新：
  tm-upload:新增了prop属性name，用于提交表单时的标识，返回上传成功后的服务器数据结构
  同时这些组件都相应增加了name字段:tm-input,tm-groupradio,tm-groupcheckbox,tm-upload,tm-rate,tm-slider,tm-stepper，tm-switch，表单类主要是这8个组件。
  上述8个组件放置在表单组件内部时，提交触发事件会收集所有的数据形成对象结构体并返回。详情上方表单组件文档。
* [tm-table表格](https://jx2d.cn/guid/components/%E8%A1%A8%E6%A0%BC.html)组件新增了cell插槽，以便方便自定义单元格的内容。
* [tm-swiper轮播组件](https://jx2d.cn/guid/components/%E8%BD%AE%E6%92%AD.html)，dot-model新增了一个round可选模式的样式，请前往文档查看。修改了原prop中的round属性，原为boolean，现改为Number
  属性，如果要开启圆角，需要设置round="数字"即可圆角。同时新增了maring属性，即左右间距。默认0，设定数字后，两边会有间距。单位rpx
* [tm-table表格组件](https://jx2d.cn/guid/components/%E8%A1%A8%E6%A0%BC.html)新增了一个插槽cell，通过插槽你现在可以随意更改任何一个单元格的内容，比如添加按钮等元素。
* [tm-empty组件](https://jx2d.cn/guid/components/%E6%95%B0%E6%8D%AE%E7%A9%BA.html)，新增prop属性icon,现在你可以自定义图片，可以是图标名称或者图片地址。
* 修复[tm-listItem组件](https://jx2d.cn//guid/components/%E5%88%97%E8%A1%A8.html)，单独作为拓展（手风琴）列表模式时，点击展开内容时报报错警告（不影响使用）。现在不再出现警告及错误提示。
## 1.1.6（2021-09-13）
* [tm-dialog对话框组件](https://jx2d.cn/guid/components/%E5%AF%B9%E8%AF%9D%E6%A1%86.html)的弹层动画在所有端去除了。经过大量测试uniapp对动画的支持在appvue和小程序中运行流畅度始终无法让人忍受。在H5端
  非常的流畅。但其它端仅：left,right,bottom,top等动画流畅，对scale，opacity,这种大小渐隐效果的动画支持的太差了。
* [css库](https://jx2d.cn/guid/css/%E7%B1%BB%E5%BA%93%E7%9A%84%E7%A7%8D%E7%B1%BB.html)增加：flex-top-start,flex-top-center,flex-top-end,flex-wrap,flex-shrink,fulled-height类,具体请查阅文档。
* [tm-tabs选项卡切换](https://jx2d.cn/guid/components/%E9%80%89%E9%A1%B9%E5%8D%A1%E5%88%87%E6%8D%A2.html),本次更新，新增了两个prop属性，默认字号和激活后的字号大小设定。两个默认28upx
* 调整了[tm-sliderNav侧边导航](https://jx2d.cn/guid/components/%E5%88%86%E7%B1%BB%E9%80%89%E6%8B%A9.html)的样式。
* tm-tags组件，属性文档写错，尺寸最小到xs而文档中写成了xxs，导致使用错误。调整了[tags标签](https://jx2d.cn/guid/components/%E6%A0%87%E7%AD%BE.html)样式和间距。
* 修复了[tm-input组件](https://jx2d.cn/guid/components/%E8%BE%93%E5%85%A5%E6%A1%86.html)在appvue和小程序端因为默认为空时，显示clear图标造成和检验逻辑错误。
  input-type属性增加了：textarea可选值，现在可以通过它展现文本域多选输入了,并且有字符限制提示，只需要通过maxlength来控制，右下角会显示当前字符数和限制数，并调整了样式。调整了文档示例。
* 修改和完善了[css库类清单](https://jx2d.cn/guid/css/%E7%B1%BB%E5%BA%93%E7%9A%84%E7%A7%8D%E7%B1%BB.html)文档,添加了渐变文字颜色的文档说明。
* 修改了文档，安装中的步骤方式。修改了文档：暗黑模式的使用方法：[暗黑模式](https://jx2d.cn/guid/special/%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F.html)
* 微调了[tm-upload组件](https://jx2d.cn/guid/components/%E4%B8%8A%E4%BC%A0%E5%9B%BE%E7%89%87%E7%BB%84%E4%BB%B6.html)的样式计算精度。
* 调整了[tm-sliderNav组件](https://jx2d.cn/guid/components/%E4%BE%A7%E8%BE%B9%E5%AF%BC%E8%88%AA.html)数据为响应式,方便绑定数据后，更改数组时需要手动同步，现在不需要手动同步了。新增了fontSize字号大小的配置。
* 修改了[tm-listItem组件](https://jx2d.cn//guid/components/%E5%88%97%E8%A1%A8.html)左边内容的宽度为默认的100%（不会影响现有项目，建议插槽时套个view组方便控制内容的宽）。
* 新增[搜索框组件](https://jx2d.cn/guid/components/%E6%90%9C%E7%B4%A2%E6%A1%86.html)
* 微调了九宫格的dot默认位置布局.
* 修复了[展开更多](http://localhost:8081/guid/components/%E5%B1%95%E5%BC%80%E6%9B%B4%E5%A4%9A.html)在微信小程序上嵌套动画组件时,不显示操作按钮.
* 改善了tm-poup样式,现在可以居中弹层了.
* 修复tm-swiper组件在嵌套组件时，计算宽度错误。
## 1.1.5（2021-09-06）
* 紧急修复因暗黑模式导致的个别组件：按钮，下拉选项受到了影响，样式有点问题，现已修复，请尽快更新。
* 重构了button，调整了css样式库
## 1.1.4（2021-09-06）
* #### 兼容了前面的版本。现在基本所有组件都具备了color（注：按钮为theme）和black的属性，可全局切换暗黑
* 现在你可以在任意页面或者组件中，切换为 暗黑 模式。使用方法：this.$store.commit('setTmVuetifyBlack', !this.tmVuetify.black),如果想要某个组件不受全局
  的暗模式影响，只要 :black="false或者true"即可不受全局的暗黑模式影响。
* js中通过this.tmVuetify.black；vue中通过：tmVuetify.black，来获取当前的全局模式：暗黑还是亮色状态。
* 主题切换是通过Vuex方式，因此如果你的项目已经存在了store怎么办？需要通过以下方法改变下：
* 第一种：请进入tool>store>tm-vuetify.js中把它的内容复制出来与你的store合并即可。并且进入：tm-vuetify>index.js中第91行删除或者注释即可
* 第二种：你可以把你的store和我的store合并，就不用作任何操作了，并且会在每个页面自动注入你的store函数，可以任意页面使用全局变量和函数啦。
* 个人建议第二种方法。如果你的项目庞大，请阅读：[官方Vuex介绍](https://uniapp.dcloud.io/vue-vuex),以及Vue的官方介绍[Vuex](https://vuex.vuejs.org/zh/)
* input组件，因为需要兼容一键切换暗黑模式，去掉了默认输入背景灰色，现在默认无背景了。（我觉得影响不大，你可以自己设定背景色）
* 调整了[input组件](https://jx2d.cn/guid/components/%E8%BE%93%E5%85%A5%E6%A1%86.html)的示例。
* 77+组件已经完成了暗黑模式的自动切换。
* 调整了下拉选项的样式，现在下拉的选项为悬浮。不再是静态撑开样式了。
* 细调了[步进器](https://jx2d.cn/guid/components/%E6%AD%A5%E8%BF%9B%E5%99%A8.html)的样式和暗黑模式颜色的搭配，现在更为美观了。把步进器修改为内联模式，而不是独占一行的块状。同时禁止为负，
  现在只能输入正整数，其它字符都会转换为0。 
* 调整了[对话框](https://jx2d.cn/guid/components/%E5%AF%B9%E8%AF%9D%E6%A1%86.html)的样式，更为精美，以适应暗黑模式。弹层的速度加快了。
* 修复了[按钮](https://jx2d.cn/guid/components/%E6%8C%89%E9%92%AE.html)自定义文字主题色时，不生效。
* ##### 重要： 重构了步骤条，变得更强大，属性保持不变，但不兼容之前的版本，主要是不兼容颜色值属性，旧版本只能输入颜色值，现不允许输入颜色值，只允许颜色类，和其它组件保持了统一性，同时提供了三个插槽用于自定义图标颜色等。变得更为美观和精致了。
  移步[步骤条文档查看](https://jx2d.cn/guid/components/%E6%AD%A5%E9%AA%A4%E6%9D%A1.html)
* tm-bottomnavigation底部导航工具栏有了较大的更新，新版本，可以通过数据格式随意定义自己的样式，以突显用户需要的中间凸起的圆或者其它形状。
  每一个项目都可以设置凸起的圆或者其它自己的形状和样式。[预览链接](https://jx2d.cn/guid/components/%E5%BA%95%E9%83%A8%E5%AF%BC%E8%88%AA%E5%B7%A5%E5%85%B7%E6%A0%8F.html) 
* 修复在tm-translate[动画组件](https://jx2d.cn/guid/components/translate%E5%8A%A8%E7%94%BB.html)中嵌套其它组件时，计算高度错误。
* 更新了[tm-empty 数据空](https://jx2d.cn/guid/components/%E6%95%B0%E6%8D%AE%E7%A9%BA.html)组件，新增了label字段，以支持自定义提示文字。
## 1.1.3（2021-09-03）
* 新增[【抽奖游戏组件】](https://jx2d.cn/guid/components/抽奖游戏.html)，UI美观，颜值高，可自己定制，主题切换。
  提供了：九宫格、老虎机、大转盘等常用的三种抽奖类游戏。并且每个游戏提供2套皮肤，当然你也可以自己设计。皮肤精美，游戏
  好定制，可自己指定中奖，中奖概率、奖品图片可自定义。我个人编写不容易且服务器带宽有限，请不要直接引用我的游戏静态资源，请自行下载资源
  到本地使用，提供游戏图片源AI文件，图片无水印。
* 调整了示例库界面和示例源码。
* 调整了类outlined颜色的梯度配比。原有outlined模式是主题色边框加透明背景。现改为：主题色边框+98%的主题色（饱和度的0.98）.
  使之更为柔和，符合整体搭配色彩。
* 缩减了主题库文本颜色的种类，原本是包含218种文本颜色，为了适应小程序大小。所以本次缩减为和背景颜色主题库一样的数量，具体请
  查询官网：[CSS库预置主题](http://localhost:8081/guid/css/%E9%A2%84%E7%BD%AE%E4%B8%BB%E9%A2%98%E5%BA%93.html)，从
  原来的276kb缩减至254。
* 调整了类的投影透明度。黑白没有调整保持为0.08。除了黑白色的所有的颜色默认投影的透明度调整为0.2,原先为0.3；并且调整了投影系统比
  原为1.2的拓展和3.3的系数。改为现在的1.5和4,现在所有有颜色的投影将变得更为柔和的同时也能显现出来投影的颜色。
* 调整了按钮组件默认的圆角，根据大小尺寸不一，各减1upx.
* 调整了css库文字的标准字号原有text-size-型号：xxs:20upx,xs:22upx,s:24upx,n:27upx,g:32upx,lg:34upx,xl:40upx；
  现调整为：xxs:20upx,xs:22upx,s:24upx,n:30upx,g:34upx,lg:36upx,xl:40upx，就是基本的字号由原来的14号字体调整为15号字体
  大小。调整的动机是：不再遵循原有字号理论。因为现在手机屏幕大，分辨率清晰。原有的字号着实过小，看的难受。并且我建议大家使用
  我的类来控制字号。这样方便有的软件：如果需要提供老年人使用时，就直接一键可切换大号字体。
* 主题css库因为一动，就是动整个组件库。因此改变我会非常谨慎。同时调整的同时，还在优化暗黑模式。之后的下个版本1.1.4，将推出主题动态切换的功能。
## 1.1.2（2021-09-01）
* 新增[【时间轴组件】](https://jx2d.cn/guid/components/时间轴.html)，UI美观，我已精心美化。
* 调整了[【帮助提示】](https://jx2d.cn/guid/components/帮助提示.html)弹层的文字大小为n,即标准字号大小。之前是s小号字体，在手机上显示更为合理。
* 新增了[【表格组件】](https://jx2d.cn/guid/components/表格.html)，用于简单的业务展示，自定设置包括：列宽，单元格颜色，单元格夸列宽度设置，列颜色，行颜色，表头
  等业务需要用到的强调显示的功能设置，具体请前往示例文档查阅。
* 调整了slider滑块组件，中间信息块横向显示时不居中的问题，现已调整。同时修复了在拖动滑块时，未阻止冒泡导致拖动的
  同时拖动了页面，影响体验。经实际点按效果圆点在40upx时刚好合适拖动。之前的30upx过小，不好点按。同时优化了刻度尺拖动时
  不够精确的体验。现在如果设定了刻度值拖动将会准确按照设定的值累加拖动。
  同时调整了该示例，并且修改了插槽数据。具体见文档[滑块](https://jx2d.cn/guid/components/%E6%BB%91%E5%9D%97.html)
* 新增了[【展开更多】](https://jx2d.cn/guid/components/展开更多.html)组件，主要用于文章，列表内容的收缩更多和展开更多的显示，或者付费解锁阅读更多的场景。
* 新增了[【双向滑块】](https://jx2d.cn/guid/components/双向滑块.html)，用法与已有的滑块一致，可双向按刻度滑动，双向竖向（刻度），横向双向滑动，
  双向可交叉滑动，丝滑无阻碍。
* 修复组件【密码输入框】](https://jx2d.cn/guid/components/密码输入框.html)，在输入完成后点击【确定】按钮未触发
  confirm事件。这个是我疏忽忘记了。---感谢网友 --xiaolu-- 的提醒。
* 修正组件[【悬浮按钮】](https://jx2d.cn/guid/components/悬浮按钮.html)doc说明文档中对size属性的错误描述。文档写错了。组件是没问题的。
## 1.1.1（2021-08-30）
* 修复了月份日历在ios系统下的bug,我忘记了我的月份日历 和 日历不是同一个库。搞混了。
* 修复日历，在时间范围选择上的一个bug,顺便记录下产生的过程。
使用new Date("2020/8")创建日期，理论上是正常的，但在ios下这是错误的。你需要这样创建：new Date(2020,7),可以查询MSDN文档;
同时美化了下标文本的间距。
* 调整了级联选择器底部的间距，使之更为美观合理。
* 调整了keyborad键盘按钮的默认圆角，调整了键盘标题上下的间距大小使之更为美观。
* 调整了poup的默认圆角由6改为10.
* 美化了password密码输入框的细节样式。
* 美化了upload组件的样式，同时新增了 主题色color 属性选项。
* 新增了文字渐变主题色彩，使用时，输入： text-gradient-色彩名称-accent 即可使文字与渐变背景同样的效果。
* 调整了pullBottom上拉刷新，下触底组件，新增了两个插槽供用户自己定义下拉和松开时显示自己的布局结构。
* 调整了按钮标准和大按钮时的两个的高度为76upx，之前是80upx
* 新增了 【帮助提示】组件，用于辅助弹层式不打扰页面常用的解释文字说明。
* 新增了 【定位组件】组件，用于辅助内容定位
## 1.1.0（2021-08-28）
手机扫码预览
![Image](http://jx2d.cn/uniapp/static/logo_great.png)
### [文档介绍，点此打开](http://jx2d.cn)
![Image](http://jx2d.cn/uniapp/static/qrprev.png)

---
## 1.0.5（2021-08-20）
** 非常好用的组件库，拿来即用 **
这是个初始版本1.0.0,并非1.0.4,因为我不知道怎么修改以前的信息，只能这么覆盖了。<br>
另外：初发版本，可能稳定性不可多 ，后续改动大，我预计要到1.1才能稳定。因为，不建议大家拿来生产用<br>
总的来说问题不大，如果觉得可以，对你有帮助，帮点个5星。如果觉得还不够完善，请再等下使用，等到稳定版本。会很快的。
***

### [文档介绍，点此打开](http://jx2d.cn)

***
## 1.0.4（2021-08-19）
** 非常好用的组件库，拿来即用 **

更新了新的文档库见下方。

***

### [文档介绍，点此打开](http://jx2d.cn)

***

2021年8月19日14:57:35
