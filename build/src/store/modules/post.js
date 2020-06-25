export default {
  state: () => ({
    categories: [],
    topCategories: [],
    sortCategoties: null,
    source: null,
    count: 0,
    blocks: [],
    matrix: '',
    durationData: ["0", "1", "3", "5", "10", "20", "30+"],
    browserWidth: null,
    checkedMenu: false,
    loading: 0
  }),

  actions: {
    async myGetCategories({ commit }) {
      const res = await fetch(process.env.VUE_APP_BACKEND_URL + 'api/category')
      const res_top = await fetch(process.env.VUE_APP_BACKEND_URL + 'api/category/top')

      const categories = await res.json()
      const topCategories = await res_top.json()

      commit('categoriesPost', categories)
      commit('topCategoriesPost', topCategories)
      commit('sortCategoties', categories)

    },
    writeMatrix({commit}, matrix) {
      commit('getMatrix', matrix)
    },
    loadingCount({commit}, loading) {
      commit('getLoading', loading)

    }
  },
  mutations: {
    getLoading: (state, loading) => {
      state.loading = loading
    },
    getMatrix: (state, matrix) => {
      state.matrix = matrix
    },
    getBlocks: (state, block) => {
      state.blocks.push(block)
    },

    sortCategoties: (state, categories) => {
      let source = categories;

      let her = {};
      for (let i = 0; i < source.length; i++) {
        if (!her[source[i].Name[0]]) {
          her[source[i].Name[0]] = [];
        }
        her[source[i].Name[0]].push(source[i]);
      }
      state.sortCategoties = her;
    },
    categoriesPost: (state, categories) => {
      categories.sort((a, b) => {
        if (a.Name < b.Name) {
          return -1;
        }
      });
      state.categories = categories
    },
    topCategoriesPost: (state, topCategories) => {
      // topCategories.sort((a, b) => {
      //   if (a.Name < b.Name) {
      //     return -1;
      //   }
      // });
      state.topCategories = topCategories
    },

  },
  getters: {
    matrix: state => {
      return state.matrix
    },
    durationData: state => {
      return state.durationData
    },
    increment: state => {
      return state.count
    },
    sortCategoties: state => {
      return state.sortCategoties
    },
    topCategories: state => {
      return state.topCategories
    },
    categories: state => {
      return state.categories
    },
    checkedMenu: state => {
      return state.checkedMenu
    },
    loading: state => {
      return state.loading
    }
  },
}