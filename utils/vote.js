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

export const VOTE_TYPES = {
	"pk": "双选PK",
	"multiple": "多选",
	"single": "单选"
}

export const VOTE_STATES = {
	"未开始": {
		state: "未开始",
		color: "orange"
	},
	"进行中": {
		state: "进行中",
		color: "green"
	},
	"已结束": {
		state: "已结束",
		color: "red"
	},
}

export const calcVoteState = (vote) => {
	if (vote.spec.timeLimit !== 'custom') {
		return vote.spec.hasEnded ? VOTE_STATES["已结束"] : VOTE_STATES["进行中"]
	}

	const nowTime = new Date().getTime()
	const startTime = new Date(vote.spec.startDate).getTime()
	const endTime = new Date(vote.spec.endDate).getTime()

	if (nowTime < startTime) {
		return VOTE_STATES["未开始"]
	}
	if (nowTime < endTime) {
		return VOTE_STATES["进行中"]
	}
	return vote.spec.hasEnded ? VOTE_STATES["已结束"] : VOTE_STATES["进行中"]
}

export const calcVotePercent = (vote, voteOption) => {
	if (!vote || !voteOption) return 0
	const votedDataList = vote?.stats?.voteDataList || []
	if (votedDataList.length == 0) return 0
	const voteCount = vote?.stats?.voteCount || 0
	if (voteCount == 0) return 0

	const _voteOption = votedDataList.find(x => x.id == voteOption.id)
	if (!_voteOption) return 0;
	const percent = (_voteOption.voteCount / voteCount) * 100
	return Math.round(percent)
}