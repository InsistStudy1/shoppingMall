const localUrl = "http://127.0.0.1:3000";
const version = '/api/v1';

const api = {
  goods: `${version}/goods`, // 获取商品列表
  addCart: `${version}/goods/addCart`, // 添加购物车
  cartList: `${version}/users/cartList`, //获取购物车列表
  deleteCartGood: `${version}/users/deleteCartGood`, // 删除购物车商品
  editCartGood: `${version}/users/editCartGood`, // 修改购物车商品信息
  editCheckAll: `${version}/users/editCheckAll`, // 全选购物车
}
window.api = api;
module.exports = api;
