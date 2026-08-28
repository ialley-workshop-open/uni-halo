/**
 *  功能：应用配置
 *  作者：小莫唐尼
 *  邮箱：studio@925i.cn
 *  时间：2024年06月22日 12:00:44
 *  版本：v0.1.0
 */
import {DefaultAppConfigs, getAppConfigs, getAppMockJson, setAppConfigs, setAppMockJson} from '@/config/index.js'
import {DefaultHaloGlobalConfigs, getHaloGlobalConfigs, setHaloGlobalConfigs} from '@/config/halo.config.js'
import v2Config from '@/api/v2/all.config.js'
import utils from '@/utils/index.js'
import {setTokens} from "@/utils/token";

export default {
    namespaced: true,
    state: {
		haloConfig: getHaloGlobalConfigs(),
        configs: getAppConfigs(),
        mockJson: getAppMockJson(),
    },
    getters: {
		getHaloConfig(state) {
			if (state.haloConfig) return state.haloConfig;
			return getHaloGlobalConfigs();
		},
        getConfigs(state) {
            if (state.configs) return state.configs;
            return getAppConfigs()
        },
        getMockJson(state) {
            if (state.mockJson) return state.mockJson;
            return getAppMockJson()
        }
    },
    mutations: {
		setHaloConfigs(state, data) {
			state.haloConfig = data;
			setHaloGlobalConfigs(data);
		},
        setConfigs(state, data) {
            state.configs = data;
            setAppConfigs(data)
        },
        setMockJson(state, data) {
            setAppMockJson(data)
            state.mockJson = data;
        }
    },
    actions: {
		fetchHaloConfigs({state, commit, dispatch}) {
		    return new Promise(async (resolve, reject) => {
		        try {
		            const res = await v2Config.getHaloGlobalInfo()
		            if (res) {
		                commit('setHaloConfigs', utils.deepMerge(DefaultHaloGlobalConfigs, res))
		                resolve(res)
		            } else {
		                dispatch("setDefaultHaloGlobalConfigs");
		                reject()
		            }
		        } catch (e) {
		            dispatch("setDefaultHaloGlobalConfigs");
		            reject()
		        }
		    })
		},
        fetchConfigs({state, commit, dispatch}) {
            return new Promise(async (resolve, reject) => {
                try {
                    const res = await v2Config.getAppConfigs()
                    if (res) {
                        commit('setConfigs', utils.deepMerge(DefaultAppConfigs, res))

                        // 存储token
                        if (res?.basicConfig?.tokenConfig) {
                            setTokens(res.basicConfig.tokenConfig)
                        }
                        resolve(res)
                    } else {
                        dispatch("setDefaultAppSettings");
                        reject()
                    }
                } catch (e) {
                    dispatch("setDefaultAppSettings");
                    reject()
                }
            })
        },
		// 设置默认的数据
		setDefaultHaloGlobalConfigs({commit}) {
		    commit('setHaloConfigs', JSON.parse(JSON.stringify(DefaultHaloGlobalConfigs)))
		},
        // 设置默认的数据
        setDefaultAppSettings({commit}) {
            commit('setConfigs', JSON.parse(JSON.stringify(DefaultAppConfigs)))
        },
        // 请求模拟数据
        fetchMockJson({state, commit, dispatch}) {
            return new Promise(async (resolve, reject) => {
                const mockJsonUrl = utils.checkUrl(state.configs.basicConfig.auditModeMockUrl)
                uni.request({
                    url: mockJsonUrl,
                    method: "GET",
                    success: (res) => {
                        commit('setMockJson', res.data)
                        resolve({
                            ok: true,
                            data: res.data
                        })
                    },
                    fail: (err) => {
                        resolve({
                            ok: false,
                            data: err
                        })
                    }
                })
            })
        },
    }
};
