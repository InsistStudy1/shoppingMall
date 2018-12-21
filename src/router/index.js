import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '@/views/GoodsList'
import Cart from '@/views/Cart'
import Address from '@/views/Address'
import OrderConfirm from '@/views/orderConfirm'
import OrderSuccess from '@/views/OrderSuccess'
import scroll from '@/1/scroll'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path: '/scroll',
      name: 'scroll',
      component: scroll
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart
    },
    {
      path: '/address',
      name: 'Address',
      component: Address
    },
    {
      path: '/orderconfirm',
      name: 'OrderConfirm',
      component: OrderConfirm
    },
    {
      path: '/ordersuccess',
      name: 'OrderSuccess',
      component: OrderSuccess
    }
  ]
})
