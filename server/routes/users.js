let express = require('express');
let router = express.Router();
let User = require('../models/users');
require('../util/util');

// 登录
router.post('/login', (req, res, next) => {
  var param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(param, (err, UserDoc) => {
    if (err) {
      return res.json({
        status: 1,
        message: err.message
      })
    }
    if (!UserDoc) {
      return res.json({
        status: '2',
        msg: '用户密码错误'
      })
    }
    res.cookie('userId', UserDoc.userId, {
      path: '/', // cookie 存储在根路径
      maxAge: 1000 * 60 * 60 * 12 //存储时间
    })
    res.cookie('userName', UserDoc.userName, {
      path: '/',
      maxAge: 1000 * 60 * 60
    })
    res.json({
      status: 0,
      message: '',
      result: {
        userName: UserDoc.userName
      }
    })
  })
})
// 登出
router.post('/logout', (req, res, next) => {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  })
  res.cookie('userName', '', {
    path: '/',
    maxAge: -1
  })
  res.json({
    status: 0,
    message: '',
    result: ''
  })
})
// 判断是否登录
router.post('/checkLogin', (req, res, next) => {
  if (req.cookies.userId) {
    return res.json({
      status: 0,
      message: '',
      result: {
        userName: req.cookies.userName
      }
    })
  }
})
// 获取购物车列表
router.get('/cartList', (req, res, next) => {
  let userId = req.cookies.userId;
  User.findOne({userId}, (err, UserDoc) => {
    if (err) {
      return res.json({
        status: 1,
        message: err.message,
        result: ''
      })
    }
    if (UserDoc) {
      res.json({
        status: 0,
        message: '',
        result: {
          cartList: UserDoc.cartList
        }
      })
    }
  })
})
// 删除购物车商品
router.post('/deleteCartGood', (req, res, next) => {
  let userId = req.cookies.userId;
  let productId = req.body.productId;
  User.update({userId}, {
    $pull: {
      cartList: {
        productId
      }
    }
  }, (err, doc) => {
    if (err) {
      return res.json({
        status: 1,
        message: err.message,
        result: ''
      })
    }
    if (doc) {
      res.json({
        status: 0,
        message: '',
        result: 'success'
      })
    }
  })
})
// 修改购物车商品
router.post('/editCartGood', (req, res, next) => {
  let userId = req.cookies.userId;
  let productId = req.body.productId;
  let productNum = req.body.productNum;
  let checked = req.body.checked;
  User.update({userId, "cartList.productId": productId}, {
    "cartList.$.productNum": productNum,
    "cartList.$.checked": checked
  }, (err, doc) => {
    if (err) {
      return res.json({
        status: 1,
        message: err.message,
        result: ''
      })
    }
    if (doc) {
      res.json({
        status: 0,
        message: '',
        result: 'success'
      })
    }
  })
})
// 修改全选状态
router.post('/editCheckAll', (req, res, next) => {
  let userId = req.cookies.userId,
    checkAllFlag = req.body.checkAllFlag;
  User.findOne({userId}, (err, userDoc) => {
    if (err) {
      return res.json({
        status: 1,
        message: res.message,
        result: ''
      })
    }
    let cartList = userDoc.cartList;
    cartList.forEach(item => {
      item.checked = checkAllFlag ? 1 : 0;
    })
    userDoc.save(err => {
      if (err) {
        return res.json({
          status: 1,
          message: res.message,
          result: ''
        })
      }
      res.json({
        status: 0,
        message: '',
        result: 'success'
      })
    })
  })
})
// 获取地址数据
router.get('/addressList', (req, res, next) => {
  let userId = req.cookies.userId;
  User.findOne({userId}, (err, userDoc) => {
    if (err) {
      return res.json({
        status: 1,
        message: res.message,
        result: ''
      })
    }
    res.json({
      status: 0,
      message: '',
      result: userDoc.addressList
    })
  })
})
// 设置默认地址
router.post('/setDefault', (req, res, next) => {
  let userId = req.cookies.userId,
    addressId = req.body.addressId;
  User.findOne({userId}, (err, userDoc) => {
    if (err) {
      return res.json({
        status: 1,
        message: res.message,
        result: ''
      })
    }
    userDoc.addressList.forEach(item => {
      if (item.addressId == addressId) {
        return item.isDefault = true
      }
      item.isDefault = false
    });
    userDoc.save(err => {
      if (err) {
        return res.json({
          status: 1,
          message: res.message,
          result: ''
        })
      }
      res.json({
        status: 0,
        message: '',
        result: 'success'
      })
    })
  })
})
// 删除地址
router.post('/delAddress', (req, res, next) => {
  let userId = req.cookies.userId,
    addressId = req.body.addressId;
  User.update({userId}, {
    $pull: {
      addressList: {
        addressId
      }
    }
  }, (err, doc) => {
    if (err) {
      return res.json({
        status: 1,
        message: err.message,
        result: ''
      })
    }
    if (doc) {
      res.json({
        status: 0,
        message: '',
        result: 'success'
      })
    }
  })
})
//获取订单列表
router.get('/orderInfo', (req, res, next) => {
  let userId = req.cookies.userId,
    orderInfo = [];
  User.findOne({userId}, (err, UserDoc) => {
    if (err) {
      return res.json({
        status: 1,
        message: res.message,
        result: ''
      })
    }
    orderInfo = UserDoc.cartList.filter(item => {
      if (item.checked == 1) return true
    })
    res.json({
      status: 0,
      msg: '',
      result: {
        orderInfo
      }
    })
  })
})
//付款存储订单接口
router.post('/payment', (req, res, next) => {
  let userId = req.cookies.userId;

  User.findOne({userId}, (err, userDoc) => {
    if (err) {
      return res.json({
        status: 1,
        message: res.message,
        result: ''
      })
    }

    let addressInfo = {}, // 地址信息
      orderGoodsInfo = [],   // 订单商品信息
      orderTotalPrice = 0,  // 订单总金额
      orderDetails = {},// 订单详细信息
      orderState = 1,
      createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');

    let platformNum = '622', //平台号码
      rm1 = Math.floor(Math.random() * 10),
      rm2 = Math.floor(Math.random() * 10),
      sysDate = new Date().Format('yyyyMMddhhmmss'),
      orderId = platformNum + rm1 + sysDate + rm2;      // 订单ID;;

    // 获取默认地址信息
    userDoc.addressList.some(item => {
      if (item.isDefault) {
        addressInfo = item;
        return true
      }
    })
    orderGoodsInfo = userDoc.cartList.filter(item => {
      if (item.checked == 1) {
        orderTotalPrice += item.salePrice * item.productNum;
        return true
      }
    })
    // 删除购物车中的商品
    for (let i = userDoc.cartList.length - 1; i >= 0; i--) {
      if (userDoc.cartList[i].checked == 1) {
        userDoc.cartList.splice(i, i + 1);
      }
    }
    orderDetails = {
      orderId,
      addressInfo,
      orderGoodsInfo,
      orderTotalPrice,
      createDate,
      orderState
    }
    userDoc.orderList.push(orderDetails);
    userDoc.save(err => {
      if (err) {
        return res.json({
          status: 1,
          message: res.message,
          result: ''
        })
      }
      res.json({
        status: 0,
        message: '',
        result: {
          orderId,
          orderTotalPrice,
          orderState
        }
      })
    })
  })

})
// 根据订单ID获取获取订单信息
router.get('/orderDetail', (req, res, next) => {
  let userId = req.cookies.userId,
    orderId = req.param("orderId");

  User.findOne({userId}, (err, userDoc) => {
    if (err) {
      return res.json({
        status: 1,
        message: res.message,
        result: ''
      })
    }

    let searchOrderDetail = [];
    userDoc.orderList.some(item => {
      if (item.orderId == orderId) {
        searchOrderDetail = item;
      }
    })
    if (!searchOrderDetail) {
      res.json({
        status: '120001',
        msg: '无此订单'
      })
    }
    res.json({
      status: 0,
      msg: '',
      result: {
        orderId,
        orderTotalPrice: searchOrderDetail.orderTotalPrice
      }
    })
  })
})
// 获取购物车数量
router.get('/cartCount', (req, res, next) => {
  let userId = req.cookies.userId;
  User.findOne({userId}, (err, userDoc) => {
    if (err) {
      return res.json({
        status: 1,
        message: res.message,
        result: ''
      })
    }
    let cartCount = 0;
    userDoc.cartList.forEach(item => {
      cartCount += item.productNum;
    })
    return res.json({
      status: 0,
      message: 0,
      result: {
        cartCount
      }
    })
  })
})
module.exports = router;
