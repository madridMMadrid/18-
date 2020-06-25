export default {
	state: {
		lang: '',
	},
	mutations: {
		SAVE_LANG: (state, payload) => {
			state.lang = payload
		}
	},

	actions: {
		CHANGE_LANG: ({commit}, payload) => {
			commit('SAVE_LANG', payload)
		}
	},
	getters: {
		LANG: state => {
			return state.lang
		}
	},
};