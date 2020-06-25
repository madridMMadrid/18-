export default {
	state: {
		checked: false,
		links: [
			{ value: "See.XXX", link: "https://see.xxx/?source=81" },
			{ value: "PornJ", link: "https://pornj.com/?source=81" },
			{ value: "TubeREL", link: "https://tuberel.com/?source=81" },
			{ value: "TheGay", link: "https://thegay.porn/?source=81" },
			{ value: "ImZog", link: "https://imzog.com/?source=81" },
			{ value: "PartySexs", link: "https://partysexs.com/?source=81" },
			{ value: "SSS.XXX", link: "https://sss.xxx/?source=81" },
			{ value: "PornL", link: "https://pornl.com/?source=81" },
			{ value: "iPornia", link: "https://ipornia.com/?source=81" },
			{ value: "PornQ", link: "https://pornq.com/?source=81" },
			{ value: "Porn555", link: "https://porn555.com/?source=81" },
			{ value: "PornForRelax", link: "https://pornforrelax.com/?source=81" },
			{ value: "PuPorn", link: "https://puporn.com/?source=81" },
            { value: "HClips", link: "https://hclips.com/?source=81" },
            { value: "Upornia", link: "https://upornia.com/?source=81" },
            { value: "HDZog", link: "https://hdzog.com/?source=81" },
            { value: "HotMovs", link: "https://hotmovs.com/?source=81" },
            { value: "VoyeurHit", link: "https://voyeurhit.com/?source=81" },
            { value: "TubePornClassic", link: "https://tubepornclassic.com/?source=81" },
            { value: "VJAV", link: "https://vjav.com/?source=81" },
            { value: "100HomeMade", link: "https://100homemade.com/?source=81" },
            { value: "ShemaleZ", link: "https://shemalez.com/?source=81" },
		  ],
		  
	},
	mutations: {
		ADD_CHECKED: (state, payload) => {
			state.checked = payload
		}
	},

	actions: {
		SAVE_CHECKED: ({commit}, payload) => {
			commit('ADD_CHECKED', payload)
		}
	},
	getters: {
		CHECKED: state => {
			return state.checked
		},
		LINKS: state => {
			return state.links
		}
	},
};