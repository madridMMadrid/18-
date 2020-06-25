import Vue from 'vue'
import Vuex from 'vuex'

import post from './modules/post'
import header from './modules/header'
import source from './modules/source'
import lang from './modules/lang'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    post,
    header,
    source,
    lang
  }
})


