export default {
	state: {
		source: 0,
		advNative: false,
		advPush: false,
		advPopunder: false,
		advMatrix: 0
	},
	mutations: {
		ADD_SOURCE: (state, payload) => {
			state.source = payload
		},
		ADD_ADVNATIVE: (state, payload) => {
			state.advNative = payload
		},
		ADD_ADVPUSH: (state, payload) => {
			state.advPush = payload
		},
		ADD_ADVPOPUNDER: (state, payload) => {
			state.advPopunder = payload
		},
		ADD_ADVMATRIX: (state, payload) => {
			state.advMatrix = payload
		}
	},
	actions: {
		SAVE_SOURCE: ({commit}, payload) => {
			commit('ADD_SOURCE', payload)
		},
		SAVE_ADVNATIVE: ({commit}, payload) => {
			commit('ADD_ADVNATIVE', payload)
		},
		SAVE_ADVPUSH: ({commit}, payload) => {
			commit('ADD_ADVPUSH', payload)
		},
		SAVE_ADVPOPUNDER: ({commit}, payload) => {
			commit('ADD_ADVPOPUNDER', payload)
		},
		SAVE_ADVMATRIX: ({commit}, payload) => {
			commit('ADD_ADVMATRIX', payload)
		}
	},
	getters: {
		SOURCE: state => {
			return state.source
		},
		ADVNATIVE: state => {
			return state.advNative
		},
		ADVPUSH: state => {
			return state.advPush
		},
		ADVPOPUNDER: state => {
			return state.advPopunder
		},
		ADVMATRIX: state => {
			return state.advMatrix
		}
	},
};