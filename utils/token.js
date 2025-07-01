import {getCache, setCache} from "./storage";
import utils from "./index"

export const APP_TOKENS_KEY = "APP_TOKENS";


/**
 * 获取 tokens
 */
export function getTokens() {
    const tokens = getCache(APP_TOKENS_KEY);
    return tokens ?? null;
}

/**
 * 设置 tokens
 */
export function setTokens(value) {
    setCache(APP_TOKENS_KEY, value);
    return true;
}

/**
 * 设置 tokens
 */
export function updateTokens(value) {
    if (!value) return false
    const tokens = getTokens(APP_TOKENS_KEY);
    if (!tokens) return false
    setTokens(utils.deepMerge(tokens, value))
    return true
}

/**
 * 获取 系统token
 */
export function getPersonalToken() {
    const tokens = getTokens(APP_TOKENS_KEY);
    console.log("tokens", tokens)
    return tokens?.personalToken;
}

/**
 * 设置 系统token
 */
export function setPersonalToken(personalToken) {
    const tokens = getCache(APP_TOKENS_KEY);
    if (!tokens) return false
    tokens.personalToken = personalToken
    updateTokens(tokens)
    return true
}
