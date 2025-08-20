const UnihaloVoteUid = "unihalo_vote_uid"

export const voteCacheUtil = {
	getAll() {
		const data = uni.getStorageSync(UnihaloVoteUid)
		if (!data) {
			return null
		}
		return JSON.parse(data)
	},
	get(name) {
		const data = this.getAll()
		if (!data) {
			return null
		}
		return data[name]
	},
	has(name) {
		const data = this.getAll()
		if (!data) return false
		return data[name] != undefined
	},
	set(name, value) {
		let data = this.getAll()
		if (!data) {
			data = {
				[name]: value
			}
		} else {
			data[name] = value
		}
		uni.setStorageSync(UnihaloVoteUid, JSON.stringify(data))
	}
}