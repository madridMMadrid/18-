import Vue from 'vue';
import store from './store'
import VueRouter from 'vue-router';
import BootstrapVue from 'bootstrap-vue';
import App from './App.vue';


import Home from './components/Home.vue'
import HomePage from './components/HomePage.vue';
import CategoryPage from './components/CategoryPage.vue';
import SearchPage from './components/SearchPage.vue';
import Admin from './components/Admin.vue'
import pageNotFaund from './components/pageNotFaund.vue'
import ForTest from './components/ForTest.vue'
import Parent from './components/myTest/Parent.vue'


import i18n from '@/plugins/i18n';
import FlagIcon from 'vue-flag-icon';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import VideosPage from "./components/VideosPage";
import browserDetect from "vue-browser-detect-plugin";

Vue.use(browserDetect);
Vue.use(FlagIcon)
Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.config.productionTip = false;

export const bus = new Vue()

Vue.directive('scroll', {
  inserted: function (el, binding) {
    let f = function (evt) {
      if (binding.value(evt, el)) {
        window.removeEventListener('scroll', f)
      }
    }
    window.addEventListener('scroll', f)
  }
})

const router = new VueRouter({
  mode: 'history',
  base: '',
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/search/',
      component: SearchPage,
    },
    {
      path: '/category/:categorySlug/',
      component: CategoryPage,
    },
    {
      path: '/videos/',
      component: VideosPage,
    },
    {
      path: '/admin/*',
      component: Admin,
    },
    {
      path: '*',
      component: pageNotFaund,
    },
    {
      path: '/test/',
      component: ForTest
    },
    {
      path: '/parent/',
      component: Parent
    }
  ],
});

new Vue({
  i18n,
  router,
  store,
  render: h => h(App),
}).$mount('#app');
