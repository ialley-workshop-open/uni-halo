import util from './util';

/**
 * 微信小程序分享功能。
 */
var cfg = function(){
    
    let config = {
        ...(this.$tm.vx.store.state.tmVuetify.wxshareConfig_miniMp || {})
    };
    if (typeof config.query !== 'object') config.query = {};
    //获取当前路径。
    if(!config.path){
        let cur = getCurrentPages();
        config.path = cur[cur.length-1].route;

        config.path = (config.path[0]=='/'?'' : '/') + config.path;
        config.copyLink = config.path;
        
    }
    // util.httpUrlAddKey
    let query = ''
    for (const key in config.query) {
        if (config.hasOwnProperty.call(config.query, key)) {
            const element = config.query[key];
            query = util.httpUrlAddKey(query,key,element)
        }
    }
    config.copyLink = config.path = config.path+query;
    config.query = query;
    
    return config;


}
var sharebywx = {
    onShareAppMessage() {
        let cg = cfg.call(this)||{};
        
        return { ...cg}
    },
    onShareTimeline() {
        let cg = cfg.call(this) || {};
       
        return { ...cg }
    }
}


export default { sharebywx }
