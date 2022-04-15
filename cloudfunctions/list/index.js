// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event.skip);
  const app = new TcbRouter({
    event
  })
  const wxContext = cloud.getWXContext()
  app.router('getMyLostList', async (ctx, next) => {
    const whereObj = {
      _openid: wxContext.OPENID
    }
    let result = null
    try {
      result = await db.collection('Lost')
        .where(whereObj)
        .skip(event.skip ? event.skip : 0)
        .limit(event.limit ? event.limit : 10)
        .get()
      ctx.body = {
        code: 200,
        data: result.data
      }
    } catch (err) {
      console.log(err);
    }
  })
  app.router('getSingleList', async (ctx, next) => {
    let result = null
    result = await db.collection('Lost').where({
        _id: event._id
      })
      .get()
    ctx.body = {
      code: 200,
      data: result.data
    }
  })

  return app.serve()
}