/**
 * markdown配置
 */

import {getAppConfigs} from '@/config/index.js'
import HaloTokenConfig from '@/config/token.config.js'
import utils from '@/utils/index.js'

export default {
    domain: HaloTokenConfig.BASE_API,
    tagStyle: {
        table: ` 
			table-layout: fixed;
			border-collapse:collapse;
			margin-bottom: 18px;
			overflow: hidden;
			font-size: 13px;
			color: var(--routine);
			background: #f2f6fc;
			border: 1px solid #dcdcdc;
			border-radius: 4px;
		`,
        th: `
			padding: 8px;
			border-right: 1px solid var(--classE);
			border-bottom: 1px solid var(--classE);
		`,
        td: `
			padding: 8px;
			border-right: 1px solid var(--classE);
			border-bottom: 1px solid var(--classE);
		`,
        blockquote: `
			padding: 8px 15px;
		    color: #606266;
		    background: #f2f6fc;
		    border-left: 5px solid #50bfff;
		    border-radius: 4px;
			line-height: 26px;
			margin-bottom: 18px;
		`,
        ul: 'padding-left: 15px;line-height: 1.85;',
        ol: 'padding-left: 15px;line-height: 1.85;',
        li: 'margin-bottom: 12px;line-height: 1.85;',
        h1: `
			margin: 30px 0 20px;
			color: var(--main);
			line-height: 24px;
			position: relative;
			font-size:1.2em;
			`,
        h2: `
			color: var(--main);
			line-height: 24px;
			position: relative;
			margin: 22px 0 16px;
			font-size: 1.16em;
		`,
        h3: `
		    color: var(--main);
		    line-height: 24px;
		    position: relative;
			margin: 26px 0 18px;
			font-size: 1.14em;
		`,
        h4: `
			color: var(--main);
		    line-height: 24px;
		    margin-bottom: 18px;
		    position: relative;
			font-size: 1.12em;
		`,
        h5: `
			color: var(--main);
		    line-height: 24px;
		    margin-bottom: 14px;
		    position: relative;
			font-size: 1.1em;
		`,
        h6: `
			color: #303133;
			line-height: 24px;
			margin-bottom: 14px;
			position: relative;
			font-size: 14px;
		`,
        p: `
		    line-height: 1.65;
		    margin-bottom: 14px;
			font-size: 14px;
		`,
        'code': `  `,
        strong: 'font-weight: 700;color: rgb(248, 57, 41);',
        video: 'width: 100%',
    },
    containStyle: 'font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, "PingFang SC", Cambria, Cochin, Georgia, Times, "Times New Roman", serif;padding:12px;font-size: 14px;color: #606266;word-spacing: 0.8px;letter-spacing: 0.8px;border-radius: 6px;background-color:#FFFFFF;',

    loadingGif: utils.checkImageUrl(getAppConfigs().imagesConfig.loadingGifUrl),
    emptyGif: utils.checkImageUrl(getAppConfigs().imagesConfig.loadingEmptyUrl),
}
