/**
 *  功能：应用配置
 *  作者：小莫唐尼
 *  邮箱：studio@925i.cn
 *  时间：2024年06月22日 12:00:44
 *  版本：v0.1.0
 */
import {DefaultAppConfigs, getAppConfigs, setAppConfigs} from '@/config/index.js'
import v2Config from '@/api/v2/all.config.js'

export default {
    namespaced: true,
    state: {
        configs: getAppConfigs(),
    },
    getters: {
        getConfigs(state) {
            if (state.configs) return state.configs;
            return getAppConfigs()
        },
    },
    mutations: {
        setConfigs(state, data) {
            state.configs = data;
            setAppConfigs(data)
        },
    },
    actions: {
        fetchConfigs({commit, dispatch}) {
            return new Promise(async (resolve, reject) => {
                try {
                    const res = await v2Config.getAppConfigs()
                    if (res) {
                        commit('setConfigs', res)
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
        setDefaultAppSettings({commit}) {
            commit('setConfigs', JSON.parse(JSON.stringify(DefaultAppConfigs)))
        },
    }
};
