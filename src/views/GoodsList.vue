<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>Goods</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods">Price
            <svg class="icon icon-arrow-short" :class="{'sort-up': !sortFlag}">
              <use xlink:href="#icon-arrow-short"></use>
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class="{'filterby-show': filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" @click="setPriceFilter('all')"
                     :class="{'cur': priceChecked == 'all'}">All</a></dd>
              <dd v-for="(item, index) in priceFilter" :key="index">
                <a @click="setPriceFilter(index)" href="javascript:void(0)" :class="{'cur': priceChecked == index}">{{
                  item.startPrice }} - {{ item.endPrice }}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item, index) in goodsList" :key="index">
                  <div class="pic">
                    <a href="#"><img :src="'static/'+item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{ item.productName }}</div>
                    <div class="price">￥{{ item.salePrice }}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addShopToCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10"
                 class="load-more">
              <img src="../assets/loading-spinning-bubbles.svg" alt="" v-show="loading">
            </div>
            <div class="md-overlay" v-show="overLayFlag" @click.stop="closePop"></div>

            <!-- 未登录加入购物车模态框 -->
            <modal :modalShow="errModalShow" @hideModal="hideModal">
              <p slot="message">
                请先登录,否则无法加入到购物车中!
              </p>
              <div slot="btnGroup">
                <a href="javascript:;" class="btn btn--m" @click="errModalShow=false">关闭</a>
              </div>
            </modal>

            <!-- 加入购物车成功模态框 -->
            <modal :modalShow="successModalShow" @hideModal="hideModal">
              <p slot="message">
                <svg class="icon-status-ok">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
                </svg>
                加入购物车成功！
              </p>
              <div slot="btnGroup">
                <a href="javascript:;" class="btn btn--m" @click="successModalShow=false">继续购物</a>
                <router-link class="btn btn--m" to="/cart">查看购物车</router-link>
              </div>
            </modal>

          </div>
        </div>
      </div>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>

<script>
  import NavHeader from '@/components/NavHeader';
  import NavFooter from '@/components/NavFooter';
  import NavBread from '@/components/NavBread';
  import Modal from '@/components/Modal'
  import axios from 'axios';
  import api from '@/api';

  export default {
    data() {
      return {
        goodsList: [],
        priceFilter: [
          {
            startPrice: '0.00',
            endPrice: '100.00'
          },
          {
            startPrice: '100.00',
            endPrice: '500.00'
          },
          {
            startPrice: '500.00',
            endPrice: '1000.00'
          },
          {
            startPrice: '1000.00',
            endPrice: '5000.00'
          }
        ],
        priceChecked: 'all', // 控制显示筛选栏
        filterBy: false, // 显示隐藏价格筛选
        overLayFlag: false, // 显示隐藏遮罩层
        sortFlag: true, // 1 为升序， 2 为降序
        page: 1,
        pageSize: 8,
        busy: true, // 控制滚动是否触发懒加载，false 开启，true 不开启
        priceGt: 'all', // 筛选价格最小值
        priceLte: '', // 筛选价格最大值
        loading: false, // 控制加载图片
        errModalShow: false,
        successModalShow: false
      }
    },
    created() {
      this.getGoodsList();
    },
    components: {
      NavHeader,
      NavFooter,
      NavBread,
      Modal
    },
    methods: {
      getGoodsList(flag) {
        let params = {
          page: parseInt(this.page),
          pageSize: parseInt(this.pageSize),
          sort: this.sortFlag ? 1 : -1,
          priceGt: this.priceGt,
          priceLte: this.priceLte
        }
        axios.get('/goods', {
          params
        }).then(result => {
          if (result.data.status == 0) {
            if (flag) {
              this.goodsList = this.goodsList.concat(result.data.result.list);
            } else {
              this.goodsList = result.data.result.list;
            }
            this.busy = (result.data.result.length < 8) ? true : false;
          } else {
            this.goodsList = [];
          }
        })
      },
      // 排序商品
      sortGoods() {
        this.sortFlag = !this.sortFlag;
        this.getGoodsList();
      },
      showFilterPop() {
        this.filterBy = true;
        this.overLayFlag = true;
      },
      closePop() {
        this.filterBy = false;
        this.overLayFlag = false;
      },
      // 点击筛选价格
      setPriceFilter(index) {
        this.priceChecked = index;
        this.page = 1;
        switch (index) {
          case 0:
            this.priceGt = 0;
            this.priceLte = 100;
            break;
          case 1:
            this.priceGt = 100;
            this.priceLte = 500;
            break;
          case 2:
            this.priceGt = 500;
            this.priceLte = 1000;
            break;
          case 3:
            this.priceGt = 1000;
            this.priceLte = 5000;
            break;
          case 'all':
            this.priceGt = 'all';
            this.priceLte = 0;
            break;
        }
        this.getGoodsList();
        this.closePop();
      },
      // 懒加载效果
      loadMore() {
        this.loading = true;
        this.busy = false;
        setTimeout(() => {
          this.page++;
          this.getGoodsList(true);
          this.loading = false;
        }, 500)
      },
      addShopToCart(productId) {
        axios.post('/goods/addCart', {productId}).then(result => {
          if(result.data.status == 0) {
            this.successModalShow = true
            this.$store.commit('updateCartCount', 1);
          } else {
            this.errModalShow = true
          }
        })
      },
      hideModal() {
        this.errModalShow = false
        this.successModalShow = false
      }
    }
  }
</script>

<style scoped>
  .load-more {
    padding-top: 30px;
    text-align: center;
  }
  .sort-up {
    transform: rotate(180deg);
    transition: all .3s ease-out;
  }
   .icon-arrow-short {
    transition: all .3s ease-out;
  }
</style>
