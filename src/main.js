// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex';
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
// 懒加载插件
import infiniteScroll from 'vue-infinite-scroll'
// 格式化货币
import {currency} from "./util/currency";
import axios from 'axios';

import api from '@/api';

import scroll from 'vue-seamless-scroll'
Vue.use(scroll)

Vue.use(infiniteScroll);
Vue.use(Vuex);

import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/product.css'

const store = new Vuex.Store({
  state: {
    nickName: '',
    cartCount: 0
  },
  mutations: {
    setNickName(state, nickName) {
      state.nickName = nickName;
    },
    setCartCount(state, count) {
      state.cartCount = count;
    },
    updateCartCount(state, count) {
      state.cartCount += count;
    }
  }
})

Vue.use(VueLazyLoad, {
  loading: "/static/loading-svg/loading-bars.svg"
});

Vue.filter('currency', currency);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>',
  store
})
