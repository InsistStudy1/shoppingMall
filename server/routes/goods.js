let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Goods = require('../models/goods')

//连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/db_demo', {useNewUrlParser: true});

mongoose.connection.on('connected', () => {
  console.log('数据库启用成功');
})

mongoose.connection.on('error', (error) => {
  console.log(error);
  console.log('数据库连接失败');
})

mongoose.connection.on('disconnected', () => {
  console.log('数据库断开连接');
})

// 定义获取数据接口
router.get('/', (req, res, next) => {
  let sort = req.param('sort'),
    page = parseInt(req.param('page')),
    pageSize = parseInt(req.param('pageSize')),
    priceGt = req.param('priceGt'),
    priceLte = req.param('priceLte'),
    skip = (page - 1) * pageSize, //跳过几条数据
    params = {};

  if (priceGt != 'all') {
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    };
  }
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize); //查找并分页
  goodsModel.sort({'salePrice': sort}); // 根据 salePrice 排序，1 为升序， -1为降序
  goodsModel.exec((err, doc) => { // 执行 goodsModel
    if (err) {
      return res.json({
        status: 1,
        message: err.message,
        result: ''
      })
    }
    res.json({
      status: 0,
      msg: '',
      result: {
        length: doc.length,
        list: doc,
        priceGt: priceGt,
        priceLte: priceLte
      }
    })
  })
})

router.post('/addCart', (req, res, next) => {
  let userId = "100000077",
    Users = require('../models/users'),
    productId = req.body.productId;
  Users.findOne({userId}, (err, userDoc) => {
    if (err) {
      return res.json({
        status: 1,
        message: err.message,
        result: ''
      })
    }
    let flag = userDoc.cartList.some(item => {
      if (item.productId == productId) {
        item.productNum++;
        return true
      }
    })
    if (flag) {
      userDoc.save(err => {
        if (err) {
          return res.json({
            status: 1,
            message: err.message,
            result: ''
          })
        }
        res.json({
          status: 0,
          message: '',
          result: userDoc
        })
      })
    } else {
      Goods.findOne({productId}, (err, goodsDoc) => {
        if (err) {
          return res.json({
            status: 1,
            message: err.message,
            result: ''
          })
        }
        if (goodsDoc) {
          goodsDoc.productNum = 1;
          goodsDoc.checked = 1;
          userDoc.cartList.push(goodsDoc);
          userDoc.save(err => {
            if (err) {
              return res.json({
                status: 1,
                message: err.message,
                result: ''
              })
            }
            res.json({
              status: 0,
              message: '',
              result: userDoc
            })
          })
        }
      })
    }
  })
})

module.exports = router;
