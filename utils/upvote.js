export const upvote = {
	get(key) {
		const data = uni.getStorageSync(`upvote.${key}.halo.run`)
		if (data) {
			return JSON.parse(data)
		} else {
			return []
		}
	},
	has(key, name) {
		const list = this.get(key)
		if (list.length == 0) return false;
		return list.includes(name)
	},
	set(key, name) {
		const list = this.get(key)
		uni.setStorageSync(`upvote.${key}.halo.run`, JSON.stringify([...list, name]))
	}
}