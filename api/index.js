/**
 *  功能：全局API管理
 *  作者：小莫唐尼
 *  邮箱：studio@925i.cn
 *  时间：2022年07月21日 19:14:44
 *  版本：v0.1.0
 *  修改记录：
 *  修改内容：
 *  修改人员：
 *  修改时间：
 */

import HttpHandler from '@/common/http/request.js'

import archive from './archive.js'
import article from './article.js'
import blogger from './blogger.js'
import category from './category.js'
import tag from './tag.js'
import comment from './comment.js'
import journal from './journal.js'
import link from './link.js'
import menu from './menu.js'
import option from './option.js'
import photo from './photo.js'
import post from './post.js'
import sheet from './sheet.js'
import statistics from './statistics.js'
import theme from './theme.js'

// 管理端
import admin_login from './admin/user.js'
import admin_links from './admin/links.js'
import admin_attachment from './admin/attachment.js'
import admin_category from './admin/category.js'
import admin_journal from './admin/journal.js'
import admin_photos from './admin/photos.js'
import admin_tags from './admin/tags.js'
import admin_comments from './admin/comments.js'
import admin_posts from './admin/posts.js'
import admin_logs from './admin/logs.js'

// 2.0接口
import v2 from './v2/all.api.js'

const ApiManager = {
	v2,
	...archive,
	...article,
	...blogger,
	...category,
	...tag,
	...comment,
	...journal,
	...link,
	...option,
	...photo,
	...post,
	...sheet,
	...statistics,
	...theme,
	// 管理端的api
	admin: {
		...admin_login,
		...admin_links,
		...admin_attachment,
		...admin_category,
		...admin_journal,
		...admin_photos,
		...admin_tags,
		...admin_comments,
		...admin_posts,
		...admin_logs
	}
};

const install = (Vue) => {
	Vue.prototype.$httpApi = ApiManager
}

export default {
	install
}
