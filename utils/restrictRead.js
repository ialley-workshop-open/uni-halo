/**
 * 检查文章是否受限
 * @param post
 * @returns {boolean}
 */
export function checkPostRestrictRead(post) {
    const annotations = post?.metadata?.annotations;
    const restrictReadEnable = annotations?.restrictReadEnable;

    if (restrictReadEnable === 'false') return false;

    const restrictType = restrictReadEnable;
    const raw = post.content.raw;

    const startTag = `<!-- ${restrictType}:restrict-read-html-tpl start -->`;
    const endTag = `<!-- ${restrictType}:restrict-read-html-tpl end -->`;

    // 使用正则模糊匹配（允许前后有空白字符）
    const startRegex = new RegExp(`\\s*${escapeRegExp(startTag)}\\s*`);
    const endRegex = new RegExp(`\\s*${escapeRegExp(endTag)}\\s*`);

    return startRegex.test(raw) && endRegex.test(raw);
}

/**
 * 替换受限内容
 * @param post
 * @param replacement
 * @returns {*}
 */
export function replaceRestrictedContent(post, replacement = '') {
    const annotations = post?.metadata?.annotations;
    const restrictReadEnable = annotations?.restrictReadEnable;

    if (restrictReadEnable === 'false') return post.content.raw;

    const restrictType = restrictReadEnable;
    const raw = post.content.raw;

    const startTag = `<!-- ${restrictType}:restrict-read-html-tpl start -->`;
    const endTag = `<!-- ${restrictType}:restrict-read-html-tpl end -->`;

    const startRegex = new RegExp(`\\s*${escapeRegExp(startTag)}\\s*`, 'g');
    const endRegex = new RegExp(`\\s*${escapeRegExp(endTag)}\\s*`, 'g');

    // 构造完整匹配的正则
    const pattern = `${startRegex.source}(.*?)${endRegex.source}`;
    const regex = new RegExp(pattern, 'gs');

    return raw.replace(regex, replacement);
}

// 常量定义（可抽离到 constants.js）
const PLACEHOLDER = 'restrict-read-placeholder';

/**
 * 获取可展示的HTML内容块
 * @param {Object} post - 文章对象
 * @returns {string[]} - 分割后的HTML片段数组
 */
export function getShowableContent(post) {
    const restrictEnabled = checkPostRestrictRead(post);
    const rawContent = post?.content?.raw || '';

    // 替换受限内容为占位符
    const processedContent = restrictEnabled
        ? replaceRestrictedContent(post, PLACEHOLDER)
        : rawContent;

    // 按占位符分割内容
    const contentFragments = processedContent
        .split(PLACEHOLDER)
        .map(fragment => fragment.trim())
        .filter(fragment => fragment);

    // 移除最后一个元素如果它只包含HTML标签而无实际文本
    if (contentFragments.length > 0 && isHtmlEmpty(contentFragments[contentFragments.length - 1])) {
        contentFragments.pop();
    }

    console.log('contentFragments:', contentFragments);

    return contentFragments;
}

/**
 * 获取受限阅读类型名称
 * @param post
 * @returns {string}
 */
export function getRestrictReadTypeName(post) {
    const annotations = post?.metadata?.annotations;
    const restrictReadEnable = annotations?.restrictReadEnable;

    if (restrictReadEnable === 'false') return '';
    if (restrictReadEnable === 'password') return '密码';
    if (restrictReadEnable === 'code') return '验证码';
    if (restrictReadEnable === 'login') return '登录';
    if (restrictReadEnable === 'pay') return '付费';
    if (restrictReadEnable === 'comment') return '评论';
}

/**
 * 复制文本到剪贴板
 * @param text
 * @returns {Promise<void>}
 */
export async function copyToClipboard(text) {
    try {
        await uni.setClipboardData({
            data: text,
            success: () => {
                uni.showToast({
                    title: '复制成功',
                    icon: 'success'
                });
            }
        });
    } catch (error) {
        console.error('复制出错:', error);
    }
}

/**
 * 转义字符串用于正则表达式
 * @param string
 * @returns {*}
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 判断字符串去除HTML标签后是否为空
 * @param {string} html
 * @returns {boolean}
 */
function isHtmlEmpty(html) {
    return !html || !html.replace(/<[^>]+>/g, '').trim();
}