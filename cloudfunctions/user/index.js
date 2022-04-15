// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: "findlost-3gxnjxpi30eec72b"
})

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })
  let {
    OPENID,
    ID
  } = cloud.getWXContext()
  app.use(async (ctx, next) => {
    await next()
  })

  app.router('updateMobileAndWeChat', async (ctx, next) => {
    const db = cloud.database()
    const res = await db.collection('users')
      .where({
        _openid: OPENID
      })
      .update({
        data: {
          mobile: event.mobile,
          weChat: event.weChat
        }
      })
    ctx.body = {
      updated: res.stats.updated,
      message: 'success'
    }
    await next()
  })
  app.router('getMobileAndWeChat', async (ctx, next) => {
    const db = cloud.database()
    const res = await db.collection('users').where({
        _openid: OPENID
      })
      .get()
      .then((res) => {
        return res.data
      })
    ctx.body = {
      collections: res,
      message: 'success'
    }
    await next()
  })


  return app.serve()
}